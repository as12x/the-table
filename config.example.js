window.TABLE_CONFIG = {
  SUPABASE_URL: "https://your-project.supabase.co",
  SUPABASE_ANON_KEY: "your-public-anon-key",
  SITE_URL: "http://localhost:3000",
  ICE_SERVERS: [
    { urls: "stun:stun.l.google.com:19302" },
    {
      urls: "turn:your-turn-host.example:443?transport=tcp",
      username: "turn-username",
      credential: "turn-password"
    }
  ]
};
