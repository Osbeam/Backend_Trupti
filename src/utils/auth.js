const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).send({
      success: false,
      message: "Access Denied: No Token Provided!",
    });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_KEY);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Invalid Token!",
    });
  }
};

module.exports = auth;