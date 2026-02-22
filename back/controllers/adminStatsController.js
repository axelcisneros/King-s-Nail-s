const asyncHandler = require('express-async-handler');
const User = require('../models/UserModel');
const Appointment = require('../models/AppointmentModel');
const Review = require('../models/Review');
const GalleryImage = require('../models/GalleryImageModel');
const Quote = require('../models/QuoteModel');

// @desc    Obtener métricas para el dashboard de administración
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = asyncHandler(async (req, res) => {
	// Total de usuarios
	const totalUsers = await User.countDocuments();

	// Cotizaciones por estado principales
	const quoteStatusAggregation = await Quote.aggregate([
		{ $group: { _id: '$status', count: { $sum: 1 } } },
	]);

	const quoteStatusTotals = quoteStatusAggregation.reduce((acc, item) => {
		const status = item._id;
		if (['requested', 'cancelled', 'accepted'].includes(status)) {
			acc[status] = item.count;
		}
		return acc;
	}, { requested: 0, cancelled: 0, accepted: 0 });

	// Cotizaciones agrupadas por mes-año y estado
	const quotesByMonth = await Quote.aggregate([
		{
			$group: {
				_id: {
					year: { $year: '$createdAt' },
					month: { $month: '$createdAt' },
					status: '$status',
				},
				count: { $sum: 1 },
			},
		},
		{ $sort: { '_id.year': 1, '_id.month': 1, '_id.status': 1 } },
	]);

	// Citas por estado
	const appointmentsByStatus = await Appointment.aggregate([
		{ $group: { _id: '$status', count: { $sum: 1 } } },
	]);

	// Reseñas: promedio y total aprobadas
	const reviewsStats = await Review.aggregate([
		{ $group: { _id: null, avgRating: { $avg: '$rating' }, total: { $sum: 1 } } },
	]);

	const avgRating = reviewsStats[0]?.avgRating || 0;
	const totalReviews = reviewsStats[0]?.total || 0;

	// Imágenes en la galería
	const totalImages = await GalleryImage.countDocuments();

	// Citas recientes (últimos 7 días)
	const sevenDaysAgo = new Date();
	sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

	const recentAppointments = await Appointment.find({ createdAt: { $gte: sevenDaysAgo } })
		.sort({ createdAt: -1 })
		.limit(10)
		.select('clientName requestedDate status createdAt');

	res.json({
		totalUsers,
		quoteStatusTotals,
		quotesByMonth,
		appointmentsByStatus,
		// Métricas por mes (agrupadas por mes-año)
		usersByMonth: await User.aggregate([
			{
				$group: {
					_id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
					count: { $sum: 1 },
				},
			},
			{ $sort: { '_id.year': 1, '_id.month': 1 } },
		]),
		// Citas agrupadas por mes/año tomando la fecha solicitada por el cliente (requestedDate)
		appointmentsByMonth: await Appointment.aggregate([
			{
				$group: {
					_id: { year: { $year: '$requestedDate' }, month: { $month: '$requestedDate' }, status: '$status' },
					count: { $sum: 1 },
				},
			},
			{ $sort: { '_id.year': 1, '_id.month': 1 } },
		]),
		reviewsByMonth: await Review.aggregate([
			{
				$group: {
					_id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
					count: { $sum: 1 },
					avgRating: { $avg: '$rating' },
				},
			},
			{ $sort: { '_id.year': 1, '_id.month': 1 } },
		]),
		// Reseñas por mes y por rating (1..5) -> para pies por mes
		reviewsByMonthRatings: await Review.aggregate([
			{
				$group: {
					_id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' }, rating: '$rating' },
					count: { $sum: 1 },
				},
			},
			{ $sort: { '_id.year': 1, '_id.month': 1, '_id.rating': 1 } },
		]),
		// Agregaciones por dia para el mes actual
		usersByDayThisMonth: await (async () => {
			const now = new Date();
			const year = now.getFullYear();
			const month = now.getMonth() + 1;
			return User.aggregate([
				{ $match: { $expr: { $and: [ { $eq: [ { $year: '$createdAt' }, year ] }, { $eq: [ { $month: '$createdAt' }, month ] } ] } } },
				{ $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' }, day: { $dayOfMonth: '$createdAt' } }, count: { $sum: 1 } } },
				{ $sort: { '_id.day': 1 } },
			]);
		})(),
		// Citas por día para el mes actual — usamos requestedDate (la fecha elegida por el cliente)
		appointmentsByDayThisMonth: await (async () => {
			const now = new Date();
			const year = now.getFullYear();
			const month = now.getMonth() + 1;
			return Appointment.aggregate([
				{ $match: { $expr: { $and: [ { $eq: [ { $year: '$requestedDate' }, year ] }, { $eq: [ { $month: '$requestedDate' }, month ] } ] } } },
				{ $group: { _id: { year: { $year: '$requestedDate' }, month: { $month: '$requestedDate' }, day: { $dayOfMonth: '$requestedDate' } , status: '$status' }, count: { $sum: 1 } } },
				{ $sort: { '_id.day': 1 } },
			]);
		})(),
		reviewsByDayThisMonth: await (async () => {
			const now = new Date();
			const year = now.getFullYear();
			const month = now.getMonth() + 1;
			return Review.aggregate([
				{ $match: { $expr: { $and: [ { $eq: [ { $year: '$createdAt' }, year ] }, { $eq: [ { $month: '$createdAt' }, month ] } ] } } },
				{ $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' }, day: { $dayOfMonth: '$createdAt' } }, count: { $sum: 1 }, avgRating: { $avg: '$rating' } } },
				{ $sort: { '_id.day': 1 } },
			]);
		})(),
		// Agregaciones por mes para el año actual (resumen anual por mes)
		usersByMonthThisYear: await (async () => {
			const now = new Date();
			const year = now.getFullYear();
			return User.aggregate([
				{ $match: { $expr: { $eq: [ { $year: '$createdAt' }, year ] } } },
				{ $group: { _id: { month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
				{ $sort: { '_id.month': 1 } },
			]);
		})(),
		// Resumen anual de citas por mes — basado en requestedDate
		appointmentsByMonthThisYear: await (async () => {
			const now = new Date();
			const year = now.getFullYear();
			return Appointment.aggregate([
				{ $match: { $expr: { $eq: [ { $year: '$requestedDate' }, year ] } } },
				{ $group: { _id: { month: { $month: '$requestedDate' } }, count: { $sum: 1 } } },
				{ $sort: { '_id.month': 1 } },
			]);
		})(),
		quotesByMonthThisYear: await (async () => {
			const now = new Date();
			const year = now.getFullYear();
			return Quote.aggregate([
				{ $match: { $expr: { $eq: [ { $year: '$createdAt' }, year ] } } },
				{ $group: { _id: { month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
				{ $sort: { '_id.month': 1 } },
			]);
		})(),
		reviewsByMonthThisYear: await (async () => {
			const now = new Date();
			const year = now.getFullYear();
			return Review.aggregate([
				{ $match: { $expr: { $eq: [ { $year: '$createdAt' }, year ] } } },
				{ $group: { _id: { month: { $month: '$createdAt' } }, count: { $sum: 1 }, avgRating: { $avg: '$rating' } } },
				{ $sort: { '_id.month': 1 } },
			]);
		})(),
		// Conteo por valor de rating (1..5)
		reviewsByRating: await Review.aggregate([
			{ $group: { _id: '$rating', count: { $sum: 1 } } },
			{ $sort: { '_id': 1 } },
		]),
		avgRating: Number(avgRating.toFixed(2)),
		totalReviews,
		totalImages,
		recentAppointments,
	});
});

module.exports = { getStats };
