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
    "dog chow adultos razas pequenas": "https://www.purina.com.ar/sites/default/files/styles/webp/public/2022-10/Dog-Chow-Adultos-Minis-y-Peque%C3%B1os.jpg.webp",
    "dog chow adultos razas medianas": "./img/dog-chow-adultos-razas-medianas.webp",
    "dogui cachorros": "./img/dogui-cachorros.webp",
    "dogui carne": "./img/dogui-carne.webp",
    "energy food adultos": "./img/energy-food-adultos.webp",
    "energy food cachorros": "./img/energy-food-cachorros.webp",
    "pipon pipon": "./img/pipon-pipon.webp",
    "eukanuba adulto": "./img/eukanuba-adulto.webp",
    "eukanuba adulto pequeno": "./img/eukanuba-adulto-pequeno.webp",
    "eukanuba cachorro": "./img/eukanuba-cachorro.webp",
    "excellent perro adulto m. pequena": "./img/excellent-perro-adulto-m-pequena.webp",
    "excellent perro cachorro m. pequena": "./img/excellent-perro-cachorro-m-pequena.webp",
    "fandog criadores": "./img/fandog-criadores.webp",
    "guardian adulto": "./img/guardian-adulto.webp",
    "guardian cachorro": "./img/guardian-cachorro.webp",
    "nutricare ad. mordida grande": "./img/nutricare-ad-mordida-grande.webp",
    "nutricare ad. mordida pequena": "./img/nutricare-ad-mordida-pequena.webp",
    "old prince hipoalergenico": "./img/old-prince-hipoalergenico.webp",
    "pedigree adultos carne": "./img/pedigree-adultos-carne.webp",
    "pedigree adultos carne y vegetales": "./img/pedigree-adultos-carne-y-vegetales.webp",
    "pedigree adultos razas pequenas": "./img/pedigree-adultos-razas-pequenas.webp",
    "pedigree cachorros": "./img/pedigree-cachorros.webp",
    "pedigree senior +7": "./img/pedigree-senior-7.webp",
    "royal canin mini junior mini": "./img/royal-canin-mini-junior-mini.webp",
    "royal canin mini adulto mini": "./img/royal-canin-mini-adulto-mini.webp",
    "royal canin performance adulto": "./img/royal-canin-performance-adulto.webp",
    "royal canin performance junior": "./img/royal-canin-performance-junior.webp",
    "sabrositos mix perro": "./img/sabrositos-mix-perro.webp",
    "sileoni": "./img/sileoni.webp",
    "vital can premium adulto": "./img/vital-can-premium-adulto.webp",
    "sieger": "./img/sieger.webp",
    "gooster": "./img/gooster.webp",
    "7 vidas": "./img/7-vidas.webp",
    "advance bio gato adulto": "./img/advance-bio-gato-adulto.webp",
    "advance bio gato urinary": "./img/advance-bio-gato-urinary.webp",
    "agility gato adulto": "./img/agility-gato-adulto.webp",
    "agility gato kitten": "./img/agility-gato-kitten.webp",
    "agility gato urinary": "./img/agility-gato-urinary.webp",
    "cat chow adulto carne": "./img/cat-chow-adulto-carne.webp",
    "cat chow adulto pescado": "./img/cat-chow-adulto-pescado.webp",
    "cat chow esterilizados": "./img/cat-chow-esterilizados.webp",
    "cat chow gatitos": "./img/cat-chow-gatitos.webp",
    "energy food gato": "./img/energy-food-gato.webp",
    "excellent adult cat": "./img/excellent-adult-cat.webp",
    "excelent kitten": "./img/excelent-kitten.webp",
    "excellent urinary adult cat": "./img/excellent-urinary-adult-cat.webp",
    "gati carne y pollo": "./img/gati-carne-y-pollo.webp",
    "gati pescado y salmon": "./img/gati-pescado-y-salmon.webp",
    "guardian gato adulto": "./img/guardian-gato-adulto.webp",
    "royal canin fit 32": "./img/royal-canin-fit-32.webp",
    "royal canin performance adult gato": "./img/royal-canin-performance-adult-gato.webp",
    "royal canin performance gato kitten": "./img/royal-canin-performance-gato-kitten.webp",
    "royal canin urinary": "./img/royal-canin-urinary.webp",
    "sabrositos mix gato": "./img/sabrositos-mix-gato.webp",
    "vital can complete kitten": "./img/vital-can-complete-kitten.webp",
    "vital can complete gato adulto": "./img/vital-can-complete-gato-adulto.webp",
    "whiskas carne": "./img/whiskas-carne.webp",
    "whiskas pescado": "./img/whiskas-pescado.webp",
    "whiskas pollo": "./img/whiskas-pollo.webp",
    "arroz saborizado": "./img/arroz-saborizado.webp",
};
const brandImages = {
    "royal": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Royal_Canin_logo.svg/300px-Royal_Canin_logo.svg.png",
    "pedigree": "https://1000marcas.net/wp-content/uploads/2021/06/Pedigree-Logo.png",
    "whiskas": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Whiskas_Logo.svg/300px-Whiskas_Logo.svg.png",
    "gati": "https://d22fxaf9t8d39k.cloudfront.net/60df9370accc82d7c0e78263724c9b207e865f6003759902cf6993c107567c9c90287.png",
    "dogui": "https://seeklogo.com/images/D/dogui-logo-227B23B75C-seeklogo.com.png",
    "raza": "https://www.grupo-molino.com/wp-content/uploads/2020/09/raza-logo.png",
    "eukanuba": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Eukanuba_logo.svg/300px-Eukanuba_logo.svg.png",
    "pro plan": "https://1000marcas.net/wp-content/uploads/2021/06/Purina-Pro-Plan-logo.png",
    "excellent": "https://www.purina-latam.com/sites/g/files/auxxlc391/files/styles/kraken_generic_max_width_500/public/2021-02/Purina%20Excellent%20Logo.png",
    "old prince": "https://oldprince.com.ar/assets/images/logo_op.png",
    "sieger": "https://sieger.com.ar/wp-content/uploads/2019/08/logo-sieger.png",
    "pipon": "https://static.wixstatic.com/media/893c12_3c003250005747449520443423759727~mv2.png",
    "advance": "https://advancebio.com.ar/wp-content/uploads/2024/09/logo-advance-bio-1.svg",
    "agility": "https://agility.com.ar/wp-content/uploads/2020/09/Logo-Agility.png",
    "dog chow": "https://www.purina.com.ar/sites/default/files/styles/webp/public/2021-02/Dog%20Chow%20Logo.png.webp"
};

