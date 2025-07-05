 export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const match = url.pathname.match(/^\/secure\/([A-Z]{2})$/);

    if (match) {
      const countryCode = match[1];

      try {
        const object = await env.COUNTRY_FLAGS.get(`${countryCode}.png`);
        if (!object) {
          return new Response("Flag not found", { status: 404 });
        }

        return new Response(object.body, {
          headers: {
            "Content-Type": "image/png",
            "Cache-Control": "public, max-age=3600",
          },
        });
      } catch (err) {
        return new Response("Error fetching from R2", { status: 500 });
      }
    }

    return new Response("Not Found", { status: 404 });
  },
};
