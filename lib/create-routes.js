
const fs = require('fs');
const path = require('path');
const { logger } = require('../helper/logger');
const dirPath=process.cwd()

const routeSkeleton={
    index:(()=>{
        return `const express=require('express');
const router=express.Router()
const userRoutes=require('./api/user.routes');

router.use('/user',userRoutes)

router.get('/', (req, res) => {
  res.send('Welcome to the API');
});

module.exports=router`
    }),

    userRoutes:(()=>{
        return `const express=require('express');
const router=express.Router()
const authControllers=require('../../controllers/auth.controller')
const userControllers=require('../../controllers/user.controller')
const auth=require('../../middleware/auth')


router.get('/',auth,userControllers.getAllUsers)

router.get('/:id',auth,userControllers.getUserById)

router.post('/login',authControllers.Login)

router.post('/signup',authControllers.Signup)

router.patch('/:id',auth,userControllers.editUser)

router.delete('/:id',auth,userControllers.deleteUser)    



module.exports=router
`
    })
}


async function createRoutes(){
try{
const folderPath = path.join(dirPath, "routes");

const apiRouteFolderPath = path.join(folderPath, "api");

if (!fs.existsSync(folderPath)) {
  const folderDir = fs.mkdirSync(folderPath, { recursive: true });

  fs.writeFileSync(
    path.join(folderDir, "index.js"),
    routeSkeleton.index(),
    "utf8"
  );
}

if (!fs.existsSync(apiRouteFolderPath)) {
  const folderDir = fs.mkdirSync(apiRouteFolderPath, { recursive: true });

  fs.writeFileSync(
    path.join(folderDir, "user.routes.js"),
    routeSkeleton.userRoutes(),
    "utf8"
  );
}


}catch(err){
logger.error(`Error creating routes: ${err}`);
}
}


module.exports={createRoutes}