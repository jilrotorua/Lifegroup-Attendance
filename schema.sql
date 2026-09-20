CREATE TABLE IF NOT EXISTS lifegroup_reports (
  id TEXT PRIMARY KEY NOT NULL,
  lifegroup TEXT NOT NULL,
  leader TEXT NOT NULL,
  meeting_date TEXT NOT NULL,
  meeting_type TEXT NOT NULL,
  present_json TEXT NOT NULL DEFAULT '[]',
  first_time_visitors INTEGER NOT NULL DEFAULT 0,
  returning_visitors INTEGER NOT NULL DEFAULT 0,
  notes TEXT NOT NULL DEFAULT '',
  submitted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_lifegroup_reports_date ON lifegroup_reports(meeting_date, submitted_at);
