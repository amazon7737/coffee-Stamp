var express = require("express");
var router = express.Router();
const pool = require("../db/db");
/**
 * 주문 order
 *
 */

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("order", {});
});

module.exports = router;
