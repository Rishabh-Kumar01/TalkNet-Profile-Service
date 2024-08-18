const utils = require("./utils/index.util");
const config = require("./config/index.config");
const routes = require("./routes/index.route");
const { AppError } = require("./utils/errors/index.error");

const { StatusCodes } = utils.imports.responseCodes;

const app = utils.imports.express();

// Function to setup and start the server
const setupAndStartServer = async () => {
  try {
    // Middlewares
    app.use(utils.imports.morgan("dev"));
    app.use(utils.imports.cors());
    app.use(utils.imports.helmet());
    app.use(utils.imports.compression());
    app.use(utils.imports.bodyParser.json());
    app.use(utils.imports.bodyParser.urlencoded({ extended: true }));

    // Routes
    app.use("/api", routes);

    // Home Route
    app.get("/", (request, response) => {
      response.send("Hello Server!!!😊😊😊😊");
    });

    // Error handling middleware
    app.use(utils.errorHandler.BaseError);

    // Connect to Kafka Consumer
    // await utils.kafka.connectConsumer();
    // await utils.kafka.startConsumer();
    // console.log("Kafka consumer connected and started");

    // Connect to the database
    await config.connection();

    // Start the server
    app.listen(config.serverConfig.PORT, () => {
      console.log(`SERVER IS RUNNING ON PORT ${config.serverConfig.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "ServerError",
      "Server Startup Failed",
      "An unexpected error occurred during server startup",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  // Add any cleanup operations here (e.g., closing database connections, Kafka consumer)
  process.exit(0);
});

// Call the function to setup and start the server
setupAndStartServer().catch((error) => {
  console.error("Server failed to start:", error);
  process.exit(1);
});

module.exports = app;
