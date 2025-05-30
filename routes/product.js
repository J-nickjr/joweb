document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.querySelector('.add-to-cart-btn');
  if (!addBtn) return;

  addBtn.addEventListener('click', () => {
    const product = {
      id: addBtn.dataset.id,
      name: addBtn.dataset.name,
      price: parseInt(addBtn.dataset.price),
      qty: 1,
      image: addBtn.dataset.image
    };

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge(); // ✅ 點擊加入購物車後即時更新徽章
    alert('已加入購物車');
  });

  // ✅ 補上：更新右上角徽章數量
  function updateCartBadge() {
    const badge = document.getElementById('cart-count');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'inline-block' : 'none';
    }
  }

  updateCartBadge(); // ✅ 初始載入就先更新一次
});
