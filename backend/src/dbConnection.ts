import { AppDataSource } from "./dataSource";

export const db_connection = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
};
