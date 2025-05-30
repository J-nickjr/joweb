document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.add-to-cart-btn').forEach(addBtn => {
    addBtn.addEventListener('click', () => {
      const productId = addBtn.dataset.id;
      addToCart(productId); // ✅ 呼叫共用函式
    });
  });

  updateCartBadge(); // ✅ 顯示徽章
});
