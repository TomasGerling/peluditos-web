const GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRbHFTGg7yD-wla-WTyuksMKmoPhblVtdrNAEf_BpQStuoAvVQZx2cwgigSYETo_A/pub?gid=1152455124&single=true&output=csv";
const WHATSAPP_NUMBER = "5492262677026"; 

let allProducts = [];
let cart = [];
let currentCategory = 'all';
let currentUser = null; 

// Mapeo de imágenes según palabras clave en el nombre
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

async function init() {
    loadUser(); 
    try {
        const response = await fetch(GOOGLE_SHEET_URL);
        const csvText = await response.text();
        
        // Usamos PapaParse para leer el CSV correctamente (ya incluido en tu HTML)
        Papa.parse(csvText, {
            header: false, // No usamos header automático porque el Excel tiene filas arriba
            skipEmptyLines: true,
            complete: function(results) {
                processData(results.data);
            }
        });

    } catch (error) {
        console.error("Error cargando Excel:", error);
        const loader = document.getElementById('loader');
        if(loader) loader.innerHTML = "<p>Error de conexión. Intenta recargar.</p>";
    }
}

function processData(rows) {
    allProducts = [];
    // Ordenamos claves de imagen por longitud para machear las más específicas primero
    const keywords = Object.keys(customImages).sort((a, b) => b.length - a.length);

    // Empezamos en i = 3 porque tu Excel tiene 3 filas de encabezados (ALIAS, PERRO, Headers)
    // Ajustar si es necesario, pero rows[3] debería ser el primer dato real.
    for (let i = 0; i < rows.length; i++) {
        const columns = rows[i];
        
        // Validación básica: necesitamos al menos columnas hasta el precio
        if (columns.length < 8) continue;

        // COLUMNA B (Indice 1) es la DESCRIPCION
        const rawName = columns[1]; 
        
        // Si no hay nombre, o es el encabezado "DESCRIPCION", saltamos
        if (!rawName || rawName === "DESCRIPCION" || rawName.trim() === "") continue;

        const name = rawName.trim();

        // COLUMNA H (Indice 7) -> Precio X KG (Según tu foto)
        // COLUMNA I (Indice 8) -> Precio BOLSA (Según tu foto)
        // Limpiamos el string de signos $ o puntos de mil si vinieran mal formateados, aunque parseFloat suele manejarlos
        // Nota: Si el excel usa coma decimal "1.200,50", JS necesita punto. 
        // Asumimos formato estándar CSV numérico.
        
        let priceKg = parseFloat(columns[7]); 
        let priceCerrada = parseFloat(columns[8]);

        // Si ambos precios son inválidos, saltamos la fila (quizás es un subtítulo)
        if ((isNaN(priceKg) || priceKg <= 0) && (isNaN(priceCerrada) || priceCerrada <= 0)) continue;

        const lowerName = name.toLowerCase();
        let category = 'otros';
        let catLabel = 'Varios';

        // Lógica de categorías
        if (lowerName.match(/gato|cat|kitten|gati|whiskas|felino|7 vidas|fit 32|urinary/)) {
            category = 'gato'; catLabel = 'Gato';
        } else if (lowerName.match(/perro|dog|cachorro|adulto|raza|pedigree|dogui|canino|advance|nutricare|old prince|sieger|pipon|gooster|junior|mini|medium|maxi|mordida|sileoni/)) {
            category = 'perro'; catLabel = 'Perro';
        }

        // Lógica de imágenes
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

        // Agregamos precios solo si existen
        if (!isNaN(priceKg) && priceKg > 0) {
            product.prices.push({ type: 'Por KG', price: priceKg });
        }
        if (!isNaN(priceCerrada) && priceCerrada > 0) {
            product.prices.push({ type: 'Bolsa Cerrada', price: priceCerrada });
        }

        allProducts.push(product);
    }
    
    // UI: Ocultar loader y mostrar grid
    const loader = document.getElementById('loader');
    const grid = document.getElementById('product-grid');
    if(loader) loader.style.display = 'none';
    if(grid) grid.style.display = 'grid';
    
    renderProducts(allProducts);
}

