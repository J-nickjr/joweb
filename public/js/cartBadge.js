
// ✅ 共用徽章更新函式，可在任一頁調用：cartBadge.js
function updateCartBadge() {
    const badge = document.getElementById('cart-count');
    const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'inline-block' : 'none';
    }
  }
  
  window.addEventListener('storage', updateCartBadge); // ✅ 多頁同步支援
  
  document.addEventListener('DOMContentLoaded', updateCartBadge);