const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 3000;

//驗證碼暫存（實務應使用 Redis）
const verificationCodes = new Map();

//中介軟體
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//資料庫連線
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Aa!12345678',
  database: 'bobozoo'
});

db.query('SELECT DATABASE()', (err, results) => {
  if (err) console.error('❌ 無法確認目前連接的資料庫：', err);
  else console.log('✅ 目前連接的資料庫為：', results[0]['DATABASE()']);
});

//發送驗證碼 API
app.post('/api/send-code', (req, res) => {
  const { phone } = req.body;
  if (!phone || !/^09\d{8}$/.test(phone)) {
    return res.status(400).json({ message: '請輸入有效手機號碼' });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  verificationCodes.set(phone, {
    code,
    expiresAt: Date.now() + 5 * 60 * 1000
  });

  console.log(`✅ 驗證碼 ${code} 已發送至 ${phone}（模擬）`);
  res.json({ message: '驗證碼已發送，請於 5 分鐘內使用' });
});

//登入 API
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM members WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: '伺服器錯誤' });
    if (results.length === 0) return res.status(401).json({ message: '查無此帳號，請註冊' });

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: '密碼錯誤' });
    }

    //僅呼叫一次 res.json
    res.json({
      message: '登入成功',
      email: user.email,
      phone: user.phone,
      is_subscribed: user.is_subscribed
    });
  });
});

//查詢會員詳細資料 API
app.post('/api/member-info', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: '缺少 email 參數' });
  }

  const sql = 'SELECT email, phone, name, birth, gender, is_subscribed FROM members WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error('❌ 查詢會員資料錯誤：', err);
      return res.status(500).json({ message: '伺服器錯誤' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: '查無會員資料' });
    }

    res.json(results[0]);
  });
});




// ✅ 註冊 API（含手機驗證碼驗證）
app.post('/api/register', async (req, res) => {
  const { email, phone, password, is_subscribed, code } = req.body;

  const record = verificationCodes.get(phone);
  const now = Date.now();

  console.log("🧪 註冊驗證中");
  console.log("使用者輸入 code:", code);
  console.log("後端記錄 code:", record?.code);
  console.log("過期時間:", new Date(record?.expiresAt || 0).toLocaleString());
  console.log("目前時間:", new Date(now).toLocaleString());

  if (!record) {
    return res.status(400).json({ message: '❌ 無驗證記錄（你可能還沒點過「取得驗證碼」）' });
  }

  if (String(record.code) !== String(code)) {
    return res.status(400).json({ message: `❌ 驗證碼錯誤，應為 ${record.code}，你輸入的是 ${code}` });
  }

  if (record.expiresAt < now) {
    return res.status(400).json({ message: `❌ 驗證碼已過期，${new Date(record.expiresAt).toLocaleString()} 已失效` });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const sql = 'INSERT INTO members (email, phone, password, is_subscribed) VALUES (?, ?, ?, ?)';
  db.query(sql, [email, phone, hashedPassword, is_subscribed || false], (err, result) => {
    if (err) {
      console.error('❌ MySQL 錯誤：', err);
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: '❌ 此 Email 已被註冊' });
      }
      return res.status(500).json({ message: '❌ 註冊失敗（資料庫錯誤）' });
    }

    verificationCodes.delete(phone);
    res.json({ message: '✅ 註冊成功' });
  });
});

//預設導向首頁
app.get('/', (req, res) => {
  res.redirect('/pages/index.html');
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});


//修改會員資料 API（含生日欄位）
app.post('/api/update-member', (req, res) => {
  const { email, name, gender, birth, phone, is_subscribed } = req.body;

  if (!email) {
    return res.status(400).json({ message: '缺少 email 參數' });
  }

  const sql = `
    UPDATE members
    SET name = ?, gender = ?, birth = ?, phone = ?, is_subscribed = ?
    WHERE email = ?
  `;

  db.query(sql, [name, gender, birth, phone, is_subscribed ? 1 : 0, email], (err, result) => {
    if (err) {
      console.error('❌ 更新會員資料失敗：', err);
      return res.status(500).json({ message: '伺服器錯誤：更新失敗' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '找不到該會員帳號' });
    }

    res.json({ message: '✅ 資料已成功更新' });
  });
});


