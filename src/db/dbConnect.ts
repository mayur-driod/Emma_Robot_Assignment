import sequelize from "./sequelize"

const dbConnect = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to sequelize db");
    await sequelize.sync({ alter: true });
    console.log("Database synced");
  } catch (err) {
    console.error("There was an error connecting to the database:", err);
  }
}

export default dbConnect;
