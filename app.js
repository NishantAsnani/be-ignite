const {program}=require('commander');
const {createApp} = require('./lib/create-app');
const {createControllers} = require('./lib/create-controllers');
const { createDb } = require('./lib/create-db');
const { createMiddleware } = require('./lib/create-middleware');
const { createModels } = require('./lib/create-models');
const { createRoutes } = require('./lib/create-routes');
const { createUtils } = require('./lib/create-utils');
const { execSync } = require('child_process');
const {createServices} = require('./lib/create-services');
const dirPath = process.cwd();

function setupProject() {
  execSync('npm init -y', { cwd: process.cwd(), stdio: 'inherit' });
  execSync('npm install express dotenv cors mongoose jsonwebtoken body-parser bcrypt', {
    cwd: process.cwd(),
    stdio: 'inherit'
  });
}

function isGitInstalled() {
  try {
    execSync('git --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function tryGitInit() {
  if (!isGitInstalled()) {
    console.warn('Git not installed. Skipping Git setup.');
    return;
  }

  if (fs.existsSync(path.join(dirPath, '.git'))) {
    console.log('Existing Git repo found. Skipping Git init.');
    return;
  }

  try {
    execSync('git init', { cwd: dirPath });
    execSync('git add -A', { cwd: dirPath });
    execSync('git commit -m "Initial commit from create-backend-app"', {
      cwd: dirPath,
    });

    if(!fs.existsSync(path.join(dirPath, '.gitignore'))) {
      fs.writeFileSync(path.join(dirPath, '.gitignore'), 'node_modules/\n.env');
    }
    
    console.log('Git initialized and initial commit created.');
  } catch {
    console.warn('Git repo not initialized. You can do it manually.');
  }
}


program.command('create-backend-app')
.description('Create a new backend application')
.action(() => {
  try{
  console.log('Creating a new backend application...');
  console.log('Installing dependencies...');
  setupProject();
  tryGitInit()
  createApp()
  createControllers()
  createDb()
  createMiddleware()
  createModels()
  createRoutes()
  createUtils()
  createServices()
  console.log('Backend application created successfully!');
  }catch(err){
    console.error('Error creating backend application:', err.message);
  }
  
});

program.parse(process.argv);