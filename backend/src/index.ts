import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import brandRoutes from "./routes/brandRoutes";
import userRoutes from "./routes/userRoutes";
import perfumeRoutes from "./routes/perfumeRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import perfumistRoutes from "./routes/perfumistRoutes";
import newsRoutes from "./routes/newsRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import aromaticGroupRoutes from "./routes/aromaticGroupRoutes";
import noteImageRoutes from "./routes/noteImageRoutes";
import searchRoutes from "./routes/searchRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/users", userRoutes);
app.use("/api/perfumes", perfumeRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/perfumists", perfumistRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/aromatic-groups", aromaticGroupRoutes);
app.use("/api/notes/image", noteImageRoutes);
app.use("/api/search", searchRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
