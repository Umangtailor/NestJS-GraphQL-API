/**
 * Script to create the PostgreSQL stored procedure for task queries
 * Run with: node create-stored-procedure.js
 */

const { Client } = require('pg');
require('dotenv').config({ path: './src/.env' });

const storedProcedureSQL = `
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
`;

async function createStoredProcedure() {
    const client = new Client({
        host: process.env.DATABASE_HOST || 'localhost',
        port: parseInt(process.env.DATABASE_PORT) || 5432,
        user: process.env.DATABASE_USERNAME || 'postgres',
        password: process.env.DATABASE_PASSWORD || 'postgres',
        database: process.env.DATABASE_NAME || 'postgres',
    });

    try {
        console.log('Connecting to PostgreSQL...');
        console.log(`Database: ${client.database}`);
        console.log(`Host: ${client.host}:${client.port}`);
        console.log(`User: ${client.user}`);
        console.log('');

        await client.connect();
        console.log('✓ Connected successfully!');
        console.log('');

        // Check if tables exist
        console.log('Checking if tables exist...');
        const tablesResult = await client.query(`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_name IN ('tasks', 'projects', 'users')
            ORDER BY table_name;
        `);

        if (tablesResult.rows.length === 0) {
            console.log('⚠ Warning: No tables found!');
            console.log('Please run "npm run dev" first to create the database tables.');
            console.log('Then run this script again.');
            await client.end();
            return;
        }

        console.log('✓ Found tables:', tablesResult.rows.map(r => r.table_name).join(', '));
        console.log('');

        // Create the stored procedure
        console.log('Creating stored procedure sp_get_user_tasks...');
        await client.query(storedProcedureSQL);
        console.log('✓ Stored procedure created successfully!');
        console.log('');

        // Verify it was created
        console.log('Verifying stored procedure...');
        const verifyResult = await client.query(`
            SELECT routine_name, routine_type
            FROM information_schema.routines
            WHERE routine_name = 'sp_get_user_tasks'
            AND routine_schema = 'public';
        `);

        if (verifyResult.rows.length > 0) {
            console.log('✓ Verified: sp_get_user_tasks exists');
            console.log('');
            console.log('Setup complete! You can now:');
            console.log('1. Start your application: npm run dev');
            console.log('2. Use the myTasks query in GraphQL');
        } else {
            console.log('✗ Warning: Could not verify stored procedure creation');
        }

        await client.end();
        console.log('');
        console.log('Database connection closed.');

    } catch (error) {
        console.error('✗ Error:', error.message);
        console.error('');
        console.error('Common issues:');
        console.error('1. Database credentials are incorrect (check src/.env)');
        console.error('2. PostgreSQL server is not running');
        console.error('3. Database does not exist');
        console.error('4. Tables have not been created yet (run "npm run dev" first)');
        console.error('');
        console.error('Full error:');
        console.error(error);
        process.exit(1);
    }
}

// Run the script
console.log('========================================');
console.log('PostgreSQL Stored Procedure Setup');
console.log('========================================');
console.log('');

createStoredProcedure()
    .then(() => {
        console.log('Done!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Unexpected error:', error);
        process.exit(1);
    });