document.getElementById('supportBtn').href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola Peluditos! Tengo una consulta...")}`;

// INICIALIZACION
window.onload = function() { 
    initTheme();
    updateShopStatus(); // Chequea horario
    loadUserSession(); 
    loadCart(); 
    fetchData(); 
};

// --- FUNCIÓN NUEVA: HORARIOS ---
function updateShopStatus() {
    const now = new Date();
    const day = now.getDay(); // 0 Domingo, 1 Lunes...
    const minutes = now.getHours() * 60 + now.getMinutes();

    const morningStart = 9 * 60;        // 09:00 -> 540
    const morningEnd = 13 * 60;         // 13:00 -> 780
    const afternoonStart = 16 * 60 + 30; // 16:30 -> 990
    const afternoonEnd = 20 * 60 + 30;   // 20:30 -> 1230

    let isOpen = false;
    let text = "Cerrado";

    // Si es Lunes a Sábado
    if (day >= 1 && day <= 6) {
        if ((minutes >= morningStart && minutes < morningEnd) ||
            (minutes >= afternoonStart && minutes < afternoonEnd)) {
            isOpen = true;
            text = "Abierto Ahora";
        } else {
            // Lógica inteligente de "Abre a las..."
            if (minutes < morningStart) text = "Abre 09:00hs";
            else if (minutes >= morningEnd && minutes < afternoonStart) text = "Abre 16:30hs";
            else text = "Cerrado";
        }
    } else {
        // Domingo
        text = "Cerrado (Domingo)";
    }

    const badge = document.getElementById('shop-status');
    const badgeText = document.getElementById('status-text');
    
    badgeText.innerText = text;
    if (isOpen) {
        badge.classList.remove('closed');
        badge.classList.add('open');
    } else {
        badge.classList.remove('open');
        badge.classList.add('closed');
    }
}

