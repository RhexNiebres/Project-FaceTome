const dotenv = require("dotenv");
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
dotenv.config({ path: envFile });
const express = require("express");
const passport = require("./config/passport");
const app = express();
const indexRoutes = require("./routes/indexRoute");
const authRoutes = require("./routes/authRoute");
const usersRoutes = require("./routes/usersRoute");
const followRoutes = require("./routes/followRoute");
const postRoutes = require("./routes/postRoute");
const commentRoutes = require("./routes/commentsRoute");
const cors = require("cors");

const allowedOrigins = [
  process.env.CLIENT_HOST,
  process.env.FACETOME_CLIENT_HOST,
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.options("*", cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(passport.initialize());

app.use("/", indexRoutes);
app.use("/", authRoutes);
app.use("/users", usersRoutes);
app.use("/follows", followRoutes);
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);

app.get("/ping", (req, res) => {
  res.status(200).send("OK");
});

app.listen(process.env.APP_PORT, () =>
  console.log(`App listening on port ${process.env.APP_PORT}!`)
);
