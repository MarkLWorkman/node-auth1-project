const router = require("express").Router();
const Middleware = require("./auth-middleware");
const Users = require("../users/users-model");
const bcrypt = require("bcryptjs");
const { json } = require("express");

router.post(
  "/register",
  Middleware.checkPasswordLength,
  Middleware.checkUsernameFree,
  async (req, res, next) => {
    const user = req.body;

    const hash = bcrypt.hashSync(user.password, 8);
    user.password = hash;

    try {
      const saved = await Users.add(user);
      res.status(200).json(saved);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/login",
  Middleware.checkUsernameExists,
  async (req, res, next) => {
    const { username, password } = req.body;

    try {
      const user = await Users.findBy({ username }).first();

      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = user;
        res.status(200).json({ message: `Welcome ${user.username}` });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (err) {
      next(err);
    }
  }
);

router.get("/logout", (req, res, next) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        res.status(400).json({ message: "" });
      } else {
        res.json({ message: "logged out" });
      }
    });
  } else {
    res.json({ message: "no session" });
  }
});

module.exports = router;
