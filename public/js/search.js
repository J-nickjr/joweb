document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-input');
    const searchIcon = document.querySelector('.fa-magnifying-glass');
  
    function handleSearch() {
      const query = searchInput.value.trim().toLowerCase();
      if (!query) return;
  
      const found = productData.find(p =>
        p.name.toLowerCase().includes(query)
      );
  
      if (found) {
        window.location.href = found.link;
      } else {
        alert("找不到相關商品");
      }
    }
  
    searchIcon.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    });
  });
  