/**
 * Card share-link previews for rivertcg.com/card/<id>.
 *
 * The River AI app shares links like:
 *   https://rivertcg.com/card/<id>?n=<name>&p=<price>&s=<selection>&i=<imageUrl>
 *
 * Devices WITH the app never reach this worker — iOS opens the app directly
 * (universal links via /.well-known/apple-app-site-association). This worker
 * serves everyone else, and crucially the link-preview crawlers (iMessage,
 * WhatsApp, Slack, X…), which read the Open Graph tags here to render the
 * card image + name/price as a rich preview bubble.
 *
 * Preview data rides in the query string because the pricing API requires
 * auth. To stop strangers minting rivertcg.com links that unfurl arbitrary
 * images, og:image only accepts whitelisted card-CDN hosts.
 */

const IMAGE_HOSTS = new Set(["images.scrydex.com", "images.pokemontcg.io"]);

// TODO: once the app is live, redirect humans to the App Store instead:
//   https://apps.apple.com/app/id<APP_ID>
const HUMAN_REDIRECT = "/";

const esc = (s) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const match = url.pathname.match(/^\/card\/([^/]+)\/?$/);
    if (!match) return Response.redirect(new URL("/", url).href, 302);

    const name = (url.searchParams.get("n") || "Trading card").slice(0, 120);
    const price = (url.searchParams.get("p") || "").slice(0, 40);
    const selection = (url.searchParams.get("s") || "").slice(0, 80);

    let imageTags = "";
    try {
      const img = new URL(url.searchParams.get("i") || "");
      if (img.protocol === "https:" && IMAGE_HOSTS.has(img.hostname)) {
        imageTags = `
    <meta property="og:image" content="${esc(img.href)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:image" content="${esc(img.href)}">`;
      }
    } catch {
      // No/invalid image param — preview falls back to text-only.
    }

    // Title leads with what-it-is: "PSA 10 — $1,234.56" / "NM — $9.99".
    // The card name lives in the description (and on the card image itself).
    const title =
      selection && price
        ? `${selection} — ${price}`
        : price
          ? `${name} — ${price}`
          : name;
    const description = `${name} · Live prices in River AI`;
    const canonical = `https://rivertcg.com/card/${encodeURIComponent(match[1])}`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta property="og:site_name" content="River AI">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${esc(canonical)}">${imageTags}
  <!-- Crawlers read the tags above and don't run JS; humans without the
       app get bounced onward. -->
  <script>location.replace(${JSON.stringify(HUMAN_REDIRECT)});</script>
</head>
<body></body>
</html>`;

    return new Response(html, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=3600",
      },
    });
  },
};
