// member.js
document.addEventListener('DOMContentLoaded', () => {
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
  
    loginTab.addEventListener('click', () => {
      loginForm.style.display = 'block';
      registerForm.style.display = 'none';
      loginTab.classList.add('active');
      registerTab.classList.remove('active');
    });
  
    registerTab.addEventListener('click', () => {
      loginForm.style.display = 'none';
      registerForm.style.display = 'block';
      registerTab.classList.add('active');
      loginTab.classList.remove('active');
    });
  
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = loginForm.login-email.value;
      const password = loginForm.login-password.value;
  
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
  
      const result = await res.json();
      if (result.success) {
        localStorage.setItem('loggedInUser', result.userId || result.email); // 用帳號或 ID 都可以
        alert('登入成功');
        window.location.href = 'index.html';      
      } else {
        alert('查無此帳號，請註冊');
      }
    });
  
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = registerForm['register-name'].value;
      const email = registerForm['register-email'].value;
      const password = registerForm['register-password'].value;
  
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
  
      const result = await res.json();
      if (result.success) {
        alert('註冊成功，請登入');
        loginTab.click(); // 切換回登入畫面
      } else {
        alert(result.message || '註冊失敗');
      }
    });
  });
  