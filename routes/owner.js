var express = require("express");
var router = express.Router();
const pool = require("../db/db");

/**
 * owner
 */
/* GET home page. */
router.get("/mypage/1", async (req, res) => {
  const user_id = req.session.user_id;
  const owner_id = await pool.query(
    "select id user_id from user where login_id = ?",
    [user_id]
  );

  const cafeCheck = await pool.query(
    "select * from dbseven.cafe where owner_id =?",
    [owner_id[0][0].user_id]
  );

  const cafe = await pool.query(
    "SELECT a.*, b.*, c.* FROM dbseven.owner a inner join dbseven.user b on a.user_id = b.id inner join dbseven.cafe c on a.cafe_id = c.id where user_id = ?;",
    [owner_id[0][0].user_id]
  );

  console.log(cafe[0]);

  const sales = await pool.query(
    "select * from dbseven.monthly_record where cafe_id = ?;",
    [Number(cafe[0][0].cafe_id)]
  );
  console.log(sales[0]);

  res.render("cafe_mypage_sales", { sales: sales[0] });
});

router.get("/mypage/4", async (req, res) => {
  const sess = req.session.user_id;

  const owner = await pool.query(
    "SELECT a.* , b.*, c.* FROM dbseven.owner a inner join dbseven.cafe b on a.cafe_id = b.id inner join dbseven.user c on a.user_id = c.id;"
  );

  console.log(owner[0]);

  for (let i = 0; i < owner[0].length; i++) {
    const propen = await pool.query(
      "select * from dbseven.cafe_propensity where cafe_id =? and user_id =?",
      [owner[0][i].cafe_id, sess]
    );

    console.log(propen[0]);
  }

  // 인테리어
  interior_data = {
    1: "원목",
    2: "모던",
    3: "기타 컨셉",
  };

  // 풍경
  scenery_data = {
    1: "산",
    2: "바다",
    3: "도시",
  };

  // 분위기
  feel_data = {
    1: "고요함",
    2: "잔잔한 음악",
    3: "시끌벅적",
  };

  //   if (propen[0] == []) {
  //     res.render("cafe_mypage_attract_sign", {});
  //   } else {
  //     res.render("cafe_mypage_atrract", {});
  //   }

  res.send("fjfj");

  // 성향 내역 조회
  // 성향 내역이 null 이면 가입페이지 로드 시키고 -> 성향 결제 주문
  // null 아니면 연산 시키기

  //   res.render("cafe_mypage_attract", {});
});

module.exports = router;
