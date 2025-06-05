const fs = require('fs');
const path = require('path');
const { logger } = require('../helper/logger');
const dirPath=process.cwd()

const serviceSkeleton={
    userServices:(()=>{
        return `const  User  = require("../models/users");

async function fetchUserById(userId) {
  try {
    const user = await User.findById(userId);
    
    return {isSuccess: true, data: user};
  } catch (err) {
    throw new Error(err);
  }
}

async function deleteUser(userId) {
  try {
    const deletedUser=await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return {isSuccess: false, message: "User not found"};
    }
    
    return {isSuccess: true, data: deletedUser};
  } catch (err) {
    throw new Error(err);
  }
}

async function getAllUsers(queryParams){
  try{
    const { page, limit , nameSearch  } = queryParams;
    let whereClause={}
    const offset = (page - 1) * limit; // Calculate offset for pagination
    if (nameSearch) {
      whereClause.name = {
        $regex: nameSearch,
        $options: "i", 
      };
    }

    const allUsers=await User.find(whereClause).skip(offset).limit(limit);
    const totalUsers = await User.countDocuments(whereClause);
    const totalPages = Math.ceil(totalUsers / limit);

    return {
      isSuccess: true,
      data: allUsers,
      pagination: {
        totalUsers,
        totalPages,
        currentPage: page,
        limit
      }
    };
  }catch(err){
    throw new Error(err);
  }
} 

async function updateUser(userId,oldData,updateFields) {
  try {

    const cleanedFields = {};
    for (const key in updateFields) {
      if (updateFields[key] !== undefined && updateFields[key] !== oldData[key]) {
        cleanedFields[key] = updateFields[key];
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: cleanedFields },
      { new: true } 
    );

    if (!updatedUser) {
      return {
        isSuccess: false,
        data: null,
        message: 'User not found',
      };
    }

    return {
      isSuccess: true,
      data:updatedUser,
    };
  } catch (error) {
    throw new Error(error);
  }
}


module.exports = {
  fetchUserById,
  deleteUser,
  getAllUsers,
  updateUser
};`
    }),

    authServices:(()=>{
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
    })
}


async function createServices(){
try{
const folderPath = path.join(dirPath, "services");

if (!fs.existsSync(folderPath)) {
  const folderDir = fs.mkdirSync(folderPath, { recursive: true });

  fs.writeFileSync(
    path.join(folderDir, "user.service.js"),
    serviceSkeleton.userServices(),
    "utf8"
  );

  fs.writeFileSync(
    path.join(folderDir, "auth.service.js"),
    serviceSkeleton.authServices(),
    "utf8"
  );
}


}catch(err){
logger.error(`Error creating services: ${err}`);
}
}


module.exports={createServices}