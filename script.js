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

// IMAGENES PERSONALIZADAS
const customImages = {
    "agility adulto raza pequena": "./img/agility-adulto-raza-pequena.webp",
    "agility cachorro": "./img/agility-cachorro.webp",
    "agility adulto": "./img/agility-adulto.webp",
    "advance bio adulto r. pequena": "./img/advance-bio-adulto-r-pequena.webp",
    "advance bio adulto": "./img/advance-bio-adulto.webp",
    "advance bio cachorro": "./img/advance-bio-cachorro.webp",
    "advance bio cordero": "./img/advance-bio-cordero.webp",
    "advance bio gato adulto": "./img/advance-bio-gato-adulto.webp",
    "dogui": "./img/dogui.webp",
    "nutricare cachorro": "./img/nutricare-cachorro.webp",
    "nutricare adulto": "./img/nutricare-adulto.webp",
    "old prince cordero y arroz adulto": "./img/old-prince-cordero-arroz.webp",
    "sieger adulto": "./img/sieger-adulto.webp",
    "gooster adulto": "./img/gooster-adulto.webp",
    "pipon adulto": "./img/pipon-adulto.webp",
    "sileoni adulto": "./img/sileoni-adulto.webp"
};

// 1. CARGA DE DATOS
async function init() {
    loadUser();
    showSkeleton();
    try {
        const response = await fetch(GOOGLE_SHEET_URL);
        const data = await response.text();
        processData(data);
    } catch (error) {
        console.error("Error cargando Excel:", error);
        document.getElementById('products-grid').innerHTML = '<p style="padding:20px; text-align:center;">Error al conectar con el catálogo. Reintenta en unos instantes.</p>';
    }
}

function processData(csv) {
    const lines = csv.split('\n');
    allProducts = [];
    const keywords = Object.keys(customImages).sort((a, b) => b.length - a.length);

    // Empezamos desde la fila 1 (asumiendo que la 0 es cabecera)
    for (let i = 1; i < lines.length; i++) {
        const columns = lines[i].split(',');
        if (columns.length < 8) continue;

        const name = columns[0] ? columns[0].trim() : "";
        if (!name || name.toLowerCase().includes("producto")) continue;

        const priceKg = parseFloat(columns[7]);
        const priceCerrada = parseFloat(columns[8]);
        
        // Si no tiene ningún precio válido, saltar
        if (isNaN(priceKg) && isNaN(priceCerrada)) continue;

        const lowerName = name.toLowerCase();
        
        // CATEGORIZACIÓN MEJORADA
        let category = 'otros';
        let catLabel = 'Varios';

        if (lowerName.match(/gato|cat|kitten|gati|whiskas|felino|7 vidas|fit 32|urinary/)) {
            category = 'gato';
            catLabel = 'Gato';
        } else if (lowerName.match(/perro|dog|cachorro|adulto|raza|pedigree|dogui|canino|advance|nutricare|old prince|sieger|pipon|gooster|junior|mini|medium|maxi|mordida|sileoni/)) {
            category = 'perro';
            catLabel = 'Perro';
        }

        // ASIGNACIÓN DE IMAGEN
        let img = "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=400";
        for (const key of keywords) {
            if (lowerName.includes(key)) {
                img = customImages[key];
                break;
            }
        }

        const product = {
            id: `prod-${i}`,
            name: name,
            category: category,
            catLabel: catLabel,
            image: img,
            prices: []
        };

        if (!isNaN(priceKg) && priceKg > 0) product.prices.push({ type: 'Por KG', price: priceKg });
        if (!isNaN(priceCerrada) && priceCerrada > 0) product.prices.push({ type: 'Bolsa Cerrada', price: priceCerrada });

        allProducts.push(product);
    }
    renderProducts(allProducts);
}

