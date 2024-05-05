import { error } from "console";
import { v4 as uuidv4 } from "uuid";
const destinationFolder = "./public/images";
import path from "path";
import fs, { stat } from "fs";
import CryptoJS from "crypto-js";
import { decode } from "punycode";

export const base64Conversion = (list: string[]) => {
  const imagePaths: string[] = [];
  for (let image of list) {
    try {
      const imageData = Buffer.from(image, "base64");
      const fileName = `${uuidv4()}.png`;
      const destinationPath = path.join(destinationFolder, fileName);
      imagePaths.push(destinationPath);
      fs.writeFileSync(destinationPath, imageData);
    } catch (err) {
      console.log(error);
    }
  }
  return imagePaths;
};

export const generateMessage = () => {
  const message =
    "total_amount=110,transaction_uuid=e7ec53b1-dca1-4117-a328-ad2ee73e72e4,product_code=EPAYTEST";
  const key = "8gBm/:&EnhH.1/q";
  const hash = CryptoJS.HmacSHA256(message, key);
  const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
  console.log(hashInBase64);
  console.log(message);
};

export const base64Decoder = () => {
  try {
    const encodedString =
      "eyJ0cmFuc2FjdGlvbl9jb2RlIjoiMDAwNzFDUyIsInN0YXR1cyI6IkNPTVBMRVRFIiwidG90YWxfYW1vdW50IjoiMTEwLjAiLCJ0cmFuc2FjdGlvbl91dWlkIjoiZTBlYTNiYmUtOWUzNy00Y2M5LThlNDAtNWQxMzYyYTVmZmU1IiwicHJvZHVjdF9jb2RlIjoiRVBBWVRFU1QiLCJzaWduZWRfZmllbGRfbmFtZXMiOiJ0cmFuc2FjdGlvbl9jb2RlLHN0YXR1cyx0b3RhbF9hbW91bnQsdHJhbnNhY3Rpb25fdXVpZCxwcm9kdWN0X2NvZGUsc2lnbmVkX2ZpZWxkX25hbWVzIiwic2lnbmF0dXJlIjoiZ1FZcUFqRHg5S2MreVhlZk9kM0ZucDk0eEVUSWtLQWl5UDlxbEFCcWw0OD0ifQ==";
    const decodedString = atob(encodedString);
    const data = JSON.parse(decodedString);
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const verifySignature = () => {
  const decodedString = base64Decoder();
  switch (decodedString.status) {
    case "COMPLETE":
      const message = `transaction_code=${decodedString.transaction_code},status=${decodedString.status},total_amount=${decodedString.total_amount},transaction_uuid=${decodedString.transaction_uuid},product_code=EPAYTEST,signed_field_names=transaction_code,status,total_amount,transaction_uuid,product_code,signed_field_names`;
      const key = "8gBm/:&EnhH.1/q";
      const hash = CryptoJS.HmacSHA256(message, key);
      const signature = CryptoJS.enc.Base64.stringify(hash);
      if (decodedString.signature == signature) {
        return { status: 200, message: "the signature match" };
      } else {
        return { status: 400, message: "the signature doesnot match" };
      }
    case "PENDING":
      return { status: 200, message: " pending" };
    case "FULL_REFUND":
      return { status: 200, message: "fully refunded" };
    case "PARTIAL_REFUND":
      return { status: 200, message: "partially refunded" };
    case "NOT_FOUND":
      return { status: 404, message: "not found" };
    case "CANCELED":
      return { status: 200, message: "cancelled" };
  }
};
