import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "12345",
  database: "saloon",
  // logging: true,
  synchronize: true,
  entities: ["src/entities/**/*.ts"],
  subscribers: [],
  migrations: ["./src/migration/**/*.ts"],
  migrationsRun: true,
});