function renderProducts(products) {
    const grid = document.getElementById('product-grid');
    if(!grid) return;
    grid.innerHTML = "";
    
    if(products.length === 0) {
        grid.innerHTML = "<p style='grid-column: 1/-1; text-align:center;'>No se encontraron productos.</p>";
        return;
    }

    products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'card'; 
        
        let priceOptions = p.prices.map(pr => `
            <div class="price-option">
                <div class="price-info">
                    <span class="price-label">${pr.type}</span>
                    <span class="price-amount">$${pr.price.toLocaleString('es-AR')}</span>
                </div>
                <button onclick="addToCart('${p.id}', '${pr.type}', ${pr.price})" class="btn-add" aria-label="Agregar al carrito">
                    <i class="fa-solid fa-plus"></i>
                </button>
            </div>
        `).join('');

        card.innerHTML = `
            <div class="card-img-container">
                <span class="offer-badge">${p.catLabel}</span>
                <img src="${p.image}" alt="${p.name}" class="product-img" onerror="this.src='https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=400'">
            </div>
            <div class="card-body" style="flex:1; display:flex; flex-direction:column;">
                <div class="card-header" style="padding:0; margin-bottom:10px;">
                    <h3 class="card-title">${p.name}</h3>
                </div>
                <div style="margin-top:auto;">
                    ${priceOptions}
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// --- FILTROS Y UI ---

function toggleTheme() {
    const body = document.body;
    const current = body.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
}

function setCategory(cat, btnElement) {
    currentCategory = cat;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    if(btnElement) btnElement.classList.add('active');
    applyFilters();
}

function applyFilters() {
    const input = document.getElementById('searchInput');
    const query = input ? input.value.toLowerCase() : "";
    const sortVal = document.getElementById('priceSort').value;

    let filtered = allProducts.filter(p => {
        const matchesCat = currentCategory === 'all' || p.category === currentCategory;
        const matchesSearch = p.name.toLowerCase().includes(query);
        return matchesCat && matchesSearch;
    });

    if (sortVal !== 'default') {
        filtered.sort((a, b) => {
            const priceA = a.prices[0] ? a.prices[0].price : 0;
            const priceB = b.prices[0] ? b.prices[0].price : 0;
            return sortVal === 'asc' ? priceA - priceB : priceB - priceA;
        });
    }

    renderProducts(filtered);
}

// --- CARRITO ---

function addToCart(pid, type, price) {
    const product = allProducts.find(x => x.id === pid);
    const cartKey = `${pid}-${type}`;
    const existing = cart.find(i => i.cartKey === cartKey);
    
    if (existing) { 
        existing.qty++; 
    } else { 
        cart.push({ cartKey, id: pid, name: product.name, type, price, qty: 1 }); 
    }
    
    // Animación visual botón flotante
    const floatBtn = document.querySelector('.cart-float');
    if(floatBtn) {
        floatBtn.style.transform = "scale(1.1)";
        setTimeout(() => floatBtn.style.transform = "scale(1)", 200);
    }

    updateCartUI();
}

function updateCartUI() {
    const count = cart.reduce((acc, i) => acc + i.qty, 0);
    const countBadge = document.getElementById('cart-count');
    if(countBadge) countBadge.textContent = count;
    
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        if(container) container.innerHTML = '<div style="text-align:center; padding:40px; color:var(--text-light);"><i class="fa-solid fa-basket-shopping" style="font-size:2rem; margin-bottom:10px;"></i><p>Tu carrito está vacío</p></div>';
        if(totalEl) totalEl.textContent = "$0";
        return;
    }

    let total = 0;
    const itemsHtml = cart.map((item, index) => {
        total += item.price * item.qty;
        return `
            <div class="cart-item">
                <div style="flex:1">
                    <div style="font-weight:700; margin-bottom:4px;">${item.name}</div>
                    <div style="font-size:0.85rem; color:var(--text-light);">${item.type} x $${item.price}</div>
                </div>
                <div class="qty-control">
                    <button onclick="changeQty(${index}, -1)" class="qty-btn">-</button>
                    <span style="font-weight:600; min-width:20px; text-align:center;">${item.qty}</span>
                    <button onclick="changeQty(${index}, 1)" class="qty-btn">+</button>
                </div>
            </div>`;
    }).join('');
    
    if(container) container.innerHTML = itemsHtml;
    if(totalEl) totalEl.textContent = `$${total.toLocaleString('es-AR')}`;
}

function changeQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    updateCartUI();
}

function toggleCart() {
    const modal = document.getElementById('cart-modal');
    const overlay = document.getElementById('cart-overlay');
    if(modal) modal.classList.toggle('active');
    if(overlay) overlay.classList.toggle('active');
}

function closeAllModals() {
    document.querySelectorAll('.cart-modal').forEach(m => m.classList.remove('active'));
    const overlay = document.getElementById('cart-overlay');
    if(overlay) overlay.classList.remove('active');
}

// --- USUARIO ---

function openLoginOrProfile() {
    if (currentUser) {
        const pModal = document.getElementById('profile-modal');
        const overlay = document.getElementById('cart-overlay');
        if(pModal) pModal.classList.add('active');
        if(overlay) overlay.classList.add('active');
    } else {
        const lModal = document.getElementById('login-modal');
        const overlay = document.getElementById('cart-overlay');
        if(lModal) lModal.classList.add('active');
        if(overlay) overlay.classList.add('active');
        
        document.getElementById('step-phone').classList.remove('hidden');
        document.getElementById('step-name').classList.add('hidden');
        document.getElementById('login-phone').value = '';
    }
}

function checkEnter(event, action) {
    if (event.key === "Enter") {
        if (action === 'checkPhone') handleLoginCheck();
        if (action === 'register') handleRegister();
    }
}

function handleLoginCheck() {
    const phoneInput = document.getElementById('login-phone');
    const phone = phoneInput.value.trim();
    
    if (phone.length < 8) {
        alert("Por favor ingresa un número válido");
        return;
    }

    const storedUsers = JSON.parse(localStorage.getItem('peluditos_users_db') || '{}');
    
    if (storedUsers[phone]) {
        currentUser = storedUsers[phone];
        localStorage.setItem('peluditos_user', JSON.stringify(currentUser));
        closeAllModals();
        updateUserUI();
        Swal.fire({
            icon: 'success',
            title: `¡Hola de nuevo ${currentUser.nombre}!`,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });
    } else {
        document.getElementById('step-phone').classList.add('hidden');
        document.getElementById('step-name').classList.remove('hidden');
        document.getElementById('login-name').focus();
    }
}

function handleRegister() {
    const phone = document.getElementById('login-phone').value.trim();
    const name = document.getElementById('login-name').value.trim();
    
    if (name.length < 2) {
        alert("Por favor dinos tu nombre");
        return;
    }

    const newUser = { nombre: name, telefono: phone, history: [] };
    const storedUsers = JSON.parse(localStorage.getItem('peluditos_users_db') || '{}');
    storedUsers[phone] = newUser;
    localStorage.setItem('peluditos_users_db', JSON.stringify(storedUsers));

    currentUser = newUser;
    localStorage.setItem('peluditos_user', JSON.stringify(currentUser));
    
    closeAllModals();
    updateUserUI();
    Swal.fire({
        icon: 'success',
        title: `¡Bienvenido/a ${name}!`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
    });
}

function loadUser() {
    const saved = localStorage.getItem('peluditos_user');
    if (saved) {
        try {
            currentUser = JSON.parse(saved);
            updateUserUI();
        } catch(e) { 
            localStorage.removeItem('peluditos_user'); 
        }
    }
}

function updateUserUI() {
    if (currentUser && currentUser.nombre) {
        const btnDisplay = document.querySelector('#user-btn-display span');
        if(btnDisplay) btnDisplay.textContent = currentUser.nombre.split(' ')[0];
        
        const profileName = document.getElementById('profile-name');
        const profilePhone = document.getElementById('profile-phone');
        const profileInit = document.getElementById('profile-initial');
        
        if(profileName) profileName.textContent = currentUser.nombre;
        if(profilePhone) profilePhone.textContent = currentUser.telefono;
        if(profileInit) profileInit.textContent = currentUser.nombre.charAt(0).toUpperCase();
        
        loadHistory();
    } else {
        const btnDisplay = document.querySelector('#user-btn-display span');
        if(btnDisplay) btnDisplay.textContent = "Ingresar";
    }
}

function logout() {
    localStorage.removeItem('peluditos_user');
    currentUser = null;
    location.reload();
}

// --- CHECKOUT ---

function toggleAddress(show) {
    const addrSection = document.getElementById('address-section');
    const delText = document.getElementById('delivery-text');
    
    if (show) {
        addrSection.classList.remove('hidden');
        delText.textContent = "Costo se coordina por WhatsApp";
    } else {
        addrSection.classList.add('hidden');
        delText.textContent = "Envío a domicilio";
    }
}

function checkout() {
    if (cart.length === 0) {
        Swal.fire("Carrito vacío", "Agrega productos antes de finalizar.", "warning");
        return;
    }
    
    closeAllModals();
    
    if (currentUser) {
        document.getElementById('cx-name').value = currentUser.nombre;
        document.getElementById('cx-phone').value = currentUser.telefono;
    }
    
    document.getElementById('checkout-modal').classList.add('active');
    document.getElementById('cart-overlay').classList.add('active');
}

function closeCheckout() {
    document.getElementById('checkout-modal').classList.remove('active');
    document.getElementById('cart-overlay').classList.remove('active');
}

function sendOrder() {
    const name = document.getElementById('cx-name').value;
    const phone = document.getElementById('cx-phone').value;
    const deliveryType = document.querySelector('input[name="deliveryType"]:checked').value;
    const paymentType = document.querySelector('input[name="paymentType"]:checked').value;
    const obs = document.getElementById('cx-obs').value;
    
    if (!name || !phone) {
        Swal.fire("Faltan datos", "Por favor completa tu nombre y teléfono", "error");
        return;
    }

    if (deliveryType === 'delivery') {
        const calle = document.getElementById('cx-calle').value;
        if (!calle) {
            Swal.fire("Dirección requerida", "Para delivery necesitamos tu dirección", "error");
            return;
        }
    }

    let msg = `*HOLA! NUEVO PEDIDO WEB* 🐾\n\n`;
    msg += `👤 *Cliente:* ${name}\n`;
    msg += `📱 *Tel:* ${phone}\n\n`;
    
    msg += `🛒 *PEDIDO:*\n`;
    let total = 0;
    cart.forEach(item => {
        const sub = item.price * item.qty;
        total += sub;
        msg += `- ${item.qty}x ${item.name} (${item.type})\n`;
    });
    
    msg += `\n💰 *TOTAL: $${total.toLocaleString('es-AR')}*\n`;
    msg += `💳 *Pago:* ${paymentType.toUpperCase()}\n`;
    msg += `🚚 *Entrega:* ${deliveryType.toUpperCase()}\n`;
    
    if (deliveryType === 'delivery') {
        const calle = document.getElementById('cx-calle').value;
        const piso = document.getElementById('cx-piso').value;
        const entre = document.getElementById('cx-entre').value;
        msg += `📍 *Dirección:* ${calle} ${piso ? '('+piso+')' : ''}\n`;
        if(entre) msg += `   Entre: ${entre}\n`;
    }
    
    if (obs) msg += `📝 *Nota:* ${obs}\n`;

    // Historial
    if (currentUser) {
        const storedUsers = JSON.parse(localStorage.getItem('peluditos_users_db') || '{}');
        if (storedUsers[currentUser.telefono]) {
            if (!storedUsers[currentUser.telefono].history) storedUsers[currentUser.telefono].history = [];
            storedUsers[currentUser.telefono].history.unshift({
                date: new Date().toLocaleDateString(),
                total: total,
                items: cart.length
            });
            localStorage.setItem('peluditos_users_db', JSON.stringify(storedUsers));
        }
    }

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    
    cart = [];
    updateCartUI();
    closeAllModals();
}

function loadHistory() {
    const hContainer = document.getElementById('history-container');
    if (!hContainer || !currentUser) return;
    
    const storedUsers = JSON.parse(localStorage.getItem('peluditos_users_db') || '{}');
    const userRecord = storedUsers[currentUser.telefono];
    
    if (userRecord && userRecord.history && userRecord.history.length > 0) {
        hContainer.innerHTML = userRecord.history.map(h => `
            <div class="history-card">
                <div class="history-header">
                    <span>${h.date}</span>
                    <span>${h.items} productos</span>
                </div>
                <div class="history-price">$${h.total.toLocaleString('es-AR')}</div>
            </div>
        `).join('');
    } else {
        hContainer.innerHTML = "<p style='color:var(--text-light); text-align:center;'>Aún no tienes pedidos registrados.</p>";
    }
}

window.onload = init;