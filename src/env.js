//  importing resolve from path module 
const {resolve} = require('path');

console.log(resolve(__dirname,"../.env"))
require('dotenv').config({path: resolve(__dirname,"../.env")})

console.log(process.env);
