document.addEventListener('DOMContentLoaded', () => {
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const cartMain = document.querySelector('.cart-main');
  const cartSummary = document.querySelector('.cart-summary');
  const summaryList = cartSummary.querySelector('ul');
  const totalPriceEl = cartSummary.querySelector('.total-price strong');
  const checkoutBtn = cartSummary.querySelector('.checkout-btn');

  function updateCartBadge() {
    const badge = document.getElementById('cart-count');
    const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'inline-block' : 'none';
    }
  }

  function renderCart() {
    let totalCount = 0;

    const cartListHTML = cartItems.map(item => {
      return `
        <div class="cart-item" data-id="${item.id}">
          <input type="checkbox" class="select-item" checked data-id="${item.id}">
          <img src="${item.image}" alt="${item.name}">
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <p>數量：${item.qty}</p>
            <div class="quantity">
              <button class="decrease" data-id="${item.id}">-</button>
              <span>${item.qty}</span>
              <button class="increase" data-id="${item.id}">+</button>
            </div>
          </div>
          <div class="cart-item-price">NT ${item.price * item.qty}</div>
        </div>
      `;
    }).join('');

    cartMain.innerHTML = `
      <h2>購物車</h2>
      <div class="cart-controls">
        <label><input type="checkbox" id="select-all"> 選擇全部</label>
        <button class="remove-selected">刪除選擇</button>
      </div>
      ${cartListHTML || '<p>購物車是空的</p>'}
    `;

    function updateSummary() {
      let total = 0;
      let shipping = 0;
      let totalCount = 0;

      const checkboxes = document.querySelectorAll('.select-item');

      checkboxes.forEach(cb => {
        const itemEl = cb.closest('.cart-item');
        const id = itemEl.dataset.id;
        const item = cartItems.find(p => p.id === id);
        if (cb.checked) {
          total += item.price * item.qty;
          totalCount += item.qty;
        }
      });

      if (document.querySelectorAll('.select-item:checked').length > 0) {
        shipping = 100;
      }

      const finalTotal = total + shipping;

      summaryList.innerHTML = `
        <li><span>商品總價：</span><strong>NT ${total}</strong></li>
        <li><span>運費：</span><strong>NT ${shipping}</strong></li>
        <li><span>折扣：</span><strong>-NT 0</strong></li>
      `;
      totalPriceEl.textContent = `NT ${finalTotal}`;
      checkoutBtn.textContent = `購買 ${totalCount} 件商品`;
    }

    function bindAllEvents() {
      document.querySelectorAll('.increase').forEach(btn =>
        btn.addEventListener('click', () => updateQty(btn.dataset.id, 1))
      );

      document.querySelectorAll('.decrease').forEach(btn =>
        btn.addEventListener('click', () => updateQty(btn.dataset.id, -1))
      );

      document.querySelectorAll('.select-item').forEach(cb =>
        cb.addEventListener('change', updateSummary)
      );

      document.querySelector('#select-all')?.addEventListener('change', e => {
        const checked = e.target.checked;
        document.querySelectorAll('.select-item').forEach(cb => {
          cb.checked = checked;
        });
        updateSummary();
      });

      document.querySelector('.remove-selected')?.addEventListener('click', removeSelectedItems);
    }

    bindAllEvents();
    updateSummary();
    updateCartBadge();
  }

  function updateQty(id, delta) {
    const item = cartItems.find(p => p.id === id);
    if (!item) return;

    item.qty += delta;
    if (item.qty < 1) item.qty = 1;

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    renderCart();
  }

  function removeSelectedItems() {
    const selectedCheckboxes = document.querySelectorAll('.select-item:checked');
    const selectedIds = [...selectedCheckboxes].map(cb => cb.closest('.cart-item').dataset.id);

    cartItems = cartItems.filter(item => !selectedIds.includes(item.id));
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    renderCart();
  }

  renderCart();
});
