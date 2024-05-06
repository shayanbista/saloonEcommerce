import { string, tuple } from "yup";
import Jwt from "jsonwebtoken";
import { Any, In, IsNull } from "typeorm";
require("dotenv").config();
import fs, { exists } from "fs";

import path from "path";
import { v4 as uuidv4 } from "uuid";
import { Context } from "koa";
import { AppDataSource } from "./dataSource";
import { User } from "./entities/User";
import { Product } from "./entities/product";
import { Order } from "./entities/Order";
import { userSchema } from "./auth/schema";
import { ProductImages } from "./entities/ProductImages";
import { deleteProductImage } from "./services/productImagesService";
import { deleteUser } from "./services/userService";
import { deleteProduct } from "./services/productSevice";
import { base64Conversion, base64Decoder, verifySignature } from "./utils";
import { userRole } from "./auth/jwt-verification/token_verification";
import { deleteOrder } from "./services/orderService";
import { Url } from "url";
import { encode } from "punycode";
import { Booking } from "./entities/Booking";

export const registration = async (ctx: Context) => {
  let credentials: any = ctx.request.body;
  let { userName, password, email } = credentials;

  try {
    userSchema.validate({
      password,
      email,
      userName,
    });

    let userAcc = AppDataSource.getRepository(User);

    const existingUser = await userAcc.findOne({
      where: {
        userName,
      },
    });

    if (existingUser) {
      ctx.status = 400;
      ctx.body = "User exists";
    } else {
      const user = new User();
      user.password = password;
      user.email = email;
      user.userName = userName;
      user.role = "client";
      await userAcc.save(user);

      ctx.status = 201;
      ctx.body = {
        email,
        userName,
        password,
        role: user.role,
      };
    }
  } catch (err) {
    ctx.body = 500;
    return;
  }
};

export const adminLogin = async (ctx: Context) => {
  const { email, password }: any = ctx.request.body;
  console.log(email);
  console.log(password);

  if (email != "shisiradmin@gmail.com") {
    ctx.status = 403;
    ctx.body = "this is not admin";
  } else {
    ctx.status = 200;
    return;
  }
};

export const login = async (ctx: Context) => {
  const secretKey = process.env.SECRET_KEY! || "defaultSecretKey";
  let credentials: any = ctx.request.body;
  let { email, password } = credentials;
  let userAcc = AppDataSource.getRepository(User);
  console.log(email);
  console.log(password);

  try {
    const existingUser = await userAcc.findOneBy({
      email,
    });

    if (existingUser) {
      let role = existingUser.role;
      let id = existingUser.id;
      const token = Jwt.sign({ role }, secretKey);
      ctx.status = 200;
      ctx.body = { role, id };
    } else {
      ctx.status = 404;
      ctx.body = "User does not exist";
    }
  } catch (err) {
    ctx.status = 500;
    return;
  }
};

export const storeBooking = async (ctx: Context) => {
  const payload: any = ctx.request.body;

  const { id, name, address, contact, email } = payload;
  console.log(name);
  console.log(address);
  console.log(contact);
  console.log(email);

  const bookingRepo = AppDataSource.getRepository(Booking);
  const userRepo = AppDataSource.getRepository(User);
  const userExists = await userRepo.findOne({
    where: {
      id,
    },
  });
  if (userExists) {
    const books = new Booking();
    books.name = name;
    books.contact = contact;
    books.address = address;
    books.email = email;
    books.user = userExists;
    await bookingRepo.save(books);
    console.log("successful");
    ctx.status = 200;
  } else {
    ctx.status = 400;
    return;
  }
};

export const getBooking = async (ctx: Context) => {
  const bookingRepo = AppDataSource.getRepository(Booking);
  const allBooking = await bookingRepo.find({
    where: {
      status: IsNull(),
    },
  });
  ctx.status = 200;
  ctx.body = allBooking;
};

export const approveBooking = async (ctx: Context) => {
  const bookingName: any = ctx.params.name;
  console.log(bookingName);
  const bookingname = bookingName;
  const bookingRepo = AppDataSource.getRepository(Booking);

  try {
    const bookingName = await bookingRepo.findOne({
      where: {
        name: bookingname,
      },
    });
    if (bookingName) {
      const id = bookingName.id;
      await bookingRepo.update({ id }, { status: true });
      ctx.status = 200;
    } else {
      ctx.status = 400;
      ctx.body = "not found";
    }

    // await bookingRepo.softDelete(bookingName?.id);
    // ctx.body = { message: "Booking deleted successfully" };
  } catch (error) {
    console.error("Error while deleting booking:", error);
    throw error;
  }
};

export const adminDash = async (ctx: Context) => {
  if (userRole !== "admin") {
    ctx.body = "this is not admin";
  } else {
    ctx.body = "hello admin";
  }
};

