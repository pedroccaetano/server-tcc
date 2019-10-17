import server from "./server";
import chalk from "chalk";

console.chalk = chalk;

server.listen(process.env.PORT || 3000);
