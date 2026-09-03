module.exports = {
  db: {
    host: 'mysql-367524de-eventhubmvc.l.aivencloud.com',
    port: 22826,
    user: 'avnadmin',
    password: process.env.DB_PASSWORD,
    name: 'defaultdb',
    ssl: true
  }
};
