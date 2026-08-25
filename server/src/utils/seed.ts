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

const seedDatabase = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(config.MONGODB_URI);
    console.log('[Seed] Connected successfully.');

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
    const adminUser = await User.create({
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
    const customerUser = await User.create({
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
      address: 'Pillar No. 113, Shyam Nagar Metro Station',
      instagram: 'makeup.with.art',
      googleMapsIframeUrl: 'https://maps.google.com/maps?q=Shyam+Nagar+Metro+Station+Jaipur&t=&z=15&ie=UTF8&iwloc=&output=embed',
      heroTitle: 'Your Beauty. Your Style. Your Art.',
      heroSubheading: 'Premium Unisex Salon Services Crafted Around You.',
      aboutContent: 'MAKEUP WITH ART is Jaipur’s destination for bespoke beauty transformations. Located at Pillar No. 113, Shyam Nagar Metro Station, our unisex luxury studio brings together master hair artisans, skincare specialists, and professional makeup artists.',
      whyChooseUs: [
        { title: 'Experienced Professionals', description: 'Certified beauty artists with international couture experience.' },
        { title: 'Premium Products', description: 'Authentic luxury brands dermatologically tested for all skin types.' },
        { title: 'Personalized Service', description: 'Tailored aesthetic consultations designed around your unique style.' },
        { title: 'Hygienic Environment', description: 'Hospital grade UV sterilizers and single-use hygienic client robes.' },
        { title: 'Modern Techniques', description: 'Latest Japanese hair treatments and HD airbrush bridal makeup.' }
      ],
      footerNotice: '© 2026 MAKEUP WITH ART. All Rights Reserved.'
    });

    console.log('[Seed] Creating Working Hours...');
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    for (const day of days) {
      await WorkingHours.create({
        day,
        isOpen: true,
        openTime: '09:30',
        closeTime: '20:30',
        breakStart: '13:30',
        breakEnd: '14:00',
      });
    }

    console.log('[Seed] Creating Services...');
    const servicesData = [
      {
        name: 'Hair Cut & Styling',
        slug: 'hair-cut-and-styling',
        category: 'Hair',
        shortDescription: 'Precision hair sculpting tailored to your facial structure.',
        description: 'Experience an artistic hair transformation with our master stylists. Includes scalp analysis, therapeutic wash, customized haircut, and couture blowout styling.',
        price: 799,
        discountPrice: 649,
        duration: 45,
        benefits: ['Deep scalp cleanse', 'Split-end repair cut', 'Volume blowout styling', 'Hair care advice'],
        images: ['https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1200&q=80'],
        variants: [
          { name: 'Basic Cut & Wash', price: 499, duration: 35 },
          { name: 'Senior Stylist Cut & Blowout', price: 799, duration: 45 },
          { name: 'Artistic Director Couture Cut', price: 1199, duration: 60 },
        ],
        featured: true,
        sortOrder: 1,
      },
      {
        name: 'Botox & Keratin Hair Spa',
        slug: 'botox-and-keratin-hair-spa',
        category: 'Hair',
        shortDescription: 'Intensive hair repair for mirror-like shine and frizz elimination.',
        description: 'Transform dull, damaged tresses into silky smooth hair with raw botanical keratin and deep conditioning hair botox infusion.',
        price: 3499,
        discountPrice: 2899,
        duration: 90,
        benefits: ['Eliminates 95% frizz', 'Mirror glaze shine', 'Lasts up to 4 months', 'Heat damage shield'],
        images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80'],
        featured: true,
        sortOrder: 2,
      },
      {
        name: 'HD Bridal Makeup',
        slug: 'hd-bridal-makeup',
        category: 'Makeup',
        shortDescription: 'Couture Indian bridal aesthetic with camera-ready HD glow.',
        description: 'Impeccable high-definition bridal look featuring airbrush foundation, 3D mink eyelashes, jewel embellishment setting, and saree/dupatta draping.',
        price: 15999,
        discountPrice: 13499,
        duration: 150,
        benefits: ['18-hour waterproof lock', 'Airbrush finish', 'Includes trial session', 'Free hair accessory styling'],
        images: ['https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80'],
        variants: [
          { name: 'HD Traditional Bridal', price: 13499, duration: 120 },
          { name: 'Luxury Airbrush Bridal Makeup', price: 17999, duration: 150 },
        ],
        featured: true,
        sortOrder: 3,
      },
      {
        name: 'Glamour Party Makeup',
        slug: 'glamour-party-makeup',
        category: 'Makeup',
        shortDescription: 'Chic, radiant makeup designed for evening events and cocktail parties.',
        description: 'Sophisticated event makeup highlighting contoured cheeks, smoky or glitter eyeshadow, long-wear lip color, and subtle illuminating highlights.',
        price: 3499,
        discountPrice: 2999,
        duration: 60,
        benefits: ['Customized shade match', 'Smudge-proof eye art', 'Hydrating base', 'Lash installation included'],
        images: ['https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=1200&q=80'],
        featured: true,
        sortOrder: 4,
      },
      {
        name: 'Hydra-Glow Facial Therapy',
        slug: 'hydra-glow-facial-therapy',
        category: 'Skin',
        shortDescription: 'Medical grade deep pore extraction, exfoliation, and hyaluron hydration.',
        description: 'Rejuvenate tired skin with painless vortex extraction, antioxidant serum infusion, and LED light therapy for immediate glass skin clarity.',
        price: 2999,
        discountPrice: 2499,
        duration: 60,
        benefits: ['Deep pore purification', 'Painless blackhead extraction', 'Instant glass glow', 'Collagen boosting'],
        images: ['https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80'],
        featured: true,
        sortOrder: 5,
      },
      {
        name: 'Gel Nail Extensions & Art',
        slug: 'gel-nail-extensions-and-art',
        category: 'Nails',
        shortDescription: 'Durable gel overlay extension with handcrafted nail art embellishment.',
        description: 'Sculpted long-lasting nail extensions using non-toxic gel system. Includes customized 3D chrome accent art, crystal studs, or ombre French tip finishes.',
        price: 1999,
        discountPrice: 1699,
        duration: 75,
        benefits: ['Chip-free for 4 weeks', 'Custom length & shape', 'Swarovski accent stones', 'Nourishing cuticle oil coat'],
        images: ['https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&q=80'],
        featured: true,
        sortOrder: 6,
      },
      {
        name: 'Russian Volume Eyelash Extensions',
        slug: 'russian-volume-eyelash-extensions',
        category: 'Eyelash',
        shortDescription: 'Ultra-light silk lashes for dense, dramatic, feather-soft volume.',
        description: 'Handcrafted multi-dimensional eyelash fan placement creating custom cat-eye or doll-eye flutter without damaging your natural lashes.',
        price: 2499,
        discountPrice: 1999,
        duration: 90,
        benefits: ['Weightless soft silk', 'Retains curl up to 6 weeks', 'Water resistant', 'Gentle medical adhesive'],
        images: ['https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&w=1200&q=80'],
        featured: true,
        sortOrder: 7,
      },
    ];

    const createdServices = await Service.insertMany(servicesData);

    console.log('[Seed] Creating Packages...');
    const packagesData = [
      {
        name: 'Complete Bridal Royalty Package',
        slug: 'complete-bridal-royalty-package',
        description: 'The ultimate luxury bride preparation package: HD Airbrush Makeup + Gold Facial + Hair Keratin Spa + Gel Nails + Eyelash Extensions.',
        servicesIncluded: [createdServices[2]._id, createdServices[1]._id, createdServices[4]._id, createdServices[5]._id],
        originalPrice: 24999,
        discountPrice: 18999,
        duration: 360,
        validityDays: 60,
        benefits: ['Full pre-wedding consultation', 'Complimentary pre-bridal cleanup', 'Complimentary mother-of-bride makeup discount', 'Private VIP bridal suite'],
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=80',
        featured: true,
        sortOrder: 1,
      },
      {
        name: 'Glow & Glam Makeover Combo',
        slug: 'glow-and-glam-makeover-combo',
        description: 'Perfect weekend rejuvenation: Hydra-Glow Facial + Glamour Party Makeup + Blowout Hair Styling.',
        servicesIncluded: [createdServices[0]._id, createdServices[3]._id, createdServices[4]._id],
        originalPrice: 7297,
        discountPrice: 4999,
        duration: 150,
        validityDays: 30,
        benefits: ['Instant event readiness', 'Save over 30%', 'Complimentary refreshments'],
        image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80',
        featured: true,
        sortOrder: 2,
      },
      {
        name: 'Head-to-Toe Pamper Spa',
        slug: 'head-to-toe-pamper-spa',
        description: 'Keratin Hair Spa + Hydra Facial + Gel Nails extension combo.',
        servicesIncluded: [createdServices[1]._id, createdServices[4]._id, createdServices[5]._id],
        originalPrice: 8497,
        discountPrice: 5999,
        duration: 210,
        validityDays: 30,
        benefits: ['Deep hair & skin revival', 'Unwind in relaxing ambiance', 'Free home-care sample kit'],
        image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
        featured: true,
        sortOrder: 3,
      },
    ];

    await Package.insertMany(packagesData);

    console.log('[Seed] Creating Staff Members...');
    await Staff.insertMany([
      {
        name: 'Aarti Verma',
        photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        designation: 'Master Makeup Artist & Creative Director',
        bio: 'Over 10 years specializing in Indian couture bridal, HD airbrush makeup, and fashion editorial styling.',
        servicesHandled: [createdServices[2]._id, createdServices[3]._id],
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        workingHours: { start: '10:00', end: '20:00' },
        isActive: true,
      },
      {
        name: 'Rohan Mehra',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        designation: 'Senior Hair Artisan & Color Specialist',
        bio: 'Trained in UK techniques. Expert in Balayage, Keratin treatments, and precision hair sculpting.',
        servicesHandled: [createdServices[0]._id, createdServices[1]._id],
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        workingHours: { start: '09:30', end: '19:30' },
        isActive: true,
      },
      {
        name: 'Suman Kapoor',
        photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
        designation: 'Clinical Cosmetologist & Skin Therapist',
        bio: 'Dermatology spa specialist focusing on Hydra facials, chemical peels, and anti-aging remedies.',
        servicesHandled: [createdServices[4]._id],
        workingDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        workingHours: { start: '10:00', end: '19:00' },
        isActive: true,
      },
    ]);

    console.log('[Seed] Creating Gallery...');
    await Gallery.insertMany([
      {
        title: 'Couture Indian Bride Makeup',
        category: 'Bridal',
        imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=80',
        isFeatured: true,
        sortOrder: 1,
      },
      {
        title: 'Glazed Caramel Balayage Hair',
        category: 'Hair',
        imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1200&q=80',
        isFeatured: true,
        sortOrder: 2,
      },
      {
        title: 'Glass Skin Hydra Facial Transformation',
        category: 'Skin',
        imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80',
        isFeatured: true,
        sortOrder: 3,
      },
      {
        title: 'Emerald Swarovski Gel Nail Extensions',
        category: 'Nails',
        imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&q=80',
        isFeatured: true,
        sortOrder: 4,
      },
      {
        title: 'Flawless Airbrush Glow',
        category: 'Makeup',
        imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80',
        isFeatured: true,
        sortOrder: 5,
      },
      {
        title: 'Luxury Unisex Salon Ambience',
        category: 'Salon',
        imageUrl: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=80',
        isFeatured: true,
        sortOrder: 6,
      },
    ]);

    console.log('[Seed] Creating Testimonials...');
    await Testimonial.insertMany([
      {
        customerName: 'Ananya Roy',
        rating: 5,
        review: 'MAKEUP WITH ART made my wedding day unforgettable! Aarti and her team provided the most luminous HD bridal makeup that lasted through the entire ceremony without touch-ups. Truly world class!',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        status: 'Approved',
      },
      {
        customerName: 'Vikramaditya Singh',
        rating: 5,
        review: 'Finding a high-end unisex salon in Jaipur with skilled hair stylists was difficult until I visited MAKEUP WITH ART at Shyam Nagar. Rohan gave me an exceptional modern hair cut and texture treatment.',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        status: 'Approved',
      },
      {
        customerName: 'Simran Kulkarni',
        rating: 5,
        review: 'The Hydra-Glow facial therapy is pure magic! My skin was glowing instantly for my cousin’s reception. Extremely hygienic and polite staff.',
        photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
        status: 'Approved',
      },
    ]);

    console.log('[Seed] Creating Initial Sample Booking...');
    const todayStr = new Date().toISOString().split('T')[0];
    await Booking.create({
      bookingId: 'MWA-DEMO-1001',
      customer: customerUser._id,
      itemType: 'service',
      itemId: createdServices[0]._id,
      itemName: createdServices[0].name,
      variantName: 'Senior Stylist Cut & Blowout',
      price: 799,
      date: todayStr,
      timeSlot: '11:00',
      duration: 45,
      customerName: customerUser.name,
      customerPhone: customerUser.phone,
      customerEmail: customerUser.email,
      notes: 'Please arrange hair wash with warm water.',
      status: 'Confirmed',
    });

    console.log('[Seed] Database populated successfully! 🎉');
    console.log('\n========================================');
    console.log('DEFAULT ADMIN CREDENTIALS:');
    console.log('Email: admin@makeupwithart.com');
    console.log('Password: Admin@123456');
    console.log('----------------------------------------');
    console.log('SAMPLE CUSTOMER CREDENTIALS:');
    console.log('Email: customer@gmail.com');
    console.log('Password: Customer@123456');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
