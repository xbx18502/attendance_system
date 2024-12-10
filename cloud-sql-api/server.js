const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();

// 启用 CORS 和 JSON 解析
app.use(cors());
app.use(express.json());

// 配置数据库连接
const db = mysql.createConnection({
  host: "34.146.95.173", // 替换为 Cloud SQL 实例的外部 IP
  user: "root",    // 数据库用户名
  password: "4648531123a",// 数据库密码
  database: "attendance_db" // 数据库名
});

// 连接数据库
db.connect((err) => {
  if (err) {
    console.error("无法连接到数据库:", err);
    process.exit(1);
  }
  console.log("成功连接到数据库");
});

// API 路由：获取最新状态
app.get("/api/statuses", (req, res) => {
  const query = `
    SELECT a.name, a.status, a.color, a.change_time
    FROM attendance a
    INNER JOIN (
        SELECT name, MAX(change_time) AS max_time
        FROM attendance
        GROUP BY name
    ) b ON a.name = b.name AND a.change_time = b.max_time;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("查询失败:", err);
      res.status(500).json({ error: "数据库查询失败" });
      return;
    }
    res.json(results);
  });
});

// API 路由：添加新状态
app.post("/api/add-status", (req, res) => {
  const { name, status } = req.body;
  const changeTime = new Date().toISOString().slice(0, 19).replace("T", " "); // 当前时间

  // 查询当前用户的颜色
  const getColorQuery = `
    SELECT color FROM attendance
    WHERE name = ?
    ORDER BY change_time DESC
    LIMIT 1;
  `;

  db.query(getColorQuery, [name], (err, colorResults) => {
    if (err) {
      console.error("查询颜色失败:", err);
      res.status(500).json({ error: "查询颜色失败" });
      return;
    }

    // 如果用户有现有记录，使用最新的颜色；否则使用默认颜色
    const color = colorResults.length > 0 ? colorResults[0].color : "gray";

    // 插入新的状态
    const insertQuery = `
      INSERT INTO attendance (name, status, color, change_time)
      VALUES (?, ?, ?, ?);
    `;
    db.query(insertQuery, [name, status, color, changeTime], (insertErr, results) => {
      if (insertErr) {
        console.error("插入失败:", insertErr);
        res.status(500).json({ error: "插入数据失败" });
        return;
      }

      res.json({ message: "状态添加成功", id: results.insertId });
    });
  });
});

// 启动服务器
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`服务器已启动: http://localhost:${PORT}`);
});