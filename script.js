const GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRbHFTGg7yD-wla-WTyuksMKmoPhblVtdrNAEf_BpQStuoAvVQZx2cwgigSYETo_A/pub?gid=1152455124&single=true&output=csv";
const WHATSAPP_NUMBER = "5492262677026"; 
const ENABLE_DELIVERY = false; 

// DATA VARIABLES
let allProducts = [];
let cart = [];
let currentCategory = 'all';

// USUARIO LOCAL
let currentUser = null; 
let userHistory = []; 

// IMAGENES
const customImages = {
    "agility adulto raza pequena": "./img/agility-adulto-raza-pequena.webp",
    "agility cachorro": "./img/agility-cachorro.webp",
    "agility adulto": "./img/agility-adulto.webp",
    "advance bio adulto r. pequena": "./img/advance-bio-adulto-r-pequena.webp",
    "advance bio adulto": "./img/advance-bio-adulto.webp",
    "advance bio cachorro": "./img/advance-bio-cachorro.webp",
    "advance bio cordero": "./img/advance-bio-cordero.webp",
    "dog chow adultos razas pequenas": "https://www.purina.com.ar/sites/default/files/styles/webp/public/2022-10/dog-chow-adultos-minis-y-pequenos.png.webp?itok=fO631GjL",
    "dog chow adultos medianos y grandes": "https://www.purina.com.ar/sites/default/files/styles/webp/public/2022-10/dog-chow-adultos-medianos-y-grandes.png.webp?itok=8aJm_y_4"
};

const defaultImage = "https://cdn-icons-png.flaticon.com/512/2171/2171991.png";

// INICIALIZACION
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    loadUser();
    updateCartUI();
    initTheme();
    
    // Search listener
    document.getElementById('search-input').addEventListener('input', (e) => {
        renderProducts(e.target.value);
    });

    // Category Listeners
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            renderProducts(document.getElementById('search-input').value);
        });
    });
});

// THEME TOGGLE
function initTheme() {
    const isDark = localStorage.getItem('theme') === 'dark';
    if(isDark) document.documentElement.classList.add('dark');
    
    document.getElementById('theme-toggle').addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    });
}

// FETCH DATA
function fetchProducts() {
    document.getElementById('loading').classList.remove('hidden');
    
    Papa.parse(GOOGLE_SHEET_URL, {
        download: true,
        header: true,
        complete: function(results) {
            console.log("Datos crudos:", results.data);
            allProducts = results.data
                .filter(item => item.Nombre && item.Precio) 
                .map((item, index) => {
                    const cleanName = item.Nombre.trim();
                    const cleanPrice = parseFloat(item.Precio.replace('$','').replace('.','').replace(',','.'));
                    const lowerName = cleanName.toLowerCase();
                    
                    let imgSrc = defaultImage;
                    for (const [key, url] of Object.entries(customImages)) {
                        if (lowerName.includes(key)) {
                            imgSrc = url;
                            break;
                        }
                    }

                    // Determinar categoría básica si no existe en la sheet
                    let cat = 'accesorios';
                    if(lowerName.includes('gato') || lowerName.includes('cat')) cat = 'gato';
                    else if(lowerName.includes('perro') || lowerName.includes('dog') || lowerName.includes('adulto') || lowerName.includes('cachorro')) cat = 'perro';
                    
                    if(item.Categoria) cat = item.Categoria.toLowerCase();

                    return {
                        id: index,
                        name: cleanName,
                        price: cleanPrice,
                        type: item.Variedad || 'Unidad', // Peso o Variedad
                        category: cat,
                        image: imgSrc
                    };
                });
            
            document.getElementById('loading').classList.add('hidden');
            renderProducts();
        },
        error: function(err) {
            console.error(err);
            Swal.fire('Error', 'No se pudo cargar el catálogo.', 'error');
        }
    });
}

