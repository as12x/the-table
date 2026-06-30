export default function handler(_request, response) {
  response.status(200).json({
    SUPABASE_URL: process.env.SUPABASE_URL || "",
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || "",
    SITE_URL: process.env.SITE_URL || ""
  });
}
