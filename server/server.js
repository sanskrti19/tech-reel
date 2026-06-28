const express = require("express");
const cors = require("cors");
require("dotenv").config();



const connectDB = require("./config/db");
const app = express();
const postRoutes = require("./routes/postRoutes");
const aiRoutes = require("./routes/aiRoutes");
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);



connectDB();
app.use("/api/ai", aiRoutes);
app.use(cors());
 app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({
  limit: "50mb",
  extended: true
}));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/facts", require("./routes/factRoutes"));
app.use("/api/posts", postRoutes);
app.use("/api/bookmarks", require("./routes/bookmarkRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});