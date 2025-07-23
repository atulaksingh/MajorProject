const express = require("express");
const app = express();
const mongoose = require("mongoose");

const mongoURI = "mongodb://127.0.0.1:27017/wanderlust";

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log(" MongoDB connected successfully"))
.catch((err) => console.error(" MongoDB connection error:", err));

app.get("/",(req,res)=>{
    res.send("hello lesting")
})

app.listen(8080, () => {
  console.log("Server is running on port 8000");
});
