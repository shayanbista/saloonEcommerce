import { User } from "../entities/User";
import { AppDataSource } from "../dataSource";

export const deleteUser = async (userId: number) => {
  const productRepo = AppDataSource.getRepository(User);
  if (productRepo && userId) {
    await productRepo.softDelete(userId);
  }
};
