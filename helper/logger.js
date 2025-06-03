const chalk=require('chalk')

const logger = {
  info: (msg) => {
    console.log(` ${chalk.cyan(msg)}`);
  },

  success: (msg) => {
    console.log(` ${chalk.bold.green(msg)}`);
  },

  warn: (msg) => {
    console.warn(` ${chalk.yellow(msg)}`);
  },

  error: (msg) => {
    console.error(` ${chalk.bold.red(msg)}`);
  },

  debug: (msg) => {
    if (process.env.DEBUG === 'true') {
      console.log(` ${chalk.magenta(msg)}`);
    }
  },
};

module.exports={logger}
