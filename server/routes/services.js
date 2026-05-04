const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware'); 
const { Op, fn, col } = require('sequelize');

module.exports = (Service, User, Booking, Review) => {
  
// ОТРИМАННЯ СПИСКУ ПОСЛУГ (З ФІЛЬТРАЦІЄЮ ТА РЕЙТИНГОМ)
  router.get('/', async (req, res) => {
    const { category, search, masterId } = req.query;
    
    try {

      let whereCondition = {};
      if (masterId) whereCondition.masterId = masterId;
      if (category && category !== 'Всі') whereCondition.category = category;
      if (search) {
        whereCondition.title = { [Op.like]: `%${search}%` };
      }

      const services = await Service.findAll({
        where: whereCondition,
        include: [
          { model: User, attributes: ['id', 'fullName'] },
          {
            model: Booking,
            attributes: [], 
            include: [{ model: Review, attributes: [] }]
          }
        ],
        //  Рахуємо середній рейтинг
        attributes: {
          include: [
            [fn('AVG', col('Bookings->Review.rating')), 'avgRating'],
            [fn('COUNT', col('Bookings->Review.id')), 'reviewsCount']
          ]
        },
        group: ['Service.id', 'User.id'], 
        order: [['createdAt', 'DESC']]
      });

      res.json(services);
    } catch (error) {
      console.error("BACKEND ERROR:", error);
      res.status(500).json({ message: "Помилка завантаження" });
    }
  });

  // ОТРИМАННЯ ОДНІЄЇ ПОСЛУГИ (Для сторінки відгуків)
  router.get('/:id', async (req, res) => {
    try {
      const service = await Service.findByPk(req.params.id, {
        include: [
          { model: User, attributes: ['fullName'] },
          {
            model: Booking,
            include: [{ 
              model: Review, 
              include: [{ model: User, attributes: ['fullName'] }] 
            }]
          }
        ]
      });
      
      if (!service) return res.status(404).json({ message: "Не знайдено" });
      res.json(service);
    } catch (error) {
      res.status(500).json({ message: "Помилка сервера" });
    }
  });

  // СТВОРЕННЯ ПОСЛУГИ 
  router.post('/', async (req, res) => {
    try {
      const { title, description, category, price, masterId } = req.body;
      const newService = await Service.create({ title, description, category, price, masterId });
      res.status(201).json(newService);
    } catch (error) {
      res.status(500).json({ message: "Помилка при створенні послуги" });
    }
  });

  // РЕДАГУВАННЯ ПОСЛУГИ
  router.patch('/:id', async (req, res) => {
    try {
      const { title, description, category, price } = req.body;
      const service = await Service.findByPk(req.params.id);
      
      if (!service) {
        return res.status(404).json({ message: "Послугу не знайдено" });
      }

      await service.update({ title, description, category, price });
      res.json({ message: "Послугу оновлено", service });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Помилка при оновленні послуги" });
    }
  });

  // ВИДАЛЕННЯ ПОСЛУГИ 
  router.delete('/:id', async (req, res) => {
    try {
      const serviceId = req.params.id;
      // Видаляємо всі бронювання цієї послуги
      await Booking.destroy({ where: { serviceId } });

      const deleted = await Service.destroy({ where: { id: serviceId } });

      if (deleted) {
        res.json({ message: "Послугу та всі пов'язані запити видалено" });
      } else {
        res.status(404).json({ message: "Послугу не знайдено" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Помилка при видаленні." });
    }
  });

  return router;
};