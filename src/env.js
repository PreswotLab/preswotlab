//  importing resolve from path module 
const {resolve} = require('path');

require('dotenv').config({path: resolve(__dirname,"../.env")})
