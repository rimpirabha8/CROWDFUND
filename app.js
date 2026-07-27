const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const indexRouter = require("./routes/index");

app.use("/", indexRouter);

app.listen(3000, () => {
    console.log("Server started on http://localhost:3000");
});