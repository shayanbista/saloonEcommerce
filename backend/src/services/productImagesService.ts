import { AppDataSource } from "../dataSource";
import { ProductImages } from "../entities/ProductImages";

export const deleteProductImage = async (imageId: number) => {
  const productImagesRepo = AppDataSource.getRepository(ProductImages);
  if (productImagesRepo && imageId) {
    await productImagesRepo.softDelete(imageId);
  }
};
