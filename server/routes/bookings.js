const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middleware/authMiddleware');

module.exports = (Booking, Service, User, Review) => {
  
  // ОТРИМАННЯ ВСІХ БРОНЮВАНЬ ДЛЯ АДМІНА
  router.get('/all', verifyAdmin, async (req, res) => {
    try {
      const bookings = await Booking.findAll({
        include: [
          { model: Service, attributes: ['title'] },
          { model: User, attributes: ['fullName', 'email'] }
        ],
        order: [['createdAt', 'DESC']]
      });
      res.json(bookings);
    } catch (error) {
      console.error("Помилка адмін-панелі:", error);
      res.status(500).json({ message: "Помилка при завантаженні всіх заявок" });
    }
  });

  // ОТРИМАННЯ СПИСКУ (Клієнт/Майстер)
  router.get('/', async (req, res) => {
    const { clientId, masterId } = req.query;
    let whereClause = {};
    let serviceWhere = {};

    if (clientId) whereClause.clientId = clientId;
    if (masterId) serviceWhere.masterId = masterId;

    try {
      const bookings = await Booking.findAll({
        where: whereClause,
        include: [
          {
            model: Service,
            where: masterId ? serviceWhere : {}, 
            required: !!masterId,
            include: [{ model: User, attributes: ['id', 'fullName'] }]
          },
          { 
            model: User, 
            attributes: ['id', 'fullName'], 
          },
          { 
            model: Review, 
            required: false 
          }
        ],
        order: [['createdAt', 'DESC']]
      });
      res.json(bookings);
    } catch (error) {
      console.error("ПОМИЛКА ЗАВАНТАЖЕННЯ:", error);
      res.status(500).send("Помилка сервера");
    }
  });

  // СТВОРЕННЯ НОВОЇ ЗАЯВКИ
  router.post('/', async (req, res) => {
    try {
      const { 
        bookingDate, timeSlot, address, phone, 
        problemDescription, clientId, serviceId 
      } = req.body;

      const newBooking = await Booking.create({
        bookingDate,
        timeSlot,
        address,
        phone,
        problemDescription,
        clientId,
        serviceId: serviceId || null,
        status: 'pending'
      });

      res.status(201).json({ message: 'Заявку на ремонт відправлено!', booking: newBooking });
    } catch (error) {
      console.error("ПОМИЛКА СТВОРЕННЯ:", error);
      res.status(500).json({ message: 'Помилка при створенні заявки' });
    }
  });

  // ВИДАЛЕННЯ КЛІЄНТОМ 
  router.delete('/client/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const booking = await Booking.findByPk(id);
      
      if (!booking) {
        return res.status(404).json({ message: "Заявку не знайдено" });
      }

      if (booking.status !== 'pending') {
        return res.status(400).json({ 
          message: "Неможливо скасувати заявку, яка вже в роботі" 
        });
      }

      await booking.destroy();
      res.json({ message: "Заявку успішно скасовано" });
    } catch (error) {
      console.error("ПОМИЛКА ВИДАЛЕННЯ:", error);
      res.status(500).json({ message: "Помилка при видаленні" });
    }
  });

  // ОНОВЛЕННЯ (PATCH) 
  router.patch('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { 
        status, price, masterNote, serviceId, 
        problemDescription, bookingDate, timeSlot 
      } = req.body;

      const booking = await Booking.findByPk(id);
      if (!booking) return res.status(404).json({ message: 'Заявку не знайдено' });

      let updateData = {};
    
      // Поля для клієнта (редагування)
      if (problemDescription !== undefined) updateData.problemDescription = problemDescription;
      if (bookingDate) updateData.bookingDate = bookingDate;
      if (timeSlot) updateData.timeSlot = timeSlot;

      // Поля для майстра/адміна
      if (status) updateData.status = status;
      if (price) updateData.price = price;
      if (serviceId) {
        updateData.serviceId = serviceId;
      }

      if (masterNote) {
        const timestamp = new Date().toLocaleString('uk-UA');
        const newEntry = `[${timestamp}]: ${masterNote}`;
        updateData.masterNotes = booking.masterNotes 
          ? `${booking.masterNotes}\n${newEntry}` 
          : newEntry;
      }

      await booking.update(updateData);
      res.json({ message: 'Заявку оновлено', booking });
    } catch (error) {
      console.error("PATCH BOOKING ERROR:", error);
      res.status(500).json({ message: 'Помилка при оновленні' });
    }
  });

  // ВИДАЛЕННЯ АДМІНОМ
  router.delete('/:id', verifyAdmin, async (req, res) => {
    try {
      const deleted = await Booking.destroy({ where: { id: req.params.id } });
      if (deleted) res.json({ message: "Замовлення видалено" });
      else res.status(404).json({ message: "Не знайдено" });
    } catch (error) {
      res.status(500).json({ message: "Помилка видалення" });
    }
  });

  return router;
};