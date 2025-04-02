function setupNavbar() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navbarLinks = document.querySelector('.navbar-links');
    
    if (mobileMenuBtn && navbarLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navbarLinks.classList.toggle('show');
        });
    } else {
        console.warn("Mobile menu button or navbar links not found.");
    }
  }
  
  // Immediately run the setup function (or attach it to DOMContentLoaded, if needed)
  setupNavbar();
  