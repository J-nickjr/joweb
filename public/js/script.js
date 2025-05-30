document.addEventListener('DOMContentLoaded', () => {
  //購物車徽章邏輯
  const badge = document.getElementById('cart-count');
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  if (count > 0) {
    badge.textContent = count;
    badge.style.display = 'inline-block';
  } else {
    badge.style.display = 'none';
  }

  //Hotspot 顯示邏輯
  const hotspots = document.querySelectorAll('.hotspot');
  hotspots.forEach(hotspot => {
    const popupId = hotspot.dataset.popup;
    const popup = document.querySelector(popupId);
    let hideTimeout;

    hotspot.addEventListener('mouseenter', () => {
      clearTimeout(hideTimeout);
      popup.style.display = 'block';
    });

    hotspot.addEventListener('mouseleave', () => {
      hideTimeout = setTimeout(() => {
        popup.style.display = 'none';
      }, 200);
    });

    popup.addEventListener('mouseenter', () => {
      clearTimeout(hideTimeout);
      popup.style.display = 'block';
    });

    popup.addEventListener('mouseleave', () => {
      popup.style.display = 'none';
    });
  });

  //漢堡選單開關
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuClose = document.getElementById('menu-close');

  menuToggle?.addEventListener('click', () => {
    mobileMenu?.classList.add('active');
  });

  menuClose?.addEventListener('click', () => {
    mobileMenu?.classList.remove('active');
  });
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const account = document.getElementById('loginAccount').value;
  const password = document.getElementById('loginPassword').value;

  const res = await fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ account, password })
  });

  const data = await res.json();
  alert(data.message);
});

document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const account = document.getElementById('registerAccount').value;
  const password = document.getElementById('registerPassword').value;

  const res = await fetch('http://localhost:3000/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ account, password })
  });

  const data = await res.json();
  alert(data.message);
});