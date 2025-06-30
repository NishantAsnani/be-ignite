const fs = require('fs');
const path = require('path');
const { logger } = require('../helper/logger');
const dirPath=process.cwd()

const modelSkeleton={
    users:(()=>{
        return `const User = require("../models/users");
async function createNewUser(userData) {
  try {
      const { name, email, password } = userData;


    const newUser = await User.create({
      name,
      email,
      password,
    });
    return {isSuccess: true, data: newUser};
  } catch (err) {
    throw new Error(err);
  }
}


module.exports = {
  createNewUser
};`
    }),

  
}


async function createModels() {
  console.log("Creating models ...");
  try {
    const folderPath = path.join(dirPath, "models");

    if (!fs.existsSync(folderPath)) {
      const folderDir = fs.mkdirSync(folderPath, { recursive: true });

      fs.writeFileSync(
        path.join(folderDir, "users.js"),
        modelSkeleton.users(),
        "utf8"
      );
    }
  } catch (err) {
    logger.error(`Error creating models: ${err}`);
  }
}

module.exports={createModels}