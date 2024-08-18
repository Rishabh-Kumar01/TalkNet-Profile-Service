const { JWT_SECRET } = require("../config/serverConfig");
const { AppError } = require("../utils/index.util").errorHandler;
const { responseCodes, jwt } = require("../utils/imports.util");

const { StatusCodes } = responseCodes;

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new AppError(
        "AuthenticationError",
        "Unauthorized",
        "No token provided",
        StatusCodes.UNAUTHORIZED
      );
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new AppError(
        "AuthenticationError",
        "Unauthorized",
        "Invalid token format",
        StatusCodes.UNAUTHORIZED
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    if (!req.params.userId) {
      throw new AppError(
        "AuthenticationError",
        "Unauthorized",
        "You are not authorized to perform this operation",
        StatusCodes.UNAUTHORIZED
      );
    }

    if (req.user.userId != req.params.userId) {
      throw new AppError(
        "AuthenticationError",
        "Unauthorized",
        "You are not authorized to perform this operation",
        StatusCodes.UNAUTHORIZED
      );
    }
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else if (error instanceof jwt.JsonWebTokenError) {
      next(
        new AppError(
          "AuthenticationError",
          "Unauthorized",
          "Invalid or expired token",
          StatusCodes.UNAUTHORIZED
        )
      );
    } else {
      next(
        new AppError(
          "AuthenticationError",
          "Authentication failed",
          "An unexpected error occurred during authentication",
          StatusCodes.INTERNAL_SERVER_ERROR
        )
      );
    }
  }
};

module.exports = {
  authenticate,
};
