const {program}=require('commander');
const {createApp} = require('./lib/create-app');
const {createControllers} = require('./lib/create-controllers');
const { createDb } = require('./lib/create-db');
const { createMiddleware } = require('./lib/create-middleware');
const { createModels } = require('./lib/create-models');
const { createRoutes } = require('./lib/create-routes');
const { createUtils } = require('./lib/create-utils');
const { execSync } = require('child_process');
const dirPath = process.cwd();

function setupProject() {
  execSync('npm init -y', { cwd: process.cwd(), stdio: 'inherit' });
  execSync('npm install express dotenv cors mongoose jsonwebtoken body-parser bcrypt', {
    cwd: process.cwd(),
    stdio: 'inherit'
  });
}

program.command('create-backend-app')
.description('Create a new backend application')
.action(() => {
  console.log('Creating a new backend application...');
  console.log('Installing dependencies...');
  setupProject();
  createApp()
  createControllers()
  createDb()
  createMiddleware()
  createModels()
  createRoutes()
  createUtils()
  console.log('Backend application created successfully!');
});

program.parse(process.argv);