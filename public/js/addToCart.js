function addToCart(productId) {
  const isLoggedIn = localStorage.getItem('loggedInUser') || localStorage.getItem('loggedIn');
  if (!isLoggedIn) {
    alert('請先登入才能加入購物車');
    window.location.href = '/pages/member.html';
    return;
  }

  const product = productData.find(p => p.id === productId);
  if (!product) {
    alert("找不到商品資料");
    return;
  }

  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const existingItem = cartItems.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cartItems.push({ ...product, qty: 1 });
  }

  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  updateCartBadge();

  try {
    console.log("✅ 呼叫 alert 前", product.name);
    alert(`已將「${product.name}」加入購物車`);
  } catch (e) {
    console.log(`已將「${product.name}」加入購物車 (alert 被攔截)`);
  }
}
