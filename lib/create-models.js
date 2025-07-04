const fs = require('fs');
const path = require('path');
const { logger } = require('../helper/logger');
const dirPath=process.cwd()

const modelSkeleton={
    users:(()=>{
        return `const mongoose = require('mongoose');
const {Schema} = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });


userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.pre('findOneAndUpdate', async function() {
  const update = this.getUpdate();
  if (update.password || (update.$set && update.$set.password)) {
    const password = update.password || update.$set.password;
    

    if (password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      if (update.$set) {
        update.$set.password = hashedPassword;
      } else {
        update.password = hashedPassword;
      }
    }
  }
});


const User = mongoose.model('User', userSchema);



module.exports = User;
`
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