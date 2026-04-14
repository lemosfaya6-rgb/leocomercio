import { Settings, ServicePrice } from "./types";

export const DEFAULT_SETTINGS: Settings = {
  logo: "Leocomércio",
  slogan: "Imprimimos por si. Entregamos até você.",
  whatsapp: "244900000000",
  phone: "244900000000",
  facebook: "https://facebook.com/leocomercio",
  instagram: "https://instagram.com/leocomercio",
  tiktok: "https://tiktok.com/@leocomercio",
  linkedin: "https://linkedin.com/company/leocomercio",
  twitter: "https://twitter.com/leocomercio",
  whatsappMessage: "Olá, quero imprimir um documento.\n\nTipo:\nQuantidade de páginas:\nTipo de impressão:\nEndereço:",
  heavyImagesNotice: "Documentos com muitas imagens, gráficos ou alta qualidade podem ter preço ajustado. O valor será informado antes da impressão.",
  deliveryFee: 500,
  deliveryAreas: [
    { id: "1", name: "Talatona", price: 500 },
    { id: "2", name: "Kilamba", price: 1000 },
    { id: "3", name: "Maianga", price: 700 },
  ],
  deliveryDays: "Segunda a Domingo, das 09h às 18h",
  enabledDeliveryDays: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"],
  gallery: [],
  ebookUrl: "",
  defaultCommission: 30,
  terms: "Os termos de serviço serão publicados em breve.",
  privacy: "A política de privacidade será publicada em breve.",
  howItWorks: "O manual de como funciona será publicado em breve."
};

export const DEFAULT_PRICES: ServicePrice[] = [
  { id: "bw", name: "Preto e Branco", description: "Impressão padrão em preto e branco para documentos e textos.", single: 50, promo: { pages: 3, price: 100 }, active: true },
  { id: "colorSimple", name: "Colorido", description: "Impressão colorida de alta qualidade para apresentações e trabalhos.", single: 100, promo: { pages: 2, price: 150 }, active: true },
  { id: "colorHeavy", name: "Colorido Pesado", description: "Impressão colorida com alta cobertura de tinta para fotos e imagens.", single: 200, promo: { pages: 10, price: 150 }, active: true },
];
