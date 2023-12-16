var express = require("express");
var router = express.Router();
const pool = require("../db/db");
/* GET home page. */
router.get("/", async (req, res, next) => {
  const cafe = await pool.query("select * from cafe;");
  console.log(cafe[0]);
  res.render("index", { title: "커피집", sess: null, cafe: cafe[0] });
});

module.exports = router;
