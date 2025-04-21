-- Update job status options and default
ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_status_check;
ALTER TABLE jobs ADD CONSTRAINT jobs_status_check CHECK (status IN ('pending', 'approved', 'filled', 'expired'));
ALTER TABLE jobs ALTER COLUMN status SET DEFAULT 'pending';

-- Update the active_jobs view to only show approved jobs
DROP VIEW IF EXISTS active_jobs;
CREATE VIEW active_jobs AS
SELECT *
FROM jobs
WHERE status = 'approved'
ORDER BY posted_date DESC;