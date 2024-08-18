const { StatusCodes } = require("../imports.util").responseCodes;
const AppError = require("./app.error");

class DatabaseError extends AppError {
  constructor(error) {
    super(
      "DatabaseError",
      "Database operation failed",
      error.message,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

module.exports = DatabaseError;
