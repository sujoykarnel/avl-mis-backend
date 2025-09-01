const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token)
      return res.status(401).json({ ok: false, message: "Token Missing" });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload._id || payload.id;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ ok: false, message: "Invalid or expired token" });
  }
};

module.exports = { auth };
