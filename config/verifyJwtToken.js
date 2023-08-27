const jwt = require("jsonwebtoken");

const verifyJwtToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWTSECRET);
  } catch (error) {
    console.log(error.message);
    throw new Error("Invalid Token!");
  }
};

module.exports = { verifyJwtToken };
