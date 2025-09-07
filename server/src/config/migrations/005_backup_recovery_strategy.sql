-- Database Backup and Recovery Strategy Migration
-- Implements comprehensive backup procedures and recovery mechanisms

-- Backup Metadata Table
CREATE TABLE IF NOT EXISTS backup_metadata (
  id SERIAL PRIMARY KEY,
  backup_type VARCHAR(50) NOT NULL, -- 'full', 'incremental', 'transaction_log'
  backup_size BIGINT,
  status VARCHAR(50) DEFAULT 'completed', -- 'started', 'completed', 'failed', 'verified'
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  duration INTERVAL,
  checksum VARCHAR(64),
  storage_location TEXT,
  verification_result TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(start_time, backup_type)
);

-- Backup Schedule Configuration
CREATE TABLE IF NOT EXISTS backup_schedule (
  id SERIAL PRIMARY KEY,
  schedule_name VARCHAR(100) NOT NULL,
  backup_type VARCHAR(50) NOT NULL,
  cron_expression VARCHAR(100) NOT NULL,
  retention_days INTEGER NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  last_run TIMESTAMP,
  next_run TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(schedule_name)
);

-- Disaster Recovery Plan Table
CREATE TABLE IF NOT EXISTS disaster_recovery_plan (
  id SERIAL PRIMARY KEY,
  plan_name VARCHAR(100) NOT NULL,
  description TEXT,
  rto INTERVAL NOT NULL, -- Recovery Time Objective
  rpo INTERVAL NOT NULL, -- Recovery Point Objective
  steps JSONB NOT NULL,
  tested BOOLEAN DEFAULT FALSE,
  last_tested TIMESTAMP,
  test_results TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(plan_name)
);

-- Data Archival Strategy
CREATE TABLE IF NOT EXISTS archival_policy (
  id SERIAL PRIMARY KEY,
  table_name VARCHAR(100) NOT NULL,
  archival_criteria TEXT NOT NULL, -- SQL condition for what to archive
  retention_period INTERVAL NOT NULL, -- How long to keep in main table
  archival_frequency INTERVAL NOT NULL, -- How often to run archival
  enabled BOOLEAN DEFAULT TRUE,
  last_run TIMESTAMP,
  rows_archived BIGINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(table_name)
);

-- Archived Data Tables (examples)
CREATE TABLE IF NOT EXISTS archived_orders (
  LIKE orders INCLUDING ALL,
  archival_date TIMESTAMP DEFAULT NOW(),
  original_id INTEGER
);

CREATE TABLE IF NOT EXISTS archived_user_sessions (
  LIKE user_sessions INCLUDING ALL,
  archival_date TIMESTAMP DEFAULT NOW(),
  original_id INTEGER
);

-- Backup Functions
CREATE OR REPLACE FUNCTION perform_backup(backup_type VARCHAR, storage_path TEXT)
RETURNS INTEGER AS $$
DECLARE
  backup_id INTEGER;
  start_ts TIMESTAMP := NOW();
