console.log(process.env.DB_PASSWORD);

export default {
  development: {
    username: null,
    password: null,
    database: "dofus_chart_dev",
    host: "127.0.0.1",
    dialect: "postgresql",
    logging: false,
  },
  production: {
    username: "postgres",
    password: process.env.DB_PASSWORD,
    database: "dofus_chart_dev",
    host: "127.0.0.1",
    dialect: "postgresql",
    logging: false,
  },
};
