require('dotenv').load();
module.exports.COMMON = {
    BASE_URL: process.env.BASE_URL,
    PORT: process.env.PORT || 3000
}
