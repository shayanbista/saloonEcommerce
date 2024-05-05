import { AppDataSource } from "../dataSource";
import { Product } from "../entities/product";

export const deleteProduct = async (productId: number) => {
  const productRepo = AppDataSource.getRepository(Product);
  if (productRepo && productId) {
    await productRepo.softDelete(productId);
  }
};
