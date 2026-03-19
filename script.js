// Мобильное меню
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('.header__nav');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        nav.classList.toggle('active');
    });
}

// Корзина
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartBtn = document.querySelector('.cart-btn');
const cartModal = document.getElementById('cartModal');
const closeCart = document.querySelector('.close-cart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.querySelector('.cart-count');

// Обновление счетчика корзины
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Открытие корзины
if (cartBtn) {
    cartBtn.addEventListener('click', () => {
        cartModal.classList.add('active');
        renderCart();
    });
}

// Закрытие корзины
if (closeCart) {
    closeCart.addEventListener('click', () => {
        cartModal.classList.remove('active');
    });
}

// Закрытие по клику вне корзины
document.addEventListener('click', (e) => {
    if (cartModal && cartModal.classList.contains('active')) {
        if (!cartModal.contains(e.target) && !cartBtn.contains(e.target)) {
            cartModal.classList.remove('active');
        }
    }
});

// Добавление в корзину
const addToCartBtns = document.querySelectorAll('.btn-add-to-cart');

addToCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        const productCard = btn.closest('.product__card');
        const productId = btn.dataset.id || Math.random().toString(36).substr(2, 9);
        const productTitle = productCard.querySelector('.product__title').textContent;
        const productPrice = productCard.querySelector('.current-price').textContent;
        const productImage = productCard.querySelector('.product__image img').src;
        
        const price = parseInt(productPrice.replace(/[^\d]/g, ''));
        
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                id: productId,
                title: productTitle,
                price: price,
                image: productImage,
                quantity: 1
            });
        }
        
        updateCartCount();
        showNotification('Товар добавлен в корзину');
        
        // Анимация кнопки
        btn.textContent = '✓ Добавлено';
        btn.style.background = '#D4A373';
        btn.style.border = '2px solid #D4A373';
        btn.style.color = '#FFFFFF';
        
        setTimeout(() => {
            btn.textContent = 'В корзину';
            btn.style.background = 'transparent';
            btn.style.border = '2px solid #2A2A2A';
            btn.style.color = '#2A2A2A';
        }, 2000);
    });
});

// Отображение корзины
function renderCart() {
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Корзина пуста</p>';
        cartTotal.textContent = '0 ₽';
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach(item => {
        total += item.price * item.quantity;
        
        html += `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item__image">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="cart-item__details">
                    <div class="cart-item__title">${item.title}</div>
                    <div class="cart-item__price">${item.price.toLocaleString()} ₽</div>
                    <div class="cart-item__quantity">
                        <button class="decrease-qty">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase-qty">+</button>
                        <i class="fas fa-trash cart-item__remove"></i>
                    </div>
                </div>
            </div>
        `;
    });
    
    cartItems.innerHTML = html;
    cartTotal.textContent = `${total.toLocaleString()} ₽`;
    
    // Обработчики для кнопок в корзине
    document.querySelectorAll('.decrease-qty').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const cartItem = e.target.closest('.cart-item');
            const id = cartItem.dataset.id;
            const item = cart.find(i => i.id === id);
            
            if (item.quantity > 1) {
                item.quantity--;
            } else {
                cart = cart.filter(i => i.id !== id);
            }
            
            updateCartCount();
            renderCart();
        });
    });
    
    document.querySelectorAll('.increase-qty').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const cartItem = e.target.closest('.cart-item');
            const id = cartItem.dataset.id;
            const item = cart.find(i => i.id === id);
            
            item.quantity++;
            updateCartCount();
            renderCart();
        });
    });
    
    document.querySelectorAll('.cart-item__remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const cartItem = e.target.closest('.cart-item');
            const id = cartItem.dataset.id;
            
            cart = cart.filter(i => i.id !== id);
            updateCartCount();
            renderCart();
        });
    });
}

// Избранное
const wishlistBtns = document.querySelectorAll('.product__wishlist');

wishlistBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const icon = btn.querySelector('i');
        
        if (icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            btn.style.background = '#D4A373';
            btn.style.color = '#FFFFFF';
            showNotification('Добавлено в избранное');
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            btn.style.background = '#FFFFFF';
            btn.style.color = '#6B6B6B';
            showNotification('Удалено из избранного');
        }
    });
});

// Уведомления
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Таймер обратного отсчета
function updateTimer() {
    const timerNumbers = document.querySelectorAll('.timer__number');
    if (timerNumbers.length === 0) return;
    
    let days = parseInt(timerNumbers[0].textContent);
    let hours = parseInt(timerNumbers[1].textContent);
    let minutes = parseInt(timerNumbers[2].textContent);
    let seconds = parseInt(timerNumbers[3].textContent);
    
    seconds--;
    
    if (seconds < 0) {
        seconds = 59;
        minutes--;
    }
    if (minutes < 0) {
        minutes = 59;
        hours--;
    }
    if (hours < 0) {
        hours = 23;
        days--;
    }
    if (days < 0) {
        days = 3;
        hours = 18;
        minutes = 45;
        seconds = 32;
    }
    
    timerNumbers[0].textContent = days.toString().padStart(2, '0');
    timerNumbers[1].textContent = hours.toString().padStart(2, '0');
    timerNumbers[2].textContent = minutes.toString().padStart(2, '0');
    timerNumbers[3].textContent = seconds.toString().padStart(2, '0');
}

setInterval(updateTimer, 1000);

// Форма подписки
const newsletterForm = document.getElementById('newsletterForm');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        if (email && email.includes('@') && email.includes('.')) {
            showNotification('Спасибо за подписку! Проверьте вашу почту.');
            newsletterForm.reset();
        } else {
            showNotification('Пожалуйста, введите корректный email адрес');
        }
    });
}

// Фильтры
const filterBtns = document.querySelectorAll('.filter-btn');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// Размеры на странице товара
const sizeBtns = document.querySelectorAll('.size-btn');

sizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        sizeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// Цвета на странице товара
const colorBtns = document.querySelectorAll('.color-btn');

colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        colorBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// Количество товара
const quantityBtns = document.querySelectorAll('.quantity-btn');
const quantityInput = document.querySelector('.quantity-input');

if (quantityBtns.length > 0) {
    quantityBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            let value = parseInt(quantityInput.value);
            
            if (btn.classList.contains('minus')) {
                if (value > 1) {
                    value--;
                }
            } else {
                value++;
            }
            
            quantityInput.value = value;
        });
    });
}

// Миниатюры на странице товара
const thumbnails = document.querySelectorAll('.thumbnail');
const mainImage = document.querySelector('.main-image img');

if (thumbnails.length > 0) {
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            thumbnails.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            
            if (mainImage) {
                mainImage.src = thumb.querySelector('img').src;
            }
        });
    });
}

// Поиск
const searchBtn = document.querySelector('.search-btn');

if (searchBtn) {
    searchBtn.addEventListener('click', () => {
        showNotification('Функция поиска откроется здесь');
    });
}

// Профиль
const profileBtn = document.querySelector('.profile-btn');

if (profileBtn) {
    profileBtn.addEventListener('click', () => {
        showNotification('Личный кабинет');
    });
}

// Оформление заказа
const checkoutBtn = document.getElementById('checkoutBtn');

if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showNotification('Корзина пуста');
        } else {
            showNotification('Заказ оформлен! Спасибо за покупку');
            cart = [];
            updateCartCount();
            renderCart();
            cartModal.classList.remove('active');
        }
    });
}

// Инициализация
updateCartCount();

// Закрытие мобильного меню при клике вне его
document.addEventListener('click', (e) => {
    if (nav && mobileMenuBtn) {
        if (!nav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            nav.classList.remove('active');
        }
    }
});

// Анимация появления элементов при скролле
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.category__card, .product__card, .blog__card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});