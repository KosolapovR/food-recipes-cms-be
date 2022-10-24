import chalk from "chalk";
import util from "util";

const warningLog = function (...args: any[]) {
  const prepared: string[] = [];
  args.forEach((arg: any) => {
    if (typeof arg === "object") {
      prepared.push(util.inspect(arg, false, 3, true));
    }
    prepared.push(arg);
  });
  console.log(chalk.hex("#FFA500")(...prepared));
};
const errorLog = function (...args: any[]) {
  const prepared: string[] = [];
  args.forEach((arg: any) => {
    if (typeof arg === "object") {
      prepared.push(util.inspect(arg, false, 3, true));
    }
    prepared.push(arg);
  });
  console.log(chalk.bold.red(...prepared));
};

const infoLog = function (...args: any[]) {
  const prepared: string[] = [];
  args.forEach((arg: any) => {
    if (typeof arg === "object") {
      prepared.push(util.inspect(arg, false, 3, true));
    }
    prepared.push(arg);
  });
  console.log(chalk.bold.blueBright(...prepared));
};

export { warningLog, errorLog, infoLog };
