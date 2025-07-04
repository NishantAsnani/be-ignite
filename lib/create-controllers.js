
const fs = require('fs');
const path = require('path');
const { logger } = require('../helper/logger');
const dirPath=process.cwd()

const controllerSkeleton={
    userControllers:(()=>{
        return `const  User  = require("../models/users");
const { sendSuccessResponse, sendErrorResponse } = require("../utils/response");
const { STATUS_CODE } = require("../utils/constants");
const userServices = require("../services/user.service");



async function getAllUsers(req, res) {
  try {

    const page=req.query.page? parseInt(req.query.page) : 1;
    const limit=req.query.limit? parseInt(req.query.limit) : 10;
    const nameSearch = req.query.name ? req.query.name : '';


    const allUsers = await userServices.getAllUsers({
      page,
      limit,
      nameSearch
    });

    
    if(allUsers) {
      return sendSuccessResponse(
      res,
      {users:allUsers.data,pagination:allUsers.pagination},
      "Users Retrieved Successfully",
      STATUS_CODE.OK
    );
    }
    
  } catch (err) {
    return sendErrorResponse(
      res,
      {},
      \`Error Retrieving Users: ${err.message}\`,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
}

async function getUserById(req, res) {
  try {
    const userId = req.params.id;
    
    if(!userId) {
      return sendErrorResponse(
        res,
        {},
        "User ID is required",
        STATUS_CODE.BAD_REQUEST
      );
    }

    const fetchUser = await userServices.fetchUserById(userId);

    if(!fetchUser) {
      return sendErrorResponse(
        res,
        {},
        "User Not Found",
        STATUS_CODE.NOT_FOUND
      );
    }

    
      return sendSuccessResponse(
        res,
        fetchUser,
        "User Retrieved Successfully",
        STATUS_CODE.OK
      );
    
    
  } catch (err) {
    return sendErrorResponse(
      res,
      {},
      \`Error Retrieving User: ${err.message}\`,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
}

async function deleteUser(req, res) {
  try {
    const userId = req.params.id;
    
    if(!userId) {
      return sendErrorResponse(
        res,
        {},
        "User ID is required",
        STATUS_CODE.BAD_REQUEST
      );
    }

    const deletedUser= await userServices.deleteUser(userId);

    if(deletedUser) {
      return sendSuccessResponse(
        res,
        deletedUser.data,
        "User Deleted Successfully",
        STATUS_CODE.OK
      );
    } 
  } catch (err) {
    return sendErrorResponse(
      res,
      {},
      \`Error Retrieving User: ${err.message}\`,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
}

async function editUser(req, res) {
  try {
    const userId = req.params.id;
    const { name, email, password } = req.body;

    if (!userId) {
      return sendErrorResponse(
        res,
        {},
        "User ID is required",
        STATUS_CODE.BAD_REQUEST
      );
    }

    const existingUser = await userServices.fetchUserById(userId);

    if (!existingUser) {
      return sendErrorResponse(
        res,
        {},
        "User Not Found",
        STATUS_CODE.NOT_FOUND
      );
    }


    

    const updatedUser = await userServices.updateUser(userId,existingUser,{ name, email, password });

    if (updatedUser) {
      return sendSuccessResponse(
        res,
        updatedUser.data,
        "User Updated Successfully",
        STATUS_CODE.OK
      );
    } 

  } catch (err) {
    return sendErrorResponse(
      res,
      {},
      \`Error Updating User: ${err.message}\`,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
}



module.exports={
    getAllUsers,
    getUserById,
    deleteUser,
    editUser
}`
    }),

    authControllers:(()=>{
        return `const  User  = require("../models/users");
const { sendSuccessResponse, sendErrorResponse } = require("../utils/response");
const { STATUS_CODE } = require("../utils/constants");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authServices = require("../services/auth.service");

async function Login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return sendErrorResponse(
        res,
        {},
        "Invalid Credentials",
        STATUS_CODE.NOT_FOUND
      );
    }
    const validatePassword = await bcrypt.compare(password, user.password);

    if (!validatePassword) {
      sendErrorResponse(
        res,
        {},
        "Invalid Credentials",
        STATUS_CODE.UNAUTHORIZED
      );
    } else {

      const token=jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );



      return sendSuccessResponse(
        res,
        {token,email},
        "Logged In Sucessfully",
        STATUS_CODE.SUCCESS
      );
    }
  } catch (err) {
    return sendErrorResponse(
      res,
      {},
      "Internal Server Error",
      STATUS_CODE.UNAUTHORIZED
    );
  }
}

async function Signup(req, res) {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({email});


    if (existingUser) {
      return sendErrorResponse(
        res,
        {},
        "User Already Exists",
        STATUS_CODE.CONFLICT
      );
    }

    const createUser = await authServices.createNewUser({
      name,
      email,
      password,
    });

    if (createUser.isSuccess) {
      return sendSuccessResponse(
        res,
        {data:createUser.data},
        "User Created Successfully",
        STATUS_CODE.CREATED
      );
    }
  } catch (err) {
    return sendErrorResponse(
      res,
      {},
      \`Error Creating User: \${err.message}\`,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
}



module.exports = {
  Login,
  Signup
};
`
    })
}


async function createControllers(){
  console.log("Creating controllers ...");
try{
const folderPath = path.join(dirPath, "controllers");

if (!fs.existsSync(folderPath)) {
  const folderDir = fs.mkdirSync(folderPath, { recursive: true });

  fs.writeFileSync(
    path.join(folderDir, "user.controller.js"),
    controllerSkeleton.userControllers(),
    "utf8"
  );

  fs.writeFileSync(
    path.join(folderDir, "auth.controller.js"),
    controllerSkeleton.authControllers(),
    "utf8"
  );
}


}catch(err){
logger.error(`Error creating controllers: ${err}`);
}
}


module.exports={createControllers}