export const deleteBooking = async (ctx: Context) => {
  const bookingName: any = ctx.params.name;
  console.log(bookingName);
  const bookingname = bookingName;

  const bookingRepo = AppDataSource.getRepository(Booking);

  try {
    const bookingName = await bookingRepo.findOne({
      where: {
        name: bookingname,
      },
    });
    if (bookingName) {
      const id = bookingName.id;
      await bookingRepo.softDelete(id);
      ctx.status = 200;
    } else {
      ctx.status = 400;
      ctx.body = "not found";
    }

    // await bookingRepo.softDelete(bookingName?.id);
    // ctx.body = { message: "Booking deleted successfully" };
  } catch (error) {
    console.error("Error while deleting booking:", error);
    throw error;
  }
};

export const updateUser = async (ctx: Context) => {
  const credentials: any = ctx.request.body;
  const id = ctx.params.id;

  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      ctx.status = 404;
      ctx.body = { message: "User not found" };
      return;
    }

    const allKeysExist = Object.keys(credentials).every((key) =>
      user.hasOwnProperty(key)
    );

    if (!allKeysExist) {
      ctx.status = 400;
      ctx.body = {
        message: "One or more credentials do not exist in the product",
      };
      return;
    }

    // for (const key in credentials) {
    //   if (credentials.hasOwnProperty(key) && user.hasOwnProperty(key)) {
    //     user[key] = credentials[key];
    //   }
    // }

    ctx.status = 200;
    await userRepository.update(id, credentials);
    ctx.body = "successful";
  } catch (err) {
    ctx.status = 500;
    ctx.body = err;
  }
};

export const removeUser = async (ctx: Context) => {
  const id = ctx.params.Id;
  deleteUser(id);
  ctx.body = "User deleted successfully";
  ctx.status = 200;
  try {
  } catch (err) {
    ctx.body = err;
    ctx.status = 500;
  }
};

export const storeProduct = async (ctx: Context) => {
  const productInfo: any = ctx.request.body;
  let { productName, productCategory, amount, productImagesUrl } = productInfo;

  if (!productInfo) {
    ctx.status = 404;
    ctx.body = "product info not enough";
  }
  if (!Array.isArray(productImagesUrl)) {
    ctx.status = 400;
    ctx.body = "productImagesUrl must be an array";
    return;
  }
  const productRepo = AppDataSource.getRepository(Product);
  const productImagesRepo = AppDataSource.getRepository(ProductImages);
  const productExists = await productRepo.findOne({
    where: {
      productName,
    },
  });

  if (productExists) {
    ctx.status = 404;
    ctx.body = "product exists";
    return;
  } else {
    const destinationFolder = "./public/images";
    const imagepaths = [];
    if (!productImagesRepo && productRepo) {
      ctx.status = 500;
      return;
    }

    for (let image of productImagesUrl) {
      try {
        const imageData = Buffer.from(image, "base64");
        const fileName = `${uuidv4()}.png`;
        const destinationPath = path.join(destinationFolder, fileName);
        imagepaths.push(destinationPath);
        fs.writeFileSync(destinationPath, imageData);
      } catch (err) {
        ctx.status = 500;
        ctx.body = err;
      }
      try {
        const product = new Product();
        product.productName = productName;
        product.productCategory = productCategory;
        product.amount = amount;
        await productRepo.save(product);

        const productImagesArray = imagepaths.map((images: string) => {
          const productsImage = new ProductImages();
          productsImage.imageUrl = images;
          productsImage.products = product;
          return productsImage;
        });

        await productImagesRepo.save(productImagesArray);
        ctx.status = 201;
        ctx.body = "Product and images saved successfully";
      } catch (err) {
        console.log(err);
        ctx.status = 500;
        return;
      }
    }
  }
};

export const removeProduct = async (ctx: Context) => {
  const productId = ctx.params.id;
  try {
    deleteProduct(productId);
    ctx.body = "product deleted successfully";
    ctx.status = 200;
  } catch (err) {
    ctx.status = 500;
    ctx.body = err;
  }
};

export const updateProduct = async (ctx: Context) => {
  const id = ctx.params.id;
  const credentials: any = ctx.request.body;
  try {
    const productRepository = AppDataSource.getRepository(Product);
    const product = await productRepository.findOne({
      where: {
        id,
      },
    });

    if (!product) {
      ctx.status = 404;
      ctx.body = { message: "User not found" };
      return;
    }
    const allKeysExist = Object.keys(credentials).every((key) =>
      product.hasOwnProperty(key)
    );

    if (!allKeysExist) {
      ctx.status = 400;
      ctx.body = {
        message: "One or more credentials do not exist in the product",
      };
      return;
    }

    for (const key in credentials) {
      if (credentials.hasOwnProperty(key) && product.hasOwnProperty(key)) {
        product[key] = credentials[key];
      }
    }

    ctx.status = 201;
    ctx.body = "successful";
    await productRepository.save(product);
  } catch (err) {
    ctx.status = 500;
    ctx.body = err;
  }
};

