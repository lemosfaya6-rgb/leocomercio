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
    gallery: [] as { id: number, url: string, title: string }[],
  },
  prices: {
    bw: { single: 50, promo: { pages: 3, price: 100 } },
    color: { single: 100, promo: { pages: 2, price: 150 } },
  },
  partners: [],
  afiliados: [],
  orders: [],
  admins: [{ email: "admin@leocomercio.com", password: "admin" }],
};

// Load or Initialize Data
function loadData() {
  if (fs.existsSync(DATA_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    } catch (e) {
      return initialData;
    }
  }
  return initialData;
}

function saveData(data: any) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

let db = loadData();

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

  app.get("/api/orders", (req, res) => res.json(db.orders));
  app.post("/api/orders", async (req, res) => {
    const newOrder = { id: Date.now(), ...req.body, status: "Pendente", createdAt: new Date() };
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

  app.get("/api/partners", (req, res) => res.json(db.partners));
  app.post("/api/partners", async (req, res) => {
    const newPartner = { 
      id: Date.now(), 
      ...req.body, 
      code: `PAR-${Math.random().toString(36).substring(7).toUpperCase()}`, 
      password: req.body.password || Math.random().toString(36).substring(7),
      commission: req.body.commission || 10, 
      stats: { leaves: 0, earned: 0 },
      active: true
    };
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
      commission: req.body.commission || 10, 
      stats: { earned: 0 },
      active: true
    };
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

  app.get("/api/stats", (req, res) => {
    const totalVendas = db.orders.length;
    const totalFolhas = db.orders.reduce((acc: number, o: any) => acc + (o.pages || 0), 0);
    const lucroEstimado = db.orders.reduce((acc: number, o: any) => acc + (o.totalPrice || 0), 0);
    const comissoesPagas = db.partners.reduce((acc: number, p: any) => acc + (p.stats.earned || 0), 0) + 
                          db.afiliados.reduce((acc: number, a: any) => acc + (a.stats.earned || 0), 0);
    res.json({ totalVendas, totalFolhas, lucroEstimado, comissoesPagas });
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
