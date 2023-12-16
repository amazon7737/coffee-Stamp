var express = require("express");
var router = express.Router();
const pool = require("../db/db");
/* GET home page. */
router.get("/", async (req, res, next) => {
  res.render("sign", { sess: null });
});

router.post("/signup", async (req, res) => {
  const { id, pw, name } = req.body;

  let today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth() + 1;
  let date = today.getDate();
  const wdate = year + "-" + month + "-" + date;

  console.log(id, pw, name);
  try {
    const users = await pool.query(
      "insert into dbseven.user values(null,?,null,0,null,null,null,null,?, ?, ?, null,null)",
      [wdate, id, name, pw]
    );
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    if (id.length == 0 || pw.length == 0 || name.length == 0) {
      return res.send(
        `<script type = "text/javascript">alert("빈칸을 확인해주세요."); window.history.back();';</script>`
      );
    } else {
      return res.send(
        `<script type = "text/javascript" >alert("이미 존재하는 회원입니다.");window.history.back();';</script>`
      );
    }
  }
});

// 회원가입 페이지
router.get("/signup", async (req, res) => {
  res.render("signup");
});

router.post("/signin", async (req, res) => {
  const { id, pw } = req.body;
  console.log(id, pw);

  try {
    const login = await pool.query(
      "select * from dbseven.user where login_id = ? and password = ?",
      [id, pw]
    );

    console.log("login:", login[0]);

    if (login[0].length === 0) {
      return res.send(
        `<script type="text/javascript">
        alert("아이디 또는 비밀번호가 올바르지 않습니다.");
        window.history.back();
        </script>`
      );
      res.redirect("/signin");
    } else {
      req.session.user_id = id;
    }
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    res.send(
      `<script type="text/javascript">
        alert("아이디 또는 비밀번호가 올바르지 않습니다."); 
        window.history.back();
        </script>`
    );
  }
});
router.get("/sign/out", async (req, res) => {
  try {
    req.session.destroy(function () {
      req.session;
    });
    return res.send(
      `<script type = "text/javascript" >alert("로그아웃되었습니다.");location.href='/';</script>`
    );
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
