var express = require("express");
var router = express.Router();
const pool = require("../db/db");

/**
 * owner
 */
/* GET home page. */
router.get("/mypage/1", async (req, res) => {
  const cafe = await pool.query(
    "SELECT a.*, b.* FROM dbseven.cafe a inner join dbseven.user b on a.owner_id = b.login_id;"
  );

  const sales = await pool.query("select * from dbseven.monthly_record;");
  console.log(sales[0]);

  res.render("cafe_mypage_sales", { sales: sales[0] });
});

module.exports = router;
