// app/api/profits/credit/route.ts
// Call this endpoint daily to credit profits to all active plan users.
// Set up a Vercel Cron: vercel.json → "crons": [{ "path": "/api/profits/credit", "schedule": "0 0 * * *" }]

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { data: activePlans, error: plansError } = await supabaseAdmin
      .from('user_plans')
      .select('*')
      .eq('status', 'active');

    if (plansError) throw plansError;
    if (!activePlans || activePlans.length === 0) {
      return NextResponse.json({ message: 'No active plans', credited: 0 });
    }

    const today = new Date().toISOString().split('T')[0];
    let credited = 0;
    let skipped  = 0;

    for (const plan of activePlans) {
      // Skip if already credited today
      const { data: existing } = await supabaseAdmin
        .from('profits')
        .select('id')
        .eq('user_id', plan.user_id)
        .eq('user_plan_id', plan.id)
        .eq('date', today)
        .single();

      if (existing) { skipped++; continue; }

      // Mark completed if past end date
      if (new Date() > new Date(plan.end_date)) {
        await supabaseAdmin
          .from('user_plans')
          .update({ status: 'completed' })
          .eq('id', plan.id);
        skipped++;
        continue;
      }

      // Credit daily profit
      const { error: profitError } = await supabaseAdmin
        .from('profits')
        .insert({
          user_id:      plan.user_id,
          user_plan_id: plan.id,
          amount:       plan.daily_return,
          date:         today,
        });

      if (profitError) {
        console.error(`Failed for user ${plan.user_id}:`, profitError);
        continue;
      }
      credited++;
    }

    return NextResponse.json({ success: true, credited, skipped, total: activePlans.length });

  } catch (error: any) {
    console.error('Credit profits error:', error);
    return NextResponse.json({ error: 'Failed to credit profits' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
