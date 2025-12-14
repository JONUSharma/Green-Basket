require("dotenv").config()
const express = require("express")
const connectDB = require("./Connection/Connection");
const route = require("./Routes/UserRoutes");
const P_route = require("./Routes/ProductRoutes")
const A_route = require("./Routes/AdminRoutes")
const router = require("./Routes/OrderRoutes")
const app = express()
const cors = require("cors")

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://green-basket.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
const port = process.env.PORT

app.use("/user", route)
app.use("/product",P_route)
app.use("/admin",A_route)
app.use("/order",router)



app.listen(port, () => console.log("Server is running on port", port))