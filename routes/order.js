var express = require("express");
var router = express.Router();
const pool = require("../db/db");
/**
 * 주문 order
 *
 */

// 성향 결제 페이지
router.get("/cafe_ordering", async (req, res, next) => {
  const user = req.session.user_id;
  console.log(user);
  const userSel = await pool.query(
    "select * from dbseven.user where login_id =?;",
    [user]
  );
  console.log("userSel:", userSel[0]);

  res.render("cafe_attract_order", { user: userSel[0][0] });
});

router.post("/cafe_ordering", async (req, res) => {
  const { user, item, count, item_month } = req.body;
  console.log(user, item, count, item_month);
});

// 회원 결제 페이지

module.exports = router;
