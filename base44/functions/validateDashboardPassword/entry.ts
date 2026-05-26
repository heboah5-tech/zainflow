import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

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