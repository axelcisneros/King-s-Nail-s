const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const User = require('./models/UserModel');
const Appointment = require('./models/AppointmentModel');
const Review = require('./models/Review');
const GalleryImage = require('./models/GalleryImageModel');
const Service = require('./models/ServiceModel');

async function seed() {
  try {
    await connectDB();

    // Crear admin si no existe ninguno
    const usersCount = await User.countDocuments();
    let admin;
    if (usersCount === 0) {
      console.log('No se encontraron usuarios. Creando usuario admin de prueba...');
      admin = await User.create({
        name: 'Admin Kings',
        email: 'admin@kingsnails.test',
        password: 'Admin123!',
        role: 'admin',
      });
    } else {
      admin = await User.findOne({ role: 'admin' });
      console.log(`Usuarios existentes: ${usersCount}. Admin encontrado: ${admin ? admin.email : 'no'}`);
    }

    // Crear un usuario cliente de prueba si no existe
    let client = await User.findOne({ email: 'cliente@kingsnails.test' });
    if (!client) {
      client = await User.create({
        name: 'Cliente Demo',
        email: 'cliente@kingsnails.test',
        password: 'Cliente123!',
        role: 'client',
      });
    }

    // Crear citas de ejemplo si no existen
    const apptCount = await Appointment.countDocuments();
    let appts = [];
    if (apptCount === 0) {
      console.log('Creando citas de ejemplo...');
      appts = await Appointment.create([
        {
          user: client._id,
          clientName: client.name,
          clientEmail: client.email,
          clientPhone: '+56911111111',
          service: 'Manicure clásica',
          requestedDate: new Date(),
          status: 'pending',
          notes: 'Prefiere color rojo',
        },
        {
          user: client._id,
          clientName: client.name,
          clientEmail: client.email,
          clientPhone: '+56922222222',
          service: 'Pedicure SPA',
          requestedDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
          status: 'confirmed',
        },
      ]);
    } else {
      appts = await Appointment.find().limit(2);
      console.log(`Ya existen ${apptCount} citas.`);
    }

    // Crear reseña vinculada a la primera cita (si no existe)
    const reviewsCount = await Review.countDocuments();
    if (reviewsCount === 0 && appts.length > 0) {
      console.log('Creando reseña de ejemplo...');
      await Review.create({
        user: client._id,
        appointment: appts[0]._id,
        rating: 5,
        comment: 'Me encantó el servicio, muy profesional!',
        isApproved: true,
      });
    }

    // Crear imágenes de galería de ejemplo si no existen
    const imagesCount = await GalleryImage.countDocuments();
    if (imagesCount === 0) {
      console.log('Creando imágenes de galería de ejemplo...');
      await GalleryImage.create([
        { title: 'Manicure elegante', description: 'Diseño con brillo', imageUrl: 'https://via.placeholder.com/800x600?text=Manicure', isFeatured: true },
        { title: 'Pedicure colorido', description: 'Toques veraniegos', imageUrl: 'https://via.placeholder.com/800x600?text=Pedicure' },
      ]);
    }

    // Crear servicios de ejemplo si no existen
    const servicesCount = await Service.countDocuments();
    if (servicesCount === 0) {
      console.log('Creando servicios de ejemplo...');
      await Service.create([
        { name: 'Manicure Básica', description: 'Limado, pulido y esmaltado clásico', price: 250, duration: 45 },
        { name: 'Manicure Francesa', description: 'Estilo francés elegante y clásico', price: 350, duration: 60 },
        { name: 'Manicure con Diseño', description: 'Arte personalizado en uñas', price: 450, duration: 90 },
        { name: 'Pedicure Básica', description: 'Cuidado completo de pies', price: 300, duration: 60 },
        { name: 'Pedicure SPA', description: 'Tratamiento relajante con exfoliación', price: 500, duration: 90 },
        { name: 'Uñas Acrílicas', description: 'Extensión con acrílico', price: 600, duration: 120 },
        { name: 'Uñas de Gel', description: 'Esmaltado semipermanente', price: 400, duration: 75 },
      ]);
    }

    console.log('Seed completado correctamente.');
    process.exit(0);
  } catch (err) {
    console.error('Error en el seed:', err);
    process.exit(1);
  }
}

seed();
