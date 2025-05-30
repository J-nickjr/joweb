document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  let current = 0;
  let autoSlideInterval;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
  }

  function nextSlide() {
    current = (current + 1) % slides.length;
    showSlide(current);
  }

  function prevSlide() {
    current = (current - 1 + slides.length) % slides.length;
    showSlide(current);
  }

  nextBtn?.addEventListener('click', () => {
    nextSlide();
    resetAutoSlide();
  });

  prevBtn?.addEventListener('click', () => {
    prevSlide();
    resetAutoSlide();
  });

  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 5000);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }

  showSlide(current);
  startAutoSlide();

  // 🔥 正確版的 life 按鈕 active 判斷
  const buttons = document.querySelectorAll('.life-filter-buttons a');
  const currentPath = window.location.pathname;

  buttons.forEach(button => {
    const buttonPath = new URL(button.href).pathname;
    if (currentPath.endsWith(buttonPath)) {
      buttons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
    }
  });
// ✅ 會員 icon 點擊跳轉邏輯
const memberIcon = document.querySelector('a[title="會員中心"]');
if (memberIcon) {
  memberIcon.addEventListener('click', (e) => {
    e.preventDefault();
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    if (isLoggedIn) {
      window.location.href = '/pages/member-info.html';
    } else {
      window.location.href = '/pages/member.html';
    }
  });
}
});
