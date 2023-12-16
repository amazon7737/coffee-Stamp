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
 * owner
 */
/* GET home page. */
router.get("/mypage/1", async (req, res) => {
  const user_id = req.session.user_id;

  // 유저 id 찾기
  const owner_id = await pool.query(
    "select id user_id from user where login_id = ?",
    [user_id]
  );

  // 카페 - 점주 체크
  const cafeCheck = await pool.query(
    "select * from dbseven.cafe where owner_id =?",
    [owner_id[0][0].user_id]
  );

  //
  const cafe = await pool.query(
    "SELECT a.*, b.*, c.* FROM dbseven.owner a inner join dbseven.user b on a.user_id = b.id inner join dbseven.cafe c on a.cafe_id = c.id where user_id = ?;",
    [owner_id[0][0].user_id]
  );

  //   console.log(cafe[0]);

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

  // 매출
  const sales = await pool.query(
    "select * from dbseven.monthly_record where cafe_id = ?;",
    [Number(owner[0][0].cafe_id)]
  );

  //성향 가입 날짜
  const register_time = Date.parse(propen[0][0].create_time);

  console.log("register_time", register_time);
  // 성향 가입 전 매출
  const no_register = [];
  const after_register = [];

  for (var i = 0; i < sales[0].length; i++) {
    const sales_register_time = Date.parse(sales[0][i].create_time);

    // 성향 가입 전후 날짜별 데이터 정리
    if (register_time < sales_register_time) {
      after_register.push(sales[0][i]);
    } else {
      no_register.push(sales[0][i]);
    }
  }

  // 성향 가입 후 매출 연산

  let no_register_result = 0;
  let after_register_result = 0;

  // 성향 가입 전 매출 총합
  for (var i = 0; i < no_register.length; i++) {
    no_register_result += Number(no_register[i].amount);
  }
  for (var i = 0; i < after_register.length; i++) {
    after_register_result += Number(after_register[i].amount);
  }

  // 총 % 차이 금액이 발생함
  // 차를 구하고 전년도 분의 차
  let result_money =
    ((after_register_result - no_register_result) / no_register_result) * 100;

  // 성향 가입 후 매출 총합

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

  // 만료 월
  const expire_month = propen[0][0].create_time.split("-")[1];

  // 오늘 날짜 - 만료 월
  const expire = Number(month) - Number(expire_month);

  //패키지 사이즈
  const package_time = Number(propen[0][0].package_size);

  // 만료일 연산
  const result_time = package_time - expire;

  // 성향 가입을 안했다면
  if (Number(partnerShip[0][0].partnership) == 0) {
    return res.render("cafe_mypage_attract_sign", {});
  } else {
    // 성향 가입을 했다면

    // 날짜가 가입일 보내주고 / 성향 서비스 만료일
    console.log("after_register:", after_register);
    console.log("no_register:", no_register);

    // 결과 json
    const result = [
      {
        create_time: propen[0][0].create_time,
        result_time: result_time,
        after_register: after_register,
        no_register: no_register,
        result_money: result_money,
      },
    ];

    return res.render("cafe_mypage_attract", { sales: "", result: result[0] });
  }
});

module.exports = router;
