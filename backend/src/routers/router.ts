import Router from "koa-router";

import {
  loginRoute,
  registrationRoute,
  productRoute,
  ordersRoute,
  adminDashboard,
  esewaGateway,
  bookingRoute,
} from "./routes";

export const Routes = () => {
  const router = new Router();

  loginRoute(router);
  registrationRoute(router);
  productRoute(router);
  ordersRoute(router);
  adminDashboard(router);
  bookingRoute(router);
  esewaGateway(router);
  return router;
};
