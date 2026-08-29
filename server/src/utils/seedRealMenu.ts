import mongoose from 'mongoose';
import { Service } from '../models/Service';
import { Package } from '../models/Package';
import { Staff } from '../models/Staff';
import { Gallery } from '../models/Gallery';
import { Testimonial } from '../models/Testimonial';
import { WorkingHours } from '../models/WorkingHours';
import { BusinessSettings } from '../models/BusinessSettings';
import { User } from '../models/User';
import { slugify } from './slugify';

export const seedRealMenuData = async () => {
  console.log('[SeedRealMenu] Wiping old dummy service data & populating real salon menu...');

  // 1. Wipe old services & packages
  await Service.deleteMany({});
  await Package.deleteMany({});
  await WorkingHours.deleteMany({});
  await Gallery.deleteMany({});
  await Testimonial.deleteMany({});
  await Staff.deleteMany({});

  // 2. Real Services List from Official Menu
  const realServices = [
    // --- MAN / GROOM SERVICES ---
    { name: 'Groom Raga D-Tan Facial', category: 'Groom / Man', price: 400, discountPrice: 349, duration: 45, description: 'Deep cleansing Raga D-Tan facial customized for male skin texture.', shortDescription: 'Deep cleansing Raga D-Tan facial for men' },
    { name: 'Groom O3+ D-Tan Facial', category: 'Groom / Man', price: 700, discountPrice: 599, duration: 45, description: 'Advanced O3+ whitening & de-tan treatment for grooms.', shortDescription: 'Advanced O3+ whitening & de-tan treatment' },
    { name: 'Groom Deep Cleanup', category: 'Groom / Man', price: 800, discountPrice: 699, duration: 45, description: 'Pore detox cleanup with blackhead removal and hydration mask.', shortDescription: 'Pore detox cleanup with blackhead removal' },
    { name: 'Streax Hair Colour (Men)', category: 'Groom / Man', price: 600, discountPrice: 499, duration: 45, description: 'Rich Streax grey coverage & shine hair color for men.', shortDescription: 'Rich Streax grey coverage hair color for men' },
    { name: 'Loreal Hair Colour (Men)', category: 'Groom / Man', price: 800, discountPrice: 699, duration: 45, description: 'Ammonia-free Loreal Professional hair color for natural shine.', shortDescription: 'Ammonia-free Loreal Professional hair color' },
    { name: 'Inova Premium Hair Colour (Men)', category: 'Groom / Man', price: 900, discountPrice: 799, duration: 45, description: 'Ultra-nourishing INOA oil-based hair color for men.', shortDescription: 'INOA oil-based hair color for men' },
    { name: 'Fashion Shade Streax (Men)', category: 'Groom / Man', price: 1200, discountPrice: 999, duration: 60, description: 'Trendy fashion highlights & global color streaks for men.', shortDescription: 'Trendy fashion highlights & streaks for men' },
    { name: 'Fashion Shade Loreal (Men)', category: 'Groom / Man', price: 1500, discountPrice: 1299, duration: 60, description: 'Luxury Loreal Balayage & fashion color tones for men.', shortDescription: 'Luxury Loreal Balayage & fashion color tones' },
    { name: 'Loreal Nourishment Hair Spa (Men)', category: 'Groom / Man', price: 600, discountPrice: 499, duration: 45, description: 'Deep conditioning scalp nourishment hair spa with massage.', shortDescription: 'Deep conditioning scalp nourishment hair spa' },
    { name: 'Hair Fall Control Spa (Men)', category: 'Groom / Man', price: 1500, discountPrice: 1199, duration: 60, description: 'Anti-hairfall scalp protein therapy for strengthening roots.', shortDescription: 'Anti-hairfall scalp protein therapy' },
    { name: 'Dandruff Treatment Spa (Men)', category: 'Groom / Man', price: 1500, discountPrice: 1199, duration: 60, description: 'Purifying tea-tree scalp spa to cure severe dandruff & itch.', shortDescription: 'Purifying tea-tree scalp spa for dandruff' },
    { name: 'Head & Shoulder Oil Massage', category: 'Groom / Man', price: 350, discountPrice: 299, duration: 30, description: 'Relaxing Ayurvedic warm oil head & shoulder pressure massage.', shortDescription: 'Relaxing Ayurvedic warm oil head massage' },

    // --- FACIALS & SKIN ---
    { name: 'O3+ Skin Whitening Facial', category: 'Facials & Skin', price: 2500, discountPrice: 1999, duration: 75, description: 'Dermatologist recommended O3+ facial for glowing radiant skin.', shortDescription: 'O3+ facial for glowing radiant skin' },
    { name: 'Gold Radiance Facial', category: 'Facials & Skin', price: 1500, discountPrice: 1199, duration: 60, description: '24K gold foil infused glow facial for bridal radiance.', shortDescription: '24K gold foil infused glow facial' },
    { name: 'Diamond Sparkle Facial', category: 'Facials & Skin', price: 1500, discountPrice: 1199, duration: 60, description: 'Micro-diamond ash polish for skin brightening & rejuvenation.', shortDescription: 'Micro-diamond ash polish for brightening' },
    { name: 'Aroma Therapy Relaxing Facial', category: 'Facials & Skin', price: 1500, discountPrice: 1199, duration: 60, description: 'Pure essential oil aroma facial for stress relief & glow.', shortDescription: 'Pure essential oil aroma facial for stress relief' },
    { name: 'Herbal Organic Facial', category: 'Facials & Skin', price: 1500, discountPrice: 1199, duration: 60, description: '100% natural organic botanical facial for sensitive skin.', shortDescription: '100% natural organic botanical facial' },
    { name: 'Oxy Blast Hydration Facial', category: 'Facials & Skin', price: 1400, discountPrice: 1099, duration: 60, description: 'Pure oxygen vortex infusion for instant plump skin.', shortDescription: 'Pure oxygen vortex infusion for instant plump skin' },
    { name: 'Tan Clear De-Pigmentation Facial', category: 'Facials & Skin', price: 1300, discountPrice: 999, duration: 60, description: 'Sunburn removal and even-tone de-pigmentation therapy.', shortDescription: 'Sunburn removal and even-tone therapy' },
    { name: 'C Sol Brightening Facial', category: 'Facials & Skin', price: 1250, discountPrice: 949, duration: 60, description: 'Concentrated Vitamin C brightening facial for dark spots.', shortDescription: 'Concentrated Vitamin C facial for dark spots' },
    { name: 'Vita Lift Anti-Aging Facial', category: 'Facials & Skin', price: 1200, discountPrice: 899, duration: 60, description: 'Collagen boosting skin tightening & wrinkle reduction facial.', shortDescription: 'Collagen boosting skin tightening facial' },
    { name: 'Clari Glow Deep Cleansing Facial', category: 'Facials & Skin', price: 1200, discountPrice: 899, duration: 60, description: 'Pore clarifying facial for oily & acne-prone skin.', shortDescription: 'Pore clarifying facial for oily skin' },
    { name: 'Fruit Antioxidant Facial', category: 'Facials & Skin', price: 700, discountPrice: 549, duration: 45, description: 'Fresh fruit enzyme extract facial for natural glow.', shortDescription: 'Fresh fruit enzyme extract facial' },

    // --- NAIL ART & EXTENSIONS ---
    { name: 'Acrylic Gel Nail Extension (Hands)', category: 'Nail Art', price: 2000, discountPrice: 1499, duration: 90, description: 'Long-lasting luxury acrylic gel extensions with custom shaping.', shortDescription: 'Long-lasting luxury acrylic gel extensions' },
    { name: 'Acrylic Gel Extension (Feet)', category: 'Nail Art', price: 2100, discountPrice: 1599, duration: 90, description: 'Acrylic toenail reconstruction and luxury toe gel extensions.', shortDescription: 'Acrylic toenail extension and shaping' },
    { name: 'Gel Nail Extension (Hands)', category: 'Nail Art', price: 1500, discountPrice: 1199, duration: 75, description: 'Flexible UV gel nail extensions with French tips or color.', shortDescription: 'Flexible UV gel nail extensions with French tips' },
    { name: 'Gel Extension (Feet)', category: 'Nail Art', price: 1500, discountPrice: 1199, duration: 75, description: 'UV gel toe extensions with high shine finish.', shortDescription: 'UV gel toe extensions with high shine finish' },
    { name: 'Gel Nail Paint (Hands)', category: 'Nail Art', price: 500, discountPrice: 399, duration: 45, description: 'Long-wearing chip-proof UV gel polish application.', shortDescription: 'Long-wearing chip-proof UV gel polish' },
    { name: 'Gel Nail Paint (Feet)', category: 'Nail Art', price: 600, discountPrice: 449, duration: 45, description: 'High gloss UV gel polish for toenails.', shortDescription: 'High gloss UV gel polish for toenails' },

    // --- EYELASH EXTENSIONS ---
    { name: 'Colourful Fantasy Lash Extensions', category: 'Eyelashes', price: 3000, discountPrice: 2499, duration: 90, description: 'Vibrant ombre & pastel eyelash extensions for statement eyes.', shortDescription: 'Vibrant ombre & pastel eyelash extensions' },
    { name: 'Heavy Russian Volume Lash Extensions', category: 'Eyelashes', price: 2500, discountPrice: 1999, duration: 90, description: '3D/5D mega volume mink lash extensions for glamorous look.', shortDescription: '3D/5D mega volume mink lash extensions' },
    { name: 'Basic Natural Lash Extensions', category: 'Eyelashes', price: 1500, discountPrice: 1199, duration: 60, description: 'Single strand classic lash extensions for natural length.', shortDescription: 'Single strand classic lash extensions' },

    // --- WAXING SERVICES ---
    { name: 'Full Body Wax (Rica Peel-Off)', category: 'Waxing', price: 3000, discountPrice: 2499, duration: 90, description: 'Painless Italian Rica lipo-soluble wax for smooth skin.', shortDescription: 'Painless Italian Rica lipo-soluble wax' },
    { name: 'Full Body Wax (Chocolate)', category: 'Waxing', price: 2000, discountPrice: 1599, duration: 90, description: 'Aromatic cocoa bean chocolate wax for soft skin.', shortDescription: 'Aromatic cocoa bean chocolate wax' },
    { name: 'Full Body Wax (Milk)', category: 'Waxing', price: 1800, discountPrice: 1399, duration: 90, description: 'Soothing milk protein wax for sensitive skin.', shortDescription: 'Soothing milk protein wax for sensitive skin' },
    { name: 'Brazilian Face Wax', category: 'Waxing', price: 500, discountPrice: 399, duration: 30, description: 'Painless stripless hard wax for entire face hair removal.', shortDescription: 'Painless stripless hard wax for face' },
    { name: 'Face Wax (Normal)', category: 'Waxing', price: 200, discountPrice: 149, duration: 20, description: 'Gentle facial wax for chin, cheeks and upperlips.', shortDescription: 'Gentle facial wax for chin & upperlips' },

    // --- BRIDAL & MAKEUP ---
    { name: 'Signature HD Airbrush Bridal Makeup', category: 'Bridal & Makeup', price: 18000, discountPrice: 14999, duration: 180, description: 'Ultra HD 24-hour waterproof airbrush bridal makeup with customized hairstyle, saree draping, lashes & jewelry setting.', shortDescription: 'Ultra HD 24-hour waterproof airbrush bridal makeup' },
    { name: 'Royal Pre-Bridal Pamper Package', category: 'Bridal & Makeup', price: 12500, discountPrice: 9999, duration: 240, description: 'Full body Rica wax, 24K gold facial, body polishing, hair spa, manicure & pedicure ritual.', shortDescription: 'Full body Rica wax, 24K gold facial & spa' },
    { name: 'Engagement & Sagan Glam Makeup', category: 'Bridal & Makeup', price: 8500, discountPrice: 6999, duration: 120, description: 'Soft glam HD makeup with customized hairstyle and draping.', shortDescription: 'Soft glam HD makeup for pre-wedding functions' },
  ];

  for (const s of realServices) {
    const slug = slugify(s.name);
    await Service.create({
      name: s.name,
      slug,
      category: s.category,
      description: s.description,
      shortDescription: s.shortDescription,
      price: s.price,
      discountPrice: s.discountPrice,
      duration: s.duration,
      images: ['/logo.png'],
      isFeatured: s.price > 1200,
      status: 'Active',
    });
  }

  // 3. Real Packages
  const realPackages = [
    {
      name: 'Royal Grand Bridal Package',
      description: 'Complete 3-day royal bridal couture package: Signature HD Airbrush Makeup, Pre-Bridal pamper, Rica Body Polish, Gold Facial & Gel Nails',
      originalPrice: 35000,
      discountPrice: 24999,
      duration: 360,
      validityDays: 30,
      images: ['/logo.png'],
      isPopular: true,
      status: 'Active',
    },
    {
      name: 'Groom Grooming Luxury Package',
      description: 'Complete camera-ready groom ritual: O3+ D-Tan facial, haircut, Streax color, beard sculpting, head massage & cleanup',
      originalPrice: 4500,
      discountPrice: 3299,
      duration: 150,
      validityDays: 30,
      images: ['/logo.png'],
      isPopular: true,
      status: 'Active',
    },
  ];

  for (const p of realPackages) {
    const slug = slugify(p.name);
    await Package.create({
      name: p.name,
      slug,
      description: p.description,
      servicesIncluded: [],
      originalPrice: p.originalPrice,
      discountPrice: p.discountPrice,
      duration: p.duration,
      validityDays: p.validityDays,
      images: p.images,
      isPopular: p.isPopular,
      status: p.status,
    });
  }

  // 4. Working Hours (All 7 Days 10:30 AM to 9:30 PM)
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  for (const d of days) {
    await WorkingHours.create({
      day: d,
      isOpen: true,
      openTime: '10:30',
      closeTime: '21:30',
      breakStart: '14:00',
      breakEnd: '14:30',
    });
  }

  // 5. Real Staff
  await Staff.create({
    name: 'Piyush Prajapati',
    designation: 'Master Art Director & HD Makeup Artist',
    phone: '9352769045',
    email: 'piyush@makeupwithart.com',
    bio: 'Celebrity HD Airbrush bridal makeup expert with 10+ years experience',
    photo: '/logo.png',
    status: 'Active',
  });

  await Staff.create({
    name: 'Arti Prajapati',
    designation: 'Senior Hair Artist & Nail Stylist',
    phone: '7575939735',
    email: 'arti@makeupwithart.com',
    bio: 'Keratin smoothing specialist, Balayage colorist & 3D chrome nail artist',
    photo: '/logo.png',
    status: 'Active',
  });

  // 6. Real Testimonials
  await Testimonial.create({
    customerName: 'Pooja Khandelwal',
    rating: 5,
    review: 'Absolutely stunning HD Airbrush bridal makeup! Piyush sir and his team made me look like a royal queen on my wedding day at Shyam Nagar.',
    photo: '/logo.png',
    status: 'Approved',
  });

  await Testimonial.create({
    customerName: 'Simran Rathore',
    rating: 5,
    review: 'The O3+ Facial and Rica full body wax was so smooth and relaxing. Best salon experience in Jaipur.',
    photo: '/logo.png',
    status: 'Approved',
  });

  await Testimonial.create({
    customerName: 'Rohan Sharma',
    rating: 5,
    review: 'Got the Groom D-Tan & Loreal hair color package. Super professional work by Piyush bhai!',
    photo: '/logo.png',
    status: 'Approved',
  });

  console.log('[SeedRealMenu] Real menu database seeding COMPLETE!');
};
