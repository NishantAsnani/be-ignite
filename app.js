#!/usr/bin/env node
const {program}=require('commander');
const {createApp} = require('./lib/create-app');
const {createControllers} = require('./lib/create-controllers');
const { createDb } = require('./lib/create-db');
const { createMiddleware } = require('./lib/create-middleware');
const { createModels } = require('./lib/create-models');
const { createRoutes } = require('./lib/create-routes');
const { createUtils } = require('./lib/create-utils');
const { execSync,exec } = require('child_process');
const {createServices} = require('./lib/create-services');
const dirPath = process.cwd();
const fs = require('fs');
const path = require('path');
const ora = require('ora');



function setupProject() {
  return new Promise((resolve, reject) => {
    const initSpinner = ora('Initializing npm...').start();
    exec('npm init -y', { cwd: process.cwd() }, (err) => {
      if (err) {
        initSpinner.fail('Failed to initialize npm.');
        return reject(err);
      }
      initSpinner.succeed('npm initialized.');

      const installSpinner = ora('Installing dependencies...').start();
      exec('npm install express dotenv cors mongoose jsonwebtoken body-parser bcrypt', {
        cwd: process.cwd(),
      }, (err) => {
        if (err) {
          installSpinner.fail('Failed to install dependencies.');
          return reject(err);
        }
        installSpinner.succeed('Dependencies installed.');
        resolve();
      });
    });
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
  return new Promise((resolve) => {
    if (!isGitInstalled()) {
      console.warn('Git not installed. Skipping Git setup.');
      return resolve();
    }

    if (fs.existsSync(path.join(dirPath, '.git'))) {
      console.log('Existing Git repo found. Skipping Git init.');
      return resolve();
    }

    const spinner = ora('Initializing Git repository...').start();

    exec('git init', { cwd: dirPath }, (err) => {
      if (err) {
        spinner.fail('Git init failed.');
        console.warn(err.message);
        return resolve();
      }

      spinner.succeed('Git initialized');
      return resolve();
    });
  });
}



program.command('boot-be-app')
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