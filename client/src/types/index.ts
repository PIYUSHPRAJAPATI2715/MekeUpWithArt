export interface IUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN';
  avatar?: string;
}

export interface IServiceVariant {
  name: string;
  price: number;
  duration: number;
}

export interface IService {
  _id: string;
  name: string;
  slug: string;
  category: 'Hair' | 'Skin' | 'Makeup' | 'Nails' | 'Eyelash' | 'Other';
  description: string;
  shortDescription: string;
  price: number;
  discountPrice?: number;
  duration: number;
  benefits: string[];
  images: string[];
  variants?: IServiceVariant[];
  status: 'Active' | 'Inactive';
  featured: boolean;
  sortOrder: number;
}

export interface IPackage {
  _id: string;
  name: string;
  slug: string;
  description: string;
  servicesIncluded: IService[];
  originalPrice: number;
  discountPrice: number;
  duration: number;
  validityDays?: number;
  benefits: string[];
  image: string;
  status: 'Active' | 'Inactive';
  featured: boolean;
  sortOrder: number;
}

export interface IBooking {
  _id: string;
  bookingId: string;
  customer: IUser | string;
  itemType: 'service' | 'package';
  itemId: string;
  itemName: string;
  variantName?: string;
  price: number;
  date: string;
  timeSlot: string;
  duration: number;
  staff?: any;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'No-Show';
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  notes?: string;
  cancellationReason?: string;
  createdAt: string;
}

export interface IStaff {
  _id: string;
  name: string;
  photo: string;
  designation: string;
  bio: string;
  servicesHandled: IService[];
  workingDays: string[];
  workingHours: { start: string; end: string };
  isActive: boolean;
}

export interface IGalleryItem {
  _id: string;
  title: string;
  category: string;
  imageUrl: string;
  isFeatured: boolean;
}

export interface ITestimonial {
  _id: string;
  customerName: string;
  rating: number;
  review: string;
  photo?: string;
  status: 'Approved' | 'Pending';
}

export interface INotification {
  _id: string;
  title: string;
  message: string;
  channel: 'Web' | 'Email' | 'WhatsApp';
  isRead: boolean;
  type?: string;
  link?: string;
  createdAt: string;
}

export interface IBusinessSettings {
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
}

export interface IAuditLog {
  _id: string;
  adminEmail: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: string;
  createdAt: string;
}