// RENDER PRODUCTS
function renderProducts(searchTerm = '') {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';
    const term = searchTerm.toLowerCase();

    const filtered = allProducts.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(term);
        const matchesCat = currentCategory === 'all' || p.category.includes(currentCategory);
        return matchesSearch && matchesCat;
    });

    if (filtered.length === 0) {
        document.getElementById('no-results').classList.remove('hidden');
    } else {
        document.getElementById('no-results').classList.add('hidden');
    }

    filtered.forEach(p => {
        // Formato de precio Argentina
        const priceFormatted = p.price.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 });
        
        const card = document.createElement('div');
        // Clases Tailwind para la tarjeta
        card.className = 'group bg-white dark:bg-dark-card rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col relative';
        
        card.innerHTML = `
            <div class="relative w-full h-56 overflow-hidden bg-gray-100 dark:bg-gray-800 p-6 flex items-center justify-center">
                <img src="${p.image}" alt="${p.name}" class="w-auto h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-500">
                
                ${p.type !== 'Unidad' ? `
                <span class="absolute top-3 left-3 bg-white/90 dark:bg-dark/90 backdrop-blur text-xs font-bold px-2 py-1 rounded-lg shadow-sm text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-600">
                    ${p.type}
                </span>` : ''}

                <button onclick="addToCart(${p.id})" class="absolute bottom-3 right-3 bg-white dark:bg-dark text-primary w-10 h-10 rounded-full flex items-center justify-center shadow-lg translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white" aria-label="Añadir">
                    <i class="fa-solid fa-plus"></i>
                </button>
            </div>
            
            <div class="p-5 flex-1 flex flex-col">
                <div class="mb-2">
                    <span class="text-[10px] uppercase tracking-wider font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full inline-block mb-2">
                        ${p.category.toUpperCase()}
                    </span>
                    <h3 class="font-heading font-semibold text-gray-800 dark:text-gray-100 text-lg leading-tight line-clamp-2 min-h-[3rem]" title="${p.name}">
                        ${p.name}
                    </h3>
                </div>
                
                <div class="mt-auto pt-4 flex items-center justify-between border-t border-gray-50 dark:border-gray-700/50">
                    <span class="text-2xl font-bold text-primary font-heading">${priceFormatted}</span>
                </div>
                
                <button onclick="addToCart(${p.id})" class="mt-3 w-full py-2.5 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-colors text-sm">
                    Agregar al carrito
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// CART LOGIC
function addToCart(id) {
    const product = allProducts.find(p => p.id === id);
    const existing = cart.find(i => i.id === id);
    
    if (existing) {
        existing.qty++;
        showToast(`+1 ${product.name}`);
    } else {
        cart.push({ ...product, qty: 1 });
        showToast(`${product.name} agregado`);
    }
    updateCartUI();
    // Animación del botón carrito
    const btn = document.querySelector('[onclick="openCart()"]');
    btn.classList.add('animate-bounce');
    setTimeout(() => btn.classList.remove('animate-bounce'), 500);
}

function updateCartUI() {
    const count = cart.reduce((acc, item) => acc + item.qty, 0);
    document.getElementById('cart-count').textContent = count;
    
    const container = document.getElementById('cart-items');
    container.innerHTML = '';
    
    let total = 0;
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center h-64 text-center">
                <div class="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-300">
                    <i class="fa-solid fa-basket-shopping text-3xl"></i>
                </div>
                <p class="text-gray-500 font-medium">Tu carrito está vacío</p>
                <button onclick="closeAllModals()" class="mt-4 text-primary font-bold hover:underline">Ir a comprar</button>
            </div>
        `;
    }

    cart.forEach((item, index) => {
        const subtotal = item.price * item.qty;
        total += subtotal;
        
        const div = document.createElement('div');
        div.className = 'flex gap-4 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 items-center';
        div.innerHTML = `
            <img src="${item.image}" class="w-16 h-16 object-cover rounded-xl bg-white dark:bg-gray-700">
            <div class="flex-1 min-w-0">
                <h4 class="font-bold text-sm text-gray-800 dark:text-gray-200 truncate">${item.name}</h4>
                <p class="text-xs text-gray-500">${item.type}</p>
                <div class="flex items-center gap-3 mt-2">
                    <button onclick="changeQty(${index}, -1)" class="w-6 h-6 rounded-full bg-white dark:bg-gray-600 shadow text-gray-600 dark:text-white flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"><i class="fa-solid fa-minus text-xs"></i></button>
                    <span class="font-bold text-sm w-4 text-center">${item.qty}</span>
                    <button onclick="changeQty(${index}, 1)" class="w-6 h-6 rounded-full bg-white dark:bg-gray-600 shadow text-gray-600 dark:text-white flex items-center justify-center hover:bg-green-50 hover:text-green-500 transition-colors"><i class="fa-solid fa-plus text-xs"></i></button>
                </div>
            </div>
            <div class="text-right">
                <p class="font-bold text-primary">$${subtotal.toLocaleString('es-AR')}</p>
                <button onclick="removeItem(${index})" class="text-xs text-red-400 hover:text-red-600 mt-1 underline">Eliminar</button>
            </div>
        `;
        container.appendChild(div);
    });
    
    document.getElementById('cart-total').textContent = '$' + total.toLocaleString('es-AR');
}

function changeQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    updateCartUI();
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// MODAL SYSTEM (UPDATED FOR TAILWIND)
function openCart() {
    const modal = document.getElementById('cart-modal');
    const content = document.getElementById('cart-content');
    modal.classList.remove('hidden');
    // Forzamos reflow para animación
    setTimeout(() => {
        content.classList.remove('translate-x-full');
    }, 10);
}

function openProfile() {
    if(!currentUser) {
        const modal = document.getElementById('login-modal');
        const content = document.getElementById('login-content');
        modal.classList.remove('hidden');
        setTimeout(() => {
            content.classList.remove('scale-95', 'opacity-0');
            content.classList.add('scale-100', 'opacity-100');
        }, 10);
    } else {
        const modal = document.getElementById('profile-modal');
        const content = document.getElementById('profile-content');
        renderHistory();
        modal.classList.remove('hidden');
        setTimeout(() => {
            content.classList.remove('translate-x-full');
        }, 10);
    }
}

function closeAllModals() {
    // Carrito y Perfil (Slide out)
    const slideModals = ['cart', 'profile'];
    slideModals.forEach(id => {
        const modal = document.getElementById(id+'-modal');
        const content = document.getElementById(id+'-content');
        if(!modal.classList.contains('hidden')) {
            content.classList.add('translate-x-full');
            setTimeout(() => modal.classList.add('hidden'), 300);
        }
    });

    // Login y Checkout (Fade/Scale out)
    const fadeModals = ['login', 'checkout'];
    fadeModals.forEach(id => {
        const modal = document.getElementById(id+'-modal');
        const content = document.getElementById(id+'-content');
        if(!modal.classList.contains('hidden')) {
            content.classList.remove('scale-100', 'opacity-100');
            content.classList.add('scale-95', 'opacity-0');
            setTimeout(() => modal.classList.add('hidden'), 300);
        }
    });
}

// USER & AUTH
function saveUser() {
    const name = document.getElementById('login-name').value;
    const phone = document.getElementById('login-phone').value;
    
    if(!name || !phone) return Swal.fire('Error', 'Completa los campos', 'warning');
    
    currentUser = { name, phone };
    localStorage.setItem('peluditos_user', JSON.stringify(currentUser));
    loadUser();
    closeAllModals();
    Swal.fire({
        icon: 'success',
        title: '¡Hola ' + name + '!',
        text: 'Ya puedes realizar tus pedidos.',
        timer: 2000,
        showConfirmButton: false
    });
}

function loadUser() {
    const saved = localStorage.getItem('peluditos_user');
    if(saved) {
        currentUser = JSON.parse(saved);
        document.getElementById('profile-name').textContent = currentUser.name;
        document.getElementById('profile-phone').textContent = currentUser.phone;
        document.getElementById('profile-initial').textContent = currentUser.name.charAt(0).toUpperCase();
        
        // Auto fill checkout
        if(document.getElementById('cx-calle')) {
            // Podríamos guardar dirección en futuro
        }
        
        // Load History
        const savedHistory = localStorage.getItem('peluditos_history_' + currentUser.phone.replace(/\D/g,''));
        if(savedHistory) userHistory = JSON.parse(savedHistory);
    }
}

function logout() {
    localStorage.removeItem('peluditos_user');
    currentUser = null;
    window.location.reload();
}

// CHECKOUT & WHATSAPP
function checkout() {
    if(cart.length === 0) return Swal.fire('Carrito vacío', 'Agrega productos primero', 'warning');
    
    if(!currentUser) {
        closeAllModals();
        openProfile(); // Trigger login
        return;
    }
    
    closeAllModals(); // Close cart
    const modal = document.getElementById('checkout-modal');
    const content = document.getElementById('checkout-content');
    modal.classList.remove('hidden');
    setTimeout(() => {
        content.classList.remove('scale-95', 'opacity-0');
        content.classList.add('scale-100', 'opacity-100');
    }, 10);
}

