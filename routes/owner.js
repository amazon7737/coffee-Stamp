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

  res.render("cafe_mypage_sales", { sales: sales[0] });
});

router.get("/mypage/4", async (req, res) => {
  const user_id = req.session.user_id;
  const owner_id = await pool.query(
    "select id user_id from user where login_id = ?",
    [user_id]
  );

  // 주인 찾기
  const owner = await pool.query(
    "SELECT a.* , b.*, c.* FROM dbseven.owner a inner join dbseven.cafe b on a.cafe_id = b.id inner join dbseven.user c on a.user_id = c.id where user_id = ?;",
    [owner_id[0][0].user_id]
  );

  //   console.log(owner[0]);

  // 성향 카페의 그 사람의
  const propen = await pool.query(
    "select * from dbseven.cafe_propensity where cafe_id =?",
    [Number(owner[0][0].cafe_id)]
  );
  console.log("propen:", propen[0]);

  // 성향 json
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

  const partnerShip = await pool.query(
    "select a.partnership from dbseven.cafe a where id =? and owner_id = ?",
    [propen[0][0].cafe_id, owner_id[0][0].user_id]
  );

  // 만료일

  const result = [
    {
      create_time: propen[0][0].create_time,
      exit_time: "",
    },
  ];

  // 성향 가입을 안했다면
  if (Number(partnerShip[0][0].partnership) == 0) {
    return res.render("cafe_mypage_attract_sign", {});
  } else {
    // 성향 가입을 했다면
    // 날짜가 가입일 보내주고 / 성향 서비스 만료일
    return res.render("cafe_mypage_attract", { sales: "", result: result[0] });

    // res.render("cafe_mypage_atrract", {});
  }

  // 성향 내역 조회
  // 성향 내역이 null 이면 가입페이지 로드 시키고 -> 성향 결제 주문
  // null 아니면 연산 시키기

  //   res.render("cafe_mypage_attract", {});
});

module.exports = router;
