require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Підключення до бази даних
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
  }
);

// Імпортуємо моделі
const User = require('./models/User')(sequelize);
const Service = require('./models/Service')(sequelize);
const Booking = require('./models/Booking')(sequelize);
const Sensor = require('./models/Sensor')(sequelize);
const Review = require('./models/Review')(sequelize);

// Налаштовуємо зв'язки 
// Майстер має багато послуг
User.hasMany(Service, { foreignKey: 'masterId' });
// Послуга належить одному майстру
Service.belongsTo(User, { foreignKey: 'masterId' });

// Зв'язки для бронювань
User.hasMany(Booking, { foreignKey: 'clientId' });
Booking.belongsTo(User, { foreignKey: 'clientId' }); 

Service.hasMany(Booking, { foreignKey: 'serviceId' });
Booking.belongsTo(Service, { foreignKey: 'serviceId' });

// Користувач може мати багато датчиків
User.hasMany(Sensor, { foreignKey: 'userId' });
Sensor.belongsTo(User, { foreignKey: 'userId' });

// Клієнт залишає відгук
User.hasMany(Review, { foreignKey: 'clientId' });
Review.belongsTo(User, { foreignKey: 'clientId' });

// Відгук стосується конкретного майстра
User.hasMany(Review, { foreignKey: 'masterId', as: 'MasterReviews' });
Review.belongsTo(User, { foreignKey: 'masterId', as: 'Master' });

// Відгук прив'язаний до заявки
Booking.hasOne(Review, { foreignKey: 'bookingId' });
Review.belongsTo(Booking, { foreignKey: 'bookingId' });

// Імпорт та підключення маршрутів
const authRoutes = require('./routes/auth')(User); 
app.use('/api/auth', authRoutes);

const serviceRoutes = require('./routes/services')(Service, User, Booking, Review);
app.use('/api/services', serviceRoutes);

const bookingRoutes = require('./routes/bookings')(Booking, Service, User, Review);
app.use('/api/bookings', bookingRoutes);

const sensorRoutes = require('./routes/sensors')(Sensor, Booking, User);
app.use('/api/sensors', sensorRoutes);

const userRoutes = require('./routes/users')(User); 
app.use('/api/users', userRoutes);

const reviewRoutes = require('./routes/reviews')(Review, Booking, User); 
app.use('/api/reviews', reviewRoutes);

// Синхронізація бази та запуск сервера
const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }) 
  .then(() => {
    console.log(' Таблиці в базі даних синхронізовано');
    app.listen(PORT, () => {
      console.log(` Сервер запущено на порту ${PORT}`);
    });
    app.listen(PORT, '0.0.0.0', () => {
  console.log(` Сервер запущено на http://localhost:${PORT} та у локальній мережі`);
});
  })
  .catch(err => {
    console.error(' Помилка підключення або синхронізації:', err);
  });
