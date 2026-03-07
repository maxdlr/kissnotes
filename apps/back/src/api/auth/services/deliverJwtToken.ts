import jwt from "jsonwebtoken";

const deliverJwtToken = (
  payload: any,
  expiresIn = "3m",
  secret = process.env.JWT_SECRET,
  options = {},
) => {
  if (!secret) {
    throw ApiError(500, "JWT secret is required");
  }

  const token = jwt.sign(payload, secret, {
    expiresIn,
    ...options,
  });

  return token;
};

export default deliverJwtToken;
