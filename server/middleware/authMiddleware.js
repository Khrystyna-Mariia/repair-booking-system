const jwt = require('jsonwebtoken');

const verifyAdmin = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) return res.status(403).json({ message: "Токен відсутній" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: "Доступ заборонено: потрібні права адміністратора" });
    }
    req.user = decoded; // зберігаємо дані юзера в запиті
    next();
  } catch (error) {
    res.status(401).json({ message: "Невалідний токен" });
  }
};

module.exports = { verifyAdmin };