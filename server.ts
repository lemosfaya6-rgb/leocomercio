import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import multer from "multer";
import { Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(process.cwd(), "data.json");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

// Supabase Setup
const supabaseUrl = process.env.SUPABASE_URL || "https://qejgsfjxqqtbakcrdfpk.supabase.co";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlamdzZmp4cXF0YmFrY3JkZnBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0MjgxNzAsImV4cCI6MjA5MDAwNDE3MH0.7hKhEMu3WpIaz1BZ6uSh43jbf2qxrL2EHQ66TGjWljc";
const supabase = createClient(supabaseUrl, supabaseKey);

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Initial Data
const initialData = {
  settings: {
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
    gallery: [] as { id: number, url: string, title: string }[],
    ebookUrl: "",
    defaultCommission: 30,
    terms: `Termos de Serviço - Leocomércio

1. Aceitação dos Termos
Ao utilizar os nossos serviços, o utilizador concorda plenamente com estes termos. Se não concordar com algum ponto, por favor não utilize a plataforma.

2. Descrição dos Serviços
A Leocomércio presta serviços de impressão, cópia e entrega de documentos. Reservamo-nos o direito de recusar impressões que violem a lei ou contenham conteúdo impróprio.

3. Responsabilidade do Conteúdo
O cliente é o único responsável pelos ficheiros enviados. Garanta que possui os direitos de autor ou autorização necessária para a reprodução dos mesmos. Não nos responsabilizamos por erros ortográficos ou de formatação nos ficheiros originais.

4. Pagamentos e Preços
Os preços estão sujeitos a alteração sem aviso prévio, mas serão honrados para pedidos já confirmados. O serviço só será iniciado após a confirmação do pagamento.

5. Política de Cancelamento
Devido à natureza personalizada do serviço, não aceitamos cancelamentos nem efectuamos reembolsos após o início do processo de impressão.

6. Prazos e Entregas
Esforçamo-nos para cumprir todos os prazos. No entanto, atrasos decorrentes de problemas técnicos ou logísticos externos podem ocorrer. A taxa de entrega é calculada com base na localização selecionada.`,
    privacy: `Política de Privacidade - Leocomércio

1. Recolha de Informação
Recolhemos apenas os dados necessários para processar o seu pedido: Nome, Número de WhatsApp e os ficheiros de documentos enviados para impressão.

2. Uso da Informação
Os seus dados são utilizados exclusivamente para:
- Identificar o seu pedido.
- Entrar em contacto para confirmação ou dúvidas.
- Realizar a entrega no endereço indicado.

3. Proteção de Ficheiros
Os ficheiros enviados são tratados com total confidencialidade. Após a conclusão da impressão e entrega, os ficheiros são eliminados dos nossos servidores e dispositivos de forma segura.

4. Partilha com Terceiros
Não vendemos, trocamos ou transferimos os seus dados pessoais para terceiros.

5. Segurança
Implementamos medidas de segurança para manter a segurança das suas informações pessoais quando faz um pedido.

6. Contacto
Para qualquer questão sobre a sua privacidade, entre em contacto com o nosso administrador através do WhatsApp disponível no site.`,
    howItWorks: `Bem-vindo à nossa plataforma de serviços gráficos! Aqui está um guia detalhado de como tudo funciona:

1. Escolha os seus Serviços
Navegue pela nossa lista de serviços (Impressão, Cópia, etc.) e adicione o que precisa ao seu carrinho. Pode ajustar a quantidade de páginas e o tipo de impressão (Preto e Branco ou Colorido) para cada item.

2. Preencha os seus Dados
Ao finalizar o pedido, pedimos o seu nome e número de WhatsApp. Isso é fundamental para que possamos entrar em contacto e confirmar os detalhes da entrega.

3. Envio de Documentos
Após confirmar o pedido no site, será gerado um código de rastreio único. Pode carregar os seus ficheiros (PDF, Imagens, etc.) diretamente na página de rastreio ou enviá-los via WhatsApp para o nosso administrador.

4. Pagamento e Confirmação
O pagamento é feito via transferência bancária ou referência (conforme acordado no WhatsApp). Assim que o comprovativo for enviado, o seu pedido passará para o estado 'Em Andamento'.

5. Acompanhamento em Tempo Real
Use o seu código de rastreio na aba 'Rastrear' para ver o estado do seu pedido:
- Pedido Recebido: Estamos a aguardar o pagamento/ficheiros.
- Em Andamento: O seu documento está a ser impresso.
- Pronto: O seu pedido está pronto para entrega ou levantamento.
- Entregue: O processo foi concluído com sucesso.

6. Entrega ao Domicílio
Fazemos entregas em diversas áreas (Talatona, Kilamba, Maianga, etc.). O valor da taxa de entrega será somado ao total do seu pedido.

7. Suporte e Dúvidas
Se tiver qualquer problema, use a nossa aba de 'Suporte' para abrir um ticket ou clique no botão de WhatsApp para falar diretamente connosco.

Estamos aqui para facilitar a sua vida gráfica!`,
  },
  prices: [
    { id: "bw", name: "Preto e Branco", description: "Impressão padrão em preto e branco para documentos e textos.", single: 50, promo: { pages: 3, price: 100 }, active: true },
    { id: "colorSimple", name: "Colorido", description: "Impressão colorida de alta qualidade para apresentações e trabalhos.", single: 100, promo: { pages: 2, price: 150 }, active: true },
    { id: "colorHeavy", name: "Colorido Pesado", description: "Impressão colorida com alta cobertura de tinta para fotos e imagens.", single: 200, promo: { pages: 10, price: 150 }, active: true },
  ],
  partners: [],
  afiliados: [],
  orders: [],
  supportMessages: [] as { id: number, name: string, contact: string, message: string, createdAt: string, read: boolean }[],
  news: [] as { id: number, title: string, content: string, date: string, active: boolean }[],
  admins: [{ email: "admin@leocomercio.com", password: "admin" }],
};

// Load or Initialize Data
function loadData() {
  let data = { ...initialData };
  if (fs.existsSync(DATA_FILE)) {
    try {
      const fileData = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
      data = { ...initialData, ...fileData };
      if (fileData.settings) {
        data.settings = { ...initialData.settings, ...fileData.settings };
      }
    } catch (e) {
      console.error("Error loading data.json, using initialData");
    }
  }
  return data;
}

function ensureArrays(data: any) {
  if (!data.orders) data.orders = [];
  if (!data.partners) data.partners = [];
  if (!data.afiliados) data.afiliados = [];
  if (!data.news) data.news = [];
  if (!data.supportMessages) data.supportMessages = [];
  if (!data.admins) data.admins = initialData.admins;
  if (!data.settings) data.settings = { ...initialData.settings };
  if (!data.settings.gallery) data.settings.gallery = [];
  if (!data.settings.deliveryAreas) data.settings.deliveryAreas = initialData.settings.deliveryAreas;
  if (!data.settings.enabledDeliveryDays) data.settings.enabledDeliveryDays = initialData.settings.enabledDeliveryDays;
  if (data.settings.defaultCommission === undefined) data.settings.defaultCommission = 30;
  if (!data.settings.howItWorks) data.settings.howItWorks = initialData.settings.howItWorks;
  if (!data.settings.terms) data.settings.terms = initialData.settings.terms;
  if (!data.settings.privacy) data.settings.privacy = initialData.settings.privacy;
  if (!data.prices || !Array.isArray(data.prices)) data.prices = initialData.prices;
  if (data.settings.enabledDeliveryDays.length === 5 && !data.settings.enabledDeliveryDays.includes("Sábado")) {
    data.settings.enabledDeliveryDays = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
    data.settings.deliveryDays = "Segunda a Domingo, das 09h às 18h";
  }
  
  // Update commissions to 30% if they are at the old default (10%)
  if (data.partners) {
    data.partners.forEach((p: any) => {
      if (p.commission === 10) p.commission = 30;
    });
  }
  if (data.afiliados) {
    data.afiliados.forEach((a: any) => {
      if (a.commission === 10) a.commission = 30;
    });
  }
  
  return data;
}

function saveData(data: any) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

let db = ensureArrays(loadData());

// Supabase Sync Helpers
async function syncFromSupabase() {
  try {
    const { data, error } = await supabase.from("app_data").select("*");
    
    if (error) {
      // Handle "table not found" error gracefully
      if (error.code === "42P01") {
        console.warn("⚠️  Supabase table 'app_data' not found. Using local data. Please run the SQL setup in Supabase dashboard.");
        return;
      }
      throw error;
    }

    if (data && data.length > 0) {
      data.forEach((item: any) => {
        if (item.key in db) {
          db[item.key] = item.value;
        }
      });
      db = ensureArrays(db);
      console.log("✅ Data synced from Supabase");
    } else {
      // If Supabase is empty, initialize it with local data
      console.log("ℹ️ Supabase empty, initializing with local data...");
      for (const key of Object.keys(db)) {
        await supabase.from("app_data").upsert({ key, value: db[key] });
      }
    }
  } catch (err: any) {
    console.error("❌ Error syncing from Supabase:", err.message || JSON.stringify(err));
  }
}

async function saveToSupabase(key: string, value: any) {
  try {
    const { error } = await supabase.from("app_data").upsert({ key, value });
    if (error) {
      if (error.code === "42P01") {
        console.warn(`⚠️  Could not save '${key}' to Supabase: table 'app_data' does not exist.`);
        return;
      }
      throw error;
    }
  } catch (err: any) {
    console.error(`❌ Error saving ${key} to Supabase:`, err.message || JSON.stringify(err));
  }
}

async function startServer() {
  await syncFromSupabase();
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use("/uploads", express.static(UPLOADS_DIR));

  // API Routes
  app.post("/api/upload", upload.single("image"), (req: Request, res: Response) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    res.json({ url: `/uploads/${req.file.filename}` });
  });
  app.get("/api/settings", (req, res) => res.json(db.settings));
  app.post("/api/settings", async (req, res) => {
    db.settings = { ...db.settings, ...req.body };
    saveData(db);
    await saveToSupabase("settings", db.settings);
    res.json(db.settings);
  });

  app.get("/api/gallery", (req, res) => res.json(db.settings.gallery));
  app.post("/api/gallery", async (req, res) => {
    const newItem = { id: Date.now(), ...req.body };
    if (!db.settings.gallery) db.settings.gallery = [];
    db.settings.gallery.push(newItem);
    saveData(db);
    await saveToSupabase("settings", db.settings);
    res.json(newItem);
  });
  app.delete("/api/gallery/:id", async (req, res) => {
    db.settings.gallery = db.settings.gallery.filter((item: any) => item.id !== parseInt(req.params.id));
    saveData(db);
    await saveToSupabase("settings", db.settings);
    res.json({ success: true });
  });

  app.get("/api/prices", (req, res) => res.json(db.prices));
  app.post("/api/prices", async (req, res) => {
    db.prices = req.body;
    saveData(db);
    await saveToSupabase("prices", db.prices);
    res.json(db.prices);
  });
  app.post("/api/prices/add", async (req, res) => {
    const newService = {
      id: Date.now().toString(),
      name: req.body.name || "Novo Serviço",
      description: req.body.description || "",
      single: req.body.single || 0,
      promo: {
        pages: req.body.promoPages || 0,
        price: req.body.promoPrice || 0
      },
      active: true
    };
    db.prices.push(newService);
    saveData(db);
    await saveToSupabase("prices", db.prices);
    res.json(newService);
  });
  app.delete("/api/prices/:id", async (req, res) => {
    db.prices = db.prices.filter((p: any) => p.id !== req.params.id);
    saveData(db);
    await saveToSupabase("prices", db.prices);
    res.json({ success: true });
  });

  app.get("/api/orders", (req, res) => res.json(db.orders));
  app.post("/api/orders", async (req, res) => {
    const newOrder = { id: Date.now(), ...req.body, status: "Pedido Recebido", createdAt: new Date() };
    if (!db.orders) db.orders = [];
    db.orders.push(newOrder);
    saveData(db);
    await saveToSupabase("orders", db.orders);
    res.json(newOrder);
  });
  app.patch("/api/orders/:id", async (req, res) => {
    const order = db.orders.find((o: any) => o.id === parseInt(req.params.id));
    if (order) {
      Object.assign(order, req.body);
      saveData(db);
      await saveToSupabase("orders", db.orders);
      res.json(order);
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  });
  app.delete("/api/orders/:id", async (req, res) => {
    db.orders = db.orders.filter((o: any) => o.id !== parseInt(req.params.id));
    saveData(db);
    await saveToSupabase("orders", db.orders);
    res.json({ success: true });
  });

  app.get("/api/partners", (req, res) => res.json(db.partners));
  app.post("/api/partners", async (req, res) => {
    const newPartner = { 
      id: Date.now(), 
      ...req.body, 
      code: `PAR-${Math.random().toString(36).substring(7).toUpperCase()}`, 
      password: req.body.password || Math.random().toString(36).substring(7),
      commission: req.body.commission || db.settings.defaultCommission || 30, 
      stats: { leaves: 0, earned: 0 },
      active: true
    };
    if (!db.partners) db.partners = [];
    db.partners.push(newPartner);
    saveData(db);
    await saveToSupabase("partners", db.partners);
    res.json(newPartner);
  });
  app.patch("/api/partners/:id", async (req, res) => {
    const partner = db.partners.find((p: any) => p.id === parseInt(req.params.id));
    if (partner) {
      Object.assign(partner, req.body);
      saveData(db);
      await saveToSupabase("partners", db.partners);
      res.json(partner);
    } else {
      res.status(404).json({ error: "Partner not found" });
    }
  });

  app.get("/api/afiliados", (req, res) => res.json(db.afiliados));
  app.post("/api/afiliados", async (req, res) => {
    const newAfiliado = { 
      id: Date.now(), 
      ...req.body, 
      code: `AFI-${Math.random().toString(36).substring(7).toUpperCase()}`, 
      password: req.body.password || Math.random().toString(36).substring(7),
      commission: req.body.commission || db.settings.defaultCommission || 30, 
      stats: { earned: 0 },
      active: true
    };
    if (!db.afiliados) db.afiliados = [];
    db.afiliados.push(newAfiliado);
    saveData(db);
    await saveToSupabase("afiliados", db.afiliados);
    res.json(newAfiliado);
  });
  app.patch("/api/afiliados/:id", async (req, res) => {
    const afiliado = db.afiliados.find((a: any) => a.id === parseInt(req.params.id));
    if (afiliado) {
      Object.assign(afiliado, req.body);
      saveData(db);
      await saveToSupabase("afiliados", db.afiliados);
      res.json(afiliado);
    } else {
      res.status(404).json({ error: "Afiliado not found" });
    }
  });

  app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    const admin = db.admins.find((a: any) => a.email === email && a.password === password);
    if (admin) {
      res.json({ success: true, user: { email: admin.email } });
    } else {
      res.status(401).json({ success: false, error: "Invalid credentials" });
    }
  });

  app.post("/api/admin/profile", async (req, res) => {
    const { email, password, currentEmail } = req.body;
    const admin = db.admins.find((a: any) => a.email === currentEmail);
    if (admin) {
      admin.email = email;
      admin.password = password;
      saveData(db);
      await saveToSupabase("admins", db.admins);
      res.json({ success: true, user: { email: admin.email } });
    } else {
      res.status(404).json({ success: false, error: "Admin not found" });
    }
  });

  app.post("/api/commissions/update-all", async (req, res) => {
    const { commission } = req.body;
    if (typeof commission !== "number") return res.status(400).json({ error: "Invalid commission" });
    
    db.settings.defaultCommission = commission;
    db.partners.forEach((p: any) => p.commission = commission);
    db.afiliados.forEach((a: any) => a.commission = commission);
    
    saveData(db);
    await saveToSupabase("partners", db.partners);
    await saveToSupabase("afiliados", db.afiliados);
    await saveToSupabase("settings", [db.settings]);
    
    res.json({ success: true });
  });

  app.get("/api/stats", (req, res) => {
    const totalVendas = db.orders.length;
    const totalFolhas = db.orders.reduce((acc: number, o: any) => {
      if (o.items && Array.isArray(o.items)) {
        return acc + o.items.reduce((sum: number, item: any) => sum + (item.pages || 0), 0);
      }
      return acc + (o.pages || 0);
    }, 0);
    const lucroEstimado = db.orders.reduce((acc: number, o: any) => acc + (o.totalPrice || 0), 0);
    const comissoesPagas = db.partners.reduce((acc: number, p: any) => acc + (p.stats.earned || 0), 0) + 
                          db.afiliados.reduce((acc: number, a: any) => acc + (a.stats.earned || 0), 0);
    res.json({ totalVendas, totalFolhas, lucroEstimado, comissoesPagas });
  });

  app.get("/api/support", (req, res) => res.json(db.supportMessages || []));
  app.post("/api/support", async (req, res) => {
    const ticketCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newMessage = { 
      id: Date.now(), 
      ...req.body, 
      createdAt: new Date().toISOString(),
      read: false,
      ticketCode,
      responses: []
    };
    if (!db.supportMessages) db.supportMessages = [];
    db.supportMessages.push(newMessage);
    saveData(db);
    await saveToSupabase("supportMessages", db.supportMessages);
    res.json(newMessage);
  });
  app.patch("/api/support/:id", async (req, res) => {
    const message = db.supportMessages.find((m: any) => m.id === parseInt(req.params.id));
    if (message) {
      Object.assign(message, req.body);
      saveData(db);
      await saveToSupabase("supportMessages", db.supportMessages);
      res.json(message);
    } else {
      res.status(404).json({ error: "Message not found" });
    }
  });
  app.delete("/api/support/:id", async (req, res) => {
    db.supportMessages = db.supportMessages.filter((m: any) => m.id !== parseInt(req.params.id));
    saveData(db);
    await saveToSupabase("supportMessages", db.supportMessages);
    res.json({ success: true });
  });

  app.get("/api/news", (req, res) => res.json(db.news || []));
  app.post("/api/news", async (req, res) => {
    const newItem = { 
      id: Date.now(), 
      ...req.body, 
      date: new Date().toISOString(),
      active: true
    };
    if (!db.news) db.news = [];
    db.news.push(newItem);
    saveData(db);
    await saveToSupabase("news", db.news);
    res.json(newItem);
  });
  app.delete("/api/news/:id", async (req, res) => {
    db.news = db.news.filter((n: any) => n.id !== parseInt(req.params.id));
    saveData(db);
    await saveToSupabase("news", db.news);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
