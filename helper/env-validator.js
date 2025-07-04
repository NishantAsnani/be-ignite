const { logger } = require("./logger");

function checkEnvVars() {
    const missing = [];
    if (!process.env.JWT_SECRET) missing.push("JWT_SECRET");
    if (!process.env.PORT) missing.push("PORT");
    if (!process.env.DB_NAME) missing.push("DB_NAME");

    if (missing.length) {
      logger.error(`❌ Missing .env variables: ${missing.join(", ")}`);
      logger.info("Please create a .env file and set environment variables.");
      logger.info(`\nExample .env:
PORT=port-number
DB_NAME=your-db-name
JWT_SECRET=your-secret-key
`);
      process.exit(1);
    }
  
}



module.exports={checkEnvVars}