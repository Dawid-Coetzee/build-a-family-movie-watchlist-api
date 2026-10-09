import express from "express";
import helmet from "helmet";
import bcrypt from "bcryptjs"

import watchlistRoutes from "./routes/watchlist.js";
import { signToken } from "./utils/jwt.js";
import { findByUsername } from "./utils/db.js";

const PORT = process.env.PORT;
const app = express();

app.use(helmet());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Family Movie Watchlist API");
});

app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({"error": "Missing username or password"});
  }

  const user = findByUsername(username);

  if (!user) {
    return res.status(401).json({"error": "Wrong Username or Password"});
  }

  const match = await bcrypt.compare(password, user.passwordHash);

  if (!match) {
    return res.status(401).json({"error": "Wrong Username or Password"});
  }

  const token = signToken({
    id: user.id,
    name: user.name,
    username: user.username,
    role: user.role,
  });

  return res.status(200).json({ token });
})

app.use("/api/watchlist", watchlistRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
