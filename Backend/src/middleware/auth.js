import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const token = req.cookies["auth_token"];
  if (!token) {
    return res.status(401).json({ message: "unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userId = decoded.userId;
    req.user = { userId: decoded.userId, role: decoded.role }; // Set req.user here
    console.log("Decoded user:", decoded);
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return res.status(401).json({ message: "unauthorized" });
  }
};

export default verifyToken;
