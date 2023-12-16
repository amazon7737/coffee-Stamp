var express = require("express");
var router = express.Router();
const pool = require("../db/db");
/* GET home page. */
router.get("/", async (req, res, next) => {
  res.render("sign", { sess: null });
});

router.post("/signin", async (req, res) => {
  const { id, pw } = req.body;
  req.session.user_id = id;

  console.log(id, pw);
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