// --- SISTEMA DE USUARIOS ---
function loadUserSession() {
    const storedUser = localStorage.getItem('peluditos_user');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        updateUserUI(true);
        const storedHistory = localStorage.getItem('peluditos_history_' + currentUser.phone);
        userHistory = storedHistory ? JSON.parse(storedHistory) : [];
    } else {
        updateUserUI(false);
    }
}

function updateUserUI(isLoggedIn) {
    const btn = document.getElementById('user-btn-display');
    if (isLoggedIn) {
        btn.innerHTML = `<i class="fa-solid fa-user"></i> <span>${currentUser.name.split(' ')[0]}</span>`;
        document.getElementById('profile-name').innerText = currentUser.name;
        document.getElementById('profile-phone').innerText = "+54 " + currentUser.phone;
        document.getElementById('profile-initial').innerText = currentUser.name.charAt(0).toUpperCase();
    } else {
        btn.innerHTML = `<i class="fa-regular fa-user"></i> <span>Ingresar</span>`;
    }
}

function openLoginOrProfile() {
    closeAllModals();
    if (currentUser) {
        renderHistory();
        document.getElementById('profile-modal').classList.add('active');
        document.getElementById('cart-overlay').classList.add('active');
    } else {
        document.getElementById('step-phone').classList.remove('hidden');
        document.getElementById('step-name').classList.add('hidden');
        document.getElementById('login-phone').value = '';
        document.getElementById('login-modal').classList.add('active');
        document.getElementById('cart-overlay').classList.add('active');
        setTimeout(() => document.getElementById('login-phone').focus(), 300);
    }
}

function handleLoginCheck() {
    const phoneInput = document.getElementById('login-phone').value.trim();
    if (phoneInput.length < 8) {
        Swal.fire({ text: 'Ingresa un número válido', icon: 'warning', toast:true, position:'top', timer:2000, showConfirmButton:false });
        return;
    }
    let usersDB = JSON.parse(localStorage.getItem('peluditos_users_db')) || {};
    if (usersDB[phoneInput]) {
        currentUser = usersDB[phoneInput];
        localStorage.setItem('peluditos_user', JSON.stringify(currentUser));
        finishLogin();
    } else {
        document.getElementById('step-phone').classList.add('hidden');
        document.getElementById('step-name').classList.remove('hidden');
        setTimeout(() => document.getElementById('login-name').focus(), 300);
    }
}

function handleRegister() {
    const phone = document.getElementById('login-phone').value.trim();
    const name = document.getElementById('login-name').value.trim();
    if (name.length < 2) {
        Swal.fire({ text: 'Escribe tu nombre', icon: 'warning', toast:true, position:'top' });
        return;
    }
    const newUser = { phone, name, joined: new Date().toISOString() };
    let usersDB = JSON.parse(localStorage.getItem('peluditos_users_db')) || {};
    usersDB[phone] = newUser;
    localStorage.setItem('peluditos_users_db', JSON.stringify(usersDB));
    currentUser = newUser;
    localStorage.setItem('peluditos_user', JSON.stringify(currentUser));
    finishLogin();
}

