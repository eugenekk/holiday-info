/** @type {import("jest").Config} **/
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFiles: ['dotenv/config'],
};