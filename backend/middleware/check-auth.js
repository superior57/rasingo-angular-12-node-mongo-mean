const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = { email: decodedToken.email, userId: decodedToken.userId, dialCode:decodedToken.dialCode, telephone: decodedToken.telephone, companyName: decodedToken.companyName };
    next();
  } catch (error) {
    res.status(401).json({ message: "You are not authenticated!" });
  }
};
