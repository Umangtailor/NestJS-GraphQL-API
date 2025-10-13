CREATE OR REPLACE FUNCTION sp_get_user_tasks(
  p_user_id UUID,
  p_page INT DEFAULT 1,
  p_limit INT DEFAULT 10,
  p_search TEXT DEFAULT NULL
) RETURNS TABLE(
  task_id UUID,
  title VARCHAR(255),
  description TEXT,
  status VARCHAR(50),
  project_name VARCHAR(255),
  created_date TIMESTAMP WITH TIME ZONE,
  total_count BIGINT
) AS $$
DECLARE
  offset_val INT;
BEGIN
  -- Calculate offset
  offset_val := (p_page - 1) * p_limit;

  -- Return tasks where user is creator or assignee
  RETURN QUERY
  WITH filtered_tasks AS (
    SELECT
      t.id,
      t.title,
      t.description,
      t.status,
      p.name as project_name,
      t.created_at,
      COUNT(*) OVER() as total_count
    FROM tasks t
    INNER JOIN projects p ON t.project_id = p.id
    WHERE
      t.is_deleted = FALSE
      AND (t.created_by = p_user_id OR t.assigned_to = p_user_id)
      AND (p_search IS NULL OR t.title ILIKE '%' || p_search || '%')
    ORDER BY t.created_at DESC
    LIMIT p_limit OFFSET offset_val
  )
  SELECT
    ft.id::UUID as task_id,
    ft.title,
    ft.description,
    ft.status,
    ft.project_name,
    ft.created_at as created_date,
    ft.total_count
  FROM filtered_tasks ft;
END;
$$ LANGUAGE plpgsql;