function parseIceServers() {
  if (process.env.ICE_SERVERS_JSON) {
    try {
      const parsed = JSON.parse(process.env.ICE_SERVERS_JSON);
      if (Array.isArray(parsed)) return parsed.filter((server) => server?.urls);
    } catch (_error) {
      return [];
    }
  }

  if (process.env.TURN_URLS && process.env.TURN_USERNAME && process.env.TURN_CREDENTIAL) {
    return [
      {
        urls: process.env.TURN_URLS.split(",").map((url) => url.trim()).filter(Boolean),
        username: process.env.TURN_USERNAME,
        credential: process.env.TURN_CREDENTIAL
      }
    ];
  }

  return [];
}

export default function handler(_request, response) {
  response.status(200).json({
    SUPABASE_URL: process.env.SUPABASE_URL || "",
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || "",
    SITE_URL: process.env.SITE_URL || "",
    ICE_SERVERS: parseIceServers(),
    FORCE_TURN: process.env.FORCE_TURN || ""
  });
}
