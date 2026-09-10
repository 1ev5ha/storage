document.addEventListener('DOMContentLoaded', function () {

    /* ============================
       Мобильное меню (бургер)
    ============================ */
    const menuBtn = document.querySelector('.menu-btn');
    const nav = document.querySelector('nav');

    if (menuBtn && nav) {
        menuBtn.addEventListener('click', function () {
            nav.classList.toggle('open');

            // Меняем иконку
            if (nav.classList.contains('open')) {
                menuBtn.textContent = '✕';
            } else {
                menuBtn.textContent = '☰';
            }
        });
    }

});