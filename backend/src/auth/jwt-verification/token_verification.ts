import jwt from "jsonwebtoken";
import { Context, Next } from "koa";
var userRole: string = "";

const secretKey = process.env.SECRET_KEY! || "defaultSecretKey";

export const token_verification = async (ctx: Context, next: Next) => {
  if (ctx.url.match(/^\/(public|registration|login)/)) return next();

  const authorizationheader = ctx.headers.authorization;

  if (!authorizationheader) {
    ctx.status = 400;
    ctx.body = "no authorization header";
    return;
  }

  const [tokenType, token] = authorizationheader.trim().split(" ");

  if (!token || tokenType !== "Bearer") {
    ctx.status = 400;
    ctx.body = "invalid token type";
    return;
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    ctx.state.user = decoded;
    const user = ctx.state.user;
    userRole = user.role;
    await next();
  } catch (err) {
    ctx.status = 401;
    ctx.body = "invalid token";
  }
};
export { userRole };
