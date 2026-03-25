export interface GalleryImage {
  id: number;
  url: string;
  title: string;
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
  gallery: GalleryImage[];
}

export interface Price {
  single: number;
  promo: {
    pages: number;
    price: number;
  };
}

export interface Prices {
  bw: Price;
  color: Price;
}

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

export interface Order {
  id: number;
  customerName: string;
  whatsapp: string;
  pages: number;
  type: "bw" | "color";
  address: string;
  status: "Pendente" | "Em impressão" | "Em entrega" | "Entregue";
  totalPrice: number;
  createdAt: string;
}

export interface Stats {
  totalVendas: number;
  totalFolhas: number;
  lucroEstimado: number;
  comissoesPagas: number;
}
