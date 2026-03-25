import { useState, useEffect, FormEvent } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
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
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Settings, Prices, Order, Partner, Afiliado, Stats } from "./types";

// --- API Helpers ---
const api = {
  getSettings: () => fetch("/api/settings").then(res => res.json()),
  saveSettings: (data: Partial<Settings>) => fetch("/api/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(res => res.json()),
  getPrices: () => fetch("/api/prices").then(res => res.json()),
  savePrices: (data: Prices) => fetch("/api/prices", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(res => res.json()),
  getOrders: () => fetch("/api/orders").then(res => res.json()),
  updateOrder: (id: number, data: Partial<Order>) => fetch(`/api/orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(res => res.json()),
  getPartners: () => fetch("/api/partners").then(res => res.json()),
  savePartner: (data: any) => fetch("/api/partners", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(res => res.json()),
  getAfiliados: () => fetch("/api/afiliados").then(res => res.json()),
  saveAfiliado: (data: any) => fetch("/api/afiliados", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(res => res.json()),
  updateAfiliado: (id: number, data: any) => fetch(`/api/afiliados/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(res => res.json()),
  updatePartner: (id: number, data: any) => fetch(`/api/partners/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(res => res.json()),
  getGallery: () => fetch("/api/gallery").then(res => res.json()),
  addGalleryItem: (data: { url: string, title: string }) => fetch("/api/gallery", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(res => res.json()),
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    return fetch("/api/upload", { method: "POST", body: formData }).then(res => res.json());
  },
  deleteGalleryItem: (id: number) => fetch(`/api/gallery/${id}`, { method: "DELETE" }).then(res => res.json()),
  updateAdminProfile: (data: any) => fetch("/api/admin/profile", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(res => res.json()),
  getStats: () => fetch("/api/stats").then(res => res.json()),
  login: (credentials: any) => fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(credentials) }).then(res => res.json()),
};

// --- Components ---

const Navbar = ({ settings }: { settings: Settings }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Printer className="w-8 h-8 text-red-600" />
            <span className="text-2xl font-bold tracking-tight text-gray-900">{settings.logo}</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-red-600 font-medium transition-colors">Início</Link>
            <Link to="/precos" className="text-gray-600 hover:text-red-600 font-medium transition-colors">Preços</Link>
            <Link to="/parcerias" className="text-gray-600 hover:text-red-600 font-medium transition-colors">Parcerias</Link>
            <Link to="/admin" className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-all">Painel Admin</Link>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-gray-600">
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-lg font-medium text-gray-900 border-b border-gray-50">Início</Link>
              <Link to="/precos" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-lg font-medium text-gray-900 border-b border-gray-50">Preços</Link>
              <Link to="/parcerias" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-lg font-medium text-gray-900 border-b border-gray-50">Parcerias</Link>
              <Link to="/admin" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-lg font-medium text-red-600">Painel Admin</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = ({ settings }: { settings: Settings }) => (
  <footer className="bg-gray-900 text-white pt-20 pb-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center space-x-2 mb-6">
            <Printer className="w-8 h-8 text-red-500" />
            <span className="text-2xl font-bold tracking-tight">{settings.logo}</span>
          </div>
          <p className="text-gray-400 max-w-sm mb-8">{settings.slogan}</p>
          <div className="flex space-x-4">
            <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-full hover:bg-red-600 transition-colors"><Facebook className="w-5 h-5" /></a>
            <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-full hover:bg-red-600 transition-colors"><Instagram className="w-5 h-5" /></a>
            <a href={settings.tiktok} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-full hover:bg-red-600 transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href={settings.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-full hover:bg-red-600 transition-colors"><Linkedin className="w-5 h-5" /></a>
            <a href={settings.twitter} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-full hover:bg-red-600 transition-colors"><Twitter className="w-5 h-5" /></a>
          </div>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-6">Contactos</h4>
          <ul className="space-y-4 text-gray-400">
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
          <ul className="space-y-4 text-gray-400">
            <li><Link to="/precos" className="hover:text-white transition-colors">Tabela de Preços</Link></li>
            <li><Link to="/parcerias" className="hover:text-white transition-colors">Seja um Parceiro</Link></li>
            <li><Link to="/admin" className="hover:text-white transition-colors">Área Administrativa</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} {settings.logo}. Todos os direitos reservados.</p>
      </div>
    </div>
  </footer>
);

const Home = ({ settings, prices }: { settings: Settings, prices: Prices }) => {
  const whatsappUrl = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(settings.whatsappMessage)}`;

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden bg-gray-950">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&q=80&w=1920" 
            alt="Printing" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/80 to-transparent" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
              {settings.logo} <br />
              <span className="text-red-600">Imprimimos por si.</span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed">
              {settings.slogan} Envie os seus documentos e receba-os no conforto da sua casa. Prático, rápido e profissional.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-3 px-8 py-4 bg-red-600 text-white rounded-full font-bold text-lg hover:bg-red-700 hover:scale-105 transition-all shadow-lg shadow-red-600/20"
              >
                <MessageCircle className="w-6 h-6" />
                <span>Enviar no WhatsApp</span>
              </a>
              <a 
                href={`tel:${settings.phone}`}
                className="flex items-center justify-center space-x-3 px-8 py-4 bg-white text-gray-900 rounded-full font-bold text-lg hover:bg-gray-100 hover:scale-105 transition-all shadow-lg"
              >
                <Phone className="w-6 h-6" />
                <span>Ligar Agora</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      {settings.gallery && settings.gallery.length > 0 && (
        <section className="py-24 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">A Nossa Galeria</h2>
                <p className="text-xl text-gray-500 max-w-xl">Veja alguns dos nossos trabalhos recentes e a qualidade das nossas impressões.</p>
              </div>
              <div className="flex space-x-2">
                <div className="w-12 h-1 bg-red-600 rounded-full" />
                <div className="w-4 h-1 bg-gray-200 rounded-full" />
                <div className="w-4 h-1 bg-gray-200 rounded-full" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {settings.gallery.map((item, idx) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative aspect-[4/3] overflow-hidden rounded-[2.5rem] bg-gray-100 shadow-xl shadow-gray-200/50"
                >
                  <img 
                    src={item.url} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                    <h3 className="text-xl font-bold text-white">{item.title}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How it Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Como Funciona</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">O nosso processo é simples e pensado na sua comodidade.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: <MessageCircle className="w-10 h-10" />, title: "1. Envie o Documento", desc: "Envie o seu ficheiro via WhatsApp com as especificações (preto e branco ou colorido)." },
              { icon: <Printer className="w-10 h-10" />, title: "2. Nós Imprimimos", desc: "A nossa equipa processa o seu pedido com a máxima qualidade e rapidez." },
              { icon: <Truck className="w-10 h-10" />, title: "3. Receba em Casa", desc: "Entregamos o seu documento no endereço indicado. O valor da deslocação é assumido pelo cliente." }
            ].map((step, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="p-8 bg-gray-50 rounded-3xl text-center border border-gray-100"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600 text-white rounded-2xl mb-8 shadow-xl shadow-red-600/20">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8 leading-tight">Porquê escolher a {settings.logo}?</h2>
              <div className="space-y-8">
                {[
                  { icon: <DollarSign />, title: "Preços Justos", desc: "Temos as melhores tarifas do mercado com descontos por quantidade." },
                  { icon: <ShieldCheck />, title: "Qualidade Garantida", desc: "Equipamento profissional para garantir nitidez em cada página." },
                  { icon: <Users />, title: "Parcerias Fortes", desc: "Sistema de comissões para escolas, professores e afiliados." }
                ].map((benefit, i) => (
                  <div key={i} className="flex space-x-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-white text-red-600 rounded-xl flex items-center justify-center shadow-sm">
                      {benefit.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h4>
                      <p className="text-gray-600">{benefit.desc}</p>
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
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl -ml-32 -mb-32" />
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 relative z-10">Pronto para imprimir?</h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto relative z-10">
              Não perca tempo em filas. Envie agora e receba em casa.
            </p>
            <div className="flex flex-wrap justify-center gap-6 relative z-10">
              <Link to="/precos" className="px-10 py-4 bg-white text-gray-900 rounded-full font-bold hover:bg-gray-100 transition-all flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span>Ver Preços</span>
              </Link>
              <Link to="/parcerias" className="px-10 py-4 bg-gray-800 text-white rounded-full font-bold hover:bg-gray-700 transition-all flex items-center space-x-2">
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

const PricesPage = ({ settings, prices }: { settings: Settings, prices: Prices }) => (
  <div className="pt-32 pb-24 bg-gray-50 min-h-screen">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">Tabela de Preços</h1>
        <p className="text-xl text-gray-600">Quanto mais páginas, mais desconto!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
        {/* PB */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-gray-100"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-8">
            <Printer className="w-8 h-8 text-gray-900" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Preto e Branco</h3>
          <div className="space-y-6">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
              <span className="text-gray-600">1 Página</span>
              <span className="text-2xl font-bold text-gray-900">{prices.bw.single} Kz</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-red-50 rounded-2xl border border-red-100">
              <div>
                <span className="block text-red-600 font-bold">PROMOÇÃO</span>
                <span className="text-gray-600">{prices.bw.promo.pages} Páginas</span>
              </div>
              <span className="text-2xl font-bold text-red-600">{prices.bw.promo.price} Kz</span>
            </div>
          </div>
        </motion.div>

        {/* Color */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-gray-100"
        >
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-8">
            <Printer className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Colorido</h3>
          <div className="space-y-6">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
              <span className="text-gray-600">1 Página</span>
              <span className="text-2xl font-bold text-gray-900">{prices.color.single} Kz</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-red-50 rounded-2xl border border-red-100">
              <div>
                <span className="block text-red-600 font-bold">PROMOÇÃO</span>
                <span className="text-gray-600">{prices.color.promo.pages} Páginas</span>
              </div>
              <span className="text-2xl font-bold text-red-600">{prices.color.promo.price} Kz</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto mb-16">
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-6">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Taxa de Entrega</h3>
              <p className="text-gray-500">O valor da deslocação é assumido pelo cliente.</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-gray-900">{settings.deliveryFee} Kz</span>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Valor Fixo</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-amber-50 border-l-4 border-amber-500 p-8 rounded-2xl flex items-start space-x-6">
        <AlertTriangle className="w-8 h-8 text-amber-500 flex-shrink-0" />
        <div>
          <h4 className="text-lg font-bold text-amber-900 mb-2">Aviso Importante</h4>
          <p className="text-amber-800 leading-relaxed">{settings.heavyImagesNotice}</p>
        </div>
      </div>
    </div>
  </div>
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
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-8 leading-tight">Ganhe dinheiro com a {settings.logo}</h1>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              Temos um sistema de comissões exclusivo para escolas, professores e afiliados. Ajude a sua comunidade a imprimir com facilidade e seja recompensado por isso.
            </p>
            
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Escolas e Professores</h4>
                  <p className="text-gray-600">Comissão de 15 Kz por folha impressa através do seu código.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-100 text-gray-900 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Share2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Sistema de Afiliados</h4>
                  <p className="text-gray-600">Ganhe 25% de comissão sobre o valor total dos pedidos indicados.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100 shadow-xl">
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Acesso Restrito</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                O registo de novos parceiros e afiliados é gerido exclusivamente pela nossa equipa administrativa. 
                Se deseja tornar-se um parceiro, por favor contacte-nos diretamente via WhatsApp ou telefone.
              </p>
              <div className="flex flex-col space-y-4">
                <a 
                  href={`https://wa.me/${settings.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Contactar via WhatsApp</span>
                </a>
                <a 
                  href={`tel:${settings.phone}`}
                  className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all flex items-center justify-center space-x-2"
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

const AdminDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [activeTab, setActiveTab] = useState("stats");
  const [settings, setSettings] = useState<Settings | null>(null);
  const [prices, setPrices] = useState<Prices | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [afiliados, setAfiliados] = useState<Afiliado[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  const fetchData = async () => {
    const [s, p, o, pt, af, st] = await Promise.all([
      api.getSettings(),
      api.getPrices(),
      api.getOrders(),
      api.getPartners(),
      api.getAfiliados(),
      api.getStats()
    ]);
    setSettings(s);
    setPrices(p);
    setOrders(o);
    setPartners(pt);
    setAfiliados(af);
    setStats(st);
  };

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
      <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md"
        >
          <div className="text-center mb-10">
            <Printer className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900">Admin Login</h2>
            <p className="text-gray-500">Acesso restrito à equipa Leocomércio</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
              <input 
                type="email" 
                required
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                value={credentials.email}
                onChange={e => setCredentials({...credentials, email: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Palavra-passe</label>
              <input 
                type="password" 
                required
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                value={credentials.password}
                onChange={e => setCredentials({...credentials, password: e.target.value})}
              />
            </div>
            <button 
              type="submit"
              className="w-full py-5 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all"
            >
              Entrar no Painel
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-gray-900 text-white p-8 flex flex-col fixed h-full">
        <div className="flex items-center space-x-2 mb-12">
          <Printer className="w-8 h-8 text-red-500" />
          <span className="text-xl font-bold tracking-tight">Admin Panel</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          {[
            { id: "stats", icon: <LayoutDashboard />, label: "Dashboard" },
            { id: "orders", icon: <Package />, label: "Pedidos" },
            { id: "partners", icon: <GraduationCap />, label: "Parceiros" },
            { id: "afiliados", icon: <Share2 />, label: "Afiliados" },
            { id: "gallery", icon: <ImageIcon />, label: "Galeria" },
            { id: "prices", icon: <DollarSign />, label: "Preços" },
            { id: "settings", icon: <SettingsIcon />, label: "Configurações" },
            { id: "profile", icon: <User />, label: "Perfil" }
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all ${activeTab === item.id ? "bg-red-600 text-white shadow-lg shadow-red-600/20" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}
            >
              {item.icon}
              <span className="font-semibold">{item.label}</span>
            </button>
          ))}
        </nav>

        <Link 
          to="/"
          className="mt-auto flex items-center space-x-4 px-6 py-4 text-gray-400 hover:text-white transition-colors"
        >
          <HomeIcon />
          <span className="font-semibold">Voltar ao Site</span>
        </Link>

        <button 
          onClick={() => setIsLoggedIn(false)}
          className="flex items-center space-x-4 px-6 py-4 text-gray-400 hover:text-red-500 transition-colors"
        >
          <LogOut />
          <span className="font-semibold">Sair</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-12">
        <header className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            {activeTab === "stats" && "Dashboard Geral"}
            {activeTab === "orders" && "Gestão de Pedidos"}
            {activeTab === "partners" && "Escolas e Professores"}
            {activeTab === "afiliados" && "Gestão de Afiliados"}
            {activeTab === "gallery" && "Galeria de Trabalhos"}
            {activeTab === "prices" && "Tabela de Preços"}
            {activeTab === "settings" && "Configurações do Site"}
            {activeTab === "profile" && "Perfil do Administrador"}
          </h2>
          <div className="flex items-center space-x-4">
            <span className="text-gray-500 font-medium">{new Date().toLocaleDateString()}</span>
            <Link 
              to="/"
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
            >
              <HomeIcon className="w-4 h-4" />
              <span>Ver Site</span>
            </Link>
            <button 
              onClick={() => setIsLoggedIn(false)}
              className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
          </div>
        </header>

        {activeTab === "stats" && stats && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { label: "Total Vendas", value: stats.totalVendas, icon: <Package />, color: "bg-blue-500" },
                { label: "Folhas Impressas", value: stats.totalFolhas, icon: <FileText />, color: "bg-purple-500" },
                { label: "Lucro Estimado", value: `${stats.lucroEstimado} Kz`, icon: <TrendingUp />, color: "bg-green-500" },
                { label: "Comissões Pagas", value: `${stats.comissoesPagas} Kz`, icon: <Users />, color: "bg-red-500" }
              ].map((stat, i) => (
                <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                  <div className={`w-12 h-12 ${stat.color} text-white rounded-xl flex items-center justify-center mb-6`}>
                    {stat.icon}
                  </div>
                  <p className="text-gray-500 font-medium mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
              ))}
            </div>
            {/* Recent Orders Table */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Pedidos Recentes</h3>
                <button onClick={() => setActiveTab("orders")} className="text-red-600 font-bold hover:underline">Ver todos</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                    <tr>
                      <th className="px-8 py-4">Cliente</th>
                      <th className="px-8 py-4">Status</th>
                      <th className="px-8 py-4">Total</th>
                      <th className="px-8 py-4">Data</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.slice(0, 5).map(order => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-8 py-4 font-medium text-gray-900">{order.customerName}</td>
                        <td className="px-8 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            order.status === "Entregue" ? "bg-green-100 text-green-600" :
                            order.status === "Em entrega" ? "bg-blue-100 text-blue-600" :
                            order.status === "Em impressão" ? "bg-purple-100 text-purple-600" :
                            "bg-amber-100 text-amber-600"
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-8 py-4 text-gray-900 font-bold">{order.totalPrice} Kz</td>
                        <td className="px-8 py-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                  <tr>
                    <th className="px-8 py-4">ID</th>
                    <th className="px-8 py-4">Cliente</th>
                    <th className="px-8 py-4">Páginas</th>
                    <th className="px-8 py-4">Tipo</th>
                    <th className="px-8 py-4">Total</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-4 text-gray-500">#{order.id.toString().slice(-4)}</td>
                      <td className="px-8 py-4">
                        <div className="font-medium text-gray-900">{order.customerName}</div>
                        <div className="text-xs text-gray-500">{order.whatsapp}</div>
                      </td>
                      <td className="px-8 py-4 text-gray-900">{order.pages}</td>
                      <td className="px-8 py-4 text-gray-900 uppercase">{order.type}</td>
                      <td className="px-8 py-4 text-gray-900 font-bold">{order.totalPrice} Kz</td>
                      <td className="px-8 py-4">
                        <select 
                          value={order.status}
                          onChange={async (e) => {
                            await api.updateOrder(order.id, { status: e.target.value as any });
                            fetchData();
                          }}
                          className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-sm outline-none"
                        >
                          <option value="Pendente">Pendente</option>
                          <option value="Em impressão">Em impressão</option>
                          <option value="Em entrega">Em entrega</option>
                          <option value="Entregue">Entregue</option>
                        </select>
                      </td>
                      <td className="px-8 py-4">
                        <button className="text-gray-400 hover:text-red-600 transition-colors"><Trash className="w-5 h-5" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "partners" && (
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 max-w-2xl">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Adicionar Novo Parceiro (Escola/Professor)</h3>
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
                  <input name="name" placeholder="Nome do Parceiro" required className="px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
                  <input name="email" type="email" placeholder="Email" required className="px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
                  <input name="school" placeholder="Escola (Opcional)" className="px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
                  <input name="password" type="text" placeholder="Senha de Acesso" required className="px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
                </div>
                <button type="submit" className="w-full py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all flex items-center justify-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Registar Parceiro</span>
                </button>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {partners.map(partner => (
                <div key={partner.id} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${partner.active ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                      {partner.active ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{partner.name}</h4>
                  <p className="text-sm text-gray-500 mb-2">{partner.school || "Professor Independente"}</p>
                  <p className="text-xs text-gray-400 mb-6">{partner.email}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-2xl">
                      <p className="text-xs text-gray-400 uppercase font-bold mb-1">Código</p>
                      <p className="text-sm font-mono font-bold text-red-600">{partner.code}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl">
                      <p className="text-xs text-gray-400 uppercase font-bold mb-1">Senha</p>
                      <p className="text-sm font-mono font-bold text-gray-900">{partner.password}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-2xl">
                      <p className="text-xs text-gray-400 uppercase font-bold mb-1">Folhas</p>
                      <p className="text-xl font-bold text-gray-900">{partner.stats.leaves}</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-2xl">
                      <p className="text-xs text-gray-400 uppercase font-bold mb-1">Ganhos</p>
                      <p className="text-xl font-bold text-gray-900">{partner.stats.earned} Kz</p>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Comissão (Kz por folha)</label>
                    <div className="flex space-x-2">
                      <input 
                        type="number" 
                        className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none"
                        defaultValue={partner.commission || 10}
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
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 max-w-2xl">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Adicionar Novo Afiliado</h3>
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
                  <input name="name" placeholder="Nome do Afiliado" required className="px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
                  <input name="email" type="email" placeholder="Email" required className="px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
                  <input name="password" type="text" placeholder="Senha de Acesso" required className="px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
                </div>
                <button type="submit" className="w-full py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all flex items-center justify-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Registar Afiliado</span>
                </button>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {afiliados.map(afiliado => (
                <div key={afiliado.id} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${afiliado.active ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                      {afiliado.active ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{afiliado.name}</h4>
                  <p className="text-sm text-gray-500 mb-6">{afiliado.email}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-2xl">
                      <p className="text-xs text-gray-400 uppercase font-bold mb-1">Código</p>
                      <p className="text-sm font-mono font-bold text-red-600">{afiliado.code}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl">
                      <p className="text-xs text-gray-400 uppercase font-bold mb-1">Senha</p>
                      <p className="text-sm font-mono font-bold text-gray-900">{afiliado.password}</p>
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-2xl mb-6">
                    <p className="text-xs text-gray-400 uppercase font-bold mb-1">Total Ganho</p>
                    <p className="text-xl font-bold text-gray-900">{afiliado.stats.earned} Kz</p>
                  </div>
                  <div className="pt-6 border-t border-gray-100">
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Comissão (%)</label>
                    <input 
                      type="number" 
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none"
                      defaultValue={afiliado.commission || 10}
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

        {activeTab === "gallery" && (
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 max-w-2xl">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Adicionar Novo Trabalho</h3>
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
                  <input name="title" placeholder="Título do Trabalho" required className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Carregar Ficheiro</label>
                      <input name="image" type="file" accept="image/*" className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Ou URL da Imagem</label>
                      <input name="url" placeholder="https://..." className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm" />
                    </div>
                  </div>
                </div>
                <button type="submit" className="w-full py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all flex items-center justify-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Adicionar à Galeria</span>
                </button>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {settings.gallery?.map(item => (
                <div key={item.id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden group relative">
                  <img src={item.url} alt={item.title} className="w-full h-48 object-cover" referrerPolicy="no-referrer" />
                  <div className="p-4">
                    <p className="font-bold text-gray-900 truncate">{item.title}</p>
                  </div>
                  <button 
                    onClick={async () => {
                      if(confirm("Eliminar este trabalho?")) {
                        await api.deleteGalleryItem(item.id);
                        fetchData();
                      }
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 max-w-xl">
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
                <label className="block text-sm font-bold text-gray-700 mb-2">Email do Administrador</label>
                <input 
                  name="email"
                  type="email" 
                  defaultValue={user?.email}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nova Palavra-passe</label>
                <input 
                  name="password"
                  type="password" 
                  placeholder="Deixe em branco para manter a atual"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
                  required
                />
              </div>
              <button type="submit" className="w-full py-5 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all">
                Atualizar Perfil
              </button>
            </form>
          </div>
        )}

        {activeTab === "settings" && settings && (
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 max-w-4xl">
            <form className="space-y-8" onSubmit={async (e) => {
              e.preventDefault();
              await api.saveSettings(settings);
              alert("Configurações guardadas!");
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nome da Gráfica</label>
                  <input 
                    type="text" 
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
                    value={settings.logo}
                    onChange={e => setSettings({...settings, logo: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Slogan</label>
                  <input 
                    type="text" 
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
                    value={settings.slogan}
                    onChange={e => setSettings({...settings, slogan: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">WhatsApp</label>
                  <input 
                    type="text" 
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
                    value={settings.whatsapp}
                    onChange={e => setSettings({...settings, whatsapp: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Telefone</label>
                  <input 
                    type="text" 
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
                    value={settings.phone}
                    onChange={e => setSettings({...settings, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Taxa de Entrega (Kz)</label>
                  <input 
                    type="number" 
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
                    value={settings.deliveryFee}
                    onChange={e => setSettings({...settings, deliveryFee: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Facebook</label>
                  <input 
                    type="text" 
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
                    value={settings.facebook}
                    onChange={e => setSettings({...settings, facebook: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Instagram</label>
                  <input 
                    type="text" 
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
                    value={settings.instagram}
                    onChange={e => setSettings({...settings, instagram: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">TikTok</label>
                  <input 
                    type="text" 
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
                    value={settings.tiktok}
                    onChange={e => setSettings({...settings, tiktok: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">LinkedIn</label>
                  <input 
                    type="text" 
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
                    value={settings.linkedin}
                    onChange={e => setSettings({...settings, linkedin: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Twitter (X)</label>
                  <input 
                    type="text" 
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
                    value={settings.twitter}
                    onChange={e => setSettings({...settings, twitter: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Mensagem WhatsApp</label>
                <textarea 
                  rows={4}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
                  value={settings.whatsappMessage}
                  onChange={e => setSettings({...settings, whatsappMessage: e.target.value})}
                />
              </div>
              <button type="submit" className="px-10 py-4 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition-all">Guardar Alterações</button>
            </form>
          </div>
        )}

        {activeTab === "prices" && prices && (
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 max-w-4xl">
            <form className="space-y-12" onSubmit={async (e) => {
              e.preventDefault();
              await api.savePrices(prices);
              alert("Preços atualizados!");
            }}>
              <div className="space-y-8">
                <h3 className="text-xl font-bold text-gray-900 border-b pb-4">Preto e Branco</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Preço Unitário</label>
                    <input 
                      type="number" 
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
                      value={prices.bw.single}
                      onChange={e => setPrices({...prices, bw: {...prices.bw, single: parseInt(e.target.value)}})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Páginas Promo</label>
                    <input 
                      type="number" 
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
                      value={prices.bw.promo.pages}
                      onChange={e => setPrices({...prices, bw: {...prices.bw, promo: {...prices.bw.promo, pages: parseInt(e.target.value)}}})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Preço Promo</label>
                    <input 
                      type="number" 
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
                      value={prices.bw.promo.price}
                      onChange={e => setPrices({...prices, bw: {...prices.bw, promo: {...prices.bw.promo, price: parseInt(e.target.value)}}})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <h3 className="text-xl font-bold text-gray-900 border-b pb-4">Colorido</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Preço Unitário</label>
                    <input 
                      type="number" 
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
                      value={prices.color.single}
                      onChange={e => setPrices({...prices, color: {...prices.color, single: parseInt(e.target.value)}})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Páginas Promo</label>
                    <input 
                      type="number" 
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
                      value={prices.color.promo.pages}
                      onChange={e => setPrices({...prices, color: {...prices.color, promo: {...prices.color.promo, pages: parseInt(e.target.value)}}})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Preço Promo</label>
                    <input 
                      type="number" 
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
                      value={prices.color.promo.price}
                      onChange={e => setPrices({...prices, color: {...prices.color, promo: {...prices.color.promo, price: parseInt(e.target.value)}}})}
                    />
                  </div>
                </div>
              </div>
              <button type="submit" className="px-10 py-4 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition-all">Atualizar Tabela</button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default function App() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [prices, setPrices] = useState<Prices | null>(null);

  useEffect(() => {
    api.getSettings().then(setSettings);
    api.getPrices().then(setPrices);
  }, []);

  if (!settings || !prices) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full"
      />
    </div>
  );

  return (
    <Router>
      <div className="min-h-screen bg-white font-sans selection:bg-red-100 selection:text-red-600">
        <Routes>
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="*" element={
            <>
              <Navbar settings={settings} />
              <Routes>
                <Route path="/" element={<Home settings={settings} prices={prices} />} />
                <Route path="/precos" element={<PricesPage settings={settings} prices={prices} />} />
                <Route path="/parcerias" element={<PartnersPage settings={settings} />} />
              </Routes>
              <Footer settings={settings} />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}
