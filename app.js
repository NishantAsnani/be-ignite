const {program}=require('commander');
const {createApp} = require('./lib/create-app');
const {createControllers} = require('./lib/create-controllers');


program.command('create-backend-app')
.description('Create a new backend application')
.action(() => {
  console.log('Creating a new backend application...');
  createApp()
  createControllers()
});

program.parse(process.argv);