export const addProductImages = async (ctx: Context) => {
  const productId = ctx.params.id;
  const productImagesRepo = AppDataSource.getRepository(ProductImages);
  console.log(productId);
  const productImageUrl = [
    "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",
    "1.png",
    "2.png",
    "3.png",
  ];
  let ar = base64Conversion(productImageUrl);
  console.log(ar);

  let addImages = ar.map((images) => {
    return { productId, images };
  });

  addImages.forEach(async (productId) => {
    const image = new ProductImages();
    image.products = productId.productId;
    image.imageUrl = productId.images;
    await productImagesRepo.save(image);
  });
};

export const removeProductImage = async (ctx: Context) => {
  const id = ctx.params.id;
  try {
    deleteProductImage(id);
    ctx.body = "productImage deleted successfully";
    ctx.status = 200;
  } catch (err) {
    ctx.status = 500;
    ctx.body = err;
  }
};

export const getProducts = async (ctx: Context) => {
  const product = AppDataSource.getRepository(Product);

  const items = await product.find({
    relations: ["productImages"],
  });

  if (items) {
    ctx.status = 200;
    ctx.body = items;
  } else if (!items) {
    ctx.status = 400;
    ctx.body = "no items";
  } else {
    ctx.status = 500;
    return;
  }
};

export const getProduct = async (ctx: Context) => {
  const productId = ctx.params.id;
  console.log(productId);

  const productRepo = AppDataSource.getRepository(Product);
  if (!productRepo) {
    ctx.staus = 500;
    return;
  }

  try {
    const productInfo = await productRepo.findOne({
      where: {
        id: productId,
      },
      relations: ["productImages"],
    });

    const productName = productInfo?.productName;
    const productCategory = productInfo?.productCategory;
    const amount = productInfo?.amount;
    const images =
      productInfo?.productImages?.map((image) => image.imageUrl) || [];

    ctx.body = {
      productName,
      productCategory,
      amount,
      images,
    };
  } catch (err) {
    ctx.status = 500;
    ctx.body = err;
  }
};

export const storeOrders = async (ctx: Context) => {
  const orderInfo: any = ctx.request.body;
  let productIds: (number | string)[] = [];
  let userId = ctx.params.id;

  const totalAmount = orderInfo.orderInfo.reduce((acc: number, item: any) => {
    return acc + item.Amount;
  }, 0);
  orderInfo.orderInfo.map((id: any) => {
    productIds.push(id.productId);
  });
  if (!productIds) {
    ctx.status = 404;
    ctx.meassage = "no product id";
    return;
  }

  const productRepo = AppDataSource.getRepository(Product);
  const orderRepo = AppDataSource.getRepository(Order);
  const userRepo = AppDataSource.getRepository(User);

  const userInfo = await userRepo.findOne({
    where: { id: userId },
  });

  const productInfoArray = await productRepo.find({
    where: { id: In(productIds) },
  });

  console.log(productInfoArray);

  if (!userInfo || !productInfoArray) {
    ctx.status = 400;
    return;
  }
  try {
    const order = new Order();
    order.user = userInfo;
    order.products = [...productInfoArray];
    order.orderDate = new Date();
    order.totalAmount = totalAmount;
    ctx.body = "items ordered succussfully";
    ctx.status = 201;
    await orderRepo.save(order);
  } catch (err) {
    ctx.status = 404;
    ctx.body = err;
    console.log(err);
    return;
  }
};

export const getOrders = async (ctx: Context) => {
  const userId = parseInt(ctx.params.id);
  const orderId: any = ctx.request.body;
  const orderIds = orderId.orderid;

  if (
    isNaN(userId) ||
    !Array.isArray(orderIds) ||
    orderIds.some((id) => isNaN(id))
  ) {
    ctx.status = 400;
    console.log("Invalid user ID or order IDs");
    ctx.body = "Invalid user ID or order IDs";
    return;
  }

  const userRepo = AppDataSource.getRepository(User);
  const orderRepo = AppDataSource.getRepository(Order);

  try {
    if (!userRepo || !orderRepo) {
      ctx.status = 404;
      ctx.body = "User or order not found";
      return;
    }
  } catch (err) {
    console.log(err);
  }
  const user = await userRepo.findOneBy({
    id: userId,
  });

  if (user) {
    const orders = await Promise.all(
      orderIds.map(async (ids) => {
        const order = await orderRepo.findOne({
          where: { id: ids, user: { id: userId } },
          relations: ["user", "products"],
        });
        return order;
      })
    );
    if (orders.some((order) => order === null)) {
      ctx.status = 404;
      ctx.body = "One or more orders do not exist for the user";
      return;
    }
    orders.forEach((items) => {
      ctx.body = items;
      console.log(items);
    });
  }
};

export const removeOrder = async (ctx: Context) => {
  let orderId = ctx.params.id;

  try {
    deleteOrder(orderId);
    ctx.status = 200;
    ctx.body = "order deleted successfully";
  } catch (err) {
    ctx.body = err;
    ctx.status = 500;
  }
};

export const verifyEsewa = async (ctx: Context) => {
  const result = verifySignature();

  if (result?.status && result?.message) {
    ctx.body = result?.message;
    ctx.status = result.status;
  }
};
