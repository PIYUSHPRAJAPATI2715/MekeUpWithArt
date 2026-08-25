import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from '../config/env';
import { User } from '../models/User';
import { Service } from '../models/Service';
import { Package } from '../models/Package';
import { Staff } from '../models/Staff';
import { Gallery } from '../models/Gallery';
import { Testimonial } from '../models/Testimonial';
import { BusinessSettings } from '../models/BusinessSettings';
import { WorkingHours } from '../models/WorkingHours';
import { Booking } from '../models/Booking';

export const seedDatabaseData = async () => {
  console.log('[Seed] Clearing existing database collections...');
  // Clear existing data
  await User.deleteMany({});
  await Service.deleteMany({});
  await Package.deleteMany({});
  await Staff.deleteMany({});
  await Gallery.deleteMany({});
  await Testimonial.deleteMany({});
  await BusinessSettings.deleteMany({});
  await WorkingHours.deleteMany({});
  await Booking.deleteMany({});

  console.log('[Seed] Creating Default Users...');
  // Admin User
  const adminPasswordHash = await bcrypt.hash('Admin@123456', 10);
  await User.create({
    name: 'Art Director Admin',
    email: 'admin@makeupwithart.com',
    phone: '8949009360',
    password: adminPasswordHash,
    role: 'SUPER_ADMIN',
    isActive: true,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
  });

  // Sample Customer
  const customerPasswordHash = await bcrypt.hash('Customer@123456', 10);
  await User.create({
    name: 'Priya Sharma',
    email: 'customer@gmail.com',
    phone: '9829012345',
    password: customerPasswordHash,
    role: 'CUSTOMER',
    isActive: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  });

  console.log('[Seed] Creating Business Settings...');
  await BusinessSettings.create({
    businessName: 'MAKEUP WITH ART',
    phoneNumbers: ['8949009360', '7357496309'],
    email: 'makeupwitharto@gmail.com',
    address: 'Pillar No. 113, Shyam Nagar Metro Station, Jaipur',
    instagram: 'makeup.with.art',
    googleMapsIframeUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3558.8912!2d75.7621!3d26.8912',
    heroTitle: 'CRAFTING LUXURY BEAUTY & ARTISTRY',
    heroSubheading: 'Experience Jaipur\'s premier unisex salon destination for high-definition bridal makeup, couture hair transformations, hydra facials & aesthetic nails.',
    aboutContent: 'At MAKEUP WITH ART, beauty is an immersive art form. Located at Shyam Nagar Metro Station, our luxury unisex studio combines international techniques with premium organic formulations.',
  });

  console.log('[Seed] Creating Working Hours...');
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  for (const day of days) {
    await WorkingHours.create({
      day,
      isOpen: true,
      openTime: '10:00',
      closeTime: '20:00',
      breakStart: '14:00',
      breakEnd: '14:30',
      slotIntervalMinutes: 30,
    });
  }

  console.log('[Seed] Creating Services...');
  const servicesData = [
    {
      name: 'Signature HD Bridal Makeup',
      category: 'Makeup',
      description: 'Long-lasting, waterproof high-definition airbrush bridal makeup tailored for royal Indian weddings.',
      duration: 180,
      price: 15000,
      discountPrice: 12999,
      images: ['https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80'],
      isFeatured: true,
      status: 'Active',
    },
    {
      name: 'Keratin Hair Smoothing & Spa',
      category: 'Hair',
      description: 'Formaldehyde-free protein therapy for silky, frizz-free hair with intense shine and strength.',
      duration: 120,
      price: 4999,
      discountPrice: 3999,
      images: ['https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80'],
      isFeatured: true,
      status: 'Active',
    },
    {
      name: 'Luxury Hydra Facial & Skin Glow',
      category: 'Skin',
      description: 'Deep pore vacuum extraction, hyaluronic acid infusion, and LED phototherapy for glowing skin.',
      duration: 75,
      price: 3499,
      discountPrice: 2799,
      images: ['https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80'],
      isFeatured: true,
      status: 'Active',
    },
    {
      name: 'Gel Extensions & Custom Nail Art',
      category: 'Nails',
      description: 'Full set gel nail extensions with handcrafted 3D embellishments, French tips, and chrome foil.',
      duration: 90,
      price: 2499,
      discountPrice: 1999,
      images: ['https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80'],
      isFeatured: true,
      status: 'Active',
    },
    {
      name: 'Volume Lash Extensions & Lift',
      category: 'Eyelashes',
      description: 'Synthetic mink lash extensions applied individually for dramatic volume and featherweight feel.',
      duration: 90,
      price: 2999,
      discountPrice: 2299,
      images: ['https://images.unsplash.com/photo-1583001809873-a1284a563177?auto=format&fit=crop&w=800&q=80'],
      isFeatured: true,
      status: 'Active',
    },
  ];

  const createdServices = [];
  for (const s of servicesData) {
    const serv = await Service.create({
      ...s,
      slug: s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
    });
    createdServices.push(serv);
  }

  console.log('[Seed] Creating Packages...');
  await Package.create({
    name: 'Royal Bridal Couture Package',
    slug: 'royal-bridal-couture-package',
    description: 'Complete pre-bridal and wedding day pampering including HD makeup, hair styling, skin glow & nail art.',
    servicesIncluded: [createdServices[0]._id, createdServices[1]._id, createdServices[2]._id, createdServices[3]._id],
    originalPrice: 25996,
    discountPrice: 19999,
    validityDays: 30,
    duration: 360,
    images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'],
    status: 'Active',
    isPopular: true,
  });

  console.log('[Seed] Creating Staff Roster...');
  await Staff.create([
    {
      name: 'Aarti Prajapati',
      role: 'Master Makeup Artist & Stylist',
      phone: '8949009360',
      email: 'aarti@makeupwithart.com',
      services: ['Makeup', 'Hair'],
      status: 'Active',
      photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    },
    {
      name: 'Rohan Verma',
      role: 'Senior Hair Technician',
      phone: '7357496309',
      email: 'rohan@makeupwithart.com',
      services: ['Hair'],
      status: 'Active',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    },
  ]);

  console.log('[Seed] Creating Testimonials...');
  await Testimonial.create([
    {
      customerName: 'Meghna Roy',
      review: 'Aarti did my HD bridal makeup for my wedding in Jaipur. The makeup stayed flawless all night and looked divine in photos!',
      rating: 5,
      status: 'Approved',
    },
    {
      customerName: 'Pooja Agarwal',
      review: 'Best keratin hair spa in Shyam Nagar! My hair feels so soft and smooth. Highly professional team.',
      rating: 5,
      status: 'Approved',
    },
  ]);

  console.log('[Seed] Creating Gallery Portfolio...');
  await Gallery.create([
    { title: 'HD Royal Indian Bridal Look', category: 'Makeup', imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80', isFeatured: true },
    { title: 'Couture Keratin Hair Transformation', category: 'Hair', imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80', isFeatured: true },
    { title: 'Glitz & Glam French Gel Nails', category: 'Nails', imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80', isFeatured: true },
  ]);

  console.log('[Seed] Database populated successfully!');
  return true;
};

const runStandaloneSeed = async () => {
  try {
    console.log('[Seed Standalone] Connecting to MongoDB...');
    await mongoose.connect(config.MONGODB_URI);
    await seedDatabaseData();
    console.log('[Seed Standalone] Completed.');
    process.exit(0);
  } catch (err) {
    console.error('[Seed Standalone Error]:', err);
    process.exit(1);
  }
};

if (require.main === module) {
  runStandaloneSeed();
}
