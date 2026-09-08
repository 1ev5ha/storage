document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.querySelector('.menu-btn');
    const nav = document.querySelector('nav');
    
    if (menuBtn && nav) {
        menuBtn.addEventListener('click', function() {
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

// ============================================
// Электрический эффект (минимум ресурсов)
// ============================================

(function() {
    // Создаем canvas
    const container = document.getElementById('spark-container');
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let sparks = [];
    let animating = false;
    
    // Настройки (можно менять)
    const CONFIG = {
        sparksCount: 8,        // ← МАЛО частиц (экономия CPU)
        maxSparks: 30,         // ← Максимум искр на экране
        gravity: 0.03,         // ← Слабая гравитация
        lifeDecay: 0.015,      // ← Медленное затухание
        colors: ['#00d4ff', '#7b2ffc', '#ffffff'] // Цвета
    };
    
    // Адаптация под экран
    function resize() {
        const rect = container.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        canvas.width = width;
        canvas.height = height;
    }
    window.addEventListener('resize', resize);
    resize();
    
    // Класс искры
    class Spark {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 3 + 1; // ← МЕДЛЕННО
            
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed - 1;
            this.size = Math.random() * 3 + 1; // ← МАЛЕНЬКИЕ
            this.life = 1;
            this.color = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
        }
        
        update() {
            this.vx *= 0.97;
            this.vy *= 0.97;
            this.vy += CONFIG.gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.life -= CONFIG.lifeDecay;
            return this.life > 0.01;
        }
        
        draw(ctx) {
            ctx.save();
            ctx.globalAlpha = this.life * 0.8;
            
            // Свечение
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 8;
            
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
    }
    
    // Создание искр
    function createSpark(x, y) {
        // Ограничиваем количество
        if (sparks.length > CONFIG.maxSparks) {
            sparks.splice(0, 5);
        }
        
        for (let i = 0; i < CONFIG.sparksCount; i++) {
            sparks.push(new Spark(x, y));
        }
        
        if (!animating) {
            animating = true;
            animate();
        }
    }
    
    // Анимация
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        sparks = sparks.filter(s => {
            const alive = s.update();
            if (alive) s.draw(ctx);
            return alive;
        });
        
        if (sparks.length > 0) {
            requestAnimationFrame(animate);
        } else {
            animating = false;
            ctx.clearRect(0, 0, width, height);
        }
    }
    
    // Обработчики
    function handleInteraction(e) {
        e.preventDefault();
        
        let x, y;
        if (e.touches) {
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        } else {
            x = e.clientX;
            y = e.clientY;
        }
        
        createSpark(x, y);
    }
    
    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction, { passive: false });
    
    console.log('⚡ Электрические искры активированы!');
})();