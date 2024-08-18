// Desc: Import all the required modules in one place
module.exports = {
  bodyParser: require("body-parser"),
  compression: require("compression"),
  cors: require("cors"),
  dotenv: require("dotenv"),
  express: require("express"),
  helmet: require("helmet"),
  responseCodes: require("http-status-codes"),
  jwt: require("jsonwebtoken"),
  mongoose: require("mongoose"),
  morgan: require("morgan"),
  kafka: require("kafkajs"),
};
