import pg from 'pg';

const config = {
    host: 'brackebusch-web-db.postgres.database.azure.com',
    user: process.env.DB_USER_NAME,
    password: process.env.DB_PASSWORD,
    database: 'postgres',
    port: 5432,
    ssl: true
};

const client = new pg.Client(config);

client.connect(err => {
    if (err) throw err;
    else { queryDatabase(); }
});

function queryDatabase() {

    console.log(`Running query to PostgreSQL server: ${config.host}`);

    const query = 'SELECT * FROM posts;';

    client.query(query)
        .then(res => {
            const rows = res.rows;

            rows.map(row => {
                console.log(`Read: ${JSON.stringify(row)}`);
            });
        })
        .catch(err => {
            console.log(err);
        });
}

export default function Home() {
  queryDatabase();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      in progress
    </div>
  );
}
