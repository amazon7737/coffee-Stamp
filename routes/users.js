var express = require("express");
var router = express.Router();
const pool = require("../db/db");

// 오늘날짜
let today = new Date();
let year = today.getFullYear();
let month = today.getMonth() + 1;
let date = today.getDate();
const wdate = year + "-" + month + "-" + date;

// 스탬프 설정 목록
let stamp_setting = [];

// 카페 멤버들 재정리 목록
let cafe_member_result = [];
/* GET users listing. */
router.get("/mypage", async (req, res, next) => {
  const sess = req.session.user_id;

  const user = await pool.query(
    "select * from dbseven.user where login_id  =?",
    [sess]
  );
  // console.log(user[0]);
  res.render("user_mypage_info", { user: user[0][0] });
});

router.get("/mypage/3", async (req, res) => {
  const user_id = req.session.user_id;

  const owner_id = await pool.query(
    "select id user_id from user where login_id = ?",
    [user_id]
  );

  // console.log(owner_id[0]);

  const cafe_member = await pool.query(
    "SELECT a.*, b.*, c.* FROM dbseven.cafe_member a inner join dbseven.cafe b on a.cafe_id = b.id inner join dbseven.user c on a.user_id = c.id where user_id = ?;",
    [owner_id[0][0].user_id]
  );

  // console.log("cafe_member:", cafe_member[0]);

  // 각 카페별 스탬프 설정과 해당되는 카페 아이디 매치 후 검색
  for (let i = 0; i < cafe_member[0].length; i++) {
    const stamp_setting_search = await pool.query(
      "select * from dbseven.stamp_setting where cafe_id =? and create_time = ? ;",
      [Number(cafe_member[0][i].cafe_id), "2023-12-01"]
    );

    // accured_stamp ( 채운 스탬프 개수 찾기)
    const cafe_member_id = await pool.query(
      "select * from dbseven.cafe_member where cafe_id =?",
      [Number(cafe_member[0][i].cafe_id)]
    );
    const stamp_count = await pool.query(
      "select accrued_stamp stamp_count from dbseven.stamp_board where cafe_member_id =? ",
      [cafe_member_id[0][0].id]
    );

    // console.log(stamp_setting_search[0]);

    // total_stamp : 최대 양
    // stamp_count : 채운 스탬프 개수

    stamp_setting.push({
      event_birthday: stamp_setting_search[0][0].event_birthday,
      event_first: stamp_setting_search[0][0].event_first,
      expiration: stamp_setting_search[0][0].expiration,
      total_stamp: stamp_setting_search[0][0].total_stamp,
      cafe_id: stamp_setting_search[0][0].cafe_id,
      create_time: stamp_setting_search[0][0].create_time,
      criterion_amount: stamp_setting_search[0][0].criterion_amount,
      gift_first_id: stamp_setting_search[0][0].gift_first_id,
      id: stamp_setting_search[0][0].id,
      update_time: stamp_setting_search[0][0].update_time,
      stamp_count: stamp_count[0][0].stamp_count,
    });
  }

  // console.log("stamp_setting:", stamp_setting);

  // 카페들 cafe_member 데이터 재정리
  for (let i = 0; i < cafe_member[0].length; i++) {
    for (let j = 0; j < stamp_setting.length; j++) {
      // console.log(cafe_member[0][i].cafe_name);
      // console.log(stamp_setting[0][j].total_stamp);
      // console.log(cafe_member[0][i].stamp_image);
      // console.log(owner_id[0][0].user_id);
      if (stamp_setting[j].cafe_id == cafe_member[0][i].cafe_id) {
        // console.log("cafe_member_id:", cafe_member_id[0]);

        cafe_member_result.push({
          cafe_id: cafe_member[0][i].cafe_id,
          cafe_name: cafe_member[0][i].cafe_name,
          stamp_setting: stamp_setting[j].total_stamp,
          stamp_image: cafe_member[0][i].stamp_image,
          user_id: owner_id[0][0].user_id,
        });
      }
    }
  }
  // console.log(cafe_member_result);

  res.render("user_mypage_stamp", {
    cafe_member: cafe_member_result,
    stamp_setting: stamp_setting,
    month: month,
  });
});

// 스탬프 쿠폰으로 바꾸기
router.get("/get/10/:cafe_id", async (req, res) => {
  const cafe_id = req.params.cafe_id;

  console.log(cafe_id);

  console.log("stamp_setting:", stamp_setting);
  console.log("cafe_member_result", cafe_member_result);

  // 카페 메뉴 검색 , 카페 메뉴당 스탬프 몇개 필요한지
  const cafe_menu = await pool.query("select * from menu where cafe_id = ?", [
    cafe_id,
  ]);

  const gift_menu = await pool.query(
    "SELECT b.*, c.* FROM dbseven.stamp_setting a inner join dbseven.menu b on a.gift_first_id = b.id inner join dbseven.menu c on a.gift_second_id = c.id;"
  );
  console.log(gift_menu[0]);

  // 가지겠다고 하면 바로 주문 기능 만들어서 스탬프 개수 줄어들게 할려고하는데
  // 스탬프 개수 비교해보고 적으면 바로 알림띄우고 뒤로가기

  res.render("cafe_get_coupon", { gift: gift_menu[0] });
});

router.get("/get/20/:cafe_id", async (req, res) => {
  const user_id = req.session.user_id;

  const owner_id = await pool.query(
    "select id user_id from user where login_id = ?",
    [user_id]
  );

  const cafe_id = req.params.cafe_id;

  let my_stamp = [];
  // 해당하는 카페에서 스탬프 몇개 가지고 있는지 체크
  // for(let i =0; i<stamp_setting.length; i++){

  //   if(stamp_setting[i])

  // }

  console.log(cafe_id);

  res.send("20개짜리 페이지");
});

router.post("/get/5", async (req, res) => {
  const { name, stamp_use } = req.body;
  console.log(name, stamp_use);

  // 스탬프 개수 충분한지 체크

  // 스탬프 에서 쿠폰을 변환 과정

  // 스팸프 감소 갱신

  res.send("변환");
});

router.post("/get/10", async (req, res) => {
  const { name, stamp_use } = req.body;
  console.log(name, stamp_use);

  // 스탬프 개수 충분한지 체크

  // 스탬프 에서 쿠폰을 변환 과정

  // 스팸프 감소 갱신

  res.send("변환");
});

module.exports = router;
