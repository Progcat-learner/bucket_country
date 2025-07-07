export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const match = url.pathname.match(/^\/secure\/([A-Z]{2})$/);

    if (match) {
      const countryCode = match[1];

      // Use correct binding
      let object = await env.MY_BUCKET.get(`${countryCode}.png`);

      if (!object) {
        object = await env.MY_BUCKET.get("default.png");
        if (!object) {
          return new Response("Flag not found and no fallback image available.", {
            status: 404,
            headers: { "Content-Type": "text/plain" },
          });
        }
      }

      return new Response(object.body, {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=3600",
        },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
};
