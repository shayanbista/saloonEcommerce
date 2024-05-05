import { Order } from "../entities/Order";
import { AppDataSource } from "../dataSource";
import { ProductImages } from "../entities/ProductImages";

export const deleteOrder = async (orderId: number) => {
  const orderRepo = AppDataSource.getRepository(Order);
  if (orderId && orderRepo) {
    await orderRepo.softDelete(orderId);
  }
};
