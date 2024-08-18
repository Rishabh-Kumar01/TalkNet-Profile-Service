const { StatusCodes } = require("../imports.util").responseCodes;
const AppError = require("./app.error");

class ServiceError extends AppError {
  constructor(
    message,
    explanation,
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  ) {
    super("ServiceError", message, explanation, statusCode);
  }
}

module.exports = ServiceError;