function finishLogin() {
    loadUserSession();
    closeAllModals();
    Swal.fire({ icon: 'success', title: `¡Hola ${currentUser.name}!`, toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
}

function logout() {
    localStorage.removeItem('peluditos_user');
    currentUser = null;
    userHistory = [];
    updateUserUI(false);
    closeAllModals();
    Swal.fire({ text: 'Sesión cerrada', icon: 'info', toast:true, position:'top-end', timer:1500, showConfirmButton:false });
}

function checkEnter(e, action) {
    if (e.key === "Enter") {
        if (action === 'checkPhone') handleLoginCheck();
        if (action === 'register') handleRegister();
    }
}

function renderHistory() {
    const container = document.getElementById('history-container');
    if (!userHistory || userHistory.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:var(--text-light); padding:20px;">Aún no tienes pedidos guardados.</p>';
        return;
    }
    let html = '';
    [...userHistory].reverse().forEach((order, idx) => {
        const date = new Date(order.date).toLocaleDateString('es-AR');
        const itemsSummary = order.items.map(i => `${i.qty}x ${i.name}`).join(', ');
        const realIdx = userHistory.length - 1 - idx;
        html += `
        <div class="history-card">
            <div class="history-header"><span>Pedido #${1000 + realIdx}</span><span>${date}</span></div>
            <div class="history-items">${itemsSummary}</div>
            <div class="history-footer">
                <span class="history-price">$${order.total.toLocaleString('es-AR')}</span>
                <button class="btn-repeat" onclick="repeatOrder(${realIdx})"><i class="fa-solid fa-rotate-right"></i> Repetir</button>
            </div>
        </div>`;
    });
    container.innerHTML = html;
}

function repeatOrder(idx) {
    const order = userHistory[idx];
    if (!order) return;
    order.items.forEach(item => {
        const existing = cart.find(c => c.name === item.name && c.type === item.type);
        if (existing) { existing.qty += item.qty; } else { cart.push({ ...item }); }
    });
    saveCart(); updateCartUI(); closeAllModals(); toggleCart(); 
    Swal.fire({ title: 'Productos agregados', icon: 'success', toast: true, position: 'bottom-end', timer: 1500, showConfirmButton: false });
}

// --- CORE FUNCTIONS ---
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateThemeIcon('dark');
    }
}

function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const target = current === 'dark' ? 'light' : 'dark';
    if (target === 'dark') html.setAttribute('data-theme', 'dark');
    else html.removeAttribute('data-theme');
    localStorage.setItem('theme', target);
    updateThemeIcon(target);
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#themeBtn i');
    if (theme === 'dark') { icon.classList.remove('fa-moon'); icon.classList.add('fa-sun'); } 
    else { icon.classList.remove('fa-sun'); icon.classList.add('fa-moon'); }
}

function fetchData() {
    Papa.parse(GOOGLE_SHEET_URL, {
        download: true, header: false,
        complete: function(results) {
            processData(results.data);
            document.getElementById('loader').style.display = 'none';
            document.getElementById('product-grid').style.display = 'grid';
        },
        error: function() { document.getElementById('loader').innerHTML = `<div class="error-msg">Error cargando precios.</div>`; }
    });
}

function roundToCustomRule(value) {
    if (!value) return 0;
    let integerVal = Math.round(value); 
    let remainder = integerVal % 100;
    return remainder <= 50 ? integerVal - remainder : integerVal + (100 - remainder);
}

function getImageForProduct(name) {
    const normalize = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const lowerName = normalize(name);
    const customKeys = Object.keys(customImages).sort((a, b) => b.length - a.length);
    for (const key of customKeys) { if (lowerName.includes(key)) return customImages[key]; }
    for (const [brand, url] of Object.entries(brandImages)) { if (lowerName.includes(brand.toLowerCase())) return url; }
    return null;
}

