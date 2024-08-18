const { Kafka } = require("kafkajs");
const { ProfileService } = require("../services/index.service");
const { AppError } = require("./errors/index.error");
const { StatusCodes } = require("./imports.util").responseCodes;
const { KAFKA_BROKER } = require("../config/serverConfig");

const kafka = new Kafka({
  clientId: "user-service",
  brokers: [KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: "user-service-group" });
const profileService = ProfileService.getInstance();

const connectConsumer = async () => {
  try {
    await consumer.connect();

    await consumer.subscribe({
      topic: "user-events",
      fromBeginning: true,
    });

    console.log("Kafka consumer connected and subscribed");
  } catch (error) {
    console.error("Failed to connect Kafka consumer:", error);
    throw new AppError(
      "KafkaError",
      "Kafka Connection Failed",
      "Failed to connect to Kafka broker",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const startConsumer = async () => {
  try {
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const eventData = JSON.parse(message.value.toString());
          if (eventData.type === "USER_CREATED") {
            await profileService.createProfile(eventData.data);
            console.log(
              "Profile created from Kafka message:",
              eventData.data.userId
            );
          }
        } catch (error) {
          console.error("Error processing Kafka message:", error);
          // Here you might want to implement a dead-letter queue or other error handling mechanism
        }
      },
    });
    console.log("Kafka consumer started");
  } catch (error) {
    console.error("Failed to start Kafka consumer:", error);
    throw new AppError(
      "KafkaError",
      "Kafka Consumer Failed",
      "Failed to start Kafka consumer",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

module.exports = {
  connectConsumer,
  startConsumer,
};
