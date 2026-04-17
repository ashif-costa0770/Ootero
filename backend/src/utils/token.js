import jwt from "jsonwebtoken";
import crypto from "crypto";

const resolveSecret = (secret) => secret || process.env.JWT_SECRET;

export const generateToken = (id, options = {}) => {
  const { secret, expiresIn = "30d" } = options;
  return jwt.sign({ id }, resolveSecret(secret), { expiresIn });
};

export const verifyToken = (token, options = {}) => {
  const { secret } = options;
  return jwt.verify(token, resolveSecret(secret));
};

export function generateResetToken() {
  const rawToken = crypto.randomBytes(32).toString("hex");

  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  return { rawToken, tokenHash };
}

