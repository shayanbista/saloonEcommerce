import Router from "koa-router";
import send from "koa-send";
import path from "path";
import {
  login,
  getProducts,
  registration,
  storeProduct,
  getProduct,
  removeProduct,
  removeUser,
  updateUser,
  updateProduct,
  storeOrders,
  getOrders,
  adminDash,
  removeProductImage,
  addProductImages,
  removeOrder,
  getBooking,
  deleteBooking,
  approveBooking,
  adminLogin,
} from "../controller";
import { userRole } from "../auth/jwt-verification/token_verification";
import { Context } from "vm";
import { generateMessage } from "../utils";
import { verifyEsewa } from "../controller";
import { storeBooking } from "../controller";

export const loginRoute = (router: Router) => {
  router.get("/login", (ctx: any) => {
    ctx.body = "this is login page";
    generateMessage();
    if (userRole) console.log(userRole);
    else {
      console.log(`user doesnot exist`);
    }
  });

  router.post("/adminlogin", adminLogin);

  router.get("/gateway", async (ctx) => {
    await send(ctx, "index.html", {
      root: path.join(__dirname, "../../public/template"),
    });
  });

  router.post("/login", login);
  router.put("/user/:id/Update", updateUser);
  router.delete("/user/:id/", removeUser);
};

export const registrationRoute = (router: Router) => {
  router.post("/registration", registration);
};

export const bookingRoute = (router: Router) => {
  router.post("/booking", storeBooking);
  router.get("/booking", getBooking);
  router.delete("/booking/:name", deleteBooking);
  router.put("/booking/:name", approveBooking);
};
export const adminDashboard = (router: Router) => {
  router.get("/adminDash", adminDash);
};

export const productRoute = (router: Router) => {
  router.delete("/products/:id", removeProduct);
  router.delete("/productImage/:id/", removeProductImage);
  router.post("/productImages/:id/", addProductImages);
  router.put("/products/:id/update", updateProduct);
  router.post("/products", storeProduct);
  router.get("/products", getProducts);
  router.get("/products/:id", getProduct);
};

export const ordersRoute = (router: Router) => {
  router.post("/orders/user/:id/", storeOrders);
  router.get("/user/:id/orders/", getOrders);
  router.delete("/order/:id/", removeOrder);
};

export const esewaGateway = (router: Router) => {
  router.get("/verifyEsewa/", verifyEsewa);
};
