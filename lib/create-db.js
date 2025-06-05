const fs = require('fs');
const path = require('path');
const { logger } = require('../helper/logger');
const dirPath=process.cwd()

const dbSkeleton={
    index:(()=>{
        return `const mongoose = require("mongoose");
const url = \`mongodb://localhost:27017/\${process.env.DB_NAME}\`;

const dbconnection = () => {
  try {
    mongoose.connect(url)
    console.log(\`🚀 Connected to MongoDB \`);
  } catch (err) {
    console.error("❌ Error connecting to MongoDB:", err);
  }
};


module.exports = {dbconnection};
// This code connects to a MongoDB database using Mongoose.
`
    }),

  
}


async function createDb() {
  try {
    const folderPath = path.join(dirPath, "db");

    if (!fs.existsSync(folderPath)) {
      const foldersDir = fs.mkdirSync(folderPath, { recursive: true });

      fs.writeFileSync(
        path.join(foldersDir, "index.js"),
        dbSkeleton.index(),
        "utf8"
      );
    }
  } catch (err) {
    logger.error(`Error creating db : ${err}`);
  }
}

module.exports={createDb}