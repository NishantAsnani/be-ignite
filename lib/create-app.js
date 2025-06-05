const fs = require("fs");
const path = require("path");
const { logger } = require("../helper/logger");
const dirPath=process.cwd()

function appSkeleton() {
  return `require('dotenv').config();
const express=require('express')
const app=express();
const PORT=process.env.PORT || 3000;
const cors=require('cors')
const routes=require('./routes/index')
const bodyParser=require('body-parser')
const {dbconnection} = require('./db')


dbconnection();


app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//Middleware to parse JSON and URL-encoded data


app.use('/api',routes)



app.listen(PORT, () => {
  console.log(\`🚀 Server is running on http://localhost:\${PORT}\`);
});`;
}

async function createApp() {
  try {
    const appFilePath = path.join(`./${dirPath}`, "index.js");
    fs.writeFileSync(appFilePath, appSkeleton(), "utf8");
  } catch (err) {
    
    logger.error("Error creating app file:", err);
  }
}

module.exports = { createApp };
