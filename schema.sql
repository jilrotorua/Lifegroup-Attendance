CREATE TABLE IF NOT EXISTS lifegroup_reports (
  id TEXT PRIMARY KEY NOT NULL,
  lifegroup TEXT NOT NULL,
  leader TEXT NOT NULL,
  meeting_date TEXT NOT NULL,
  meeting_type TEXT NOT NULL,
  venue TEXT NOT NULL DEFAULT '',
  discussion TEXT NOT NULL DEFAULT '',
  exhorter TEXT NOT NULL DEFAULT '',
  present_json TEXT NOT NULL DEFAULT '[]',
  first_visitor_names_json TEXT NOT NULL DEFAULT '[]',
  returning_visitor_names_json TEXT NOT NULL DEFAULT '[]',
  first_time_visitors INTEGER NOT NULL DEFAULT 0,
  returning_visitors INTEGER NOT NULL DEFAULT 0,
  photos_json TEXT NOT NULL DEFAULT '[]',
  notes TEXT NOT NULL DEFAULT '',
  submitted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_lifegroup_reports_date ON lifegroup_reports(meeting_date, submitted_at);