function toggleDelivery(enable) {
    const fields = document.getElementById('delivery-fields');
    if(enable) fields.classList.remove('hidden');
    else fields.classList.add('hidden');
}

function sendOrder() {
    const deliveryType = document.querySelector('input[name="delivery"]:checked').value;
    const paymentType = document.getElementById('cx-payment').value;
    const obs = document.getElementById('cx-obs').value;
    
    const { name, phone } = currentUser;
    
    let addressText = '';
    if (deliveryType === 'envio') {
        const calle = document.getElementById('cx-calle').value;
        const extra = document.getElementById('cx-piso').value;
        const entre = document.getElementById('cx-entre').value;
        
        if (!calle) return Swal.fire({ text: 'Por favor indica la dirección de entrega', icon: 'warning' });
        
        addressText = `📍 *Envío a:* ${calle} ${extra ? '('+extra+')' : ''}\n`;
        if(entre) addressText += `   Entre: ${entre}\n`;
    } else {
        addressText = `🏪 *Retiro en Local*\n`;
    }

    let msg = `Hola Peluditos! 👋 Soy *${name}*.\n`;
    msg += `📞 Tel: ${phone}\n\n`;
    msg += `📋 *MI PEDIDO:*\n`;
    
    let total = 0;
    cart.forEach(i => {
        let sub = i.price * i.qty;
        total += sub;
        msg += `▪️ ${i.qty} x ${i.name} (${i.type}) = $${sub.toLocaleString('es-AR')}\n`;
    });
    
    msg += `\n💰 *TOTAL: $${total.toLocaleString('es-AR')}*\n`;
    msg += `------------------\n`;
    msg += addressText;
    msg += `💳 *Pago:* ${paymentType.toUpperCase()}\n`;
    if(obs) msg += `📝 *Nota:* ${obs}\n`;

    // Save History
    const orderRecord = { date: new Date().toISOString(), items: [...cart], total: total };
    let historyKey = 'peluditos_history_' + phone.replace(/\D/g,'');
    let history = JSON.parse(localStorage.getItem(historyKey) || '[]');
    history.unshift(orderRecord);
    localStorage.setItem(historyKey, JSON.stringify(history));

    // Send
    const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(link, '_blank');
    
    cart = [];
    updateCartUI();
    closeAllModals();
}

function renderHistory() {
    const container = document.getElementById('history-container');
    container.innerHTML = '';
    
    if(userHistory.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-sm italic">Aún no tienes pedidos registrados.</p>';
        return;
    }

    userHistory.forEach(order => {
        const date = new Date(order.date).toLocaleDateString();
        const div = document.createElement('div');
        div.className = 'bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700';
        
        let itemsHtml = order.items.map(i => `<li class="text-sm text-gray-600 dark:text-gray-400">• ${i.qty}x ${i.name}</li>`).join('');
        
        div.innerHTML = `
            <div class="flex justify-between items-center mb-2">
                <span class="text-xs font-bold bg-white dark:bg-gray-700 px-2 py-1 rounded text-gray-500">${date}</span>
                <span class="text-primary font-bold">$${order.total.toLocaleString('es-AR')}</span>
            </div>
            <ul class="mb-3 space-y-1">${itemsHtml}</ul>
            <button onclick="repeatOrder('${order.date}')" class="w-full py-2 bg-green-100 text-green-700 text-sm font-bold rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center gap-2">
                <i class="fa-solid fa-rotate-right"></i> Repetir Pedido
            </button>
        `;
        container.appendChild(div);
    });
}

function repeatOrder(dateStr) {
    const order = userHistory.find(o => o.date === dateStr);
    if(order) {
        cart = [...order.items];
        updateCartUI();
        closeAllModals();
        openCart();
        Swal.fire('Listo', 'Productos agregados al carrito', 'success');
    }
}

// TOAST NOTIFICATION
function showToast(text) {
    const Toast = Swal.mixin({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: false,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    });
    
    Toast.fire({
        icon: 'success',
        title: text,
        background: document.documentElement.classList.contains('dark') ? '#1F2937' : '#fff',
        color: document.documentElement.classList.contains('dark') ? '#fff' : '#000'
    });
}

// Dependencia PapaParse para leer CSV
const script = document.createElement('script');
script.src = "https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.0/papaparse.min.js";
document.head.appendChild(script);