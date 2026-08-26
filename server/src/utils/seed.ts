import mongoose from 'mongoose';
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
  await User.create({
    name: 'Art Director Admin',
    email: 'admin@makeupwithart.com',
    phone: '9352769045',
    password: 'Admin@123456',
    role: 'SUPER_ADMIN',
    isActive: true,
    avatar: '/logo.png',
  });

  await User.create({
    name: 'Priya Sharma',
    email: 'customer@gmail.com',
    phone: '7575939735',
    password: 'Customer@123456',
    role: 'CUSTOMER',
    isActive: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  });

  console.log('[Seed] Creating Business Settings...');
  await BusinessSettings.create({
    businessName: 'MAKEUP WITH ART',
    phoneNumbers: ['9352769045', '7575939735'],
    email: 'makeupwitharto@gmail.com',
    address: 'Pillar No. 113, Shyam Nagar Metro Station, Jaipur',
    instagram: 'makeup.with.art',
    googleMapsIframeUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3558.8912!2d75.7621!3d26.8912',
    heroTitle: 'CRAFTING LUXURY BEAUTY & ARTISTRY',
    heroSubheading: 'Experience Jaipur\'s premier unisex salon destination for HD bridal & groom makeup, couture hair smoothing, hydra facials, Russian lash lifts & 3D chrome nail art.',
    aboutContent: 'At MAKEUP WITH ART, beauty is an immersive art form. Located at Pillar No. 113, Shyam Nagar Metro Station, our luxury studio delivers world-class unisex salon experiences with organic formulations and certified master artists.',
  });

  console.log('[Seed] Creating Working Hours (10:30 AM to 9:30 PM)...');
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  for (const day of days) {
    await WorkingHours.create({
      day,
      isOpen: true,
      openTime: '10:30',
      closeTime: '21:30',
      breakStart: '14:00',
      breakEnd: '14:30',
      slotIntervalMinutes: 30,
    });
  }

  console.log('[Seed] Creating Comprehensive Services...');
  const servicesData = [
    // Bridal Makeup
    {
      name: 'Signature HD Airbrush Bridal Makeup',
      category: 'Bridal Makeup',
      description: 'Ultra HD waterproof airbrush bridal makeup with 24-hour stay, premium lash application, hair styling, outfit draping & jewel setting.',
      shortDescription: 'Ultra HD waterproof airbrush bridal makeup with 24-hour stay.',
      duration: 180,
      price: 18000,
      discountPrice: 14999,
      images: ['https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80'],
      isFeatured: true,
      status: 'Active',
    },
    {
      name: 'Royal Pre-Bridal Pamper Ritual',
      category: 'Bridal Makeup',
      description: 'Complete pre-wedding body polishing, gold facial, full body waxing, hair spa & deluxe manicure-pedicure.',
      shortDescription: 'Complete pre-wedding body polishing, gold facial & hair spa.',
      duration: 240,
      price: 12500,
      discountPrice: 9999,
      images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'],
      isFeatured: true,
      status: 'Active',
    },
    {
      name: 'Engagement & Sagan Glam Makeup',
      category: 'Bridal Makeup',
      description: 'Soft glam HD makeup with subtle shimmer, customized hair do & saree/lehenga draping for pre-wedding functions.',
      shortDescription: 'Soft glam HD makeup with customized hair do & draping.',
      duration: 120,
      price: 8500,
      discountPrice: 6999,
      images: ['https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80'],
      isFeatured: false,
      status: 'Active',
    },

    // Groom Makeup & Grooming
    {
      name: 'Royal Groom Beard Sculpting & Haircut',
      category: 'Groom Makeup',
      description: 'Precision scissor haircut, steam hot-towel beard shaping, charcoal scalp detox & blow-dry finish for grooms.',
      shortDescription: 'Precision haircut, steam beard shaping & scalp detox.',
      duration: 60,
      price: 2499,
      discountPrice: 1999,
      images: ['https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80'],
      isFeatured: true,
      status: 'Active',
    },
    {
      name: 'Groom HD Skin Touchup & De-Tan Facial',
      category: 'Groom Makeup',
      description: 'Camera-ready matte skin touchup for groom on wedding day including de-tan, dark circle conceal & beard styling.',
      shortDescription: 'Camera-ready matte skin touchup & de-tan facial for grooms.',
      duration: 90,
      price: 4500,
      discountPrice: 3499,
      images: ['https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80'],
      isFeatured: true,
      status: 'Active',
    },

    // Hair Art & Styling
    {
      name: 'Keratin Protein Hair Smoothing Therapy',
      category: 'Hair Art',
      description: 'Formaldehyde-free intense protein infusion that eliminates 95% frizz, giving silky straight manageable hair for up to 6 months.',
      shortDescription: 'Protein infusion giving silky straight hair for up to 6 months.',
      duration: 150,
      price: 5999,
      discountPrice: 4499,
      images: ['https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80'],
      isFeatured: true,
      status: 'Active',
    },
    {
      name: 'Botox Hair Rejuvenation Treatment',
      category: 'Hair Art',
      description: 'Deep conditioning anti-aging hair repair treatment enriched with caviar oil, collagen & B5 vitamins.',
      shortDescription: 'Anti-aging hair repair with caviar oil & collagen.',
      duration: 180,
      price: 6999,
      discountPrice: 5499,
      images: ['https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80'],
      isFeatured: true,
      status: 'Active',
    },
    {
      name: 'Global Hair Color & Balayage Art',
      category: 'Hair Art',
      description: 'Custom hand-painted French Balayage highlights with Olaplex bond protection and gloss shine toner.',
      shortDescription: 'Hand-painted Balayage highlights with Olaplex bond protection.',
      duration: 180,
      price: 7500,
      discountPrice: 5999,
      images: ['https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=800&q=80'],
      isFeatured: false,
      status: 'Active',
    },

    // Nails Art
    {
      name: 'Gel Extensions & 3D Chrome Nail Art',
      category: 'Nail Art',
      description: 'Full set luxury gel nail extensions with handcrafted 3D embellishments, metallic chrome foil & French tips.',
      shortDescription: 'Luxury gel nail extensions with 3D chrome foil & French tips.',
      duration: 90,
      price: 2999,
      discountPrice: 2299,
      images: ['https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80'],
      isFeatured: true,
      status: 'Active',
    },
    {
      name: 'Russian Dry Manicure & Pedicure',
      category: 'Nail Art',
      description: 'E-file precision cuticle care with organic foot soak, callus scrubbing & long-wear gel polish finish.',
      shortDescription: 'Precision cuticle care with organic foot soak & gel polish.',
      duration: 75,
      price: 1999,
      discountPrice: 1599,
      images: ['https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=80'],
      isFeatured: false,
      status: 'Active',
    },

    // Skin & Facials
    {
      name: 'Luxury Hydra Glow Facial & LED Therapy',
      category: 'Skin',
      description: '6-in-1 medical grade hydro-dermabrasion with hyaluronic serum vortex infusion, cold hammer & red light phototherapy.',
      shortDescription: 'Hydro-dermabrasion with hyaluronic vortex infusion & LED therapy.',
      duration: 75,
      price: 3999,
      discountPrice: 2999,
      images: ['https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80'],
      isFeatured: true,
      status: 'Active',
    },

    // Eyelash & Eyebrow
    {
      name: 'Russian Volume Lash Extensions',
      category: 'Eyelashes',
      description: 'Ultra-light 3D/5D mink lash fan extensions for voluminous fluttery eyes lasting up to 4 weeks.',
      shortDescription: '3D mink lash extensions for voluminous fluttery eyes.',
      duration: 90,
      price: 3499,
      discountPrice: 2699,
      images: ['https://images.unsplash.com/photo-1583001809873-a1284a563177?auto=format&fit=crop&w=800&q=80'],
      isFeatured: true,
      status: 'Active',
    },
  ];

  const createdServices: any[] = [];
  for (const s of servicesData) {
    try {
      const slug = s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const serv = await Service.create({
        ...s,
        slug,
      });
      createdServices.push(serv);
    } catch (err: any) {
      console.error('[Service Seed Error]:', err.message);
    }
  }

  console.log('[Seed] Creating Packages...');
  try {
    const includedIds = createdServices.slice(0, 4).map(s => s._id);
    await Package.create([
      {
        name: 'Royal Bridal & Groom Luxury Combo',
        slug: 'royal-bridal-groom-luxury-combo',
        description: 'Ultimate wedding package for both bride and groom including HD Airbrush makeup, hair keratin, hydra facials & nail art.',
        servicesIncluded: includedIds,
        originalPrice: 34996,
        discountPrice: 24999,
        validityDays: 30,
        duration: 360,
        images: ['https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'],
        status: 'Active',
        isPopular: true,
      },
      {
        name: 'Festival Deluxe Pamper Package',
        slug: 'festival-deluxe-pamper-package',
        description: 'Complete festive glow makeover including Hydra Facial, Keratin Spa, Russian Manicure & Lash Lift.',
        servicesIncluded: includedIds.slice(0, 2),
        originalPrice: 11997,
        discountPrice: 6999,
        validityDays: 15,
        duration: 210,
        images: ['https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80'],
        status: 'Active',
        isPopular: true,
      },
    ]);
  } catch (err: any) {
    console.error('[Package Seed Error]:', err.message);
  }

  console.log('[Seed] Creating Staff Roster...');
  try {
    await Staff.create([
      {
        name: 'Aarti Prajapati',
        role: 'Master Makeup & Hair Artist',
        phone: '9352769045',
        email: 'aarti@makeupwithart.com',
        services: ['Bridal Makeup', 'Groom Makeup', 'Hair Art'],
        status: 'Active',
        photo: '/logo.png',
      },
      {
        name: 'Piyush Prajapati',
        role: 'Senior Stylist & Creative Director',
        phone: '7575939735',
        email: 'piyush@makeupwithart.com',
        services: ['Hair Art', 'Groom Makeup', 'Nail Art'],
        status: 'Active',
        photo: '/logo.png',
      },
    ]);
  } catch (err: any) {
    console.error('[Staff Seed Error]:', err.message);
  }

  console.log('[Seed] Creating Testimonials...');
  try {
    await Testimonial.create([
      {
        customerName: 'Meghna Roy',
        review: 'Aarti did my HD airbrush bridal makeup for my wedding in Jaipur. The makeup stayed flawless for 24 hours and looked royal in photographs!',
        rating: 5,
        status: 'Approved',
      },
      {
        customerName: 'Rahul & Neha Sharma',
        review: 'We booked the Royal Bridal & Groom combo. Best salon in Shyam Nagar! Professional team, luxury ambience & top-tier keratin treatment.',
        rating: 5,
        status: 'Approved',
      },
    ]);
  } catch (err: any) {
    console.error('[Testimonial Seed Error]:', err.message);
  }

  console.log('[Seed] Creating Gallery Portfolio...');
  try {
    await Gallery.create([
      { title: 'HD Royal Airbrush Bridal Makeup', category: 'Makeup', imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80', isFeatured: true },
      { title: 'Couture Keratin Protein Smoothing', category: 'Hair', imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80', isFeatured: true },
      { title: '3D Chrome Gel Nail Art Extensions', category: 'Nails', imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80', isFeatured: true },
      { title: 'Royal Groom Beard Sculpting & Styling', category: 'Hair', imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80', isFeatured: true },
    ]);
  } catch (err: any) {
    console.error('[Gallery Seed Error]:', err.message);
  }

  console.log('[Seed] Comprehensive demo data populated successfully!');
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
