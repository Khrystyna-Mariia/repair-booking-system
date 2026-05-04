const express = require('express');
const router = express.Router();

module.exports = (Review, Booking, User) => {
  router.post('/', async (req, res) => {
    try {
      const { rating, comment, bookingId, clientId, masterId } = req.body;

      if (!masterId) {
        return res.status(400).json({ message: 'ID майстра обов’язкове' });
      }

      const review = await Review.create({
        rating,
        comment,
        bookingId,
        clientId,
        masterId
      });

      res.status(201).json(review);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Помилка при створенні відгуку' });
    }
  });

  return router;
};