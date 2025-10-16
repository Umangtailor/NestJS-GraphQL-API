-- PostgreSQL Stored Procedure for Getting User Tasks
-- This stored procedure retrieves tasks for a specific user with pagination and search functionality

CREATE OR REPLACE FUNCTION sp_get_user_tasks(
    p_user_id UUID,
    p_page INT,
    p_limit INT,
    p_search TEXT
)
RETURNS TABLE (
    task_id UUID,
    title VARCHAR,
    description TEXT,
    status VARCHAR,
    project_name VARCHAR,
    created_date TIMESTAMP WITH TIME ZONE,
    total_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    WITH filtered_tasks AS (
        SELECT
            t.id,
            t.title,
            t.description,
            t.status,
            p.name as project_name,
            t."createdAt",
            COUNT(*) OVER() as total_count
        FROM tasks t
        INNER JOIN projects p ON t."projectId" = p.id
        WHERE
            t."isDeleted" = false
            AND (
                t."createdBy" = p_user_id
                OR t."assignedTo" = p_user_id
            )
            AND (
                p_search IS NULL
                OR p_search = ''
                OR t.title ILIKE '%' || p_search || '%'
                OR t.description ILIKE '%' || p_search || '%'
            )
        ORDER BY t."createdAt" DESC
        LIMIT p_limit
        OFFSET (p_page - 1) * p_limit
    )
    SELECT
        ft.id as task_id,
        ft.title,
        ft.description,
        ft.status,
        ft.project_name,
        ft."createdAt" as created_date,
        ft.total_count
    FROM filtered_tasks ft;
END;
$$ LANGUAGE plpgsql;

