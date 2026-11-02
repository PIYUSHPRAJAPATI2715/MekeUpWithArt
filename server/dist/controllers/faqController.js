"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFaq = exports.updateFaq = exports.createFaq = exports.getAdminFaqs = exports.getPublicFaqs = void 0;
const FAQ_1 = require("../models/FAQ");
const defaultFaqList = [
    {
        category: 'Bridal & Groom',
        question: 'How far in advance should I book my bridal or groom makeup package?',
        answer: 'We recommend booking 1 to 3 months in advance for wedding dates to guarantee your preferred artist and private bridal suite. However, we also accommodate last-minute bookings based on daily slot availability.',
        order: 1,
    },
    {
        category: 'Bridal & Groom',
        question: 'What is the difference between HD Makeup and Airbrush Bridal Makeup?',
        answer: 'HD (High Definition) makeup uses ultra-fine light-diffusing pigments that blend seamlessly for high-resolution camera photography. Airbrush makeup applies a micro-fine mist with an air compressor, creating a 24-hour waterproof, sweat-resistant, and weightless poreless finish perfect for Indian weddings.',
        order: 2,
    },
    {
        category: 'Bridal & Groom',
        question: 'Do you offer bridal makeup trials and skin patch tests?',
        answer: 'Yes! We offer pre-bridal consultations and patch tests to ensure skin compatibility, test shades, and finalize your customized hairstyle, draping, and jewelry placement.',
        order: 3,
    },
    {
        category: 'Hair & Styling',
        question: 'What is the difference between Keratin Smoothing and Hair Botox Spa?',
        answer: 'Keratin smoothing aligns hair bonds to eliminate frizz and gives 80-90% straightening for 4 to 6 months. Hair Botox is an intensive deep-conditioning protein repair treatment that fills damaged hair cuticles, restores elasticity, and adds mirror shine without altering your natural wave pattern.',
        order: 4,
    },
    {
        category: 'Hair & Styling',
        question: 'Can I wash my hair immediately after hair color or balayage?',
        answer: 'We advise waiting at least 48 to 72 hours before your first home wash after a global color or balayage. Always use sulfate-free and color-protect shampoos to maintain vibrancy and longevity.',
        order: 5,
    },
    {
        category: 'Skin & Facials',
        question: 'Which facial is best for instant glow before a party or wedding?',
        answer: 'Our O3+ Skin Whitening Facial and 24K Gold Radiance Facial are the top choices for instant glow, skin de-tanning, and youthful radiance before major events.',
        order: 6,
    },
    {
        category: 'Skin & Facials',
        question: 'Are your skin care and waxing products safe for sensitive skin?',
        answer: 'Absolutely. We use dermatologically tested hypoallergenic products, including Italian Rica peel-off wax (which adheres to hair and not skin, minimizing pain and redness) and organic botanical serums.',
        order: 7,
    },
    {
        category: 'Nail Art & Lashes',
        question: 'How long do Acrylic and Gel Nail Extensions last?',
        answer: 'With proper care, our UV gel and acrylic nail extensions last 3 to 4 weeks before needing an infill or refresh. They are chip-resistant, glossy, and durable.',
        order: 8,
    },
    {
        category: 'Nail Art & Lashes',
        question: 'Will eyelash extensions damage my natural eyelashes?',
        answer: 'Not at all. Our certified lash artists apply single-strand classic or Russian volume fans to individual natural lashes using medical-grade adhesive, allowing your natural lashes to shed normally according to their natural growth cycle.',
        order: 9,
    },
    {
        category: 'Appointments & Pricing',
        question: 'What are the salon timings and exact location?',
        answer: 'MAKEUP WITH ART is open 7 days a week from 10:30 AM to 9:30 PM. We are located at Pillar No. 113, Shyam Nagar Metro Station, New Sanganer Road, Jaipur, Rajasthan.',
        order: 10,
    },
    {
        category: 'Appointments & Pricing',
        question: 'How can I book an appointment or check price packages?',
        answer: 'You can book directly through our website by selecting your desired service and preferred time slot, or call/WhatsApp us directly at +91 9352769045 or +91 7575939735.',
        order: 11,
    },
];
/**
 * Public FAQs
 */
const getPublicFaqs = async (req, res) => {
    try {
        let faqs = await FAQ_1.FAQ.find({ isActive: true }).sort({ category: 1, order: 1 });
        if (faqs.length === 0) {
            await FAQ_1.FAQ.insertMany(defaultFaqList);
            faqs = await FAQ_1.FAQ.find({ isActive: true }).sort({ category: 1, order: 1 });
        }
        res.json({ success: true, data: faqs });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getPublicFaqs = getPublicFaqs;
/**
 * Admin FAQs
 */
const getAdminFaqs = async (req, res) => {
    try {
        let faqs = await FAQ_1.FAQ.find().sort({ category: 1, order: 1 });
        if (faqs.length === 0) {
            await FAQ_1.FAQ.insertMany(defaultFaqList);
            faqs = await FAQ_1.FAQ.find().sort({ category: 1, order: 1 });
        }
        res.json({ success: true, data: faqs });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAdminFaqs = getAdminFaqs;
/**
 * Create FAQ
 */
const createFaq = async (req, res) => {
    try {
        const { question, answer, category, order, isActive } = req.body;
        if (!question || !answer) {
            return res.status(400).json({ success: false, message: 'Question and Answer are required' });
        }
        const faq = await FAQ_1.FAQ.create({
            question,
            answer,
            category: category || 'General',
            order: order ?? 0,
            isActive: isActive !== undefined ? isActive : true,
        });
        res.status(201).json({ success: true, data: faq, message: 'FAQ created successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createFaq = createFaq;
/**
 * Update FAQ
 */
const updateFaq = async (req, res) => {
    try {
        const faq = await FAQ_1.FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!faq) {
            return res.status(404).json({ success: false, message: 'FAQ not found' });
        }
        res.json({ success: true, data: faq, message: 'FAQ updated successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateFaq = updateFaq;
/**
 * Delete FAQ
 */
const deleteFaq = async (req, res) => {
    try {
        const faq = await FAQ_1.FAQ.findByIdAndDelete(req.params.id);
        if (!faq) {
            return res.status(404).json({ success: false, message: 'FAQ not found' });
        }
        res.json({ success: true, message: 'FAQ deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteFaq = deleteFaq;
