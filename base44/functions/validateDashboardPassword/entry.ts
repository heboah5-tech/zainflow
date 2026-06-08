import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const body = await req.text();
    let password;
    try {
      const parsed = JSON.parse(body);
      password = parsed.password;
    } catch {
      return Response.json({ error: 'بيانات غير صحيحة', valid: false }, { status: 400 });
    }

    const correctPassword = Deno.env.get("DASHBOARD_PASSWORD");

    console.log("Password check - Provided:", password, "Configured:", correctPassword ? "[SET]" : "[NOT SET]");

    if (!correctPassword) {
      return Response.json({ error: 'كلمة المرور غير مهيأة - تواصل مع الدعم', valid: false }, { status: 500 });
    }

    const isValid = password === correctPassword;
    console.log("Password valid:", isValid);
    return Response.json({ valid: isValid, error: isValid ? null : 'كلمة المرور غير صحيحة' });
  } catch (error) {
    console.error("Password validation error:", error);
    return Response.json({ error: error.message, valid: false }, { status: 500 });
  }
});