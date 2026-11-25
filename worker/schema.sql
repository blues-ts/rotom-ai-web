-- Android waitlist (D1 database "river-waitlist", binding DB).
-- Apply with: npm run waitlist:schema
CREATE TABLE IF NOT EXISTS waitlist (
  email      TEXT PRIMARY KEY,
  lang       TEXT NOT NULL,           -- en, es, pt-BR: which language to email them in
  platform   TEXT NOT NULL,           -- 'android'
  created_at TEXT NOT NULL,           -- UTC, 'YYYY-MM-DD HH:MM:SS'
  ip_hash    TEXT NOT NULL            -- salted SHA-256 of the IP, only for rate limiting
);
CREATE INDEX IF NOT EXISTS waitlist_ip_time ON waitlist (ip_hash, created_at);
