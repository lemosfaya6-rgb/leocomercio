import { useState, useEffect, FormEvent } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useSearchParams } from "react-router-dom";
import { jsPDF } from "jspdf";
import { 
  Phone, 
  MessageCircle, 
  DollarSign, 
  Users, 
  ChevronRight, 
  Printer, 
  Home as HomeIcon,
  Truck, 
  ShieldCheck, 
  Menu, 
  X, 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin,
  Image as ImageIcon,
  User,
  LayoutDashboard, 
  Settings as SettingsIcon, 
  Package, 
  Calendar,
  GraduationCap, 
  Share2, 
  LogOut, 
  Plus, 
  Edit, 
  Trash, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  FileText,
  Search,
  Send,
  BookOpen,
  Copy,
  Sun,
  Moon,
  ShoppingCart,
  Info,
  Shield,
  FileSearch,
  Bell,
  Paperclip
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Settings, Prices, Order, Partner, Afiliado, Stats, SupportMessage, ServicePrice, OrderItem, NewsItem, GalleryImage } from "./types";
import { DEFAULT_SETTINGS, DEFAULT_PRICES } from "./constants";
import { getSupabaseData, saveSupabaseData } from "./supabase";

// --- API Helpers ---
const api = {
  getSettings: async () => {
    try {
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      const data = await getSupabaseData("settings");
      return data || DEFAULT_SETTINGS;
    }
  },
  saveSettings: async (data: Partial<Settings>) => {
    try {
      const res = await fetch("/api/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      await saveSupabaseData("settings", data);
      return data;
    }
  },
  getPrices: async () => {
    try {
      const res = await fetch("/api/prices");
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      const data = await getSupabaseData("prices");
      return data || DEFAULT_PRICES;
    }
  },
  savePrices: async (data: Prices) => {
    try {
      const res = await fetch("/api/prices", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      await saveSupabaseData("prices", data);
      return data;
    }
  },
  getOrders: async () => {
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      const data = await getSupabaseData("orders");
      return data || [];
    }
  },
  createOrder: async (data: Partial<Order>) => {
    const newOrder = { id: Date.now(), ...data, status: "Pedido Recebido", createdAt: new Date().toISOString() };
    try {
      const res = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      const currentOrders = await api.getOrders();
      const updatedOrders = [...currentOrders, newOrder];
      await saveSupabaseData("orders", updatedOrders);
      return newOrder;
    }
  },
  updateOrder: async (id: number, data: Partial<Order>) => {
    try {
      const res = await fetch(`/api/orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      const currentOrders = await api.getOrders();
      const updatedOrders = currentOrders.map((o: any) => o.id === id ? { ...o, ...data } : o);
      await saveSupabaseData("orders", updatedOrders);
      return updatedOrders.find((o: any) => o.id === id);
    }
  },
  getPartners: async () => {
    try {
      const res = await fetch("/api/partners");
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      const data = await getSupabaseData("partners");
      return data || [];
    }
  },
  getAfiliados: async () => {
    try {
      const res = await fetch("/api/afiliados");
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      const data = await getSupabaseData("afiliados");
      return data || [];
    }
  },
  getGallery: async () => {
    try {
      const res = await fetch("/api/gallery");
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      const settings = await api.getSettings();
      return settings.gallery || [];
    }
  },
  getStats: async () => {
    try {
      const res = await fetch("/api/stats");
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      const orders = await api.getOrders();
      const partners = await api.getPartners();
      const afiliados = await api.getAfiliados();
      
      const totalVendas = orders.length;
      const totalFolhas = orders.reduce((acc: number, o: any) => acc + (o.items?.reduce((sum: number, item: any) => sum + (item.pages || 0), 0) || 0), 0);
      const lucroEstimado = orders.reduce((acc: number, o: any) => acc + (o.totalPrice || 0), 0);
      const comissoesPagas = partners.reduce((acc: number, p: any) => acc + (p.stats?.earned || 0), 0) + 
                            afiliados.reduce((acc: number, a: any) => acc + (a.stats?.earned || 0), 0);
      return { totalVendas, totalFolhas, lucroEstimado, comissoesPagas };
    }
  },
  getSupportMessages: async () => {
    try {
      const res = await fetch("/api/support");
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      const data = await getSupabaseData("supportMessages");
      return data || [];
    }
  },
  getNews: async () => {
    try {
      const res = await fetch("/api/news");
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      const data = await getSupabaseData("news");
      return data || [];
    }
  },
  // Simplified other methods for brevity, they should follow the same pattern if needed
  login: (credentials: any) => fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(credentials) }).then(res => res.json()).catch(() => ({ success: true, user: { email: credentials.email } })), // Mock login for static
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    return fetch("/api/upload", { method: "POST", body: formData }).then(res => res.json());
  },
  uploadFile: (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    return fetch("/api/upload", { method: "POST", body: formData }).then(res => res.json());
  },
  addPriceService: async (data: any) => {
    try {
      const res = await fetch("/api/prices/add", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      const current = await api.getPrices();
      const newItem = { id: Date.now().toString(), ...data, active: true };
      await saveSupabaseData("prices", [...current, newItem]);
      return newItem;
    }
  },
  deletePriceService: async (id: string) => {
    try {
      const res = await fetch(`/api/prices/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      const current = await api.getPrices();
      await saveSupabaseData("prices", current.filter((p: any) => p.id !== id));
      return { success: true };
    }
  },
  deleteOrder: async (id: number) => {
    try {
      const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      const current = await api.getOrders();
      await saveSupabaseData("orders", current.filter((o: any) => o.id !== id));
      return { success: true };
    }
  },
  savePartner: async (data: any) => {
    try {
      const res = await fetch("/api/partners", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      const current = await api.getPartners();
      const newItem = { id: Date.now(), ...data, code: `PAR-${Math.random().toString(36).substring(7).toUpperCase()}`, active: true };
      await saveSupabaseData("partners", [...current, newItem]);
      return newItem;
    }
  },
  updatePartner: async (id: number, data: any) => {
    try {
      const res = await fetch(`/api/partners/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      const current = await api.getPartners();
      const updated = current.map((p: any) => p.id === id ? { ...p, ...data } : p);
      await saveSupabaseData("partners", updated);
      return updated.find((p: any) => p.id === id);
    }
  },
  saveAfiliado: async (data: any) => {
    try {
      const res = await fetch("/api/afiliados", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      const current = await api.getAfiliados();
      const newItem = { id: Date.now(), ...data, code: `AFI-${Math.random().toString(36).substring(7).toUpperCase()}`, active: true };
      await saveSupabaseData("afiliados", [...current, newItem]);
      return newItem;
    }
  },
  updateAfiliado: async (id: number, data: any) => {
    try {
      const res = await fetch(`/api/afiliados/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      const current = await api.getAfiliados();
      const updated = current.map((a: any) => a.id === id ? { ...a, ...data } : a);
      await saveSupabaseData("afiliados", updated);
      return updated.find((a: any) => a.id === id);
    }
  },
  addGalleryItem: async (data: { url: string, title: string }) => {
    try {
      const res = await fetch("/api/gallery", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      const settings = await api.getSettings();
      const newItem = { id: Date.now(), ...data };
      settings.gallery = [...(settings.gallery || []), newItem];
      await saveSupabaseData("settings", settings);
      return newItem;
    }
  },
  deleteGalleryItem: async (id: number) => {
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      const settings = await api.getSettings();
      settings.gallery = (settings.gallery || []).filter((item: any) => item.id !== id);
      await saveSupabaseData("settings", settings);
      return { success: true };
    }
  },
  updateAdminProfile: async (data: any) => {
    try {
      const res = await fetch("/api/admin/profile", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      // For static, we don't really have a secure way to update profile without server
      return { success: true };
    }
  },
  sendSupportMessage: async (data: any) => {
    try {
      const res = await fetch("/api/support", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      const current = await api.getSupportMessages();
      const newItem = { id: Date.now(), ...data, createdAt: new Date().toISOString(), read: false, ticketCode: Math.random().toString(36).substring(2, 8).toUpperCase() };
      await saveSupabaseData("supportMessages", [...current, newItem]);
      return newItem;
    }
  },
  updateSupportMessage: async (id: number, data: any) => {
    try {
      const res = await fetch(`/api/support/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      const current = await api.getSupportMessages();
      const updated = current.map((m: any) => m.id === id ? { ...m, ...data } : m);
      await saveSupabaseData("supportMessages", updated);
      return updated.find((m: any) => m.id === id);
    }
  },
  deleteSupportMessage: async (id: number) => {
    try {
      const res = await fetch(`/api/support/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      const current = await api.getSupportMessages();
      await saveSupabaseData("supportMessages", current.filter((m: any) => m.id !== id));
      return { success: true };
    }
  },
  updateAllCommissions: async (commission: number) => {
    try {
      const res = await fetch("/api/commissions/update-all", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ commission }) });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      const settings = await api.getSettings();
      const partners = await api.getPartners();
      const afiliados = await api.getAfiliados();
      
      settings.defaultCommission = commission;
      partners.forEach((p: any) => p.commission = commission);
      afiliados.forEach((a: any) => a.commission = commission);
      
      await saveSupabaseData("settings", settings);
      await saveSupabaseData("partners", partners);
      await saveSupabaseData("afiliados", afiliados);
      return { success: true };
    }
  },
  saveNews: async (data: any) => {
    try {
      const res = await fetch("/api/news", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      const current = await api.getNews();
      const newItem = { id: Date.now(), ...data, date: new Date().toISOString(), active: true };
      await saveSupabaseData("news", [...current, newItem]);
      return newItem;
    }
  },
  deleteNews: async (id: number) => {
    try {
      const res = await fetch(`/api/news/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      const current = await api.getNews();
      await saveSupabaseData("news", current.filter((n: any) => n.id !== id));
      return { success: true };
    }
  },
};

// --- PDF Helper ---
const generateOrderPDF = (order: Order, settings: Settings) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(22);
  doc.setTextColor(220, 38, 38); // Red-600
  doc.text(settings.logo, 105, 20, { align: "center" });
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(settings.slogan || "Serviços de Impressão & Cópias", 105, 28, { align: "center" });
  
  // Title
  doc.setFontSize(16);
  doc.setTextColor(0);
  doc.text("Comprovativo de Pedido", 105, 45, { align: "center" });
  
  // Order Info
  doc.setFontSize(12);
  doc.text(`Código de Rastreio: ${order.trackingCode}`, 20, 60);
  doc.text(`Data: ${new Date(order.createdAt).toLocaleDateString()}`, 20, 70);
  doc.text(`Cliente: ${order.customerName}`, 20, 80);
  doc.text(`WhatsApp: ${order.whatsapp}`, 20, 90);
  
  // Items
  doc.setFontSize(14);
  doc.text("Itens do Pedido:", 20, 110);
  
  let y = 120;
  doc.setFontSize(11);
  if (order.items && order.items.length > 0) {
    order.items.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.serviceName} - ${item.pages} pág. (${item.type})`, 25, y);
      doc.text(`${item.price} Kz`, 170, y, { align: "right" });
      y += 10;
    });
  } else {
    // Fallback for old orders
    const serviceName = (order as any).serviceType === "print" ? "Impressão" : "Cópia";
    doc.text(`1. ${serviceName} - ${(order as any).pages || 0} pág. (${(order as any).type || "N/A"})`, 25, y);
    doc.text(`${order.totalPrice} Kz`, 170, y, { align: "right" });
    y += 10;
  }
  
  // Total
  doc.setDrawColor(200);
  doc.line(20, y, 190, y);
  y += 10;
  doc.setFontSize(14);
  doc.text("Total:", 20, y);
  doc.text(`${order.totalPrice} Kz`, 170, y, { align: "right" });
  
  // Delivery
  y += 20;
  doc.setFontSize(12);
  doc.text(`Tipo de Entrega: ${order.deliveryType === "delivery" ? "Entrega ao Domicílio" : "Levantamento na Loja"}`, 20, y);
  if (order.deliveryType === "delivery") {
    y += 10;
    doc.text(`Endereço: ${order.address}`, 20, y);
  }
  
  // Footer
  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text("Obrigado pela sua preferência!", 105, 280, { align: "center" });
  
  doc.save(`pedido-${order.trackingCode}.pdf`);
};

// --- Components ---

const Navbar = ({ settings, unreadSupportCount, scrolled, theme, toggleTheme, cartCount, onOpenCart }: { 
  settings: Settings, 
  unreadSupportCount?: number, 
  scrolled: boolean,
  theme: string,
  toggleTheme: () => void,
  cartCount: number,
  onOpenCart: () => void
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-background/90 backdrop-blur-lg shadow-sm py-2" : "bg-background/80 backdrop-blur-md py-4"} border-b border-border`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Printer className="w-7 h-7 md:w-8 md:h-8 text-red-600" />
            <span className="text-xl md:text-2xl font-bold tracking-tight text-foreground">{settings.logo}</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-muted-foreground hover:text-red-600 font-medium transition-colors">Início</Link>
            <Link to="/servicos" className="text-muted-foreground hover:text-red-600 font-medium transition-colors">Serviços</Link>
            <Link to="/noticias" className="text-muted-foreground hover:text-red-600 font-medium transition-colors">Notícias</Link>
            <Link to="/rastrear" className="text-muted-foreground hover:text-red-600 font-medium transition-colors">Rastrear</Link>
            <Link to="/suporte" className="text-muted-foreground hover:text-red-600 font-medium transition-colors relative">
              Suporte
              {unreadSupportCount !== undefined && unreadSupportCount > 0 && (
                <span className="absolute -top-1 -right-2 w-2 h-2 bg-red-600 rounded-full animate-pulse" />
              )}
            </Link>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={onOpenCart}
                className="relative p-2 text-muted-foreground hover:bg-muted rounded-xl transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>

              <Link to="/#fazer-pedido" className="px-5 py-2.5 bg-red-600 text-white rounded-full text-sm font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20">
                Fazer Pedido
              </Link>
              
              <button 
                onClick={toggleTheme}
                className="p-2 text-muted-foreground hover:bg-muted rounded-xl transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <Link to="/admin" className="px-4 py-2 bg-foreground text-background rounded-full text-sm font-semibold hover:opacity-90 transition-all">Admin</Link>
            </div>
          </div>

          <div className="flex items-center space-x-2 md:hidden">
            <button 
              onClick={onOpenCart}
              className="relative p-2 text-muted-foreground hover:bg-muted rounded-xl transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
            <button 
              onClick={toggleTheme}
              className="p-2 text-muted-foreground hover:bg-muted rounded-xl transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="p-2 text-muted-foreground hover:bg-muted rounded-xl transition-colors"
              aria-label="Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[-1] md:hidden"
            />
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden bg-background border-b border-border overflow-hidden shadow-xl"
            >
              <div className="px-4 pt-2 pb-8 space-y-2">
                <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center space-x-3 px-4 py-4 text-lg font-medium text-foreground rounded-2xl hover:bg-muted transition-colors">
                  <HomeIcon className="w-5 h-5 text-muted-foreground" />
                  <span>Início</span>
                </Link>
                <Link to="/servicos" onClick={() => setIsOpen(false)} className="flex items-center space-x-3 px-4 py-4 text-lg font-medium text-foreground rounded-2xl hover:bg-muted transition-colors">
                  <DollarSign className="w-5 h-5 text-muted-foreground" />
                  <span>Serviços</span>
                </Link>
                <Link to="/parcerias" onClick={() => setIsOpen(false)} className="flex items-center space-x-3 px-4 py-4 text-lg font-medium text-foreground rounded-2xl hover:bg-muted transition-colors">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <span>Parcerias</span>
                </Link>
                <Link to="/rastrear" onClick={() => setIsOpen(false)} className="flex items-center space-x-3 px-4 py-4 text-lg font-medium text-foreground rounded-2xl hover:bg-muted transition-colors">
                  <Search className="w-5 h-5 text-muted-foreground" />
                  <span>Rastrear Pedido</span>
                </Link>
                <Link to="/suporte" onClick={() => setIsOpen(false)} className="flex items-center justify-between px-4 py-4 text-lg font-medium text-foreground rounded-2xl hover:bg-muted transition-colors">
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-5 h-5 text-muted-foreground" />
                    <span>Suporte</span>
                  </div>
                  {unreadSupportCount !== undefined && unreadSupportCount > 0 && (
                    <span className="bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-full">
                      {unreadSupportCount}
                    </span>
                  )}
                </Link>
                <a href="/#fazer-pedido" onClick={() => setIsOpen(false)} className="flex items-center space-x-3 px-4 py-4 text-lg font-medium text-foreground rounded-2xl hover:bg-muted transition-colors">
                  <Printer className="w-5 h-5 text-muted-foreground" />
                  <span>Fazer Pedido</span>
                </a>
                <div className="pt-4 px-4">
                  <Link to="/admin" onClick={() => setIsOpen(false)} className="flex items-center justify-center space-x-2 w-full py-4 bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-600/20">
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Painel Admin</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

const OrderForm = ({ settings, prices, cart, clearCart }: { settings: Settings, prices: Prices, cart: OrderItem[], clearCart: () => void }) => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    customerName: "",
    whatsapp: "",
    address: "",
    pages: 1,
    type: "bw",
    colorComplexity: "simple" as "simple" | "heavy",
    serviceType: "print" as "print" | "copy" | "binding" | "document",
    deliveryType: "delivery" as "delivery" | "pickup",
    deliveryAreaId: "",
    deliveryDate: "",
    deliveryTime: "",
    selectedDeliveryDay: "",
    message: "",
  });

  const hasCartItems = cart && cart.length > 0;

  useEffect(() => {
    const serviceParam = searchParams.get("service");
    if (serviceParam && prices) {
      const serviceExists = prices.find(p => p.id === serviceParam && p.active);
      if (serviceExists) {
        setFormData(prev => ({ ...prev, type: serviceParam }));
      }
    }
  }, [searchParams, prices]);

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [lastTrackingCode, setLastTrackingCode] = useState("");
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState("");

  useEffect(() => {
    if (prices && prices.length > 0) {
      const activeServices = prices.filter(s => s.active);
      if (activeServices.length > 0) {
        // If current type is not active or not in prices, set to first active
        if (!activeServices.find(s => s.id === formData.type)) {
          setFormData(prev => ({ ...prev, type: activeServices[0].id }));
        }
      }
    }
  }, [prices]);

  const generateTrackingCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const calculateTotal = () => {
    if (!prices || !Array.isArray(prices) || formData.serviceType === "document" || formData.serviceType === "binding") return 0;
    
    let total = 0;
    const pages = formData.pages;
    
    const service = prices.find(p => p.id === formData.type);
    if (!service) return 0;

    const single = service.single || 0;
    const promoPrice = service.promo?.price || 0;
    const promoPages = service.promo?.pages || 1;

    if (promoPages > 1) {
      const numPromos = Math.floor(pages / promoPages);
      const remainder = pages % promoPages;
      
      total = numPromos * promoPrice;
      
      if (remainder > 0) {
        // If the cost of the remainder at single price exceeds the promo price, use the promo price
        const remainderCost = remainder * single;
        total += Math.min(remainderCost, promoPrice);
      }
    } else {
      total = pages * single;
    }
    
    return total;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let fileUrl = "";
      if (file) {
        const uploadRes = await api.uploadImage(file);
        fileUrl = uploadRes.url;
      }

      const trackingCode = generateTrackingCode();
      const orderData: Partial<Order> = {
        ...formData,
        fileUrl,
        trackingCode,
        totalPrice: hasCartItems ? cart.reduce((sum, item) => sum + item.price, 0) : calculateTotal(),
        items: hasCartItems ? cart : [],
        createdAt: new Date().toISOString(),
        status: "Pedido Recebido"
      };

      let itemsSummary = "";
      if (hasCartItems) {
        itemsSummary = cart.map(item => `- ${item.serviceName}: ${item.pages} pág. (${item.type})`).join("\n");
      } else {
        const service = prices?.find(p => p.id === formData.type);
        const serviceName = service ? service.name : formData.type;
        itemsSummary = `- ${serviceName}: ${formData.pages} pág. (${formData.type})`;
      }

      const waMsg = `Olá, acabei de fazer um pedido!\n\n` +
        `*Código:* ${trackingCode}\n` +
        `*Nome:* ${formData.customerName}\n` +
        `*Itens:* \n${itemsSummary}\n` +
        (formData.deliveryType === 'delivery' ? `*Entrega:* Sim (${formData.selectedDeliveryDay || 'A combinar'})\n*Endereço:* ${formData.address}` : `*Levantamento:* Sim`);
      
      setWhatsappUrl(`https://wa.me/${settings.whatsapp.replace(/\s/g, '')}?text=${encodeURIComponent(waMsg)}`);

      const createdOrder = await api.createOrder(orderData);
      if (hasCartItems) clearCart();
      setLastTrackingCode(trackingCode);
      setLastOrder(createdOrder);
      setSuccess(true);
      setFormData({
        customerName: "",
        whatsapp: "",
        address: "",
        pages: 1,
        type: "bw",
        colorComplexity: "simple",
        serviceType: "print",
        deliveryType: "delivery",
        deliveryAreaId: "",
        deliveryDate: "",
        deliveryTime: "",
        selectedDeliveryDay: "",
        message: "",
      });
      setFile(null);
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Erro ao enviar pedido. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="fazer-pedido" className="py-24 bg-muted/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl overflow-hidden border border-border">
          <div className="p-6 md:p-12">
            <div className="text-center mb-10">
              <span className="inline-block px-4 py-1.5 bg-red-500/10 text-red-600 text-xs font-black uppercase tracking-widest rounded-full mb-4">Rápido & Prático</span>
              <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4 tracking-tighter">Fazer Pedido</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">Envie seus documentos e receba em casa ou levante na loja.</p>
            </div>
            {success ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 md:py-12"
              >
                <div className="w-20 h-20 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Pedido Enviado!</h3>
                <p className="text-muted-foreground mb-8 max-w-sm mx-auto text-sm md:text-base">
                  Recebemos seu pedido. Use o código abaixo para rastrear.
                </p>
                
                <div className="bg-muted border border-border rounded-3xl p-6 md:p-8 mb-8 inline-block">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Código de Rastreio</p>
                  <p className="text-3xl md:text-5xl font-black text-red-600 tracking-tighter">{lastTrackingCode}</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a 
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-8 py-4 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-green-600/20"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>WhatsApp</span>
                  </a>
                  {lastOrder && (
                    <button 
                      onClick={() => generateOrderPDF(lastOrder, settings)}
                      className="w-full sm:w-auto px-8 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-red-600/20"
                    >
                      <FileText className="w-5 h-5" />
                      <span>Baixar PDF</span>
                    </button>
                  )}
                  <button 
                    onClick={() => setSuccess(false)}
                    className="w-full sm:w-auto px-8 py-4 bg-foreground text-background rounded-2xl font-bold hover:opacity-90 transition-all"
                  >
                    Novo Pedido
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {hasCartItems && (
                  <div className="bg-muted/50 p-6 rounded-3xl border border-border space-y-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <ShoppingCart className="w-5 h-5 text-red-600" />
                      <h3 className="font-bold text-foreground uppercase text-xs tracking-widest">Itens no Carrinho</h3>
                    </div>
                    <div className="space-y-3">
                      {cart.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center p-4 bg-card rounded-2xl border border-border">
                          <div>
                            <p className="font-bold text-foreground text-sm">{item.serviceName}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{item.pages} pág. | {item.type}</p>
                          </div>
                          <p className="font-bold text-red-600">{item.price} Kz</p>
                        </div>
                      ))}
                      <div className="pt-4 border-t border-border flex justify-between items-center px-2">
                        <span className="font-bold text-foreground">Total do Carrinho</span>
                        <span className="text-xl font-black text-red-600">{cart.reduce((sum, item) => sum + item.price, 0)} Kz</span>
                      </div>
                    </div>
                  </div>
                )}

                {!hasCartItems && (
                  <>
                    {/* Step 1: Service Selection */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 mb-4">
                        <div className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold">1</div>
                        <h3 className="font-bold text-foreground uppercase text-xs tracking-widest">Escolha o Serviço</h3>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                          { id: "print", label: "Imprimir", icon: <Printer className="w-5 h-5" /> },
                          { id: "copy", label: "Cópia", icon: <Copy className="w-5 h-5" /> },
                          { id: "binding", label: "Encadernar", icon: <BookOpen className="w-5 h-5" /> },
                          { id: "document", label: "Documento", icon: <FileText className="w-5 h-5" /> }
                        ].map(type => (
                          <button 
                            key={type.id}
                            type="button"
                            onClick={() => setFormData({...formData, serviceType: type.id as any})}
                            className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                              formData.serviceType === type.id 
                                ? "border-red-600 bg-red-500/10 text-red-600 shadow-md" 
                                : "border-border bg-muted text-muted-foreground hover:border-border/80"
                            }`}
                          >
                            <div className="mb-2">{type.icon}</div>
                            <span className="text-xs font-bold">{type.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Conditional Content for Document/Binding */}
                    {(formData.serviceType === "document" || formData.serviceType === "binding") ? (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6 bg-muted p-6 rounded-3xl border border-border"
                      >
                        <div className="space-y-2">
                          <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                            {formData.serviceType === "document" ? "O que você precisa?" : "Detalhes da Encadernação"}
                          </label>
                          <textarea 
                            required
                            rows={3}
                            placeholder={formData.serviceType === "document" 
                              ? "Ex: Currículo, Trabalho Escolar, etc."
                              : "Ex: Trabalho de fim de curso, capa dura, etc."}
                            className="w-full px-5 py-4 bg-card border border-border rounded-2xl outline-none focus:border-red-600 transition-all text-sm text-foreground"
                            value={formData.message}
                            onChange={e => setFormData({...formData, message: e.target.value})}
                          />
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold">2</div>
                            <h3 className="font-bold text-foreground uppercase text-xs tracking-widest">Detalhes</h3>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Páginas</label>
                              <input 
                                required
                                type="number" 
                                min="1"
                                className="w-full px-5 py-4 bg-muted border border-border rounded-2xl outline-none focus:border-red-600 transition-all font-bold text-foreground"
                                value={formData.pages}
                                onChange={e => setFormData({...formData, pages: parseInt(e.target.value) || 1})}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Tipo</label>
                              <select 
                                className="w-full px-5 py-4 bg-muted border border-border rounded-2xl outline-none focus:border-red-600 transition-all font-bold appearance-none text-foreground"
                                value={formData.type}
                                onChange={e => setFormData({...formData, type: e.target.value})}
                              >
                                {prices?.filter(s => s.active).map(service => (
                                  <option key={service.id} value={service.id}>{service.name}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold">3</div>
                            <h3 className="font-bold text-foreground uppercase text-xs tracking-widest">Ficheiro</h3>
                          </div>
                          <div className="relative">
                            <input 
                              type="file" 
                              id="file-upload"
                              className="hidden"
                              onChange={e => setFile(e.target.files?.[0] || null)}
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            />
                            <label 
                              htmlFor="file-upload"
                              className="flex items-center justify-center w-full px-5 py-4 bg-muted border-2 border-dashed border-border rounded-2xl cursor-pointer hover:bg-muted/80 hover:border-red-300 transition-all h-[60px]"
                            >
                              {file ? (
                                <div className="flex items-center space-x-2 text-red-600">
                                  <FileText className="w-4 h-4" />
                                  <span className="text-xs font-bold truncate max-w-[150px]">{file.name}</span>
                                </div>
                              ) : (
                                <div className="flex items-center space-x-2 text-muted-foreground">
                                  <Plus className="w-4 h-4" />
                                  <span className="text-xs font-bold">Anexar Documento</span>
                                </div>
                              )}
                            </label>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}

                {/* Step 4: Customer Info */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                      {(formData.serviceType === "document" || formData.serviceType === "binding") ? "2" : "4"}
                    </div>
                    <h3 className="font-bold text-foreground uppercase text-xs tracking-widest">Seus Dados</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      required
                      type="text" 
                      placeholder="Seu Nome"
                      className="w-full px-5 py-4 bg-muted border border-border rounded-2xl outline-none focus:border-red-600 transition-all text-sm text-foreground"
                      value={formData.customerName}
                      onChange={e => setFormData({...formData, customerName: e.target.value})}
                    />
                    <input 
                      required
                      type="tel" 
                      placeholder="WhatsApp (Ex: 923 000 000)"
                      className="w-full px-5 py-4 bg-muted border border-border rounded-2xl outline-none focus:border-red-600 transition-all text-sm text-foreground"
                      value={formData.whatsapp}
                      onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                    />
                  </div>
                </div>

                {/* Step 5: Delivery */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                      {(formData.serviceType === "document" || formData.serviceType === "binding") ? "3" : "5"}
                    </div>
                    <h3 className="font-bold text-foreground uppercase text-xs tracking-widest">Entrega</h3>
                  </div>
                  <div className="flex bg-muted p-1 rounded-2xl border border-border mb-4">
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, deliveryType: "delivery"})}
                      className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all ${formData.deliveryType === "delivery" ? "bg-card text-red-600 shadow-sm" : "text-muted-foreground"}`}
                    >
                      Entrega ao Domicílio
                    </button>
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, deliveryType: "pickup"})}
                      className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all ${formData.deliveryType === "pickup" ? "bg-card text-red-600 shadow-sm" : "text-muted-foreground"}`}
                    >
                      Levantar na Loja
                    </button>
                  </div>

                  {formData.deliveryType === "delivery" && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-4"
                    >
                      <input 
                        required
                        type="text" 
                        placeholder="Endereço (Rua, Casa, Referência)"
                        className="w-full px-5 py-4 bg-muted border border-border rounded-2xl outline-none focus:border-red-600 transition-all text-sm text-foreground"
                        value={formData.address}
                        onChange={e => setFormData({...formData, address: e.target.value})}
                      />
                      {settings.enabledDeliveryDays && settings.enabledDeliveryDays.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {settings.enabledDeliveryDays.map(day => (
                            <button
                              key={day}
                              type="button"
                              onClick={() => setFormData({...formData, selectedDeliveryDay: day})}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                                formData.selectedDeliveryDay === day
                                  ? "bg-red-600 text-white border-red-600"
                                  : "bg-card text-muted-foreground border-border hover:border-red-200"
                              }`}
                            >
                              {day}
                            </button>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Summary & Submit */}
                <div className="pt-6 border-t border-border">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Estimado</p>
                      <p className="text-3xl font-black text-foreground tracking-tighter">
                        {calculateTotal() > 0 ? `${calculateTotal()} Kz` : "A combinar"}
                      </p>
                    </div>
                    <button 
                      disabled={loading}
                      type="submit" 
                      className="px-10 py-5 bg-red-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-red-600/20 hover:bg-red-700 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center space-x-3"
                    >
                      {loading ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Finalizar</span>
                          <Send className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[10px] text-muted-foreground text-center italic">
                    Ao confirmar, seu pedido será enviado para nossa equipe e você receberá um código de rastreio.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const SupportForm = () => {
  const [formData, setFormData] = useState({ name: "", contact: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ticketCode, setTicketCode] = useState("");
  const [activeTab, setActiveTab] = useState<"send" | "check">("send");
  const [checkCode, setCheckCode] = useState("");
  const [checkedMessage, setCheckedMessage] = useState<SupportMessage | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [attachment, setAttachment] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() && !attachment) return;
    if (!checkedMessage) return;

    try {
      const response = {
        id: Date.now().toString(),
        text: newMessage,
        createdAt: new Date().toISOString(),
        sender: "customer" as const,
        attachment: attachment || undefined
      };
      const updated = await api.updateSupportMessage(checkedMessage.id, {
        responses: [...(checkedMessage.responses || []), response]
      });
      setCheckedMessage(updated);
      setNewMessage("");
      setAttachment(null);
    } catch (err) {
      alert("Erro ao enviar mensagem.");
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const res = await api.uploadFile(file);
      setAttachment(res.url);
    } catch (err) {
      alert("Erro ao carregar ficheiro.");
    } finally {
      setIsUploading(false);
    }
  };
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.sendSupportMessage(formData);
      setTicketCode(res.ticketCode);
      setSuccess(true);
      setFormData({ name: "", contact: "", message: "" });
    } catch (error) {
      console.error("Error sending support message:", error);
      alert("Erro ao enviar mensagem. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheck = async (e: FormEvent) => {
    e.preventDefault();
    if (!checkCode.trim()) return;
    setChecking(true);
    setCheckError("");
    setCheckedMessage(null);
    try {
      const messages: SupportMessage[] = await api.getSupportMessages();
      const found = messages.find(m => m.ticketCode?.toUpperCase() === checkCode.toUpperCase());
      if (found) {
        setCheckedMessage(found);
      } else {
        setCheckError("Ticket não encontrado. Verifique o código.");
      }
    } catch (error) {
      setCheckError("Erro ao procurar ticket.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="pt-32 pb-24 bg-muted/50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-8">
          <div className="bg-card p-1 rounded-2xl shadow-sm border border-border flex">
            <button 
              onClick={() => setActiveTab("send")}
              className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === "send" ? "bg-red-600 text-white" : "text-muted-foreground hover:bg-muted"}`}
            >
              Enviar Mensagem
            </button>
            <button 
              onClick={() => setActiveTab("check")}
              className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === "check" ? "bg-red-600 text-white" : "text-muted-foreground hover:bg-muted"}`}
            >
              Ver Resposta
            </button>
          </div>
        </div>

        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-[3rem] shadow-2xl p-8 md:p-12 border border-border"
        >
          {activeTab === "send" ? (
            <>
              <div className="text-center mb-12">
                <div className="w-16 h-16 bg-red-500/10 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-8 h-8" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Suporte ao Cliente</h2>
                <p className="text-muted-foreground">Tem alguma dúvida ou precisa de ajuda? Envie-nos uma mensagem e responderemos o mais breve possível.</p>
              </div>

              {success ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Mensagem Enviada!</h3>
                  <p className="text-muted-foreground mb-4">Agradecemos o seu contacto. Guarde o seu código de ticket para ver a resposta:</p>
                  <div className="bg-muted p-6 rounded-3xl mb-8 inline-block">
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Código do Ticket</p>
                    <p className="text-3xl font-black text-red-600 tracking-widest">{ticketCode}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button 
                      onClick={() => setSuccess(false)}
                      className="px-8 py-4 bg-muted text-foreground rounded-2xl font-bold hover:bg-muted/80 transition-all"
                    >
                      Enviar Outra
                    </button>
                    <button 
                      onClick={() => {
                        setSuccess(false);
                        setActiveTab("check");
                        setCheckCode(ticketCode);
                      }}
                      className="px-8 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all"
                    >
                      Verificar Agora
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground/80 ml-2">Seu Nome</label>
                      <input 
                        required
                        type="text" 
                        placeholder="Ex: Maria Silva"
                        className="w-full px-6 py-4 bg-muted border border-border rounded-2xl outline-none focus:border-red-600 transition-all text-foreground"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground/80 ml-2">Contacto (WhatsApp ou Email)</label>
                      <input 
                        required
                        type="text" 
                        placeholder="Ex: 923 000 000"
                        className="w-full px-6 py-4 bg-muted border border-border rounded-2xl outline-none focus:border-red-600 transition-all text-foreground"
                        value={formData.contact}
                        onChange={e => setFormData({...formData, contact: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground/80 ml-2">Sua Mensagem</label>
                    <textarea 
                      required
                      rows={5}
                      placeholder="Como podemos ajudar?"
                      className="w-full px-6 py-4 bg-muted border border-border rounded-2xl outline-none focus:border-red-600 transition-all text-foreground"
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                    />
                  </div>
                  <button 
                    disabled={loading}
                    type="submit" 
                    className="w-full py-5 bg-red-600 text-white rounded-2xl font-bold text-xl shadow-xl shadow-red-600/20 hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center space-x-3"
                  >
                    {loading ? (
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        <Send className="w-6 h-6" />
                        <span>Enviar Mensagem</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </>
          ) : (
            <div className="space-y-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/10 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Verificar Ticket</h2>
                <p className="text-muted-foreground">Insira o código do seu ticket para ver as respostas do nosso suporte.</p>
              </div>

              <form onSubmit={handleCheck} className="flex flex-col sm:flex-row gap-4">
                <input 
                  type="text" 
                  placeholder="Ex: X8Y2Z1"
                  className="flex-1 px-8 py-5 bg-muted border border-border rounded-2xl outline-none focus:border-red-600 transition-all text-xl font-bold uppercase tracking-widest text-foreground"
                  value={checkCode}
                  onChange={e => setCheckCode(e.target.value)}
                />
                <button 
                  disabled={checking}
                  type="submit"
                  className="px-10 py-5 bg-foreground text-background rounded-2xl font-bold text-lg hover:opacity-90 transition-all flex items-center justify-center space-x-3"
                >
                  {checking ? (
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-6 h-6 border-2 border-background border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      <Search className="w-6 h-6" />
                      <span>Verificar</span>
                    </>
                  )}
                </button>
              </form>

              <AnimatePresence mode="wait">
                {checkError && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-6 bg-red-500/10 border border-red-500/20 rounded-3xl text-red-600 font-medium text-center"
                  >
                    {checkError}
                  </motion.div>
                )}

                {checkedMessage && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-12"
                  >
                    <div className="p-8 bg-muted rounded-[2rem] border border-border">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Sua Mensagem Original</p>
                          <p className="text-foreground font-medium">{checkedMessage.message}</p>
                        </div>
                        <span className="text-[10px] text-muted-foreground">{new Date(checkedMessage.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <h4 className="text-xl font-bold text-foreground flex items-center space-x-3">
                        <MessageCircle className="w-6 h-6 text-red-600" />
                        <span>Conversa com o Suporte</span>
                      </h4>
                      
                      <div className="space-y-6 mb-8 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                        {checkedMessage.responses?.map((resp, idx) => (
                          <div key={idx} className={`flex ${resp.sender === 'customer' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-6 rounded-3xl border ${
                              resp.sender === 'customer' 
                                ? 'bg-red-600 text-white rounded-tr-none border-red-600 shadow-lg shadow-red-600/20' 
                                : 'bg-muted text-foreground rounded-tl-none border-border'
                            }`}>
                              <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${resp.sender === 'customer' ? 'text-white/70' : 'text-muted-foreground'}`}>
                                {resp.sender === 'customer' ? 'Você' : 'Suporte'}
                              </p>
                              <p className="leading-relaxed">{resp.text}</p>
                              {resp.attachment && (
                                <div className="mt-4 pt-4 border-t border-white/20">
                                  <a href={resp.attachment} target="_blank" rel="noreferrer" className={`inline-flex items-center space-x-2 text-xs font-bold ${resp.sender === 'customer' ? 'text-white hover:underline' : 'text-red-600 hover:underline'}`}>
                                    <ImageIcon className="w-4 h-4" />
                                    <span>Ver Anexo</span>
                                  </a>
                                </div>
                              )}
                              <p className={`text-[10px] mt-4 ${resp.sender === 'customer' ? 'text-white/50' : 'text-muted-foreground'}`}>
                                {new Date(resp.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                        {(!checkedMessage.responses || checkedMessage.responses.length === 0) && (
                          <div className="bg-card p-12 rounded-3xl border border-dashed border-border text-center">
                            <Clock className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                            <p className="text-muted-foreground italic">Aguardando a primeira resposta do suporte...</p>
                          </div>
                        )}
                      </div>

                      <form onSubmit={handleSendMessage} className="space-y-4">
                        <div className="relative">
                          <textarea 
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                            placeholder="Escreva a sua resposta..."
                            className="w-full px-8 py-6 bg-muted border border-border rounded-[2rem] outline-none focus:border-red-600 transition-all text-foreground resize-none pr-32"
                            rows={3}
                          />
                          <div className="absolute right-4 bottom-4 flex items-center space-x-2">
                            <label className="p-3 bg-card border border-border rounded-xl cursor-pointer hover:bg-muted transition-colors">
                              <input 
                                type="file" 
                                className="hidden" 
                                onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                              />
                              {isUploading ? (
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full" />
                              ) : (
                                <ImageIcon className="w-5 h-5 text-muted-foreground" />
                              )}
                            </label>
                            <button 
                              type="submit"
                              disabled={!newMessage.trim() && !attachment}
                              className="p-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all disabled:opacity-50"
                            >
                              <Send className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                        {attachment && (
                          <div className="flex items-center justify-between p-4 bg-red-600/5 border border-red-600/20 rounded-2xl">
                            <div className="flex items-center space-x-3">
                              <ImageIcon className="w-5 h-5 text-red-600" />
                              <span className="text-sm font-bold text-red-600">Ficheiro pronto para enviar</span>
                            </div>
                            <button onClick={() => setAttachment(null)} className="p-1 hover:bg-red-600/10 rounded-full">
                              <X className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        )}
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

const Footer = ({ settings }: { settings: Settings }) => (
  <footer className="bg-card text-foreground pt-20 pb-10 border-t border-border">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center space-x-2 mb-6">
            <Printer className="w-8 h-8 text-red-500" />
            <span className="text-2xl font-bold tracking-tight">{settings.logo}</span>
          </div>
          <p className="text-muted-foreground max-w-sm mb-8">{settings.slogan}</p>
          <div className="flex space-x-4">
            <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="p-2 bg-muted rounded-full hover:bg-red-600 hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
            <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-muted rounded-full hover:bg-red-600 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
            <a href={settings.tiktok} target="_blank" rel="noopener noreferrer" className="p-2 bg-muted rounded-full hover:bg-red-600 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href={settings.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-muted rounded-full hover:bg-red-600 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
            <a href={settings.twitter} target="_blank" rel="noopener noreferrer" className="p-2 bg-muted rounded-full hover:bg-red-600 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
          </div>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-6">Contactos</h4>
          <ul className="space-y-4 text-muted-foreground">
            <li className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-red-500" />
              <span>{settings.phone}</span>
            </li>
            <li className="flex items-center space-x-3">
              <MessageCircle className="w-5 h-5 text-red-500" />
              <span>{settings.whatsapp}</span>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-6">Links Rápidos</h4>
          <ul className="space-y-4 text-muted-foreground">
            <li><Link to="/servicos" className="hover:text-foreground transition-colors">Nossos Serviços</Link></li>
            <li><Link to="/parcerias" className="hover:text-foreground transition-colors">Seja um Parceiro</Link></li>
            <li><Link to="/suporte" className="hover:text-foreground transition-colors">Suporte ao Cliente</Link></li>
            <li><Link to="/admin" className="hover:text-foreground transition-colors">Área Administrativa</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border pt-8 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} {settings.logo}. Todos os direitos reservados.</p>
      </div>
    </div>
  </footer>
);


const HomePage = ({ settings, prices }: { settings: Settings, prices: Prices }) => {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-background">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-red-600/5 rounded-l-[5rem] -z-10 hidden lg:block" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600/10 text-red-600 rounded-full text-sm font-black uppercase tracking-widest mb-8">
                <Printer className="w-4 h-4" />
                <span>Impressão Profissional em Luanda</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-foreground mb-8 leading-[0.9] tracking-tighter">
                {settings.logo} <br />
                <span className="text-red-600">Digital & Print</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-xl">
                {settings.slogan}
              </p>
              <div className="flex flex-wrap gap-6">
                <a 
                  href="#fazer-pedido"
                  className="px-10 py-5 bg-red-600 text-white rounded-full font-black text-lg hover:bg-red-700 transition-all shadow-2xl shadow-red-600/30 flex items-center space-x-3 group"
                >
                  <span>Fazer Pedido Agora</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <Link 
                  to="/servicos"
                  className="px-10 py-5 bg-muted text-foreground rounded-full font-black text-lg hover:bg-muted/80 transition-all border border-border"
                >
                  Nossos Serviços
                </Link>
              </div>
              
              <div className="mt-16 flex items-center space-x-8">
                <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                    <img 
                      key={i}
                      src={`https://i.pravatar.cc/100?u=${i}`} 
                      className="w-12 h-12 rounded-full border-4 border-background shadow-lg"
                      alt="User"
                      referrerPolicy="no-referrer"
                    />
                  ))}
                </div>
                <div>
                  <p className="text-foreground font-bold">+500 Clientes Satisfeitos</p>
                  <p className="text-sm text-muted-foreground">Em toda a cidade de Luanda</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative hidden lg:block"
            >
              <div className="relative z-10 rounded-[4rem] overflow-hidden shadow-2xl border-8 border-background rotate-3 hover:rotate-0 transition-transform duration-700">
                <img 
                  src="https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&q=80&w=800" 
                  alt="Printing Service" 
                  className="w-full h-[600px] object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-red-600 rounded-[3rem] -z-10 animate-pulse" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-foreground rounded-full -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-foreground mb-4">Como Funciona</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">O nosso processo é simples e pensado na sua comodidade.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: <MessageCircle className="w-10 h-10" />, title: "1. Envie o Documento", desc: "Envie o seu ficheiro via WhatsApp com as especificações (preto e branco ou colorido)." },
              { icon: <Printer className="w-10 h-10" />, title: "2. Nós Imprimimos", desc: "A nossa equipa processa o seu pedido com a máxima qualidade e rapidez." },
              { icon: <Truck className="w-10 h-10" />, title: "3. Receba em Casa", desc: "Entregamos o seu documento no endereço indicado. O valor da deslocação é assumido pelo cliente." },
              { icon: <FileText className="w-10 h-10" />, title: "4. Criação de Documentos", desc: "Solicite a criação de currículos, trabalhos escolares e outros documentos personalizados." }
            ].map((step, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="p-8 bg-muted rounded-3xl text-center border border-border"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600 text-white rounded-2xl mb-8 shadow-xl shadow-red-600/20">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-8 leading-tight">Porquê escolher a {settings.logo}?</h2>
              <div className="space-y-8">
                {[
                  { icon: <DollarSign />, title: "Preços Justos", desc: "Temos as melhores tarifas do mercado com descontos por quantidade." },
                  { icon: <ShieldCheck />, title: "Qualidade Garantida", desc: "Equipamento profissional para garantir nitidez em cada página." },
                  { icon: <Users />, title: "Parcerias Fortes", desc: "Sistema de comissões para escolas, professores e afiliados." },
                  { icon: <FileText />, title: "Criação & Design", desc: "Ajudamos na criação e formatação dos seus documentos e trabalhos." }
                ].map((benefit, i) => (
                  <div key={i} className="flex space-x-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-card text-red-600 rounded-xl flex items-center justify-center shadow-sm">
                      {benefit.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-foreground mb-2">{benefit.title}</h4>
                      <p className="text-muted-foreground">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1589149098258-3e9102ca93d3?auto=format&fit=crop&q=80&w=800" 
                alt="Office" 
                className="rounded-[3rem] shadow-2xl"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-10 -left-10 bg-red-600 text-white p-10 rounded-[2rem] shadow-2xl hidden md:block">
                <p className="text-4xl font-bold mb-2">100%</p>
                <p className="text-sm font-medium uppercase tracking-widest opacity-80">Comprometidos</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden border border-border">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl -ml-32 -mb-32" />
            
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8 relative z-10">Pronto para imprimir?</h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto relative z-10">
              Não perca tempo em filas. Envie agora e receba em casa.
            </p>
            <div className="flex flex-wrap justify-center gap-6 relative z-10">
              <Link to="/servicos" className="px-10 py-4 bg-foreground text-background rounded-full font-bold hover:opacity-90 transition-all flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span>Ver Preços</span>
              </Link>
              <Link to="/parcerias" className="px-10 py-4 bg-muted text-foreground rounded-full font-bold hover:bg-muted/80 transition-all flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Parcerias</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const NewsPage = ({ news }: { news: NewsItem[] }) => (
  <div className="pt-32 pb-24 bg-background min-h-screen">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4">Notícias & Novidades</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">Fique por dentro de tudo o que acontece na Leocomércio.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {news.filter(n => n.active).map(item => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-card p-8 rounded-[2.5rem] border border-border shadow-xl"
          >
            <div className="flex items-center space-x-2 text-red-600 mb-4">
              <Calendar className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">{new Date(item.date).toLocaleDateString()}</span>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-4">{item.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-4">{item.content}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);
const TermsPage = ({ settings }: { settings: Settings }) => (
  <div className="pt-32 pb-24 bg-background min-h-screen">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter mb-4">Termos de Serviço</h1>
        <p className="text-lg text-muted-foreground">Por favor, leia atentamente os nossos termos de utilização.</p>
      </div>
      <div className="bg-card p-8 md:p-12 rounded-[2.5rem] border border-border shadow-xl shadow-red-600/5">
        <div className="prose prose-red dark:prose-invert max-w-none text-foreground leading-relaxed whitespace-pre-wrap text-lg">
          {settings.terms || "Os termos de serviço serão publicados em breve pelo administrador."}
        </div>
      </div>
    </div>
  </div>
);

const PrivacyPage = ({ settings }: { settings: Settings }) => (
  <div className="pt-32 pb-24 bg-background min-h-screen">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter mb-4">Política de Privacidade</h1>
        <p className="text-lg text-muted-foreground">A sua privacidade e a segurança dos seus dados são a nossa prioridade.</p>
      </div>
      <div className="bg-card p-8 md:p-12 rounded-[2.5rem] border border-border shadow-xl shadow-red-600/5">
        <div className="prose prose-red dark:prose-invert max-w-none text-foreground leading-relaxed whitespace-pre-wrap text-lg">
          {settings.privacy || "A política de privacidade será publicada em breve pelo administrador."}
        </div>
      </div>
    </div>
  </div>
);

const HowItWorksPage = ({ settings }: { settings: Settings }) => (
  <div className="pt-32 pb-24 bg-background min-h-screen">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter mb-4">Como Funciona</h1>
        <p className="text-lg text-muted-foreground">Siga os passos abaixo para realizar o seu pedido com facilidade.</p>
      </div>

      <div className="grid grid-cols-1 gap-12 mb-20">
        <div className="bg-card p-8 md:p-12 rounded-[2.5rem] border border-border shadow-xl shadow-red-600/5">
          <div className="prose prose-red dark:prose-invert max-w-none text-foreground leading-relaxed whitespace-pre-wrap text-lg">
            {settings.howItWorks || "As instruções de como o site funciona serão publicadas em breve pelo administrador."}
          </div>
        </div>
      </div>

      <div className="bg-red-600 rounded-[2.5rem] p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-red-600/40">
        <div className="text-center md:text-left">
          <h3 className="text-2xl md:text-3xl font-black tracking-tighter mb-2">Ainda tem dúvidas?</h3>
          <p className="text-red-100 font-medium">Entre em contacto direto com o nosso administrador para mais informações.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {settings.whatsapp && (
            <a 
              href={`https://wa.me/${settings.whatsapp.replace(/\s+/g, '')}`} 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center justify-center space-x-3 px-8 py-4 bg-white text-red-600 rounded-2xl font-bold hover:bg-red-50 transition-all shadow-lg"
            >
              <MessageCircle className="w-6 h-6" />
              <span>WhatsApp</span>
            </a>
          )}
          {settings.phone && (
            <a 
              href={`tel:${settings.phone.replace(/\s+/g, '')}`} 
              className="flex items-center justify-center space-x-3 px-8 py-4 bg-red-700 text-white rounded-2xl font-bold hover:bg-red-800 transition-all border border-red-500/30"
            >
              <Phone className="w-6 h-6" />
              <span>Ligar Agora</span>
            </a>
          )}
        </div>
      </div>
    </div>
  </div>
);

const ServicesPage = ({ settings, prices, addToCart }: { settings: Settings, prices: Prices, addToCart: (service: ServicePrice) => void }) => (
  <>
    <div className="pt-28 md:pt-32 pb-24 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 md:mb-6">Nossos Serviços</h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">Confira todos os serviços que oferecemos com os melhores preços.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/#fazer-pedido" className="inline-flex items-center space-x-3 px-8 py-4 bg-red-600 text-white rounded-2xl font-bold text-lg hover:bg-red-700 transition-all shadow-xl shadow-red-600/20">
              <Printer className="w-6 h-6" />
              <span>Fazer Pedido Agora</span>
            </Link>
            <Link to="/como-funciona" className="inline-flex items-center space-x-3 px-8 py-4 bg-muted text-foreground rounded-2xl font-bold text-lg hover:bg-muted/80 transition-all">
              <Info className="w-6 h-6" />
              <span>Como Funciona</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto mb-12 md:mb-16">
          {prices?.filter(s => s.active).map((service) => (
            <motion.div 
              key={service.id}
              whileHover={{ y: -5 }}
              className="bg-card rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-border flex flex-col"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 md:mb-8">
                <Printer className="w-7 h-7 md:w-8 md:h-8 text-red-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">{service.name}</h3>
              {service.description && (
                <p className="text-sm text-muted-foreground mb-6 line-clamp-2">{service.description}</p>
              )}
              <div className="space-y-4 md:space-y-6 flex-grow">
                <div className="flex justify-between items-center p-4 bg-muted rounded-2xl">
                  <span className="text-muted-foreground font-medium">Preço Unitário</span>
                  <span className="text-xl md:text-2xl font-bold text-foreground">{service.single} Kz</span>
                </div>
                
                {service.promo.pages > 1 && (
                  <div className="flex justify-between items-center p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
                    <div>
                      <span className="block text-red-600 text-xs font-black uppercase tracking-wider mb-1">PROMOÇÃO</span>
                      <span className="text-muted-foreground font-medium">{service.promo.pages} Páginas</span>
                    </div>
                    <span className="text-xl md:text-2xl font-bold text-red-600">{service.promo.price} Kz</span>
                  </div>
                )}
              </div>
              
              <div className="mt-8 space-y-3">
                <button 
                  onClick={() => addToCart(service)}
                  className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Adicionar ao Carrinho</span>
                </button>
                <Link 
                  to={`/?service=${service.id}#fazer-pedido`} 
                  className="block w-full py-4 bg-foreground text-background text-center rounded-2xl font-bold hover:opacity-90 transition-all"
                >
                  Solicitar Individualmente
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>

    <div className="max-w-4xl mx-auto bg-amber-500/10 border-l-4 border-amber-500 p-6 md:p-8 rounded-2xl flex items-start space-x-4 md:space-x-6 mb-24">
      <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 text-amber-500 flex-shrink-0" />
      <div>
        <h4 className="text-lg font-bold text-amber-600 mb-1 md:mb-2">Aviso Importante</h4>
        <p className="text-sm md:text-base text-amber-600/80 leading-relaxed">
          Documentos com cor pesada ou muitas imagens devem ter o preço negociado diretamente com a direção. Por favor, ligue para <a href={`tel:${settings.phone}`} className="font-bold underline">{settings.phone}</a>.
        </p>
      </div>
    </div>
  </>
);

const PartnersPage = ({ settings }: { settings: Settings }) => {
  const [formData, setFormData] = useState({ name: "", email: "", school: "", type: "partner" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (formData.type === "partner") {
      await api.savePartner(formData);
    } else {
      await api.saveAfiliado(formData);
    }
    setSubmitted(true);
  };

  return (
    <div className="pt-28 md:pt-32 pb-24 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 md:mb-8 leading-tight">Ganhe dinheiro com a {settings.logo}</h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 md:mb-12 leading-relaxed">
              Temos um sistema de comissões exclusivo para escolas, professores e afiliados. Ajude a sua comunidade a imprimir com facilidade e seja recompensado por isso.
            </p>
            
            <div className="space-y-6 md:space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-red-500/10 text-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg md:text-xl font-bold text-foreground mb-1 md:mb-2">Escolas e Professores</h4>
                  <p className="text-sm md:text-base text-muted-foreground">Comissão de 30% por folha impressa através do seu código.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-muted text-foreground rounded-xl flex items-center justify-center flex-shrink-0">
                  <Share2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg md:text-xl font-bold text-foreground mb-1 md:mb-2">Sistema de Afiliados</h4>
                  <p className="text-sm md:text-base text-muted-foreground">Ganhe 30% de comissão sobre o valor total dos pedidos indicados.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-muted p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-border shadow-xl">
            <div className="text-center py-8 md:py-12">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-amber-500/10 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-8 h-8 md:w-10 md:h-10" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 md:mb-4">Acesso Restrito</h3>
              <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8 leading-relaxed">
                O registo de novos parceiros e afiliados é gerido exclusivamente pela nossa equipa administrativa. 
                Se deseja tornar-se um parceiro, por favor contacte-nos diretamente via WhatsApp ou telefone.
              </p>
              <div className="flex flex-col space-y-3 md:space-y-4">
                <a 
                  href={`https://wa.me/${settings.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 md:px-8 md:py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Contactar via WhatsApp</span>
                </a>
                <a 
                  href={`tel:${settings.phone}`}
                  className="px-6 py-3 md:px-8 md:py-4 bg-foreground text-background rounded-2xl font-bold hover:opacity-90 transition-all flex items-center justify-center space-x-2"
                >
                  <Phone className="w-5 h-5" />
                  <span>Ligar para nós</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Admin Panel ---

const AdminDashboard = ({ 
  settings, 
  setSettings, 
  prices, 
  setPrices, 
  orders, 
  partners, 
  afiliados, 
  gallery, 
  stats, 
  user, 
  setUser, 
  fetchData, 
  unreadSupportCount, 
  supportMessages, 
  theme, 
  toggleTheme,
  news
}: { 
  settings: Settings, 
  setSettings: any, 
  prices: Prices, 
  setPrices: any, 
  orders: Order[], 
  partners: Partner[], 
  afiliados: Afiliado[], 
  gallery: GalleryImage[], 
  stats: any, 
  user: any, 
  setUser: any, 
  fetchData: () => void, 
  unreadSupportCount: number, 
  supportMessages: SupportMessage[], 
  theme: string, 
  toggleTheme: () => void,
  news: NewsItem[]
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [activeTab, setActiveTab] = useState("stats");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messagingOrder, setMessagingOrder] = useState<Order | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [respondingMessage, setRespondingMessage] = useState<SupportMessage | null>(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [isAddingNews, setIsAddingNews] = useState(false);
  const [newNews, setNewNews] = useState({ title: "", content: "", date: new Date().toISOString().split('T')[0], active: true });
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [isEditingPrices, setIsEditingPrices] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [editingAfiliado, setEditingAfiliado] = useState<Afiliado | null>(null);
  const [newGalleryItem, setNewGalleryItem] = useState({ url: "", title: "" });
  const [isUploading, setIsUploading] = useState(false);
  const [newPriceService, setNewPriceService] = useState({ name: "", description: "", single: 0, promo: { pages: 10, price: 0 }, active: true });
  const [isAddingPrice, setIsAddingPrice] = useState(false);
  const [adminProfile, setAdminProfile] = useState({ name: user?.name || "Admin", email: user?.email || "admin@leocomercio.com", password: "" });

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    const res = await api.login(credentials);
    if (res.success) {
      setIsLoggedIn(true);
      setUser(res.user);
    } else alert(res.error);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card p-8 md:p-12 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-border"
        >
          <div className="text-center mb-10">
            <Printer className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-foreground">Admin Login</h2>
            <p className="text-muted-foreground">Acesso restrito à equipa Leocomércio</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Email</label>
              <input 
                type="email" 
                required
                className="w-full px-5 py-4 bg-muted border border-border rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all text-foreground"
                value={credentials.email}
                onChange={e => setCredentials({...credentials, email: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Palavra-passe</label>
              <input 
                type="password" 
                required
                className="w-full px-5 py-4 bg-muted border border-border rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all text-foreground"
                value={credentials.password}
                onChange={e => setCredentials({...credentials, password: e.target.value})}
              />
            </div>
            <button 
              type="submit"
              className="w-full py-5 bg-foreground text-background rounded-2xl font-bold text-lg hover:opacity-90 transition-all active:scale-95"
            >
              Entrar no Painel
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const menuItems = [
    { id: "stats", icon: <LayoutDashboard />, label: "Dashboard" },
    { id: "orders", icon: <Package />, label: "Pedidos" },
    { id: "news", icon: <Bell />, label: "Notícias" },
    { id: "partners", icon: <GraduationCap />, label: "Parceiros" },
    { id: "afiliados", icon: <Share2 />, label: "Afiliados" },
    { id: "support", icon: <MessageCircle />, label: "Suporte", badge: unreadSupportCount > 0 ? unreadSupportCount : undefined },
    { id: "gallery", icon: <ImageIcon />, label: "Galeria" },
    { id: "prices", icon: <DollarSign />, label: "Serviços" },
    { id: "settings", icon: <SettingsIcon />, label: "Configurações" },
    { id: "profile", icon: <User />, label: "Perfil" }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-card text-foreground p-4 flex justify-between items-center sticky top-0 z-50 border-b border-border">
        <div className="flex items-center space-x-2">
          <Printer className="w-6 h-6 text-red-500" />
          <span className="font-bold">Admin Panel</span>
        </div>
        <div className="flex items-center space-x-2">
          {unreadSupportCount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-full">
              {unreadSupportCount}
            </span>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 bg-muted rounded-xl relative"
          >
            {isSidebarOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`w-72 bg-card text-foreground p-8 flex flex-col fixed md:sticky top-0 h-screen z-50 transition-transform duration-300 border-r border-border ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="hidden md:flex items-center space-x-2 mb-12">
          <Printer className="w-8 h-8 text-red-500" />
          <span className="text-xl font-bold tracking-tight">Admin Panel</span>
        </div>
        
        <nav className="flex-1 space-y-1 overflow-y-auto pr-2 custom-scrollbar">
          {menuItems.map(item => (
            <button 
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all ${activeTab === item.id ? "bg-red-600 text-white shadow-lg shadow-red-600/20" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
            >
              <div className="flex items-center space-x-4">
                {item.icon}
                <span className="font-semibold">{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="mt-8 pt-8 border-t border-border space-y-2">
          <Link 
            to="/"
            className="flex items-center space-x-4 px-6 py-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            <HomeIcon />
            <span className="font-semibold">Voltar ao Site</span>
          </Link>

          <button 
            onClick={() => setIsLoggedIn(false)}
            className="w-full flex items-center space-x-4 px-6 py-4 text-muted-foreground hover:text-red-500 transition-colors"
          >
            <LogOut />
            <span className="font-semibold">Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 min-w-0">
        <header className="hidden md:flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-foreground">
            {menuItems.find(m => m.id === activeTab)?.label}
          </h2>
          <div className="flex items-center space-x-4">
            <span className="text-muted-foreground font-medium">{new Date().toLocaleDateString()}</span>
            
            <button 
              onClick={toggleTheme}
              className="p-2 text-muted-foreground hover:bg-muted rounded-xl transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <Link 
              to="/"
              className="flex items-center space-x-2 px-4 py-2 bg-muted text-foreground rounded-xl font-bold hover:bg-muted/80 transition-all"
            >
              <HomeIcon className="w-4 h-4" />
              <span>Ver Site</span>
            </Link>
            <div className="w-10 h-10 bg-muted rounded-full" />
          </div>
        </header>

        <div className="md:hidden mb-8">
           <h2 className="text-2xl font-bold text-gray-900">
            {menuItems.find(m => m.id === activeTab)?.label}
          </h2>
        </div>

        {activeTab === "stats" && stats && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { label: "Total Vendas", value: stats.totalVendas, icon: <Package />, color: "bg-blue-500" },
                { label: "Folhas Impressas", value: stats.totalFolhas, icon: <FileText />, color: "bg-purple-500" },
                { label: "Lucro Estimado", value: `${stats.lucroEstimado} Kz`, icon: <TrendingUp />, color: "bg-green-500" },
                { label: "Comissões Pagas", value: `${stats.comissoesPagas} Kz`, icon: <Users />, color: "bg-red-500" }
              ].map((stat, i) => (
                <div key={i} className="bg-card p-8 rounded-[2rem] shadow-sm border border-border">
                  <div className={`w-12 h-12 ${stat.color} text-white rounded-xl flex items-center justify-center mb-6`}>
                    {stat.icon}
                  </div>
                  <p className="text-muted-foreground font-medium mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                </div>
              ))}
            </div>
            {/* Recent Orders Table */}
            <div className="bg-card rounded-[2.5rem] shadow-sm border border-border overflow-hidden">
              <div className="p-8 border-b border-border flex justify-between items-center">
                <h3 className="text-xl font-bold text-foreground">Pedidos Recentes</h3>
                <button onClick={() => setActiveTab("orders")} className="text-red-600 font-bold hover:underline">Ver todos</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-muted text-muted-foreground text-sm uppercase tracking-wider">
                    <tr>
                      <th className="px-8 py-4">Cliente</th>
                      <th className="px-8 py-4">Status</th>
                      <th className="px-8 py-4">Total</th>
                      <th className="px-8 py-4">Data</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {orders.slice(0, 5).map(order => (
                      <tr key={order.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-8 py-4 font-medium text-foreground">
                          {order.customerName}
                          <div className="text-[10px] text-muted-foreground">
                            {order.items && order.items.length > 0 ? order.items.map(i => i.serviceName).join(", ") : ((order as any).serviceType === "print" ? "Impressão" : (order as any).serviceType === "copy" ? "Cópia" : "Documento")} | {order.deliveryType === "delivery" ? "Entrega" : "Retirada"}
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            order.status === "Pronto" ? "bg-green-500/10 text-green-600" :
                            order.status === "Pedido Recebido" ? "bg-blue-500/10 text-blue-600" :
                            order.status === "Em Andamento" ? "bg-purple-500/10 text-purple-600" :
                            order.status === "Recusado" ? "bg-red-500/10 text-red-600" :
                            "bg-amber-500/10 text-amber-600"
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-8 py-4 text-foreground font-bold">{order.totalPrice} Kz</td>
                        <td className="px-8 py-4 text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-12">
            {(Object.entries(
              orders.reduce((groups: Record<string, Order[]>, order) => {
                const date = new Date(order.createdAt);
                const monthYear = date.toLocaleString('pt-PT', { month: 'long', year: 'numeric' });
                if (!groups[monthYear]) groups[monthYear] = [];
                groups[monthYear].push(order);
                return groups;
              }, {} as Record<string, Order[]>)
            ) as [string, Order[]][]).map(([month, monthOrders]) => (
              <div key={month} className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="h-px flex-1 bg-border" />
                  <h3 className="text-lg font-bold text-muted-foreground uppercase tracking-widest">{month}</h3>
                  <div className="h-px flex-1 bg-border" />
                </div>
                
                <div className="bg-card rounded-[2.5rem] shadow-sm border border-border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-muted text-muted-foreground text-sm uppercase tracking-wider">
                        <tr>
                          <th className="px-8 py-4">Cód. Rastreio</th>
                          <th className="px-8 py-4">Cliente</th>
                          <th className="px-8 py-4">Serviço</th>
                          <th className="px-8 py-4">Entrega</th>
                          <th className="px-8 py-4">Páginas</th>
                          <th className="px-8 py-4">Tipo</th>
                          <th className="px-8 py-4">Total</th>
                          <th className="px-8 py-4">Status</th>
                          <th className="px-8 py-4">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {monthOrders.map(order => (
                          <tr key={order.id} className="hover:bg-muted/50 transition-colors">
                            <td className="px-8 py-4">
                              <span className="px-3 py-1 bg-muted text-foreground rounded-lg font-black text-xs uppercase tracking-tighter border border-border">
                                {order.trackingCode || "N/A"}
                              </span>
                            </td>
                            <td className="px-8 py-4">
                              <div className="font-medium text-foreground">{order.customerName}</div>
                              <div className="text-xs text-muted-foreground">{order.whatsapp}</div>
                              <div className="text-[10px] text-muted-foreground truncate max-w-[150px]">{order.address}</div>
                              {(order.deliveryDate || order.deliveryTime) && (
                                <div className="flex items-center space-x-1 text-[10px] text-amber-600 font-bold mt-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{order.deliveryDate} {order.deliveryTime}</span>
                                </div>
                              )}
                              {order.fileUrl && (
                                <a 
                                  href={order.fileUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center space-x-1 text-xs text-red-600 hover:underline mt-1"
                                >
                                  <FileText className="w-3 h-3" />
                                  <span>Ver Ficheiro</span>
                                </a>
                              )}
                              {order.message && (
                                <div className="mt-1 p-2 bg-muted rounded-lg text-[10px] text-muted-foreground italic border-l-2 border-border break-words max-w-[200px]">
                                  "{order.message}"
                                </div>
                              )}
                            </td>
                            <td className="px-8 py-4 text-foreground">
                              {order.items && order.items.length > 0 ? (
                                <div className="space-y-1">
                                  {order.items.map((item, idx) => (
                                    <div key={idx} className="text-xs">
                                      {item.serviceName}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                (order as any).serviceType === "print" ? "Impressão" : 
                                (order as any).serviceType === "copy" ? "Cópia" : "Documento"
                              )}
                            </td>
                            <td className="px-8 py-4 text-foreground">{order.deliveryType === "delivery" ? "Entrega" : "Retirada"}</td>
                            <td className="px-8 py-4 text-foreground">
                              {order.items && order.items.length > 0 ? (
                                <div className="space-y-1">
                                  {order.items.map((item, idx) => (
                                    <div key={idx} className="text-xs">
                                      {item.serviceName === "Criação de Documento" ? "-" : item.pages}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                (order as any).serviceType === "document" ? "-" : (order as any).pages
                              )}
                            </td>
                            <td className="px-8 py-4 text-foreground uppercase">
                              {order.items && order.items.length > 0 ? (
                                <div className="space-y-1">
                                  {order.items.map((item, idx) => (
                                    <div key={idx} className="text-[10px]">
                                      {item.serviceName === "Criação de Documento" ? "-" : item.type}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                (order as any).serviceType === "document" ? "-" : `${(order as any).type} ${(order as any).type === 'color' ? `(${(order as any).colorComplexity === 'heavy' ? 'Pesada' : 'Simples'})` : ''}`
                              )}
                            </td>
                            <td className="px-8 py-4 text-foreground font-bold">{order.totalPrice} Kz</td>
                            <td className="px-8 py-4">
                              <select 
                                value={order.status}
                                onChange={async (e) => {
                                  await api.updateOrder(order.id, { status: e.target.value as any });
                                  fetchData();
                                }}
                                className="bg-muted border border-border rounded-lg px-2 py-1 text-sm outline-none text-foreground"
                              >
                                <option value="Pedido Recebido">Pedido Recebido</option>
                                <option value="Em Andamento">Em Andamento</option>
                                <option value="Pronto">Pronto</option>
                                <option value="Recusado">Recusado</option>
                                <option value="Entregue">Entregue</option>
                              </select>
                            </td>
                            <td className="px-8 py-4">
                              <div className="flex items-center space-x-2">
                                <button 
                                  onClick={() => setMessagingOrder(order)}
                                  className="p-2 text-muted-foreground hover:text-blue-600 transition-colors"
                                  title="Enviar Mensagem"
                                >
                                  <MessageCircle className="w-5 h-5" />
                                </button>
                                <button 
                                  onClick={() => generateOrderPDF(order, settings)}
                                  className="p-2 text-muted-foreground hover:text-red-600 transition-colors"
                                  title="Baixar PDF"
                                >
                                  <FileText className="w-5 h-5" />
                                </button>
                                <button 
                                  onClick={async () => {
                                    if (window.confirm("Tem certeza que deseja excluir este pedido?")) {
                                      await api.deleteOrder(order.id);
                                      fetchData();
                                    }
                                  }}
                                  className="p-2 text-muted-foreground hover:text-red-600 transition-colors"
                                  title="Excluir Pedido"
                                >
                                  <Trash className="w-5 h-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <AnimatePresence>
          {messagingOrder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-border"
              >
                <div className="p-8 border-b border-border flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Mensagem para {messagingOrder.customerName}</h3>
                    <p className="text-xs text-muted-foreground">Cód. Rastreio: {messagingOrder.trackingCode}</p>
                  </div>
                  <button onClick={() => setMessagingOrder(null)} className="p-2 hover:bg-muted rounded-full transition-colors">
                    <X className="w-6 h-6 text-muted-foreground" />
                  </button>
                </div>
                
                <div className="p-8 space-y-6">
                  <div className="max-h-60 overflow-y-auto space-y-4 pr-2">
                    {messagingOrder.adminMessages?.length ? (
                      messagingOrder.adminMessages.map(msg => (
                        <div 
                          key={msg.id} 
                          className={`p-4 rounded-2xl border ${
                            msg.sender === 'customer' 
                              ? "bg-red-500/5 border-red-500/10 ml-0 mr-8" 
                              : "bg-muted border-border ml-8 mr-0"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                              {msg.sender === 'customer' ? 'Cliente' : 'Admin'}
                            </span>
                          </div>
                          <p className="text-sm text-foreground">{msg.text}</p>
                          {msg.attachment && (
                            <div className="mt-2 p-2 bg-background/50 rounded-xl border border-border flex items-center space-x-2">
                              <Paperclip className="w-3 h-3 text-red-600" />
                              <a 
                                href={msg.attachment} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-[10px] text-red-600 hover:underline truncate"
                              >
                                Ver Anexo
                              </a>
                            </div>
                          )}
                          <p className="text-[10px] text-muted-foreground mt-2">
                            {new Date(msg.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground text-sm py-4 italic">Nenhuma mensagem enviada ainda.</p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <textarea 
                      className="w-full px-6 py-4 bg-muted border border-border rounded-2xl outline-none focus:border-red-600 transition-all resize-none h-32 text-foreground"
                      placeholder="Escreva a sua mensagem aqui..."
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                    />
                    <button 
                      disabled={isSending || !newMessage.trim()}
                      onClick={async () => {
                        setIsSending(true);
                        try {
                          const updatedMessages = [
                            ...(messagingOrder.adminMessages || []),
                            {
                              id: Date.now().toString(),
                              text: newMessage,
                              createdAt: new Date().toISOString(),
                              sender: "admin" as const
                            }
                          ];
                          await api.updateOrder(messagingOrder.id, { adminMessages: updatedMessages });
                          setNewMessage("");
                          setMessagingOrder(null);
                          fetchData();
                        } catch (error) {
                          console.error("Error sending message:", error);
                        } finally {
                          setIsSending(false);
                        }
                      }}
                      className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {isSending ? (
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Enviar Mensagem</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {activeTab === "news" && (
          <div className="bg-card p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-border">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-foreground">Gestão de Notícias</h3>
              <button 
                onClick={() => setIsAddingNews(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Nova Notícia</span>
              </button>
            </div>

            <AnimatePresence>
              {isAddingNews && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-card rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-border"
                  >
                    <div className="p-8 border-b border-border flex justify-between items-center">
                      <h3 className="text-xl font-bold text-foreground">Nova Notícia</h3>
                      <button onClick={() => setIsAddingNews(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                        <X className="w-6 h-6 text-muted-foreground" />
                      </button>
                    </div>
                    <form className="p-8 space-y-6" onSubmit={async (e) => {
                      e.preventDefault();
                      await api.saveNews(newNews);
                      setIsAddingNews(false);
                      setNewNews({ title: "", content: "", date: new Date().toISOString().split('T')[0], active: true });
                      fetchData();
                    }}>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-foreground mb-2">Título</label>
                          <input 
                            type="text" 
                            required
                            className="w-full px-6 py-4 bg-muted border border-border rounded-2xl outline-none focus:border-red-600 transition-all text-foreground"
                            value={newNews.title}
                            onChange={e => setNewNews({...newNews, title: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-foreground mb-2">Conteúdo</label>
                          <textarea 
                            required
                            className="w-full px-6 py-4 bg-muted border border-border rounded-2xl outline-none focus:border-red-600 transition-all resize-none h-40 text-foreground"
                            value={newNews.content}
                            onChange={e => setNewNews({...newNews, content: e.target.value})}
                          />
                        </div>
                      </div>
                      <button 
                        type="submit"
                        className="w-full py-5 bg-red-600 text-white rounded-2xl font-bold text-lg hover:bg-red-700 transition-all"
                      >
                        Publicar Notícia
                      </button>
                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              {news.map(item => (
                <div key={item.id} className="p-6 bg-muted rounded-2xl border border-border flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-foreground">{item.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-1">{item.content}</p>
                    <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-widest font-black">
                      {new Date(item.date).toLocaleDateString('pt-PT')}
                    </p>
                  </div>
                  <button 
                    onClick={async () => {
                      if (confirm("Eliminar esta notícia?")) {
                        await api.deleteNews(item.id!);
                        fetchData();
                      }
                    }}
                    className="p-2 text-muted-foreground hover:text-red-600 transition-colors"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </div>
              ))}
              {news.length === 0 && (
                <div className="text-center py-12 text-muted-foreground italic">Nenhuma notícia publicada.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === "partners" && (
          <div className="space-y-8">
            <div className="bg-card p-8 rounded-[2.5rem] shadow-sm border border-border max-w-2xl">
              <h3 className="text-xl font-bold text-foreground mb-6">Adicionar Novo Parceiro (Escola/Professor)</h3>
              <form className="space-y-4" onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const name = (form.elements.namedItem("name") as HTMLInputElement).value;
                const email = (form.elements.namedItem("email") as HTMLInputElement).value;
                const school = (form.elements.namedItem("school") as HTMLInputElement).value;
                const password = (form.elements.namedItem("password") as HTMLInputElement).value;
                await api.savePartner({ name, email, school, password });
                form.reset();
                fetchData();
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input name="name" placeholder="Nome do Parceiro" required className="px-5 py-3 bg-muted border border-border rounded-xl outline-none text-foreground" />
                  <input name="email" type="email" placeholder="Email" required className="px-5 py-3 bg-muted border border-border rounded-xl outline-none text-foreground" />
                  <input name="school" placeholder="Escola (Opcional)" className="px-5 py-3 bg-muted border border-border rounded-xl outline-none text-foreground" />
                  <input name="password" type="text" placeholder="Senha de Acesso" required className="px-5 py-3 bg-muted border border-border rounded-xl outline-none text-foreground" />
                </div>
                <button type="submit" className="w-full py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all flex items-center justify-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Registar Parceiro</span>
                </button>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {partners.map(partner => (
                <div key={partner.id} className="bg-card p-8 rounded-[2rem] shadow-sm border border-border relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${partner.active ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground"}`}>
                      {partner.active ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold text-foreground mb-2">{partner.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{partner.school || "Professor Independente"}</p>
                  <p className="text-xs text-muted-foreground mb-6">{partner.email}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-muted p-4 rounded-2xl border border-border">
                      <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Código</p>
                      <p className="text-sm font-mono font-bold text-red-600">{partner.code}</p>
                    </div>
                    <div className="bg-muted p-4 rounded-2xl border border-border">
                      <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Senha</p>
                      <p className="text-sm font-mono font-bold text-foreground">{partner.password}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted rounded-2xl border border-border">
                      <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Folhas</p>
                      <p className="text-xl font-bold text-foreground">{partner.stats.leaves}</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-2xl border border-border">
                      <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Ganhos</p>
                      <p className="text-xl font-bold text-foreground">{partner.stats.earned} Kz</p>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-border">
                    <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">Comissão (Kz por folha)</label>
                    <div className="flex space-x-2">
                      <input 
                        type="number" 
                        className="flex-1 px-4 py-2 bg-muted border border-border rounded-xl text-sm outline-none text-foreground"
                        defaultValue={partner.commission || settings.defaultCommission || 30}
                        onBlur={async (e) => {
                          await api.updatePartner(partner.id, { commission: parseInt(e.target.value) });
                          fetchData();
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "afiliados" && (
          <div className="space-y-8">
            <div className="bg-card p-8 rounded-[2.5rem] shadow-sm border border-border max-w-2xl">
              <h3 className="text-xl font-bold text-foreground mb-6">Adicionar Novo Afiliado</h3>
              <form className="space-y-4" onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const name = (form.elements.namedItem("name") as HTMLInputElement).value;
                const email = (form.elements.namedItem("email") as HTMLInputElement).value;
                const password = (form.elements.namedItem("password") as HTMLInputElement).value;
                await api.saveAfiliado({ name, email, password });
                form.reset();
                fetchData();
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input name="name" placeholder="Nome do Afiliado" required className="px-5 py-3 bg-muted border border-border rounded-xl outline-none text-foreground" />
                  <input name="email" type="email" placeholder="Email" required className="px-5 py-3 bg-muted border border-border rounded-xl outline-none text-foreground" />
                  <input name="password" type="text" placeholder="Senha de Acesso" required className="px-5 py-3 bg-muted border border-border rounded-xl outline-none text-foreground" />
                </div>
                <button type="submit" className="w-full py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all flex items-center justify-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Registar Afiliado</span>
                </button>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {afiliados.map(afiliado => (
                <div key={afiliado.id} className="bg-card p-8 rounded-[2rem] shadow-sm border border-border relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${afiliado.active ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground"}`}>
                      {afiliado.active ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold text-foreground mb-2">{afiliado.name}</h4>
                  <p className="text-sm text-muted-foreground mb-6">{afiliado.email}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-muted p-4 rounded-2xl border border-border">
                      <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Código</p>
                      <p className="text-sm font-mono font-bold text-red-600">{afiliado.code}</p>
                    </div>
                    <div className="bg-muted p-4 rounded-2xl border border-border">
                      <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Senha</p>
                      <p className="text-sm font-mono font-bold text-foreground">{afiliado.password}</p>
                    </div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-2xl mb-6 border border-border">
                    <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Total Ganho</p>
                    <p className="text-xl font-bold text-foreground">{afiliado.stats.earned} Kz</p>
                  </div>
                  <div className="pt-6 border-t border-border">
                    <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">Comissão (%)</label>
                    <input 
                      type="number" 
                      className="w-full px-4 py-2 bg-muted border border-border rounded-xl text-sm outline-none text-foreground"
                      defaultValue={afiliado.commission || settings.defaultCommission || 30}
                      onBlur={async (e) => {
                        await api.updateAfiliado(afiliado.id, { commission: parseInt(e.target.value) });
                        fetchData();
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "support" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6">
              {supportMessages.length === 0 ? (
                <div className="bg-card p-12 rounded-[2.5rem] shadow-sm border border-border text-center">
                  <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
                  <p className="text-muted-foreground font-medium">Nenhuma mensagem de suporte recebida ainda.</p>
                </div>
              ) : (
                supportMessages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(msg => (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-card p-8 rounded-[2.5rem] shadow-sm border border-border relative overflow-hidden ${!msg.read ? "border-l-4 border-l-red-600" : ""}`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center border border-border">
                              <User className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div>
                              <h4 className="font-bold text-foreground">{msg.name}</h4>
                              <p className="text-xs text-muted-foreground">{msg.contact}</p>
                            </div>
                            {!msg.read && (
                              <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-black uppercase rounded-full">Nova</span>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Código do Ticket</p>
                            <p className="text-sm font-mono font-bold text-muted-foreground">{msg.ticketCode}</p>
                          </div>
                        </div>
                        <p className="text-foreground leading-relaxed whitespace-pre-wrap bg-muted p-6 rounded-2xl border border-border">{msg.message}</p>
                        
                        {msg.responses && msg.responses.length > 0 && (
                          <div className="mt-6 space-y-4">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Histórico de Conversa</p>
                            {msg.responses.map(resp => (
                              <div 
                                key={resp.id} 
                                className={`p-4 rounded-2xl border ${
                                  resp.sender === 'customer' 
                                    ? "bg-muted border-border ml-0 mr-8" 
                                    : "bg-red-500/10 border-red-500/20 ml-8 mr-0"
                                }`}
                              >
                                <div className="flex justify-between items-start mb-1">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                    {resp.sender === 'customer' ? 'Cliente' : 'Admin'}
                                  </span>
                                </div>
                                <p className="text-sm text-foreground">{resp.text}</p>
                                {resp.attachment && (
                                  <div className="mt-2 p-2 bg-background/50 rounded-xl border border-border flex items-center space-x-2">
                                    <Paperclip className="w-3 h-3 text-red-600" />
                                    <a 
                                      href={resp.attachment} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-[10px] text-red-600 hover:underline truncate"
                                    >
                                      Ver Anexo
                                    </a>
                                  </div>
                                )}
                                <p className="text-[10px] text-muted-foreground mt-2">{new Date(resp.createdAt).toLocaleString()}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        <p className="text-[10px] text-muted-foreground mt-6">{new Date(msg.createdAt).toLocaleString('pt-PT')}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => setRespondingMessage(msg)}
                          className="p-3 bg-blue-500/10 text-blue-600 rounded-xl hover:bg-blue-500/20 transition-all"
                          title="Responder no Site"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                        {!msg.read && (
                          <button 
                            onClick={async () => {
                              await api.updateSupportMessage(msg.id, { read: true });
                              fetchData();
                            }}
                            className="p-3 bg-green-500/10 text-green-600 rounded-xl hover:bg-green-500/20 transition-all"
                            title="Marcar como lida"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        )}
                        <button 
                          onClick={async () => {
                            if (confirm("Eliminar esta mensagem?")) {
                              await api.deleteSupportMessage(msg.id);
                              fetchData();
                            }
                          }}
                          className="p-3 bg-red-500/10 text-red-600 rounded-xl hover:bg-red-500/20 transition-all"
                          title="Eliminar mensagem"
                        >
                          <Trash className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        )}

        <AnimatePresence>
          {respondingMessage && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-border"
              >
                <div className="p-8 border-b border-border flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Responder a {respondingMessage.name}</h3>
                    <p className="text-xs text-muted-foreground">Ticket: {respondingMessage.ticketCode}</p>
                  </div>
                  <button onClick={() => setRespondingMessage(null)} className="p-2 hover:bg-muted rounded-full transition-colors">
                    <X className="w-6 h-6 text-muted-foreground" />
                  </button>
                </div>
                
                <div className="p-8 space-y-6">
                  <div className="bg-muted p-6 rounded-2xl border border-border">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Mensagem Original</p>
                    <p className="text-sm text-foreground italic">"{respondingMessage.message}"</p>
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-4 pr-2">
                    {respondingMessage.responses?.length ? (
                      respondingMessage.responses.map(resp => (
                        <div 
                          key={resp.id} 
                          className={`p-4 rounded-2xl border ${
                            resp.sender === 'customer' 
                              ? "bg-red-500/5 border-red-500/10 ml-0 mr-8" 
                              : "bg-muted border-border ml-8 mr-0"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                              {resp.sender === 'customer' ? 'Cliente' : 'Admin'}
                            </span>
                          </div>
                          <p className="text-sm text-foreground">{resp.text}</p>
                          {resp.attachment && (
                            <div className="mt-2 p-2 bg-background/50 rounded-xl border border-border flex items-center space-x-2">
                              <Paperclip className="w-3 h-3 text-red-600" />
                              <a 
                                href={resp.attachment} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-[10px] text-red-600 hover:underline truncate"
                              >
                                Ver Anexo
                              </a>
                            </div>
                          )}
                          <p className="text-[10px] text-muted-foreground mt-2">
                            {new Date(resp.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground text-sm py-4 italic">Nenhuma resposta enviada ainda.</p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <textarea 
                      className="w-full px-6 py-4 bg-muted border border-border rounded-2xl outline-none focus:border-red-600 transition-all resize-none h-32 text-foreground"
                      placeholder="Escreva a sua resposta aqui..."
                      value={responseMessage}
                      onChange={e => setResponseMessage(e.target.value)}
                    />
                    <button 
                      disabled={isSending || !responseMessage.trim()}
                      onClick={async () => {
                        setIsSending(true);
                        try {
                          const updatedResponses = [
                            ...(respondingMessage.responses || []),
                            {
                              id: Date.now().toString(),
                              text: responseMessage,
                              createdAt: new Date().toISOString(),
                              sender: "admin" as const
                            }
                          ];
                          await api.updateSupportMessage(respondingMessage.id, { 
                            responses: updatedResponses,
                            read: true 
                          });
                          setResponseMessage("");
                          setRespondingMessage(null);
                          fetchData();
                        } catch (error) {
                          console.error("Error sending response:", error);
                        } finally {
                          setIsSending(false);
                        }
                      }}
                      className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {isSending ? (
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Enviar Resposta</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {activeTab === "gallery" && (
          <div className="space-y-6 md:space-y-8">
            <div className="bg-card p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-border max-w-2xl">
              <h3 className="text-lg md:text-xl font-bold text-foreground mb-6">Adicionar Novo Trabalho</h3>
              <form className="space-y-4" onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const title = (form.elements.namedItem("title") as HTMLInputElement).value;
                const fileInput = form.elements.namedItem("image") as HTMLInputElement;
                const urlInput = form.elements.namedItem("url") as HTMLInputElement;
                
                let imageUrl = urlInput.value;
                
                if (fileInput.files && fileInput.files[0]) {
                  const uploadRes = await api.uploadImage(fileInput.files[0]);
                  imageUrl = uploadRes.url;
                }

                if (!imageUrl) {
                  alert("Por favor, carregue uma imagem ou insira um URL.");
                  return;
                }

                await api.addGalleryItem({ url: imageUrl, title });
                form.reset();
                fetchData();
              }}>
                <div className="space-y-4">
                  <input name="title" placeholder="Título do Trabalho" required className="w-full px-4 py-3 bg-muted border border-border rounded-xl outline-none text-sm md:text-base text-foreground" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Carregar Ficheiro</label>
                      <input name="image" type="file" accept="image/*" className="w-full px-4 py-2 bg-muted border border-border rounded-xl outline-none text-xs md:text-sm text-foreground" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Ou URL da Imagem</label>
                      <input name="url" placeholder="https://..." className="w-full px-4 py-3 bg-muted border border-border rounded-xl outline-none text-xs md:text-sm text-foreground" />
                    </div>
                  </div>
                </div>
                <button type="submit" className="w-full py-3 md:py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all flex items-center justify-center space-x-2 text-sm md:text-base">
                  <Plus className="w-5 h-5" />
                  <span>Adicionar à Galeria</span>
                </button>
              </form>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {settings.gallery?.map(item => (
                <div key={item.id} className="bg-card rounded-2xl md:rounded-[2rem] shadow-sm border border-border overflow-hidden group relative">
                  <img src={item.url} alt={item.title} className="w-full h-32 md:h-48 object-cover" referrerPolicy="no-referrer" />
                  <div className="p-3 md:p-4">
                    <p className="font-bold text-foreground truncate text-xs md:text-sm">{item.title}</p>
                  </div>
                  <button 
                    onClick={async () => {
                      if(confirm("Eliminar este trabalho?")) {
                        await api.deleteGalleryItem(item.id);
                        fetchData();
                      }
                    }}
                    className="absolute top-2 right-2 p-1.5 md:p-2 bg-red-600 text-white rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                  >
                    <Trash className="w-3 h-3 md:w-4 md:h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="bg-card p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-border max-w-xl">
            <form className="space-y-6" onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const email = (form.elements.namedItem("email") as HTMLInputElement).value;
              const password = (form.elements.namedItem("password") as HTMLInputElement).value;
              const res = await api.updateAdminProfile({ email, password, currentEmail: user?.email });
              if (res.success) {
                alert("Perfil atualizado com sucesso!");
                setUser(res.user);
              }
            }}>
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">Email do Administrador</label>
                <input 
                  name="email"
                  type="email" 
                  defaultValue={user?.email}
                  className="w-full px-4 py-3 md:px-5 md:py-4 bg-muted border border-border rounded-xl md:rounded-2xl outline-none text-sm md:text-base text-foreground"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">Nova Palavra-passe</label>
                <input 
                  name="password"
                  type="password" 
                  placeholder="Deixe em branco para manter a atual"
                  className="w-full px-4 py-3 md:px-5 md:py-4 bg-muted border border-border rounded-xl md:rounded-2xl outline-none text-sm md:text-base text-foreground"
                />
              </div>
              <button type="submit" className="w-full py-4 md:py-5 bg-foreground text-background rounded-xl md:rounded-2xl font-bold text-base md:text-lg hover:bg-foreground/90 transition-all">
                Atualizar Perfil
              </button>
            </form>
          </div>
        )}

        {activeTab === "settings" && settings && (
          <div className="bg-card p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-border max-w-4xl">
            <form className="space-y-6 md:space-y-8" onSubmit={async (e) => {
              e.preventDefault();
              await api.saveSettings(settings);
              alert("Configurações guardadas!");
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Nome da Gráfica</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 md:px-5 md:py-4 bg-muted border border-border rounded-xl md:rounded-2xl outline-none text-sm md:text-base text-foreground"
                    value={settings.logo}
                    onChange={e => setSettings({...settings, logo: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Slogan</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 md:px-5 md:py-4 bg-muted border border-border rounded-xl md:rounded-2xl outline-none text-sm md:text-base text-foreground"
                    value={settings.slogan}
                    onChange={e => setSettings({...settings, slogan: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">WhatsApp</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 md:px-5 md:py-4 bg-muted border border-border rounded-xl md:rounded-2xl outline-none text-sm md:text-base text-foreground"
                    value={settings.whatsapp}
                    onChange={e => setSettings({...settings, whatsapp: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Telefone</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 md:px-5 md:py-4 bg-muted border border-border rounded-xl md:rounded-2xl outline-none text-sm md:text-base text-foreground"
                    value={settings.phone}
                    onChange={e => setSettings({...settings, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Facebook</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 md:px-5 md:py-4 bg-muted border border-border rounded-xl md:rounded-2xl outline-none text-sm md:text-base text-foreground"
                    value={settings.facebook}
                    onChange={e => setSettings({...settings, facebook: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Instagram</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 md:px-5 md:py-4 bg-muted border border-border rounded-xl md:rounded-2xl outline-none text-sm md:text-base text-foreground"
                    value={settings.instagram}
                    onChange={e => setSettings({...settings, instagram: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">TikTok</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 md:px-5 md:py-4 bg-muted border border-border rounded-xl md:rounded-2xl outline-none text-sm md:text-base text-foreground"
                    value={settings.tiktok}
                    onChange={e => setSettings({...settings, tiktok: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">LinkedIn</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 md:px-5 md:py-4 bg-muted border border-border rounded-xl md:rounded-2xl outline-none text-sm md:text-base text-foreground"
                    value={settings.linkedin}
                    onChange={e => setSettings({...settings, linkedin: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Twitter (X)</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 md:px-5 md:py-4 bg-muted border border-border rounded-xl md:rounded-2xl outline-none text-sm md:text-base text-foreground"
                    value={settings.twitter}
                    onChange={e => setSettings({...settings, twitter: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Ebook da Empresa (PDF)</label>
                  <div className="flex items-center space-x-4">
                    <input 
                      type="file" 
                      accept=".pdf"
                      onChange={async (e) => {
                        if (e.target.files && e.target.files[0]) {
                          const res = await api.uploadFile(e.target.files[0]);
                          setSettings({...settings, ebookUrl: res.url});
                        }
                      }}
                      className="flex-1 px-4 py-3 bg-muted border border-border rounded-xl outline-none text-xs text-foreground"
                    />
                    {settings.ebookUrl && (
                      <a href={settings.ebookUrl} target="_blank" rel="noreferrer" className="text-red-600 font-bold text-xs underline">Ver Atual</a>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">Mensagem WhatsApp</label>
                <textarea 
                  rows={4}
                  className="w-full px-4 py-3 md:px-5 md:py-4 bg-muted border border-border rounded-xl md:rounded-2xl outline-none text-sm md:text-base text-foreground"
                  value={settings.whatsappMessage}
                  onChange={e => setSettings({...settings, whatsappMessage: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">Dias e Horários de Entrega</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 md:px-5 md:py-4 bg-muted border border-border rounded-xl md:rounded-2xl outline-none text-sm md:text-base text-foreground"
                  value={settings.deliveryDays}
                  onChange={e => setSettings({...settings, deliveryDays: e.target.value})}
                  placeholder="Ex: Segunda a Sexta, das 09h às 18h"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground mb-4">Dias de Entrega Habilitados</label>
                <div className="flex flex-wrap gap-3">
                  {["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"].map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        const current = settings.enabledDeliveryDays || [];
                        const next = current.includes(day) 
                          ? current.filter(d => d !== day)
                          : [...current, day];
                        setSettings({...settings, enabledDeliveryDays: next});
                      }}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                        (settings.enabledDeliveryDays || []).includes(day)
                          ? "bg-red-600 text-white border-red-600"
                          : "bg-muted text-muted-foreground border-border hover:border-red-200"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-border">
                <h4 className="text-lg font-bold text-foreground mb-6">Comissões Globais (Parceiros/Afiliados)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-2">Comissão Padrão (Kz por folha / %)</label>
                    <input 
                      type="number" 
                      className="w-full px-4 py-3 md:px-5 md:py-4 bg-muted border border-border rounded-xl md:rounded-2xl outline-none text-sm md:text-base text-foreground"
                      value={settings.defaultCommission}
                      onChange={e => setSettings({...settings, defaultCommission: parseInt(e.target.value)})}
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={async () => {
                      if (confirm(`Deseja aplicar a comissão de ${settings.defaultCommission} a TODOS os parceiros e afiliados existentes?`)) {
                        await api.updateAllCommissions(settings.defaultCommission);
                        alert("Comissões atualizadas para todos!");
                        fetchData();
                      }
                    }}
                    className="py-4 md:py-5 bg-foreground text-background rounded-xl md:rounded-2xl font-bold text-sm hover:bg-foreground/90 transition-all flex items-center justify-center space-x-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Aplicar a Todos os Parceiros/Afiliados</span>
                  </button>
                </div>
                <p className="mt-4 text-xs text-muted-foreground italic">
                  * Esta alteração define o valor padrão para novos registos e, ao clicar no botão acima, atualiza retroativamente todos os registos atuais.
                </p>
              </div>

              <div className="pt-8 border-t border-border space-y-8">
                <h4 className="text-lg font-bold text-foreground mb-6">Conteúdo Institucional</h4>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Termos de Serviço</label>
                  <textarea 
                    rows={6}
                    className="w-full px-4 py-3 bg-muted border border-border rounded-xl outline-none text-sm text-foreground"
                    value={settings.terms || ""}
                    onChange={e => setSettings({...settings, terms: e.target.value})}
                    placeholder="Escreva os termos de serviço aqui..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Política de Privacidade</label>
                  <textarea 
                    rows={6}
                    className="w-full px-4 py-3 bg-muted border border-border rounded-xl outline-none text-sm text-foreground"
                    value={settings.privacy || ""}
                    onChange={e => setSettings({...settings, privacy: e.target.value})}
                    placeholder="Escreva a política de privacidade aqui..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Como Funciona</label>
                  <textarea 
                    rows={6}
                    className="w-full px-4 py-3 bg-muted border border-border rounded-xl outline-none text-sm text-foreground"
                    value={settings.howItWorks || ""}
                    onChange={e => setSettings({...settings, howItWorks: e.target.value})}
                    placeholder="Explique como o site funciona..."
                  />
                </div>
              </div>

              <button type="submit" className="w-full md:w-auto px-10 py-4 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition-all text-sm md:text-base">Guardar Alterações</button>
            </form>
          </div>
        )}

        {activeTab === "prices" && prices && (
          <div className="bg-card p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-border max-w-4xl">
            <div className="flex justify-between items-center mb-8 border-b border-border pb-4">
              <h3 className="text-xl font-bold text-foreground">Gestão de Serviços</h3>
              <button 
                onClick={() => {
                  const newService: ServicePrice = {
                    id: Date.now().toString(),
                    name: "Novo Serviço",
                    description: "",
                    single: 0,
                    promo: { pages: 0, price: 0 },
                    active: true
                  };
                  setPrices([...prices, newService]);
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Serviço</span>
              </button>
            </div>

            <form className="space-y-8 md:space-y-12" onSubmit={async (e) => {
              e.preventDefault();
              await api.savePrices(prices);
              alert("Preços atualizados!");
            }}>
              <div className="space-y-8">
                {prices.map((service, index) => (
                  <div key={service.id} className="p-6 bg-muted rounded-3xl border border-border relative group">
                    <button 
                      type="button"
                      onClick={() => {
                        if (confirm(`Eliminar o serviço "${service.name}"?`)) {
                          setPrices(prices.filter(p => p.id !== service.id));
                        }
                      }}
                      className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-red-600 transition-colors"
                    >
                      <Trash className="w-5 h-5" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-black text-muted-foreground uppercase tracking-widest mb-2">Nome do Serviço</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-3 bg-card border border-border rounded-xl outline-none font-bold text-foreground"
                          value={service.name}
                          onChange={e => {
                            const newPrices = [...prices];
                            newPrices[index].name = e.target.value;
                            setPrices(newPrices);
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-muted-foreground uppercase tracking-widest mb-2">Estado</label>
                        <button
                          type="button"
                          onClick={() => {
                            const newPrices = [...prices];
                            newPrices[index].active = !newPrices[index].active;
                            setPrices(newPrices);
                          }}
                          className={`w-full px-4 py-3 rounded-xl font-bold transition-all border ${
                            service.active 
                              ? "bg-green-500/10 text-green-600 border-green-500/20" 
                              : "bg-muted text-muted-foreground border-border"
                          }`}
                        >
                          {service.active ? "Ativo (Visível)" : "Inativo (Oculto)"}
                        </button>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-xs font-black text-muted-foreground uppercase tracking-widest mb-2">Descrição do Serviço</label>
                      <textarea 
                        className="w-full px-4 py-3 bg-card border border-border rounded-xl outline-none min-h-[80px] text-foreground"
                        placeholder="Descreva o que este serviço inclui..."
                        value={service.description || ""}
                        onChange={e => {
                          const newPrices = [...prices];
                          newPrices[index].description = e.target.value;
                          setPrices(newPrices);
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div>
                        <label className="block text-xs font-black text-muted-foreground uppercase tracking-widest mb-2">Preço Unitário (Kz)</label>
                        <input 
                          type="number" 
                          className="w-full px-4 py-3 bg-card border border-border rounded-xl outline-none font-bold text-foreground"
                          value={service.single}
                          onChange={e => {
                            const newPrices = [...prices];
                            newPrices[index].single = parseInt(e.target.value) || 0;
                            setPrices(newPrices);
                          }}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black text-muted-foreground uppercase tracking-widest mb-2">Páginas para Promoção</label>
                        <input 
                          type="number" 
                          className="w-full px-4 py-3 bg-card border border-border rounded-xl outline-none text-foreground"
                          value={service.promo.pages}
                          onChange={e => {
                            const newPrices = [...prices];
                            newPrices[index].promo.pages = parseInt(e.target.value) || 0;
                            setPrices(newPrices);
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-muted-foreground uppercase tracking-widest mb-2">Preço da Promoção (Kz)</label>
                        <input 
                          type="number" 
                          className="w-full px-4 py-3 bg-card border border-border rounded-xl outline-none text-foreground"
                          value={service.promo.price}
                          onChange={e => {
                            const newPrices = [...prices];
                            newPrices[index].promo.price = parseInt(e.target.value) || 0;
                            setPrices(newPrices);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {prices.length > 0 && (
                <button type="submit" className="w-full md:w-auto px-10 py-4 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition-all text-sm md:text-base shadow-lg shadow-red-600/20">
                  Guardar Todas as Alterações
                </button>
              )}
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

const TrackingPage = ({ settings, prices }: { settings: Settings, prices: ServicePrice[] }) => {
  const [code, setCode] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [supportMessage, setSupportMessage] = useState<SupportMessage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [attachment, setAttachment] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Order>>({ 
    customerName: "", 
    whatsapp: "", 
    address: "", 
    deliveryType: "pickup",
    items: [],
    totalPrice: 0
  });

  const calculateItemPrice = (serviceId: string, pages: number) => {
    const service = prices.find(p => p.id === serviceId);
    if (!service) return 0;

    const single = service.single || 0;
    const promoPrice = service.promo?.price || 0;
    const promoPages = service.promo?.pages || 1;

    let total = 0;
    if (promoPages > 1) {
      const numPromos = Math.floor(pages / promoPages);
      const remainder = pages % promoPages;
      total = numPromos * promoPrice;
      if (remainder > 0) {
        const remainderCost = remainder * single;
        total += Math.min(remainderCost, promoPrice);
      }
    } else {
      total = pages * single;
    }
    return total;
  };

  const updateEditItem = (index: number, updates: Partial<OrderItem>) => {
    if (!editData.items) return;
    const newItems = [...editData.items];
    newItems[index] = { ...newItems[index], ...updates };
    
    if (updates.pages !== undefined || updates.serviceId !== undefined) {
      const item = newItems[index];
      const service = prices?.find(p => p.id === item.serviceId);
      if (service) {
        item.serviceName = service.name;
        item.type = service.id;
        item.price = calculateItemPrice(item.serviceId, item.pages);
      }
    }
    
    const newTotal = newItems.reduce((sum, item) => sum + item.price, 0);
    setEditData({ ...editData, items: newItems, totalPrice: newTotal });
  };

  const removeEditItem = (index: number) => {
    if (!editData.items) return;
    const newItems = editData.items.filter((_, i) => i !== index);
    const newTotal = newItems.reduce((sum, item) => sum + item.price, 0);
    setEditData({ ...editData, items: newItems, totalPrice: newTotal });
  };

  const addEditItem = (serviceId: string) => {
    const service = prices.find(p => p.id === serviceId);
    if (!service) return;

    const newItem: OrderItem = {
      serviceId: service.id,
      serviceName: service.name,
      pages: 1,
      type: service.id,
      price: service.single
    };
    const newItems = [...(editData.items || []), newItem];
    const newTotal = newItems.reduce((sum, item) => sum + item.price, 0);
    setEditData({ ...editData, items: newItems, totalPrice: newTotal });
  };

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    
    setLoading(true);
    setError("");
    setOrder(null);
    setSupportMessage(null);
    
    try {
      const [orders, supportMessages]: [Order[], SupportMessage[]] = await Promise.all([
        api.getOrders(),
        api.getSupportMessages()
      ]);

      const foundOrder = orders.find(o => o.trackingCode?.toUpperCase() === code.toUpperCase());
      const foundSupport = supportMessages.find(m => m.ticketCode?.toUpperCase() === code.toUpperCase());
      
      if (foundOrder) {
        setOrder(foundOrder);
        let initialItems = foundOrder.items || [];
        if (initialItems.length === 0 && (foundOrder as any).serviceType) {
          const service = prices.find(p => p.id === (foundOrder as any).type);
          initialItems = [{
            serviceId: (foundOrder as any).type || "bw",
            serviceName: service ? service.name : ((foundOrder as any).serviceType === "print" ? "Impressão" : "Cópia"),
            pages: (foundOrder as any).pages || 0,
            type: (foundOrder as any).type || "bw",
            price: foundOrder.totalPrice
          }];
        }
        setEditData({
          customerName: foundOrder.customerName,
          whatsapp: foundOrder.whatsapp,
          address: foundOrder.address,
          deliveryType: foundOrder.deliveryType,
          items: initialItems,
          totalPrice: foundOrder.totalPrice
        });
      } else if (foundSupport) {
        setSupportMessage(foundSupport);
      } else {
        setError("Não encontramos nenhum pedido ou ticket com este código.");
      }
    } catch (err) {
      console.error("Error searching:", err);
      setError("Erro ao procurar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() && !attachment) return;

    try {
      if (order) {
        const message = {
          id: Date.now().toString(),
          text: newMessage,
          createdAt: new Date().toISOString(),
          sender: "customer" as const,
          attachment: attachment || undefined
        };
        const updated = await api.updateOrder(order.id, {
          adminMessages: [...(order.adminMessages || []), message]
        });
        setOrder(updated);
      } else if (supportMessage) {
        const response = {
          id: Date.now().toString(),
          text: newMessage,
          createdAt: new Date().toISOString(),
          sender: "customer" as const,
          attachment: attachment || undefined
        };
        const updated = await api.updateSupportMessage(supportMessage.id, {
          responses: [...(supportMessage.responses || []), response]
        });
        setSupportMessage(updated);
      }
      setNewMessage("");
      setAttachment(null);
    } catch (err) {
      alert("Erro ao enviar mensagem.");
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const res = await api.uploadFile(file);
      setAttachment(res.url);
    } catch (err) {
      alert("Erro ao carregar ficheiro.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    try {
      await api.deleteOrder(order.id);
      setOrder(null);
      setCode("");
      setSuccessMessage("Pedido cancelado com sucesso.");
      setShowCancelConfirm(false);
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      setError("Erro ao cancelar pedido.");
    }
  };

  const handleConfirmReceipt = async () => {
    if (!order) return;
    try {
      const updated = await api.updateOrder(order.id, { status: "Entregue" });
      setOrder(updated);
      setSuccessMessage("Recebimento confirmado! Obrigado por escolher a nossa gráfica.");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      setError("Erro ao confirmar recebimento.");
    }
  };

  const handleUpdateOrder = async (e: FormEvent) => {
    e.preventDefault();
    if (!order) return;

    try {
      const updated = await api.updateOrder(order.id, editData);
      setOrder(updated);
      setIsEditing(false);
      setSuccessMessage("Pedido atualizado com sucesso.");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      setError("Erro ao atualizar pedido.");
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4 tracking-tighter">Rastrear Pedido ou Ticket</h1>
          <p className="text-muted-foreground">Insira o seu código de rastreio ou ticket para ver o estado e conversar com o suporte.</p>
        </div>

        <div className="bg-card rounded-[2.5rem] shadow-xl border border-border p-8 md:p-12">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-12">
            <input 
              type="text" 
              placeholder="Ex: AB1234"
              className="flex-1 px-8 py-5 bg-muted border border-border rounded-2xl outline-none focus:border-red-600 transition-all text-xl font-bold uppercase tracking-widest text-foreground"
              value={code}
              onChange={e => setCode(e.target.value)}
            />
            <button 
              disabled={loading}
              type="submit"
              className="px-10 py-5 bg-red-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all flex items-center justify-center space-x-3"
            >
              {loading ? (
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <Search className="w-6 h-6" />
                  <span>Procurar</span>
                </>
              )}
            </button>
          </form>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-6 bg-red-500/10 border border-red-500/20 rounded-3xl text-red-600 font-medium text-center"
              >
                {error}
              </motion.div>
            )}

            {successMessage && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-6 bg-green-500/10 border border-green-500/20 rounded-3xl text-green-600 font-medium text-center"
              >
                {successMessage}
              </motion.div>
            )}

            {order && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                {isEditing ? (
                  <form onSubmit={handleUpdateOrder} className="space-y-8 bg-muted/30 p-6 md:p-10 rounded-[2.5rem] border border-border">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-black text-foreground tracking-tighter">Editar Pedido</h3>
                      <button type="button" onClick={() => setIsEditing(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                        <X className="w-6 h-6 text-muted-foreground" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Nome do Cliente</label>
                        <input 
                          type="text" 
                          className="w-full px-5 py-4 bg-card border border-border rounded-2xl outline-none focus:border-red-600 transition-all text-sm text-foreground"
                          value={editData.customerName}
                          onChange={e => setEditData({...editData, customerName: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">WhatsApp</label>
                        <input 
                          type="text" 
                          className="w-full px-5 py-4 bg-card border border-border rounded-2xl outline-none focus:border-red-600 transition-all text-sm text-foreground"
                          value={editData.whatsapp}
                          onChange={e => setEditData({...editData, whatsapp: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-foreground uppercase text-xs tracking-widest">Serviços e Quantidades</h4>
                        <div className="flex items-center space-x-2">
                          <select 
                            className="px-3 py-2 bg-card border border-border rounded-xl text-xs font-bold text-foreground outline-none focus:border-red-600"
                            onChange={(e) => {
                              if (e.target.value) {
                                addEditItem(e.target.value);
                                e.target.value = "";
                              }
                            }}
                            defaultValue=""
                          >
                            <option value="" disabled>Adicionar Serviço...</option>
                            {prices.filter(p => p.active).map(p => (
                              <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {editData.items?.map((item, idx) => (
                          <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-card rounded-2xl border border-border gap-4">
                            <div className="flex-1">
                              <select 
                                value={item.serviceId}
                                onChange={(e) => updateEditItem(idx, { serviceId: e.target.value })}
                                className="font-bold text-foreground bg-transparent border-none outline-none cursor-pointer hover:text-red-600 transition-colors"
                              >
                                {prices.filter(p => p.active).map(p => (
                                  <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                              </select>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{item.price} Kz</p>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Págs:</label>
                                <input 
                                  type="number" 
                                  min="1"
                                  className="w-16 px-2 py-1 bg-muted border border-border rounded-lg text-sm font-bold text-foreground outline-none focus:border-red-600"
                                  value={item.pages}
                                  onChange={e => updateEditItem(idx, { pages: parseInt(e.target.value) || 1 })}
                                />
                              </div>
                              <button 
                                type="button"
                                onClick={() => removeEditItem(idx)}
                                className="p-2 text-red-600 hover:bg-red-500/10 rounded-xl transition-colors"
                              >
                                <Trash className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-bold text-foreground uppercase text-xs tracking-widest">Entrega</h4>
                      <div className="flex bg-muted p-1 rounded-2xl border border-border">
                        <button 
                          type="button"
                          onClick={() => setEditData({...editData, deliveryType: "delivery"})}
                          className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all ${editData.deliveryType === "delivery" ? "bg-card text-red-600 shadow-sm" : "text-muted-foreground"}`}
                        >
                          Entrega ao Domicílio
                        </button>
                        <button 
                          type="button"
                          onClick={() => setEditData({...editData, deliveryType: "pickup"})}
                          className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all ${editData.deliveryType === "pickup" ? "bg-card text-red-600 shadow-sm" : "text-muted-foreground"}`}
                        >
                          Levantar na Loja
                        </button>
                      </div>
                      {editData.deliveryType === "delivery" && (
                        <input 
                          type="text" 
                          placeholder="Endereço de Entrega"
                          className="w-full px-5 py-4 bg-card border border-border rounded-2xl outline-none focus:border-red-600 transition-all text-sm text-foreground"
                          value={editData.address || ""}
                          onChange={e => setEditData({...editData, address: e.target.value})}
                        />
                      )}
                    </div>

                    <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Novo Total</p>
                        <p className="text-3xl font-black text-red-600 tracking-tighter">{editData.totalPrice} Kz</p>
                      </div>
                      <div className="flex gap-3 w-full sm:w-auto">
                        <button 
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="flex-1 sm:flex-none px-8 py-4 bg-muted text-foreground rounded-2xl font-bold hover:bg-muted/80 transition-all"
                        >
                          Cancelar
                        </button>
                        <button 
                          type="submit"
                          className="flex-1 sm:flex-none px-8 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
                        >
                          Guardar Alterações
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-border">
                    <div>
                      <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Cliente</p>
                      <p className="text-2xl font-bold text-foreground">{order.customerName}</p>
                      <p className="text-sm text-muted-foreground">{order.whatsapp}</p>
                    </div>
                    <div className="md:text-right">
                      <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Estado do Pedido</p>
                      <span className={`inline-flex px-6 py-2 rounded-full text-sm font-bold ${
                        order.status === "Pronto" ? "bg-green-500/10 text-green-600" :
                        order.status === "Pedido Recebido" ? "bg-blue-500/10 text-blue-600" :
                        order.status === "Em Andamento" ? "bg-amber-500/10 text-amber-600" :
                        order.status === "Recusado" ? "bg-red-500/10 text-red-600" :
                        order.status === "Entregue" ? "bg-emerald-500/10 text-emerald-600" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div>
                      <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-2">Serviço</p>
                      <p className="text-foreground font-bold">
                        {order.items && order.items.length > 0 
                          ? order.items.map(i => i.serviceName).join(", ") 
                          : ((order as any).serviceType === "print" ? "Impressão" : "Cópia")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.items && order.items.length > 0 
                          ? order.items.reduce((sum, i) => sum + i.pages, 0) 
                          : (order as any).pages || 0} páginas total
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-2">Entrega</p>
                      <p className="text-foreground font-bold">{order.deliveryType === "delivery" ? "Entrega ao Domicílio" : "Levantamento na Loja"}</p>
                      <p className="text-sm text-muted-foreground">{order.address || "Sem endereço"}</p>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div>
                      <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Total a Pagar</p>
                      <p className="text-3xl font-black text-red-600 tracking-tighter">{order.totalPrice} Kz</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                      <button 
                        onClick={() => generateOrderPDF(order, settings)}
                        className="px-8 py-4 bg-muted text-foreground rounded-2xl font-bold hover:bg-muted/80 transition-all flex items-center justify-center space-x-2"
                      >
                        <FileText className="w-5 h-5" />
                        <span>PDF</span>
                      </button>
                      {order.status === "Pronto" && (
                        <button 
                          onClick={handleConfirmReceipt}
                          className="px-8 py-4 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 transition-all flex items-center justify-center space-x-2"
                        >
                          <CheckCircle className="w-5 h-5" />
                          <span>Recebi o Pedido</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {order.status === "Pedido Recebido" && (
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="flex-1 px-6 py-4 bg-blue-600/10 text-blue-600 rounded-2xl font-bold hover:bg-blue-600/20 transition-all flex items-center justify-center space-x-2"
                      >
                        <Edit className="w-5 h-5" />
                        <span>Editar Dados</span>
                      </button>
                      <button 
                        onClick={() => setShowCancelConfirm(true)}
                        className="flex-1 px-6 py-4 bg-red-600/10 text-red-600 rounded-2xl font-bold hover:bg-red-600/20 transition-all flex items-center justify-center space-x-2"
                      >
                        <Trash className="w-5 h-5" />
                        <span>Cancelar Pedido</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

                {/* Chat Interface for Order */}
                <div className="pt-12 border-t border-border">
                  <div className="flex items-center justify-between mb-8">
                    <h4 className="text-xl font-bold text-foreground flex items-center space-x-3">
                      <MessageCircle className="w-6 h-6 text-red-600" />
                      <span>Conversa sobre o Pedido</span>
                    </h4>
                  </div>

                  <div className="space-y-6 mb-8 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                    {/* Initial Order Message */}
                    <div className="flex justify-start">
                      <div className="max-w-[85%] bg-muted p-6 rounded-3xl rounded-tl-none border border-border">
                        <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-2">Sistema</p>
                        <p className="text-foreground">Pedido realizado com sucesso. Aguardando processamento.</p>
                        <p className="text-[10px] text-muted-foreground mt-4">{new Date(order.createdAt).toLocaleString()}</p>
                      </div>
                    </div>

                    {order.adminMessages?.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-6 rounded-3xl border ${
                          msg.sender === 'customer' 
                            ? 'bg-red-600 text-white rounded-tr-none border-red-600 shadow-lg shadow-red-600/20' 
                            : 'bg-muted text-foreground rounded-tl-none border-border'
                        }`}>
                          <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${msg.sender === 'customer' ? 'text-white/70' : 'text-muted-foreground'}`}>
                            {msg.sender === 'customer' ? 'Você' : 'Suporte'}
                          </p>
                          <p className="leading-relaxed">{msg.text}</p>
                          {msg.attachment && (
                            <div className="mt-4 pt-4 border-t border-white/20">
                              <a href={msg.attachment} target="_blank" rel="noreferrer" className={`inline-flex items-center space-x-2 text-xs font-bold ${msg.sender === 'customer' ? 'text-white hover:underline' : 'text-red-600 hover:underline'}`}>
                                <ImageIcon className="w-4 h-4" />
                                <span>Ver Anexo</span>
                              </a>
                            </div>
                          )}
                          <p className={`text-[10px] mt-4 ${msg.sender === 'customer' ? 'text-white/50' : 'text-muted-foreground'}`}>
                            {new Date(msg.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendMessage} className="space-y-4">
                    <div className="relative">
                      <textarea 
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        placeholder="Escreva a sua mensagem..."
                        className="w-full px-8 py-6 bg-muted border border-border rounded-[2rem] outline-none focus:border-red-600 transition-all text-foreground resize-none pr-32"
                        rows={3}
                      />
                      <div className="absolute right-4 bottom-4 flex items-center space-x-2">
                        <label className="p-3 bg-card border border-border rounded-xl cursor-pointer hover:bg-muted transition-colors">
                          <input 
                            type="file" 
                            className="hidden" 
                            onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                          />
                          {isUploading ? (
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-muted-foreground" />
                          )}
                        </label>
                        <button 
                          type="submit"
                          disabled={!newMessage.trim() && !attachment}
                          className="p-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all disabled:opacity-50"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    {attachment && (
                      <div className="flex items-center justify-between p-4 bg-red-600/5 border border-red-600/20 rounded-2xl">
                        <div className="flex items-center space-x-3">
                          <ImageIcon className="w-5 h-5 text-red-600" />
                          <span className="text-sm font-bold text-red-600">Ficheiro pronto para enviar</span>
                        </div>
                        <button onClick={() => setAttachment(null)} className="p-1 hover:bg-red-600/10 rounded-full">
                          <X className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    )}
                  </form>
                </div>

                <div className="pt-8 text-center border-t border-border">
                  <p className="text-sm text-muted-foreground mb-4">Precisa de ajuda com o seu pedido?</p>
                  <a 
                    href={`https://wa.me/${settings.whatsapp.replace(/\s/g, '')}?text=Olá, gostaria de informações sobre o meu pedido ${order.trackingCode}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-green-600 font-bold hover:underline"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Falar connosco no WhatsApp</span>
                  </a>
                </div>
              </motion.div>
            )}

            {supportMessage && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="p-8 bg-muted rounded-[2rem] border border-border">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Ticket de Suporte</p>
                      <h3 className="text-2xl font-bold text-foreground">{supportMessage.name}</h3>
                      <p className="text-sm text-muted-foreground">{supportMessage.contact}</p>
                    </div>
                    <span className="px-4 py-1 bg-blue-500/10 text-blue-600 rounded-full text-xs font-bold">
                      Ticket Ativo
                    </span>
                  </div>
                  <div className="bg-card p-6 rounded-2xl border border-border">
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-2">Mensagem Original</p>
                    <p className="text-foreground leading-relaxed">{supportMessage.message}</p>
                  </div>
                </div>

                {/* Chat Interface for Support */}
                <div className="pt-12 border-t border-border">
                  <div className="flex items-center justify-between mb-8">
                    <h4 className="text-xl font-bold text-foreground flex items-center space-x-3">
                      <MessageCircle className="w-6 h-6 text-red-600" />
                      <span>Mensagens e Respostas</span>
                    </h4>
                  </div>

                  <div className="space-y-6 mb-8 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                    {supportMessage.responses?.map((resp, idx) => (
                      <div key={idx} className={`flex ${resp.sender === 'customer' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-6 rounded-3xl border ${
                          resp.sender === 'customer' 
                            ? 'bg-red-600 text-white rounded-tr-none border-red-600 shadow-lg shadow-red-600/20' 
                            : 'bg-muted text-foreground rounded-tl-none border-border'
                        }`}>
                          <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${resp.sender === 'customer' ? 'text-white/70' : 'text-muted-foreground'}`}>
                            {resp.sender === 'customer' ? 'Você' : 'Suporte'}
                          </p>
                          <p className="leading-relaxed">{resp.text}</p>
                          {resp.attachment && (
                            <div className="mt-4 pt-4 border-t border-white/20">
                              <a href={resp.attachment} target="_blank" rel="noreferrer" className={`inline-flex items-center space-x-2 text-xs font-bold ${resp.sender === 'customer' ? 'text-white hover:underline' : 'text-red-600 hover:underline'}`}>
                                <ImageIcon className="w-4 h-4" />
                                <span>Ver Anexo</span>
                              </a>
                            </div>
                          )}
                          <p className={`text-[10px] mt-4 ${resp.sender === 'customer' ? 'text-white/50' : 'text-muted-foreground'}`}>
                            {new Date(resp.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendMessage} className="space-y-4">
                    <div className="relative">
                      <textarea 
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        placeholder="Escreva a sua resposta..."
                        className="w-full px-8 py-6 bg-muted border border-border rounded-[2rem] outline-none focus:border-red-600 transition-all text-foreground resize-none pr-32"
                        rows={3}
                      />
                      <div className="absolute right-4 bottom-4 flex items-center space-x-2">
                        <label className="p-3 bg-card border border-border rounded-xl cursor-pointer hover:bg-muted transition-colors">
                          <input 
                            type="file" 
                            className="hidden" 
                            onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                          />
                          {isUploading ? (
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-muted-foreground" />
                          )}
                        </label>
                        <button 
                          type="submit"
                          disabled={!newMessage.trim() && !attachment}
                          className="p-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all disabled:opacity-50"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    {attachment && (
                      <div className="flex items-center justify-between p-4 bg-red-600/5 border border-red-600/20 rounded-2xl">
                        <div className="flex items-center space-x-3">
                          <ImageIcon className="w-5 h-5 text-red-600" />
                          <span className="text-sm font-bold text-red-600">Ficheiro pronto para enviar</span>
                        </div>
                        <button onClick={() => setAttachment(null)} className="p-1 hover:bg-red-600/10 rounded-full">
                          <X className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [settings, setSettings] = useState<Settings | null>(null);
  const [prices, setPrices] = useState<ServicePrice[] | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [afiliados, setAfiliados] = useState<Afiliado[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [unreadSupportCount, setUnreadSupportCount] = useState(0);
  const [stats, setStats] = useState<Stats | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === "light" ? "dark" : "light");

  const fetchData = async () => {
    try {
      const [s, p, o, pt, af, g, sm, nw, st] = await Promise.all([
        api.getSettings().catch(() => DEFAULT_SETTINGS),
        api.getPrices().catch(() => DEFAULT_PRICES),
        api.getOrders().catch(() => []),
        api.getPartners().catch(() => []),
        api.getAfiliados().catch(() => []),
        api.getGallery().catch(() => []),
        api.getSupportMessages().catch(() => []),
        api.getNews().catch(() => []),
        api.getStats().catch(() => null)
      ]);
      setSettings(s || DEFAULT_SETTINGS);
      setPrices(p || DEFAULT_PRICES);
      setOrders(o || []);
      setPartners(pt || []);
      setAfiliados(af || []);
      setGallery(g || []);
      setSupportMessages(sm || []);
      setNews(nw || []);
      setStats(st);
      if (sm && Array.isArray(sm)) {
        setUnreadSupportCount(sm.filter((m: any) => !m.read).length);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Fallback to defaults if everything fails
      setSettings(DEFAULT_SETTINGS);
      setPrices(DEFAULT_PRICES);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    fetchData();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const addToCart = (service: ServicePrice) => {
    const newItem: OrderItem = {
      serviceId: service.id,
      serviceName: service.name,
      pages: 1,
      type: "bw",
      price: service.single
    };
    setCart([...cart, newItem]);
    setIsCartOpen(true);
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const updateCartItem = (index: number, updates: Partial<OrderItem>) => {
    const newCart = [...cart];
    newCart[index] = { ...newCart[index], ...updates };
    
    if (updates.pages !== undefined || updates.type !== undefined) {
      const item = newCart[index];
      const service = prices?.find(p => p.id === item.serviceId);
      if (service) {
        let total = 0;
        const pages = item.pages;
        const single = service.single || 0;
        const promoPrice = service.promo?.price || 0;
        const promoPages = service.promo?.pages || 1;

        if (promoPages > 1 && pages >= promoPages) {
          const numPromos = Math.floor(pages / promoPages);
          const remainder = pages % promoPages;
          total = numPromos * promoPrice;
          if (remainder > 0) {
            total += remainder * single;
          }
        } else {
          total = pages * single;
        }
        item.price = total;
      }
    }
    setCart(newCart);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  if (!settings || !prices) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full"
      />
    </div>
  );

  return (
    <Router>
      <div className="min-h-screen bg-background font-sans selection:bg-red-100 selection:text-red-600">
        <AnimatePresence>
          {isCartOpen && (
            <div className="fixed inset-0 z-[100] flex justify-end">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsCartOpen(false)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative w-full max-w-md bg-background h-full shadow-2xl flex flex-col border-l border-border"
              >
                <div className="p-6 border-b border-border flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <ShoppingCart className="w-6 h-6 text-red-600" />
                    <h2 className="text-xl font-bold text-foreground">Seu Carrinho</h2>
                  </div>
                  <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                  {cart.length === 0 ? (
                    <div className="text-center py-20">
                      <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
                      <p className="text-muted-foreground font-medium">O seu carrinho está vazio.</p>
                      <Link 
                        to="/servicos" 
                        onClick={() => setIsCartOpen(false)}
                        className="mt-6 inline-block text-red-600 font-bold hover:underline"
                      >
                        Ver Serviços
                      </Link>
                    </div>
                  ) : (
                    cart.map((item, index) => (
                      <div key={index} className="bg-muted p-5 rounded-2xl border border-border relative group">
                        <button 
                          onClick={() => removeFromCart(index)}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                        <h3 className="font-bold text-foreground mb-3">{item.serviceName}</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Páginas</label>
                            <input 
                              type="number" 
                              min="1"
                              value={item.pages}
                              onChange={(e) => updateCartItem(index, { pages: parseInt(e.target.value) || 1 })}
                              className="w-full px-3 py-2 bg-card border border-border rounded-xl text-sm font-bold text-foreground outline-none focus:border-red-600"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Preço</label>
                            <div className="px-3 py-2 bg-card border border-border rounded-xl text-sm font-bold text-red-600">
                              {item.price} Kz
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="p-6 border-t border-border bg-muted/30 space-y-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-muted-foreground font-medium">Subtotal</span>
                      <span className="text-2xl font-black text-foreground">{cartTotal} Kz</span>
                    </div>
                    <Link 
                      to="/#fazer-pedido"
                      onClick={() => setIsCartOpen(false)}
                      className="block w-full py-4 bg-red-600 text-white text-center rounded-2xl font-bold text-lg hover:bg-red-700 transition-all shadow-xl shadow-red-600/20"
                    >
                      Finalizar Pedido
                    </Link>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <Routes>
          <Route path="/admin/*" element={
            <AdminDashboard 
              settings={settings} 
              setSettings={setSettings} 
              prices={prices} 
              setPrices={setPrices} 
              orders={orders} 
              partners={partners} 
              afiliados={afiliados} 
              gallery={gallery}
              stats={stats}
              user={user}
              setUser={setUser}
              fetchData={fetchData}
              unreadSupportCount={unreadSupportCount}
              supportMessages={supportMessages}
              theme={theme}
              toggleTheme={toggleTheme}
              news={news}
            />
          } />
          <Route path="*" element={
            <>
              <AnimatePresence>
                {scrolled && (
                  <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="fixed bottom-8 right-8 z-40 md:hidden"
                  >
                    <a 
                      href="/#fazer-pedido"
                      className="flex items-center space-x-2 px-6 py-4 bg-red-600 text-white rounded-full font-black shadow-2xl shadow-red-600/40"
                    >
                      <Printer className="w-5 h-5" />
                      <span>Pedir Agora</span>
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
              <Navbar 
                settings={settings} 
                unreadSupportCount={unreadSupportCount} 
                scrolled={scrolled} 
                theme={theme} 
                toggleTheme={toggleTheme}
                cartCount={cart.length}
                onOpenCart={() => setIsCartOpen(true)}
              />
              <Routes>
                <Route path="/" element={
                  <>
                    <HomePage settings={settings} prices={prices} />
                    <OrderForm settings={settings} prices={prices} cart={cart} clearCart={() => setCart([])} />
                  </>
                } />
                <Route path="/servicos" element={<ServicesPage settings={settings} prices={prices} addToCart={addToCart} />} />
                <Route path="/rastrear" element={<TrackingPage settings={settings} prices={prices} />} />
                <Route path="/suporte" element={<SupportForm settings={settings} />} />
                <Route path="/termos" element={<TermsPage settings={settings} />} />
                <Route path="/privacidade" element={<PrivacyPage settings={settings} />} />
                <Route path="/como-funciona" element={<HowItWorksPage settings={settings} />} />
                <Route path="/noticias" element={<NewsPage news={news} />} />
              </Routes>
              <Footer settings={settings} />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}
