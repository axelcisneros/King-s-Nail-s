const express = require('express');
const router = express.Router();
const {
  createQuote,
  getMyQuotes,
  getAllQuotes,
  respondQuote,
} = require('../controllers/quoteController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, createQuote).get(protect, admin, getAllQuotes);
router.route('/my').get(protect, getMyQuotes);
router.route('/:id/respond').put(protect, admin, respondQuote);

module.exports = router;
