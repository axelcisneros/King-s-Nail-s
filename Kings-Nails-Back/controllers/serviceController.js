const asyncHandler = require('express-async-handler');
const Service = require('../models/ServiceModel');

// @desc Get all services
// @route GET /api/services
// @access Public (admin page reads them)
const getServices = asyncHandler(async (req, res) => {
  const services = await Service.find().sort({ createdAt: 1 });
  res.json(services);
});

// @desc Create a new service
// @route POST /api/services
// @access Admin
const createService = asyncHandler(async (req, res) => {
  const { name, description, price, duration } = req.body;
  if (!name || !price || !duration) {
    res.status(400);
    throw new Error('Missing required fields');
  }
  const service = await Service.create({ name, description, price, duration });
  res.status(201).json(service);
});

// @desc Update a service
// @route PUT /api/services/:id
// @access Admin
const updateService = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const service = await Service.findById(id);
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }
  const { name, description, price, duration } = req.body;
  service.name = name ?? service.name;
  service.description = description ?? service.description;
  service.price = price ?? service.price;
  service.duration = duration ?? service.duration;
  const updated = await service.save();
  res.json(updated);
});

// @desc Delete a service
// @route DELETE /api/services/:id
// @access Admin
const deleteService = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const service = await Service.findById(id);
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }
  await service.remove();
  res.json({ message: 'Service removed' });
});

module.exports = { getServices, createService, updateService, deleteService };
