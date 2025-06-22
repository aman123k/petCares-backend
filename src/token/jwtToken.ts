import { config } from "dotenv";
config();
import Jwt from "jsonwebtoken";

const secreteKey: string = String(process.env.SecreteKey);

const createToken = (user: object) => {
  const accessToken = Jwt.sign({ user }, secreteKey);
  return accessToken;
};
const verifyToken = (token: string) => {
  if (!token) return null;
  try {
    const userDetails = Jwt.verify(token, secreteKey);
    return userDetails;
  } catch {
    return null;
  }
};
export { createToken, verifyToken };