BEGIN
  INSERT INTO backup_metadata (backup_type, start_time, status, storage_location)
  VALUES (backup_type, start_ts, 'started', storage_path)
  RETURNING id INTO backup_id;
  
  -- Simulate backup process (in real implementation, this would call pg_dump)
  PERFORM pg_sleep(1);
  
  UPDATE backup_metadata 
  SET status = 'completed', end_time = NOW(), duration = NOW() - start_ts
  WHERE id = backup_id;
  
  RETURN backup_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION verify_backup(backup_id INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
  -- Simulate verification (in real implementation, this would verify checksums)
  PERFORM pg_sleep(0.5);
  
  UPDATE backup_metadata 
  SET status = 'verified', verification_result = 'Backup verified successfully'
  WHERE id = backup_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION calculate_next_backup_time()
RETURNS TRIGGER AS $$
BEGIN
  -- Update next_run time for schedules after they run
  IF TG_OP = 'UPDATE' AND OLD.last_run IS DISTINCT FROM NEW.last_run THEN
    NEW.next_run := NEW.last_run + (
      SELECT archival_frequency FROM archival_policy 
      WHERE table_name = NEW.schedule_name
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for automated backup management
CREATE OR REPLACE TRIGGER trigger_update_next_backup_time
  BEFORE UPDATE ON backup_schedule
  FOR EACH ROW
  EXECUTE FUNCTION calculate_next_backup_time();

-- Indexes for backup performance
CREATE INDEX IF NOT EXISTS idx_backup_metadata_time ON backup_metadata(start_time);
CREATE INDEX IF NOT EXISTS idx_backup_metadata_type ON backup_metadata(backup_type);
CREATE INDEX IF NOT EXISTS idx_archived_orders_date ON archived_orders(archival_date);
CREATE INDEX IF NOT EXISTS idx_archived_sessions_date ON archived_user_sessions(archival_date);

-- Insert Default Backup Schedule
INSERT INTO backup_schedule (schedule_name, backup_type, cron_expression, retention_days) VALUES
  ('daily_full', 'full', '0 2 * * *', 30),      -- Daily at 2 AM, keep 30 days
  ('hourly_incremental', 'incremental', '0 * * * *', 7), -- Hourly, keep 7 days
  ('weekly_verification', 'verification', '0 3 * * 0', 90) -- Weekly verification
ON CONFLICT (schedule_name) DO NOTHING;

-- Insert Default Disaster Recovery Plan
INSERT INTO disaster_recovery_plan (plan_name, description, rto, rpo, steps) VALUES
  ('production_recovery', 'Primary production database recovery plan', 
   '4 hours', '1 hour',
   '[
     {"step": 1, "action": "Identify failure type and scope", "timeout": "30 minutes"},
     {"step": 2, "action": "Activate standby database if available", "timeout": "1 hour"},
     {"step": 3, "action": "Restore from latest verified backup", "timeout": "2 hours"},
     {"step": 4, "action": "Apply transaction logs if available", "timeout": "1 hour"},
     {"step": 5, "action": "Verify data consistency", "timeout": "30 minutes"},
     {"step": 6, "action": "Resume normal operations", "timeout": "30 minutes"}
   ]'::jsonb)
ON CONFLICT (plan_name) DO NOTHING;

-- Insert Default Archival Policies
INSERT INTO archival_policy (table_name, archival_criteria, retention_period, archival_frequency) VALUES
  ('orders', 'created_at < NOW() - INTERVAL ''2 years'' AND status IN (''delivered'', ''cancelled'', ''refunded'')', '2 years', '1 month'),
  ('user_sessions', 'expires_at < NOW() - INTERVAL ''6 months''', '6 months', '1 week'),
  ('user_behavior_events', 'created_at < NOW() - INTERVAL ''1 year''', '1 year', '1 month'),
  ('backup_metadata', 'start_time < NOW() - INTERVAL ''1 year''', '1 year', '3 months')
ON CONFLICT (table_name) DO NOTHING;

-- Create Backup Monitoring View
CREATE OR REPLACE VIEW backup_monitoring AS
SELECT 
  bs.schedule_name,
  bs.backup_type,
  bs.cron_expression,
  bs.enabled,
  bs.last_run,
  bs.next_run,
  bm.status as last_status,
  bm.duration as last_duration,
  bm.verification_result
FROM backup_schedule bs
LEFT JOIN backup_metadata bm ON bm.id = (
  SELECT id FROM backup_metadata 
  WHERE backup_type = bs.backup_type 
  ORDER BY start_time DESC 
  LIMIT 1
);

-- Create Recovery Readiness Report
CREATE OR REPLACE VIEW recovery_readiness_report AS
SELECT
  drp.plan_name,
  drp.rto,
  drp.rpo,
  drp.tested,
  drp.last_tested,
  COUNT(bm.id) FILTER (WHERE bm.status = 'verified' AND bm.start_time > NOW() - drp.rpo::interval) as recent_backups,
  COUNT(bm.id) FILTER (WHERE bm.status = 'verified') as total_verified_backups,
  CASE 
    WHEN drp.tested = TRUE AND drp.last_tested > NOW() - INTERVAL '6 months' THEN 'READY'
    WHEN drp.tested = TRUE THEN 'NEEDS_RETEST'
    ELSE 'NOT_TESTED'
  END as readiness_status
FROM disaster_recovery_plan drp
CROSS JOIN backup_metadata bm
GROUP BY drp.id, drp.plan_name, drp.rto, drp.rpo, drp.tested, drp.last_tested;

-- Update statistics
ANALYZE backup_metadata;
ANALYZE backup_schedule;
ANALYZE disaster_recovery_plan;
ANALYZE archival_policy;