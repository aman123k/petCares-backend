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
    const userDetais = Jwt.verify(token, secreteKey);
    return userDetais;
  } catch {
    return null;
  }
};
export { createToken, verifyToken };
