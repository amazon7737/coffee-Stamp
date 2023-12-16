var express = require("express");
var router = express.Router();
const pool = require("../db/db");

// 오늘날짜
let today = new Date();
let year = today.getFullYear();
let month = today.getMonth() + 1;
let date = today.getDate();
const wdate = year + "-" + month + "-" + date;

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
  //   console.log("userSel:", userSel[0]);

  res.render("cafe_attract_order", { user: userSel[0][0] });
});

router.post("/cafe_ordering", async (req, res) => {
  const user_id = req.session.user_id;
  const { item_month } = req.body;

  console.log(item_month);

  //   console.log(user);
  //   const userSel = await pool.query(
  //     "select * from dbseven.user where login_id =?;",
  //     [user]
  //   );

  // user_id 찾기
  const owner_id = await pool.query(
    "select id user_id from user where login_id = ?",
    [user_id]
  );

  // 카페 찾기
  const cafe = await pool.query(
    "SELECT a.*, b.*, c.* FROM dbseven.owner a inner join dbseven.user b on a.user_id = b.id inner join dbseven.cafe c on a.cafe_id = c.id where user_id = ?;",
    [owner_id[0][0].user_id]
  );
  console.log(cafe[0]);

  // 카페 테이블 package_size 수정
  const package_size_update = await pool.query(
    "update dbseven.cafe_propensity set package_size =?,  update_time = ? where cafe_id = ?",
    [item_month, wdate, cafe[0][0].cafe_id]
  );
  const partnerShip_update = await pool.query(
    "update dbseven.cafe set partnership =? , update_time = ? where id = ?",
    ["1", wdate, cafe[0][0].cafe_id]
  );

  res.send("결제성공");
});

// 회원 결제 페이지

module.exports = router;
