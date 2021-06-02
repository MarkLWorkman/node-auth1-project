const router = require("express").Router();
const Users = require("./users-model");
const Middleware = require("../auth/auth-middleware");

router.get("/", Middleware.restricted, async (req, res, next) => {
  try {
    const users = await Users.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
