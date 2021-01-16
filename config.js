const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    PORT: process.env.PORT,
    USER_MONGODB: process.env.USER_MONGODB,
    MDP_MONGODB: process.env.MDP_MONGODB,
    DATABASE: process.env.DATABASE,
    DOMAINE: process.env.DOMAINE,
    SECRET_KEY: process.env.SECRET_KEY
}