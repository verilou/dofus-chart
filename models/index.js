import { readdirSync } from "fs";
import { basename, dirname } from "path";
import { DataTypes, Sequelize } from "sequelize";
import { fileURLToPath } from "url";
import database from "../config/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = {};

console.log(process.env.NODE_ENV, process.env.DB_PASSWORD);
const sequelize = new Sequelize(database[process.env.NODE_ENV]);

const files = readdirSync(__dirname).filter(
  (file) =>
    file.indexOf(".") !== 0 &&
    file !== basename(__filename) &&
    file.slice(-3) === ".js",
);

await Promise.all(
  files.map(async (file) => {
    const model = await import(`./${file}`);
    if (!model.default) {
      return;
    }

    const namedModel = model.default(sequelize, DataTypes);
    db[namedModel.name] = namedModel;
  }),
);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
