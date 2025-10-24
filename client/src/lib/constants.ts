export const CONTACT_INFO = {
  phone: "+91 98765 43210",
  email: "hello@bouquetbar.com",
  whatsapp: "+919876543210",
  address: {
    street: "123 Flower Street, Indiranagar",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560038",
    full: "123 Flower Street, Indiranagar, Bengaluru - 560038, Karnataka"
  },
  hours: {
    weekdays: "Mon-Sat: 9AM-8PM",
    weekends: "Sun: 10AM-6PM",
    full: "Mon-Sat: 9AM-8PM, Sun: 10AM-6PM"
  }
};

export const SOCIAL_LINKS = {
  instagram: "https://instagram.com/bouquetbar",
  youtube: "https://youtube.com/@bouquetbar",
  facebook: "https://facebook.com/bouquetbar",
  whatsapp: `https://wa.me/${CONTACT_INFO.whatsapp.replace('+', '')}`
};

export const COMPANY_INFO = {
  name: "Bouquet Bar",
  tagline: "Buy Fresh Flowers & Learn Floral Art with Us",
  description: "India's premier floral design institute & online flower marketplace",
  location: "Bengaluru",
  foundedYear: 2020,
  studentsCount: "500+",
  establishedText: "India's premier floral design institute & online flower marketplace in Bengaluru."
};

export const PROMO_CODES = {
  firstOrder: {
    code: "FIRSTBLOOM",
    discount: 20,
    description: "20% OFF on First Order!"
  }
};

export const NAVIGATION_SECTIONS = [
  { id: "home", label: "Home" },
  { id: "shop", label: "Shop" },
  { id: "school", label: "School" },
  { id: "gallery", label: "Gallery" },
  { id: "blog", label: "Blog" },
  { id: "contact", label: "Contact" }
];

export const FLOWER_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "roses", label: "Roses" },
  { id: "orchids", label: "Orchids" },
  { id: "wedding", label: "Wedding" },
  { id: "gifts", label: "Gifts" },
  { id: "seasonal", label: "Seasonal" }
];

export const OCCASIONS = [
  { value: "birthday", label: "Birthday" },
  { value: "anniversary", label: "Anniversary" },
  { value: "wedding", label: "Wedding" },
  { value: "corporate", label: "Corporate Event" },
  { value: "other", label: "Other" }
];

export const BATCH_OPTIONS = [
  { value: "march-15-morning", label: "March 15, 2024 - Morning" },
  { value: "march-20-evening", label: "March 20, 2024 - Evening" },
  { value: "march-25-weekend", label: "March 25, 2024 - Weekend" }
];

export const WHY_CHOOSE_US_FEATURES = [
  {
    title: "Fresh Flowers Guarantee",
    description: "Direct imports and local sourcing ensure maximum freshness and longevity"
  },
  {
    title: "Expert Trainers",
    description: "Learn from certified professionals with international experience"
  },
  {
    title: "Fast Delivery",
    description: "Same-day delivery across Bengaluru with temperature-controlled transport"
  },
  {
    title: "International Certification",
    description: "Globally recognized certificates to advance your floral design career"
  }
];

export const SCHOOL_BENEFITS = [
  {
    title: "Certified Expert Trainers",
    description: "Learn from internationally certified floral designers with 15+ years experience"
  },
  {
    title: "Hands-on Practice",
    description: "Real flower arrangements, practical sessions, and portfolio building"
  },
  {
    title: "International Certification",
    description: "Globally recognized certificates to boost your floral design career"
  },
  {
    title: "Career Support",
    description: "Job placement assistance and business setup guidance"
  }
];

export const API_ENDPOINTS = {
  products: "/api/products",
  courses: "/api/courses",
  orders: "/api/orders",
  enrollments: "/api/enrollments",
  testimonials: "/api/testimonials",
  blog: "/api/blog"
};

export const CURRENCY = {
  symbol: "₹",
  code: "INR"
};

export const APP_CONFIG = {
  siteName: "Bouquet Bar Bengaluru",
  siteDescription: "Premium Flowers & Floral Design School",
  defaultMetaDescription: "India's premier floral design institute & online flower marketplace. Buy fresh flowers and learn professional floral art with certified trainers in Bengaluru.",
  keywords: "flowers, bouquets, floral design, flower school, Bengaluru, wedding flowers, roses, orchids, floral courses"
};
