import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const { password } = await req.json();
    const correctPassword = Deno.env.get("DASHBOARD_PASSWORD");

    if (!correctPassword) {
      return Response.json({ error: 'Password not configured' }, { status: 500 });
    }

    const isValid = password === correctPassword;
    return Response.json({ valid: isValid });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});