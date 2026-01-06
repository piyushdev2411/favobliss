import { Editor } from "@tiptap/react";

export interface Billboard {
  id: string;
  label: string;
  imageUrl: string;
}

export interface Coupons {
  code: string;
  value: number;
  isActive: boolean;
  startDate: string;
  expiryDate: string;
  usagePerUser: number;
  usedCount: number;
  description: string;
  products: Product[];
}

export interface Brand {
  id: string;
  slug: string;
  name: string;
  bannerImage: string;
  cardImage: string;
}

export interface Location {
  id: string;
  pincode: string;
  city: string;
  state: string;
  country: string;
}

export interface LocationGroup {
  id: string;
  name: string;
  deliveryDays: number;
  isExpressDelivery: boolean;
  expressDeliveryText: string;
  isCodAvailable: boolean;
  locations: Location[];
}

export enum CategoryType {
  MEN,
  WOMEN,
  UNISEX,
  BEAUTY,
}

export enum CategoryClassification {
  TOPWEAR,
  BOTTOMWEAR,
  FOOTWEAR,
  INNERWEARANDSLEEPWEAR,
  MAKEUP,
  SKINCARE,
  HAIRCARE,
  FRAGRANCES,
}

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  classification: CategoryClassification;
  bannerImage: string;
  landingPageBanner: string;
  slug: string;
  description?: string;
  subCategories?: Category[];
}

export enum ProductType {
  MEN,
  WOMEN,
  KIDS,
  BEAUTY,
}

export interface Product {
  id: string;
  category: Category;
  price: number;
  isFeatured: boolean;
  isArchieved: boolean;
  stock: number;
  description: string;
  type: ProductType;
  sizeAndFit: string[];
  materialAndCare: string[];
  size: Size;
  color: Color;
  productImages: ProductImage[];
  enabledFeatures: string;
  variants: Variant[];
  brand: Brand;
  expressDelivery: boolean;
  warranty: string;
  isNewArrival: boolean;
  averageRating: number;
  subCategory: SubCategory;
  productId: string;
  slug: string;
  coupons: Coupon[];
}

export interface Blog {
  id: string;
  title: string;
  banner: string;
  slug: string;
  views: number;
  postedBy?: string;
  content: any;
  createdAt: string;
  updatedAt: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  openGraphImage?: string;
  published: boolean;
}

export interface Coupon {
  id: string;
  couponId: string;
  productId: string;
  createdAt: string;
  updatedAt: string;
  coupon: {
    id: string;
    code: string;
    value: number;
    description: string;
    usagePerUser: number;
    usedCount: number;
  };
}

export interface DocumentContent {
  type: string;
  content: Array<Record<string, any>>;
}

export interface StoredDocument {
  id: string;
  content: DocumentContent;
  name: string;
}

export interface PaginatedBlogs {
  blogs: Blog[];
  total: number;
  page: number;
  limit: number;
}

export interface Brand {
  name: string;
  slug: string;
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  bannerImage?: string;
  categoryId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductSpecification {
  specificationField: {
    name: string;
    group?: {
      name: string;
    };
  };
  value: string;
}

export interface ProductImage {
  id: string;
  url: string;
}

export interface Size {
  id: string;
  name: string;
  value: string;
}

export interface VariantImage {
  id: string;
  url: string;
  mediaType: "IMAGE" | "VIDEO";
}

export interface Color {
  id: string;
  name: string;
  value: string;
}

export interface CartSelectedItem {
  id: string;
  quantity: number;
  price: number;
  mrp: number;
  image: string;
  name: string;
  about: string;
  size?: string;
  slug: string;
  color?: string;
  selectedVariant?: Variant;
  variantId: string;
  locationId?: string | null;
}

export interface PriceRange {
  id: string;
  value: string;
  name: string;
}

export type MenuItem = {
  label: string;
  href: string;
  count?: number;
};

export type MenuCategory = {
  name: string;
  items: MenuItem[];
  subItems?: MenuItem[] | Record<string, MenuItem[]>;
  link: string;
  slug: string;
};

export interface ApiCategory {
  id: string;
  name: string;
  subCategories: ApiSubCategory[];
}

export interface ApiSubCategory {
  id: string;
  name: string;
  categoryId: string;
  parentId: string | null;
  productCount: number; // Assumed API includes count
}

export interface InvoiceItem {
  description: string;
  hsn: string;
  sku: string;
  qty: number;
  unitPrice: number;
  unitDisc: number;
  taxableValue: number;
  igst: number;
  total: number;
}

export interface InvoiceData {
  soldBy: {
    company: string;
    address: string;
    city: string;
    state: string;
    country: string;
    stateCode: string;
    phone: string;
    gstin: string;
    invoiceNo: string;
    invoiceDate: string;
    orderNo: string;
    orderDate: string;
  };
  deliveredTo: {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    stateCode: string;
    paymentMethod: string;
    shippedBy: string;
    awbNo: string;
    waybillNo: string;
  };
  items: InvoiceItem[];
  netTotal: number;
}

export interface Address {
  id: string;
  userId: string;
  isDefault: boolean;
  name: string;
  phoneNumber: string;
  zipCode: number;
  address: string;
  landmark: string;
  town: string;
  district: string;
  state: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductApiResponse {
  variant: Variant;
  product: Product;
  allVariants: VariantSummary[];
}

export interface Variant {
  id: string;
  productId: string;
  sizeId?: string;
  colorId?: string;
  stock: number;
  sku: string;
  hsn: string;
  tax: number;
  gstIn: string;
  name: string;
  slug: string;
  about?: string;
  description: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  openGraphImage?: string;
  size?: Size;
  color?: Color;
  images: VariantImage[];
  variantPrices: {
    locationId: string;
    price: number;
    mrp: number;
    locationGroupId: string;
    locationGroup: LocationGroup;
  }[];
  variantSpecifications: ProductSpecification[];
}
export interface VariantSummary {
  id: string;
  title: string;
  slug: string;
  color: string | null;
  size: string | null;
  sizeId: string | null;
  colorId: string | null;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  text: string;
  images: { url: string }[];
  videos: { url: string }[];
  createdAt: string;
  userId: string;
  categoryRatings: { categoryName: string; rating: number }[];
  customDate?: string | null;
  title: string;
}

export interface HomePageCategoryProduct {
  id: string;
  homepageCategoryId: string;
  productId: string;
  product: Product;
  createdAt: string;
  updatedAt: string;
}

export interface HomepageCategory {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  products: HomePageCategoryProduct[];
}

export interface NodeItems {
  command?: (editor: Editor) => void;
  label: string;
  icon?: any;
  isActive?: (editor: Editor) => boolean;
  style?: React.CSSProperties;
  isColorPicker?: boolean;
  isFloatingMenu?: boolean;
  dropdownItems?: NodeItems[];
  isDropdown?: boolean;
}
