// context/UserContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  supabase,
  getUserProfile,
  updateUserProfile,
} from "@app/component/lib/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserData {
  firstName: string;
  lastName:  string;
  email:     string; // from auth.users — never editable
}

interface UserContextValue {
  user:       UserData;
  loading:    boolean;
  updateUser: (patch: { firstName?: string; lastName?: string }) => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData>({
    firstName: "",
    lastName:  "",
    email:     "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser(supabaseUser: any) {
      if (!supabaseUser) {
        setLoading(false);
        return;
      }

      const email   = supabaseUser.email ?? "";
      const profile = await getUserProfile(supabaseUser.id);

      setUser({
        firstName: profile?.first_name ?? "",
        lastName:  profile?.last_name  ?? "",
        email,
      });
      setLoading(false);
    }

    // Load immediately from current session
    supabase.auth.getUser().then(({ data: { user } }) => loadUser(user));

    // Stay in sync on login/logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => loadUser(session?.user ?? null)
    );

    return () => subscription.unsubscribe();
  }, []);

  // Writes only to the profiles table — email is never touched
  async function updateUser(patch: { firstName?: string; lastName?: string }) {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return;

    const dbPatch: Record<string, string> = {};
    if (patch.firstName !== undefined) dbPatch.first_name = patch.firstName;
    if (patch.lastName  !== undefined) dbPatch.last_name  = patch.lastName;

    await updateUserProfile(authUser.id, dbPatch as any);

    // Optimistic local update
    setUser((prev) => ({
      ...prev,
      firstName: patch.firstName ?? prev.firstName,
      lastName:  patch.lastName  ?? prev.lastName,
    }));
  }

  return (
    <UserContext.Provider value={{ user, loading, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside <UserProvider>");
  return ctx;
}
