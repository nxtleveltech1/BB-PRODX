import { NextResponse } from "next/server";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    // ignore
  }

  const email = (body?.email || "").toString().trim();
  const hp = (body?.hp || "").toString();
  const ts = Number(body?.ts || 0);
  const hcaptchaToken = (body?.hcaptchaToken || "").toString();

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
  }

  // Honeypot: if filled, pretend success but do nothing
  if (hp) {
    return NextResponse.json({ message: "Subscribed successfully." });
  }

  // Minimum dwell time (1.5s)
  if (!ts || Date.now() - ts < 1500) {
    return NextResponse.json({ message: "Please try again." }, { status: 400 });
  }

  // Optional hCaptcha verification
  if (process.env.HCAPTCHA_SECRET) {
    if (!hcaptchaToken) {
      return NextResponse.json({ message: "Captcha required." }, { status: 400 });
    }
    try {
      const form = new URLSearchParams();
      form.append("secret", process.env.HCAPTCHA_SECRET);
      form.append("response", hcaptchaToken);
      const verify = await fetch("https://hcaptcha.com/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: form.toString(),
      });
      const result = await verify.json();
      if (!result?.success) {
        return NextResponse.json({ message: "Captcha verification failed." }, { status: 400 });
      }
    } catch (e: any) {
      return NextResponse.json({ message: e?.message || "Captcha error." }, { status: 400 });
    }
  }

  try {
    // Prefer Brevo (Sendinblue) if configured
    if (process.env.BREVO_API_KEY && process.env.BREVO_LIST_ID) {
      const res = await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        } as any,
        body: JSON.stringify({
          email,
          listIds: [Number(process.env.BREVO_LIST_ID)],
          updateEnabled: true,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return NextResponse.json(
          { message: data?.message || "Failed to subscribe (Brevo)." },
          { status: 500 }
        );
      }
      return NextResponse.json({ message: "Subscribed successfully." });
    }

    // Fallback to Mailchimp if configured
    if (
      process.env.MAILCHIMP_API_KEY &&
      process.env.MAILCHIMP_LIST_ID &&
      process.env.MAILCHIMP_SERVER_PREFIX
    ) {
      const auth = (typeof Buffer !== 'undefined'
        ? Buffer.from(`anystring:${process.env.MAILCHIMP_API_KEY}`).toString("base64")
        : (globalThis as any).btoa(`anystring:${process.env.MAILCHIMP_API_KEY}`));
      const url = `https://${process.env.MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_LIST_ID}/members`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_address: email,
          status: "subscribed",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return NextResponse.json(
          { message: data?.detail || "Failed to subscribe (Mailchimp)." },
          { status: 500 }
        );
      }
      return NextResponse.json({ message: "Subscribed successfully." });
    }

    // No provider configured
    console.warn("Newsletter subscription attempted, but no provider configured.", { email });
    return NextResponse.json(
      { message: "No newsletter provider configured on the server." },
      { status: 501 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { message: err?.message || "Unexpected server error." },
      { status: 500 }
    );
  }
}
