const fs = require('fs');
const path = require('path');
const { logger } = require('../helper/logger');
const dirPath=process.cwd()

const utilsSkeleton={
    constants:(()=>{
        return `const STATUS_CODE={
NOT_FOUND:404,
SUCCESS:200,
SERVER_ERROR:500,
UNAUTHORIZED:401,
CONFLICT:409,
}

module.exports={
    STATUS_CODE
}`
    }),

    response:(()=>{
        return `const sendSuccessResponse = (
  res,
  data = {},
  message = "Operation completed Sucessfully",
  status_code = 200
) => {
  return res.status(status_code).json({
    success: true,
    message,
    data,
  });
};

const sendErrorResponse = (
  res,
  error = {},
  message = "Internal Server error",
  status_code = 500
) => {
  return res.status(status_code).json({
    success: false,
    message,
    error,
  });
};

module.exports = {
  sendSuccessResponse,
  sendErrorResponse,
};
`
    })
}


async function createUtils(){
console.log("Creating utils ...");
try{
const folderPath = path.join(dirPath, "utils");

if (!fs.existsSync(folderPath)) {
  const folderDir = fs.mkdirSync(folderPath, { recursive: true });

  fs.writeFileSync(
    path.join(folderDir, "constants.js"),
    utilsSkeleton.constants(),
    "utf8"
  );

  fs.writeFileSync(
    path.join(folderDir, "response.js"),
    utilsSkeleton.response(),
    "utf8"
  );
}


}catch(err){
logger.error(`Error creating utils: ${err}`);
}
}


module.exports={createUtils}