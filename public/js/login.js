document.addEventListener('DOMContentLoaded', () => {
  // ✅ 登入表單處理
  const loginForm = document.getElementById('login-form');
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm['login-email'].value.trim();
    const password = loginForm['login-password'].value;

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ 登入成功');
        window.location.href = '/pages/index.html';
      } else {
        alert('❌ 登入失敗：' + data.message);
      }
    } catch (err) {
      alert('❌ 無法登入，請稍後再試');
    }
  });

  // ✅ 註冊表單處理
  const registerForm = document.getElementById('register-form');
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = registerForm['register-email'].value.trim();
    const phone = registerForm['register-phone'].value.trim();
    const password = registerForm['register-password'].value;
    const confirm = registerForm['register-confirm'].value;
    const code = registerForm['register-code'].value.trim();
    const isSubscribed = registerForm['subscribe'].checked;
    const agree = registerForm['agree'].checked;

    if (!agree) {
      alert('❌ 請勾選已閱讀並同意相關條款');
      return;
    }

    if (password !== confirm) {
      alert('❌ 兩次密碼輸入不一致');
      return;
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          phone,
          password,
          is_subscribed: isSubscribed,
          code
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ 註冊成功，請登入');
        window.scrollTo(0, 0);
      } else {
        alert('❌ 註冊失敗：' + data.message);
      }
    } catch (err) {
      alert('❌ 無法註冊，請稍後再試');
    }
  });

  // ✅ 驗證碼取得與倒數
  const verifyBtn = document.querySelector('.btn-verify');
  const phoneInput = document.querySelector('input[name="register-phone"]');
  let countdown = 60;
  let timer = null;

  verifyBtn.addEventListener('click', async () => {
    const phone = phoneInput.value.trim();

    if (!/^09\d{8}$/.test(phone)) {
      alert('請輸入有效手機號碼（09開頭，共10碼）');
      return;
    }

    try {
      const res = await fetch('/api/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ 驗證碼已發送');
        startCountdown();
      } else {
        alert('❌ 發送失敗：' + data.message);
      }
    } catch (err) {
      alert('❌ 發送驗證碼失敗');
    }
  });

  function startCountdown() {
    if (timer) clearInterval(timer); // 若已存在倒數計時，先清除

    verifyBtn.disabled = true;
    countdown = 60;
    verifyBtn.textContent = `重新傳送 (${countdown}s)`;
    timer = setInterval(() => {
      countdown--;
      verifyBtn.textContent = `重新傳送 (${countdown}s)`;
      if (countdown <= 0) {
        clearInterval(timer);
        verifyBtn.disabled = false;
        verifyBtn.textContent = '取得驗證碼';
      }
    }, 1000);
  }
});