function cleanProductName(name) {
    if (!name) return "";
    let clean = name.replace(/['"]/g, ''); 
    clean = clean.replace(/\b(perro|gato|perros|gatos)\b/gi, '').replace(/\s+/g, ' ').trim();
    return clean;
}

function processData(rows) {
    allProducts = [];
    const cleanPrice = (val) => {
        if (!val) return 0;
        let cleaned = val.toString().replace(/[$.]/g, '').replace(',', '.').replace(/[^\d.]/g, '');
        return roundToCustomRule(parseFloat(cleaned) || 0);
    };

    for (let i = 5; i < rows.length; i++) {
        const row = rows[i];
        let nombreRaw = row[2];
        if (!nombreRaw || nombreRaw.includes("DESCRIPCION")) continue;

        const weightRaw = row[3];
        const weight = (weightRaw && weightRaw.toString().trim() !== '') ? weightRaw : null;
        let valColH = cleanPrice(row[7]);
        let valColI = cleanPrice(row[8]);
        let precioKg = 0; let precioBolsa = 0;

        const normalize = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        const lowerName = normalize(nombreRaw);
        
        let category = 'otros'; let catLabel = ''; 
        if (lowerName.match(/gato|cat|kitten|gati|whiskas|felino|7 vidas|fit 32|urinary/)) { category = 'gato'; catLabel = 'Gato'; }
        else if (lowerName.match(/perro|dog|cachorro|adulto|raza|pedigree|dogui|canino|advance|nutricare|old prince|sieger|pipon|gooster|junior|mini|medium|maxi|mordida|sileoni/)) { category = 'perro'; catLabel = 'Perro'; }
        
        const isSpecial = lowerName.match(/piedra|arena|sanitaria|sobre|pouch|lata|humedo|golosina/);
        if (category === 'otros') {
            if (isSpecial) {
                category = 'otros'; catLabel = ''; 
                precioBolsa = Math.max(valColH, valColI);
                precioKg = 0;
            } else {
                precioBolsa = valColH; precioKg = valColI;    
            }
        } else {
            precioKg = valColH; precioBolsa = valColI;
        }

        let imgUrl = row[10] && row[10].startsWith('http') ? row[10] : getImageForProduct(nombreRaw);
        if (precioKg <= 0 && precioBolsa <= 0) continue;

        allProducts.push({
            nombre: cleanProductName(nombreRaw), originalName: nombreRaw, weight: weight, imgUrl: imgUrl, 
            precioKg: precioKg > 0 ? precioKg : null, precioBolsa: precioBolsa > 0 ? precioBolsa : null,
            category: category, catLabel: catLabel, isOffer: lowerName.includes('oferta') || lowerName.includes('promo')
        });
    }
    applyFilters();
}

function setCategory(cat, btn) {
    currentCategory = cat;
    document.querySelectorAll('.filter-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
    if(btn) { btn.classList.add('active'); btn.setAttribute('aria-pressed', 'true'); }
    applyFilters();
}

function applyFilters() {
    const term = document.getElementById('searchInput').value.toLowerCase();
    const sortOrder = document.getElementById('priceSort').value;
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '';
    const normalize = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    
    let filtered = allProducts.filter(p => {
        const matchCat = currentCategory === 'all' || p.category === currentCategory;
        const matchSearch = normalize(p.originalName).includes(normalize(term));
        return matchCat && matchSearch;
    });

    if (sortOrder !== 'default') {
        filtered.sort((a, b) => {
            const getMinPrice = (prod) => {
                const prices = [];
                if (prod.precioKg) prices.push(prod.precioKg);
                if (prod.precioBolsa) prices.push(prod.precioBolsa);
                return Math.min(...prices);
            };
            return sortOrder === 'asc' ? getMinPrice(a) - getMinPrice(b) : getMinPrice(b) - getMinPrice(a);
        });
    }

    if (filtered.length === 0) { grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:40px; color:var(--text-light);">No encontramos resultados 🐶🐱</div>'; return; }
    const fragment = document.createDocumentFragment();
    filtered.forEach(p => {
        const card = document.createElement('article'); card.className = 'card';
        let badgeHtml = p.isOffer ? `<div class="offer-badge">OFERTA</div>` : '';
        let catLabelHtml = p.catLabel ? `<span class="category-label horizontal">${p.catLabel}</span>` : '';
        let defaultIcon = 'fa-bag-shopping';
        if (p.category === 'perro') defaultIcon = 'fa-dog';
        if (p.category === 'gato') defaultIcon = 'fa-cat';
        let imgHtml = p.imgUrl ? 
            `<div class="card-img-container">${badgeHtml}<img src="${p.imgUrl}" alt="${p.nombre}" class="product-img" loading="lazy" width="200" height="200" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"><i class="fa-solid fa-paw placeholder-icon" style="display:none"></i>${catLabelHtml}</div>` : 
            `<div class="card-img-container">${badgeHtml}<i class="fa-solid ${defaultIcon} placeholder-icon"></i>${catLabelHtml}</div>`;
        
        let pricesHtml = '';
        const fmt = n => n.toLocaleString('es-AR');
        const jsSafeName = p.nombre.replace(/'/g, "\\'");
        
        if (p.precioKg) {
            pricesHtml += `<div class="price-option"><div class="price-info"><span class="price-label">x Kg Suelto</span><span class="price-amount">$${fmt(p.precioKg)}</span></div><button class="btn-add" onclick="addToCart('${jsSafeName}', 'Kg', ${p.precioKg})"><i class="fa-solid fa-plus"></i></button></div>`;
        }
        if (p.precioBolsa) {
            let labelBolsa = 'Unidad';
            if (p.weight) {
                const isNumber = !isNaN(parseFloat(p.weight)) && isFinite(p.weight);
                if (!isNumber || p.category === 'otros') { labelBolsa = p.weight; } 
                else { labelBolsa = `Bolsa ${p.weight} Kg`; }
            }
            pricesHtml += `<div class="price-option"><div class="price-info"><span class="price-label">${labelBolsa}</span><span class="price-amount">$${fmt(p.precioBolsa)}</span></div><button class="btn-add" onclick="addToCart('${jsSafeName}', '${labelBolsa}', ${p.precioBolsa})"><i class="fa-solid fa-plus"></i></button></div>`;
        }
        card.innerHTML = `${imgHtml}<div style="flex:1; display:flex; flex-direction:column;"><div class="card-header"><h2 class="card-title">${p.nombre}</h2></div><div class="card-body">${pricesHtml}</div></div>`;
        fragment.appendChild(card);
    });
    grid.appendChild(fragment);
}

function saveCart() { localStorage.setItem('peluditos_cart', JSON.stringify(cart)); }
function loadCart() { const saved = localStorage.getItem('peluditos_cart'); if (saved) { cart = JSON.parse(saved); updateCartUI(); } }
function addToCart(name, type, price) {
    const existing = cart.find(i => i.name === name && i.type === type);
    if (existing) existing.qty++; else cart.push({ name, type, price, qty: 1 });
    saveCart(); updateCartUI();
    const Toast = Swal.mixin({ toast: true, position: 'bottom-end', showConfirmButton: false, timer: 1500, background: 'var(--white)', color: 'var(--text)' });
    Toast.fire({ icon: 'success', title: 'Agregado' });
}
function changeQty(index, delta) { cart[index].qty += delta; if (cart[index].qty <= 0) cart.splice(index, 1); saveCart(); updateCartUI(); }
function updateCartUI() {
    const container = document.getElementById('cart-items'); const totalEl = document.getElementById('cart-total'); const countEl = document.getElementById('cart-count');
    container.innerHTML = ''; let total = 0, count = 0;
    if(cart.length === 0) container.innerHTML = '<p style="text-align:center; color:var(--text-light); margin-top:50px;">Tu carrito está vacío 🦴</p>';
    cart.forEach((item, index) => {
        total += item.price * item.qty; count += item.qty;
        container.innerHTML += `<div class="cart-item"><div style="flex-grow:1"><div style="font-weight:600; font-size:0.9rem; text-transform:capitalize;">${item.name.toLowerCase()}</div><div style="font-size:0.8rem; color:var(--text-light);">${item.type} x $${item.price.toLocaleString('es-AR')}</div></div><div class="qty-control"><button class="qty-btn" onclick="changeQty(${index}, -1)">-</button><span>${item.qty}</span><button class="qty-btn" onclick="changeQty(${index}, 1)">+</button></div></div>`;
    });
    totalEl.innerText = `$${total.toLocaleString('es-AR')}`; countEl.innerText = count; countEl.style.display = count > 0 ? 'flex' : 'none';
}
function toggleCart() { closeAllModals(); document.getElementById('cart-modal').classList.add('active'); document.getElementById('cart-overlay').classList.add('active'); }
function closeAllModals() { document.querySelectorAll('.cart-modal').forEach(m => m.classList.remove('active')); document.getElementById('cart-overlay').classList.remove('active'); }

function checkout() {
    if (cart.length === 0) return Swal.fire({ title: 'Ups', text: 'El carrito está vacío', icon: 'warning', background: 'var(--white)', color: 'var(--text)' });
    closeAllModals();
    const deliveryOpt = document.getElementById('opt-delivery'); const deliveryText = document.getElementById('delivery-text');
    if (!ENABLE_DELIVERY) { deliveryOpt.disabled = true; deliveryText.innerText = "(No disponible)"; } 
    else { deliveryOpt.disabled = false; deliveryText.innerText = "Envío a domicilio"; }
    if (currentUser) { document.getElementById('cx-name').value = currentUser.name; document.getElementById('cx-phone').value = currentUser.phone; }
    document.getElementById('checkout-modal').classList.add('active'); document.getElementById('cart-overlay').classList.add('active'); 
}
function closeCheckout() { document.getElementById('checkout-modal').classList.remove('active'); document.getElementById('cart-modal').classList.add('active'); }
function toggleAddress(show) { const section = document.getElementById('address-section'); if (show) section.classList.remove('hidden'); else section.classList.add('hidden'); }

function sendOrder() {
    const name = document.getElementById('cx-name').value; const phone = document.getElementById('cx-phone').value;
    if (!name || !phone) return Swal.fire({ title: 'Faltan datos', text: 'Por favor completa nombre y teléfono', icon: 'error' });
    const deliveryType = document.querySelector('input[name="deliveryType"]:checked').value;
    const paymentType = document.querySelector('input[name="paymentType"]:checked').value;
    const obs = document.getElementById('cx-obs').value;
    let addressText = "";
    if (deliveryType === 'delivery') {
        const calle = document.getElementById('cx-calle').value; const extra = document.getElementById('cx-piso').value; const entre = document.getElementById('cx-entre').value;
        if (!calle) return Swal.fire({ text: 'Por favor indica la dirección de entrega', icon: 'warning' });
        addressText = `📍 *Envío a:* ${calle} ${extra ? '('+extra+')' : ''}\n`; if(entre) addressText += `   Entre: ${entre}\n`;
    } else { addressText = `🏪 *Retiro en Local*\n`; }
    let msg = `Hola Peluditos! 👋 Soy *${name}*.\n`; msg += `📞 Tel: ${phone}\n\n`; msg += `📋 *MI PEDIDO:*\n`;
    let total = 0; cart.forEach(i => { let sub = i.price * i.qty; total += sub; msg += `▪️ ${i.qty} x ${i.name} (${i.type}) = $${sub.toLocaleString('es-AR')}\n`; });
    msg += `\n💰 *TOTAL: $${total.toLocaleString('es-AR')}*\n`; msg += `------------------\n`;
    msg += addressText; msg += `💳 *Pago:* ${paymentType.toUpperCase()}\n`; if(obs) msg += `📝 *Nota:* ${obs}\n`;
    const orderRecord = { date: new Date().toISOString(), items: [...cart], total: total };
    let historyKey = 'peluditos_history_' + phone.replace(/\D/g,'');
    let currentHistory = JSON.parse(localStorage.getItem(historyKey)) || [];
    currentHistory.push(orderRecord);
    localStorage.setItem(historyKey, JSON.stringify(currentHistory));
    if (currentUser && currentUser.phone === phone) { userHistory = currentHistory; }
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
}