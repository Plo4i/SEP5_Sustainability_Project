import pg from 'pg';

// Establishing connection details
const pool = new pg.Pool({
    user: 'fgfvuocu',
    host: 'cornelius.db.elephantsql.com',
    database: 'fgfvuocu',
    password: 'SctnoJglNVvNuF47Wngw2ms3vYFMVRVN',
    port: 5432,
  });

// Connecting to the DB
try {
  await pool.connect();
  pool.on('connect', (client) => {
    client.query('SET search_path TO ecoeval;');
});
  console.log('Successfully connected to the database');
} catch (err) {
  console.error('Failed to connect to the database', err);
}

// Listen for the SIGTERM signal (e.g., when the application is being stopped)
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received. Closing the pool. 1');
  pool.end().then(() => {
      console.log('Pool has been closed');
      process.exit(0);
  });
});

// Listen for the SIGINT signal (e.g., when the application is being interrupted)
process.on('SIGINT', () => {
  console.log('SIGINT signal received. Closing the pool. 2');
  pool.end().then(() => {
      console.log('Pool has been closed');
      process.exit(0);
  });
});

export default pool;