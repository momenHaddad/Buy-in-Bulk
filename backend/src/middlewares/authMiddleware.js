/*const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "No token, Unauthorized" });
        }
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;
            console.log("User decoded from token:", req.user);
            next();
        }catch (error) {
            return res.status(400).json({ message: "Token is not valid" });
        }
    }else {
        return res.status(401).json({ message: "No token, Unauthorized" });
    }
};

module.exports = verifyToken;*/

const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  // Check if header exists and starts with "Bearer "
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token, Unauthorized" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      console.log("User decoded from token:", req.user);
      next();
    } catch (error) {
      return res.status(403).json({ message: "Token is not valid" });
    }
  } else {
    return res.status(401).json({ message: "Authorization header missing or malformed" });
  }
};

module.exports = verifyToken;