// 2. RENDERIZADO
function renderProducts(products) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = "";

    if (products.length === 0) {
        grid.innerHTML = '<p style="grid-column:1/-1; text-align:center; padding:50px;">No se encontraron productos.</p>';
        return;
    }

    products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        let priceOptions = p.prices.map(pr => `
            <div class="price-row">
                <span>${pr.type}: <strong>$${pr.price.toLocaleString('es-AR')}</strong></span>
                <button onclick="addToCart('${p.id}', '${pr.type}', ${pr.price})" class="add-btn" aria-label="Añadir al carrito">
                    <i class="fa-solid fa-plus"></i>
                </button>
            </div>
        `).join('');

        card.innerHTML = `
            <div class="badge">${p.catLabel}</div>
            <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=400'">
            <div class="product-info">
                <h3>${p.name}</h3>
                <div class="price-container">${priceOptions}</div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// 3. FILTROS
function filterCategory(cat) {
    currentCategory = cat;
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    event.currentTarget.classList.add('active');
    applyFilters();
}

function applyFilters() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const filtered = allProducts.filter(p => {
        const matchesCat = currentCategory === 'all' || p.category === currentCategory;
        const matchesSearch = p.name.toLowerCase().includes(query);
        return matchesCat && matchesSearch;
    });
    renderProducts(filtered);
}

// 4. CARRITO
function addToCart(pid, type, price) {
    const product = allProducts.find(x => x.id === pid);
    const cartKey = `${pid}-${type}`;
    const existing = cart.find(i => i.cartKey === cartKey);

    if (existing) {
        existing.qty++;
    } else {
        cart.push({ cartKey, id: pid, name: product.name, type, price, qty: 1 });
    }
    updateCartUI();
    
    // Feedback visual
    const btn = event.currentTarget;
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-check"></i>';
    btn.style.background = 'var(--secondary)';
    setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = '';
    }, 800);
}

function updateCartUI() {
    const count = cart.reduce((acc, i) => acc + i.qty, 0);
    document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
    
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total-amount');
    
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:gray; padding:20px;">Tu carrito está vacío</p>';
        totalEl.textContent = "0";
        return;
    }

    let total = 0;
    container.innerHTML = cart.map((item, index) => {
        total += item.price * item.qty;
        return `
            <div class="cart-item">
                <div style="flex:1">
                    <div style="font-weight:600; font-size:0.9rem">${item.name}</div>
                    <div style="font-size:0.8rem; color:var(--text-light)">${item.type}</div>
                </div>
                <div class="qty-controls">
                    <button onclick="changeQty(${index}, -1)">-</button>
                    <span>${item.qty}</span>
                    <button onclick="changeQty(${index}, 1)">+</button>
                </div>
                <div style="font-weight:700; min-width:70px; text-align:right">$${(item.price * item.qty).toLocaleString('es-AR')}</div>
            </div>
        `;
    }).join('');
    totalEl.textContent = total.toLocaleString('es-AR');
}

function changeQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    updateCartUI();
}

// 5. MODALES Y NAVEGACIÓN
function toggleCart() {
    document.getElementById('cart-modal').classList.toggle('active');
    document.body.style.overflow = document.getElementById('cart-modal').classList.contains('active') ? 'hidden' : '';
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
    document.body.style.overflow = '';
}

function showSkeleton() {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = Array(6).fill('<div class="skeleton"></div>').join('');
}

// 6. LOGIN Y PERFIL
function loadUser() {
    const saved = localStorage.getItem('peluditos_user');
    if (saved) {
        currentUser = JSON.parse(saved);
        updateUserUI();
    }
}

function updateUserUI() {
    if (currentUser) {
        document.getElementById('user-name-display').textContent = currentUser.nombre.split(' ')[0];
        document.getElementById('profile-name').textContent = currentUser.nombre;
        document.getElementById('profile-phone').textContent = currentUser.telefono;
        document.getElementById('profile-initial').textContent = currentUser.nombre.charAt(0).toUpperCase();
        loadHistory();
    }
}

function openProfile() {
    if (!currentUser) {
        Swal.fire({
            title: '¡Hola!',
            text: 'Para ver tu perfil y pedidos, por favor ingresa tus datos.',
            input: 'text',
            inputPlaceholder: 'Tu Nombre',
            showCancelButton: true,
            confirmButtonText: 'Continuar'
        }).then(res => {
            if (res.isConfirmed && res.value) {
                const nombre = res.value;
                Swal.fire({
                    title: 'Teléfono',
                    input: 'tel',
                    inputPlaceholder: 'Tu WhatsApp (ej: 2262...)'
                }).then(res2 => {
                    if (res2.isConfirmed && res2.value) {
                        currentUser = { nombre, telefono: res2.value };
                        localStorage.setItem('peluditos_user', JSON.stringify(currentUser));
                        updateUserUI();
                        document.getElementById('profile-modal').classList.add('active');
                    }
                });
            }
        });
    } else {
        document.getElementById('profile-modal').classList.add('active');
    }
}

function logout() {
    localStorage.removeItem('peluditos_user');
    currentUser = null;
    location.reload();
}

// 7. FINALIZAR PEDIDO
function checkout() {
    if (cart.length === 0) return;
    if (!currentUser) {
        openProfile();
        return;
    }
    document.getElementById('checkout-modal').classList.add('active');
}

function sendWhatsApp() {
    const paymentType = document.querySelector('input[name="pago"]:checked').value;
    const deliveryType = document.querySelector('input[name="entrega"]:checked').value;
    const obs = document.getElementById('cx-obs').value;
    
    let addressText = "";
    if (deliveryType === 'delivery') {
        const calle = document.getElementById('cx-calle').value;
        if (!calle) return Swal.fire({ text: 'Por favor indica la dirección de entrega', icon: 'warning' });
        addressText = `📍 *Envío a:* ${calle}\n`;
    } else {
        addressText = `🏪 *Retiro en Local*\n`;
    }

    let msg = `Hola Peluditos! 👋 Soy *${currentUser.nombre}*.\n\n`;
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
    if (obs) msg += `📝 *Nota:* ${obs}\n`;

    // Guardar en historial
    const pedido = {
        id: Date.now(),
        fecha: new Date().toLocaleDateString(),
        items: [...cart],
        total: total
    };
    userHistory.unshift(pedido);
    localStorage.setItem('peluditos_history_' + currentUser.telefono, JSON.stringify(userHistory.slice(0,10)));

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    cart = [];
    updateCartUI();
    closeAllModals();
    Swal.fire('¡Pedido Enviado!', 'Te contactaremos por WhatsApp.', 'success');
}

function loadHistory() {
    const container = document.getElementById('history-container');
    const saved = localStorage.getItem('peluditos_history_' + currentUser.telefono);
    if (saved) {
        userHistory = JSON.parse(saved);
        if (userHistory.length === 0) {
            container.innerHTML = '<p>No tienes pedidos anteriores.</p>';
            return;
        }
        container.innerHTML = userHistory.map(p => `
            <div class="history-card">
                <div style="display:flex; justify-content:space-between; margin-bottom:8px">
                    <strong>📅 ${p.fecha}</strong>
                    <span class="history-price">$${p.total.toLocaleString('es-AR')}</span>
                </div>
                <div style="font-size:0.8rem; color:var(--text-light)">
                    ${p.items.map(it => `${it.qty}x ${it.name}`).join(', ')}
                </div>
            </div>
        `).join('');
    } else {
        container.innerHTML = '<p>Aún no has realizado pedidos.</p>';
    }
}

// INICIO
window.onload = init;