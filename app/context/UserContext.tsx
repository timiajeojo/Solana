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
  createUserProfile,
} from "@/component/lib/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserData {
  firstName: string;
  lastName:  string;
  email:     string;
}

interface UserContextValue {
  user:       UserData;
  loading:    boolean;
  updateUser: (patch: { firstName?: string; lastName?: string }) => Promise<void>;
}

const UserContext = createContext<UserContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function UserProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<UserData>({ firstName: "", lastName: "", email: "" });
  const [loading, setLoading] = useState(true);

  async function loadUser(supabaseUser: any) {
    if (!supabaseUser) {
      setLoading(false);
      return;
    }

    const email = supabaseUser.email ?? "";

    // 1️⃣ Try the profiles table first
    let profile = await getUserProfile(supabaseUser.id);

    // 2️⃣ If no profile row exists, try to create one from user_metadata
    //    (populated by Google OAuth or if metadata was set on sign-up)
    if (!profile) {
      const meta       = supabaseUser.user_metadata ?? {};
      const firstName  = meta.first_name  ?? meta.given_name  ?? meta.full_name?.split(" ")[0] ?? "";
      const lastName   = meta.last_name   ?? meta.family_name ?? meta.full_name?.split(" ").slice(1).join(" ") ?? "";

      try {
        profile = await createUserProfile(supabaseUser.id, firstName, lastName);
      } catch {
        // Profile may already exist (race condition) — try fetching again
        profile = await getUserProfile(supabaseUser.id);
      }
    }

    // 3️⃣ Final fallback: derive something displayable from the email
    const emailPrefix   = email.split("@")[0] ?? "";
    const fallbackFirst = profile?.first_name || emailPrefix;
    const fallbackLast  = profile?.last_name  || "";

    setUser({
      firstName: fallbackFirst,
      lastName:  fallbackLast,
      email,
    });
    setLoading(false);
  }

  useEffect(() => {
    // Load from current session immediately
    supabase.auth.getUser().then(({ data: { user } }) => loadUser(user));

    // Stay in sync on login / logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => loadUser(session?.user ?? null)
    );

    return () => subscription.unsubscribe();
  }, []);

  // Persists edits to the profiles table — email is never touched
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
