import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
import authRoutes from "./routes/auth";
import countryRoutes from "./routes/admin/countries";
import networkRoutes from "./routes/admin/networks";
import { PORT } from "./config/env";

const app = express();
app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log("✅ Connecté à MySQL avec TypeORM");

    // ✅ Montage des routes
    app.use("/auth", authRoutes);
    app.use("/countries", countryRoutes);
    app.use("/networks", networkRoutes);

    // ✅ Lancement du serveur
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error("❌ Erreur connexion DB:", err));
