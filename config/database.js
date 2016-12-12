// config/database.js
module.exports = {
    url: process.env.DATABASE_URL || 'postgres://localhost:5432/ramio'
};