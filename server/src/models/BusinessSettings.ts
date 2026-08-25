import mongoose, { Schema, Document } from 'mongoose';

export interface IBusinessSettings extends Document {
  businessName: string;
  phoneNumbers: string[];
  email: string;
  address: string;
  instagram: string;
  googleMapsIframeUrl: string;
  heroTitle: string;
  heroSubheading: string;
  aboutContent: string;
  whyChooseUs: { title: string; description: string }[];
  footerNotice: string;
  updatedAt: Date;
}

const BusinessSettingsSchema = new Schema<IBusinessSettings>(
  {
    businessName: { type: String, default: 'MAKEUP WITH ART' },
    phoneNumbers: [{ type: String }],
    email: { type: String, default: 'makeupwitharto@gmail.com' },
    address: { type: String, default: 'Pillar No. 113, Shyam Nagar Metro Station' },
    instagram: { type: String, default: 'makeup.with.art' },
    googleMapsIframeUrl: { type: String, default: 'https://maps.google.com/maps?q=Shyam+Nagar+Metro+Station+Jaipur&t=&z=15&ie=UTF8&iwloc=&output=embed' },
    heroTitle: { type: String, default: 'Your Beauty. Your Style. Your Art.' },
    heroSubheading: { type: String, default: 'Premium Unisex Salon Services Crafted Around You.' },
    aboutContent: { type: String, default: 'MAKEUP WITH ART is a premier unisex beauty salon dedicated to elevating your personal style. We blend modern techniques with artistic elegance to deliver bespoke hair, skin, makeup, and nail transformations.' },
    whyChooseUs: [
      {
        title: { type: String, default: 'Experienced Professionals' },
        description: { type: String, default: 'Master stylists and cosmetologists trained in international techniques.' }
      },
      {
        title: { type: String, default: 'Premium Products' },
        description: { type: String, default: 'Top-tier dermatologist tested & cruelty-free luxury cosmetics.' }
      },
      {
        title: { type: String, default: 'Personalized Service' },
        description: { type: String, default: 'Tailored beauty consultations for your unique features and style.' }
      },
      {
        title: { type: String, default: 'Hygienic Environment' },
        description: { type: String, default: 'Hospital-grade sanitization and disposable single-use kits.' }
      }
    ],
    footerNotice: { type: String, default: '© 2026 MAKEUP WITH ART. All Rights Reserved.' }
  },
  { timestamps: true }
);

export const BusinessSettings = mongoose.model<IBusinessSettings>('BusinessSettings', BusinessSettingsSchema);
