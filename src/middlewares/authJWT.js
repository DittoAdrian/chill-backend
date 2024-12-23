import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Token tidak diberikan!" });
    }
    // Verifikasi Token
    jwt.verify(authHeader, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Token tidak valid! 2" });
      }
      req.user = decoded;
      next();
    });
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan!", error: err.message });
  }
};

export default verifyToken;
