/**
 * Android waitlist: POST /api/waitlist
 *
 * The homepage form (all three languages) posts { email, lang, company }.
 * `company` is a hidden honeypot field: people leave it empty, bots fill it.
 *
 * With JS the site sends Accept: application/json and shows the result
 * inline. Without JS the browser posts the form normally and gets a small
 * thank-you page back.
 *
 * Stored in D1 (binding DB, table in ../schema.sql): email, language, time,
 * and a salted hash of the IP that's only used to rate-limit signups.
 */

const LANGS = new Set(["en", "es", "pt-BR"]);
const MAX_PER_IP_PER_HOUR = 10;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const TEXT = {
  en: {
    ok: "You're on the list. We'll email you when River launches on Android.",
    invalid: "Please enter a valid email address.",
    limited: "Too many signups from this network. Please try again later.",
    error: "Something went wrong. Please try again.",
    back: "Back to River",
    home: "/",
  },
  es: {
    ok: "Ya estás en la lista. Te enviaremos un correo cuando River llegue a Android.",
    invalid: "Ingresa un correo electrónico válido.",
    limited: "Demasiados registros desde esta red. Inténtalo más tarde.",
    error: "Algo salió mal. Inténtalo de nuevo.",
    back: "Volver a River",
    home: "/es/",
  },
  "pt-BR": {
    ok: "Você está na lista. Vamos te avisar por e-mail quando o River chegar ao Android.",
    invalid: "Digite um e-mail válido.",
    limited: "Muitos cadastros desta rede. Tente novamente mais tarde.",
    error: "Algo deu errado. Tente novamente.",
    back: "Voltar para o River",
    home: "/pt-br/",
  },
};

export async function handleWaitlist(request, env) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: { allow: "POST" } });
  }

  // Only accept posts from our own pages.
  const origin = request.headers.get("origin");
  if (origin && !isAllowedOrigin(origin)) {
    return new Response("Forbidden", { status: 403 });
  }

  let fields;
  try {
    fields = await readFields(request);
  } catch {
    fields = {};
  }

  const lang = LANGS.has(fields.lang) ? fields.lang : "en";
  const wantsJson = (request.headers.get("accept") || "").includes("application/json");
  const reply = (key, status) => respond(wantsJson, lang, key, status);

  // Honeypot filled: act like it worked so the bot moves on.
  if (fields.company) return reply("ok", 200);

  const email = String(fields.email || "").trim().toLowerCase();
  if (email.length > 254 || !EMAIL_RE.test(email)) return reply("invalid", 400);

  try {
    const ipHash = await sha256(`river-waitlist:${request.headers.get("cf-connecting-ip") || ""}`);

    const recent = await env.DB.prepare(
      "SELECT COUNT(*) AS n FROM waitlist WHERE ip_hash = ? AND created_at > datetime('now', '-1 hour')",
    )
      .bind(ipHash)
      .first();
    if (recent && recent.n >= MAX_PER_IP_PER_HOUR) return reply("limited", 429);

    // Signing up twice is fine: keep the first row, still say "you're on the list".
    await env.DB.prepare(
      "INSERT INTO waitlist (email, lang, platform, created_at, ip_hash) VALUES (?, ?, 'android', datetime('now'), ?) ON CONFLICT(email) DO NOTHING",
    )
      .bind(email, lang, ipHash)
      .run();

    return reply("ok", 200);
  } catch (err) {
    console.error("waitlist insert failed", err);
    return reply("error", 500);
  }
}

function isAllowedOrigin(origin) {
  try {
    const { hostname } = new URL(origin);
    return hostname === "rivertcg.com" || hostname === "www.rivertcg.com" || hostname === "localhost";
  } catch {
    return false;
  }
}

async function readFields(request) {
  const type = request.headers.get("content-type") || "";
  if (type.includes("application/json")) return await request.json();
  const form = await request.formData();
  return Object.fromEntries(form);
}

async function sha256(text) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function respond(wantsJson, lang, key, status) {
  const t = TEXT[lang];
  const ok = key === "ok";
  const headers = { "cache-control": "no-store", "x-robots-tag": "noindex" };

  if (wantsJson) {
    return Response.json({ ok, message: t[key] }, { status, headers });
  }

  // No-JS fallback: a tiny page in the site's style.
  const html = `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <title>River TCG</title>
  <style>
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 24px;
      background: #0C0C0E; color: #EDEDEF; text-align: center;
      font: 17px/1.5 -apple-system, BlinkMacSystemFont, system-ui, sans-serif; }
    p { max-width: 420px; margin: 0 0 28px; }
    a { display: inline-block; padding: 14px 24px; border-radius: 999px; background: #fff; color: #0b0b0d;
      font-weight: 600; text-decoration: none; }
  </style>
</head>
<body>
  <main>
    <p>${t[key]}</p>
    <a href="${t.home}${ok ? "" : "#android"}">${t.back}</a>
  </main>
</body>
</html>`;
  return new Response(html, { status, headers: { ...headers, "content-type": "text/html; charset=utf-8" } });
}
