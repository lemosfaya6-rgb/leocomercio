export interface GalleryImage {
  id: number;
  url: string;
  title: string;
}

export interface DeliveryArea {
  id: string;
  name: string;
  price: number;
}

export interface Settings {
  logo: string;
  slogan: string;
  whatsapp: string;
  phone: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  linkedin: string;
  twitter: string;
  whatsappMessage: string;
  heavyImagesNotice: string;
  deliveryFee: number;
  deliveryAreas: DeliveryArea[];
  deliveryDays: string;
  enabledDeliveryDays: string[];
  gallery: GalleryImage[];
  ebookUrl?: string;
  defaultCommission: number;
  terms?: string;
  privacy?: string;
  howItWorks?: string;
}

export interface ServicePrice {
  id: string;
  name: string;
  description?: string;
  single: number;
  promo: {
    pages: number;
    price: number;
  };
  active: boolean;
}

export type Prices = ServicePrice[];

export interface Partner {
  id: number;
  name: string;
  email: string;
  school?: string;
  code: string;
  password?: string;
  commission: number;
  stats: {
    leaves: number;
    earned: number;
  };
  active: boolean;
}

export interface Afiliado {
  id: number;
  name: string;
  email: string;
  code: string;
  password?: string;
  stats: {
    earned: number;
  };
  commission: number;
  active: boolean;
}

export interface OrderItem {
  serviceId: string;
  serviceName: string;
  pages: number;
  type: string;
  price: number;
}

export interface Order {
  id: number;
  customerName: string;
  whatsapp: string;
  items: OrderItem[];
  deliveryType: "delivery" | "pickup";
  deliveryAreaId?: string;
  address: string;
  status: "Pedido Recebido" | "Recusado" | "Em Andamento" | "Pronto";
  trackingCode: string;
  totalPrice: number;
  deliveryDate?: string;
  deliveryTime?: string;
  selectedDeliveryDay?: string;
  createdAt: string;
  fileUrl?: string;
  message?: string;
  serviceType?: "print" | "copy" | "document";
  pages?: number;
  type?: string;
  colorComplexity?: "simple" | "heavy";
  adminMessages?: {
    id: string;
    text: string;
    createdAt: string;
    sender: "admin" | "support";
  }[];
}

export interface Stats {
  totalVendas: number;
  totalFolhas: number;
  lucroEstimado: number;
  comissoesPagas: number;
}

export interface SupportResponse {
  id: string;
  text: string;
  createdAt: string;
  sender: "admin" | "support";
}

export interface SupportMessage {
  id: number;
  name: string;
  contact: string;
  email?: string;
  message: string;
  createdAt: string;
  read: boolean;
  ticketCode: string;
  responses?: SupportResponse[];
}

export interface NewsItem {
  id: number;
  title: string;
  content: string;
  date: string;
  active: boolean;
}
