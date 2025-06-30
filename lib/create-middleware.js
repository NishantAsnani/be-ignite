const fs = require('fs');
const path = require('path');
const { logger } = require('../helper/logger');
const dirPath=process.cwd()

const middlewareSkeleton={
    auth:(()=>{
        return `const {sendSuccessResponse,sendErrorResponse} = require("../utils/response");
const {STATUS_CODE}=require('../utils/constants')
const jwt = require("jsonwebtoken");

async function auth(req, res, next) {
  try {
    if (!req.headers.authorization) {
        return sendErrorResponse(res,"Authorization header not found",{},STATUS_CODE.UNAUTHORIZED)
    }
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return sendErrorResponse(res,"Token not found",{},STATUS_CODE.UNAUTHORIZED)
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return sendErrorResponse(res,\`Unknown error \${error}\`,{},STATUS_CODE.UNAUTHORIZED)
  }
}


module.exports = auth;`
    }),

  
}


async function createMiddleware() {
  console.log("Creating controllers ...");
  try {
    const folderPath = path.join(dirPath, "middleware");

    if (!fs.existsSync(folderPath)) {
      const foldersDir = fs.mkdirSync(folderPath, { recursive: true });

      fs.writeFileSync(
        path.join(foldersDir, "auth.js"),
        middlewareSkeleton.auth(),
        "utf8"
      );
    }
  } catch (err) {
    logger.error(`Error creating midleware: ${err}`);
  }
}

module.exports={createMiddleware}