const express = require("express");
const router = express.Router();

let campaigns = [
    { id: 1, name: "School Fund", goal: 100000, collected: 25000, image: "/close-up-education-economy-objects.jpg" },
    { id: 2, name: "Medical Help", goal: 100000, collected: 70000, image: "/pexels-cottonbro-7583375.jpg" },
    { id: 3, name: "Animal Welfare", goal: 90000, collected: 50000, image: "/judy-beth-morris-i5q6oha6Lak-unsplash (1).jpg" }
];

let users = [];
let currentUser = null;

router.get("/", (req, res) => {
    res.render("index", {
        campaigns,
        user: currentUser
    });
});

router.get("/about", (req, res) => {
    res.render("about", {
        user: currentUser
    });
});

router.get("/contact", (req, res) => {
    res.render("contact", {
        user: currentUser
    });
});

router.post("/contact", (req, res) => {
    console.log(req.body);
    res.redirect("/");
});

router.get("/campaign/:id", (req, res) => {
    const campaign = campaigns.find(c => c.id == req.params.id);
    res.render("campaign", {
        campaign,
        user: currentUser
    });
});

router.post("/donate", (req, res) => {
    if (!currentUser) return res.redirect("/login");

    const id = Number(req.body.id);
    const money = Number(req.body.money);
    const campaign = campaigns.find(c => c.id == id);

    if (campaign) {
        campaign.collected += money;
    }

    res.redirect("/");
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", (req, res) => {
    const { name, email, password } = req.body;

    users.push({ name, email, password });
    currentUser = { name, email };

    res.redirect("/");
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", (req, res) => {
    const { email, password } = req.body;

    const user = users.find(
        u => u.email === email && u.password === password
    );

    if (user) {
        currentUser = {
            name: user.name,
            email: user.email
        };
        res.redirect("/");
    } else {
        res.send("Wrong email or password. <a href='/login'>Try again</a>");
    }
});

router.get("/logout", (req, res) => {
    currentUser = null;
    res.redirect("/");
});

module.exports = router;