const GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRbHFTGg7yD-wla-WTyuksMKmoPhblVtdrNAEf_BpQStuoAvVQZx2cwgigSYETo_A/pub?gid=1152455124&single=true&output=csv";
const WHATSAPP_NUMBER = "5492262677026"; 

let allProducts = [];
let cart = [];
let currentCategory = 'all';
let currentUser = null; 
let userHistory = []; 

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
    loadUser(); // Carga usuario antes
    showSkeleton();
    try {
        const response = await fetch(GOOGLE_SHEET_URL);
        const csvData = await response.text();
        processData(csvData);
    } catch (error) {
        console.error("Error cargando Excel:", error);
    }
}

function processData(csv) {
    const lines = csv.split('\n');
    allProducts = [];
    const keywords = Object.keys(customImages).sort((a, b) => b.length - a.length);

    for (let i = 1; i < lines.length; i++) {
        const columns = lines[i].split(',');
        if (columns.length < 8) continue;

        const name = columns[0] ? columns[0].trim() : "";
        if (!name || name.toLowerCase().includes("producto")) continue;

        const priceKg = parseFloat(columns[7]);
        const priceCerrada = parseFloat(columns[8]);
        if (isNaN(priceKg) && isNaN(priceCerrada)) continue;

        const lowerName = name.toLowerCase();
        let category = 'otros';
        let catLabel = 'Varios';

        if (lowerName.match(/gato|cat|kitten|gati|whiskas|felino|7 vidas|fit 32|urinary/)) {
            category = 'gato'; catLabel = 'Gato';
        } else if (lowerName.match(/perro|dog|cachorro|adulto|raza|pedigree|dogui|canino|advance|nutricare|old prince|sieger|pipon|gooster|junior|mini|medium|maxi|mordida|sileoni/)) {
            category = 'perro'; catLabel = 'Perro';
        }

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

function renderProducts(products) {
    const grid = document.getElementById('products-grid');
    if(!grid) return;
    grid.innerHTML = "";
    products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        let priceOptions = p.prices.map(pr => `
            <div class="price-row">
                <span>${pr.type}: <strong>$${pr.price.toLocaleString('es-AR')}</strong></span>
                <button onclick="addToCart('${p.id}', '${pr.type}', ${pr.price})" class="add-btn"><i class="fa-solid fa-plus"></i></button>
            </div>
        `).join('');
        card.innerHTML = `<div class="badge">${p.catLabel}</div><img src="${p.image}" alt="${p.name}" onerror="this.src='https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=400'"><div class="product-info"><h3>${p.name}</h3><div class="price-container">${priceOptions}</div></div>`;
        grid.appendChild(card);
    });
}

// FUNCIONES DE INTERFAZ
function toggleTheme() {
    const body = document.body;
    const current = body.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
}

function filterCategory(cat) {
    currentCategory = cat;
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    if(event) event.currentTarget.classList.add('active');
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

// CARRITO
function addToCart(pid, type, price) {
    const product = allProducts.find(x => x.id === pid);
    const cartKey = `${pid}-${type}`;
    const existing = cart.find(i => i.cartKey === cartKey);
    if (existing) { existing.qty++; } 
    else { cart.push({ cartKey, id: pid, name: product.name, type, price, qty: 1 }); }
    updateCartUI();
}

function updateCartUI() {
    const count = cart.reduce((acc, i) => acc + i.qty, 0);
    document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total-amount');
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:20px;">Carrito vacío</p>';
        totalEl.textContent = "0";
        return;
    }
    let total = 0;
    container.innerHTML = cart.map((item, index) => {
        total += item.price * item.qty;
        return `<div class="cart-item"><div style="flex:1"><b>${item.name}</b><br><small>${item.type}</small></div><div class="qty-controls"><button onclick="changeQty(${index}, -1)">-</button><span>${item.qty}</span><button onclick="changeQty(${index}, 1)">+</button></div></div>`;
    }).join('');
    totalEl.textContent = total.toLocaleString('es-AR');
}

function changeQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    updateCartUI();
}

function toggleCart() {
    document.getElementById('cart-modal').classList.toggle('active');
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
}

function showSkeleton() {
    document.getElementById('products-grid').innerHTML = Array(6).fill('<div class="skeleton"></div>').join('');
}

// GESTIÓN DE USUARIO (ARREGLADO EL ERROR SPLIT)
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
        const displayName = document.getElementById('user-name-display');
        const profileName = document.getElementById('profile-name');
        if(displayName) displayName.textContent = currentUser.nombre.split(' ')[0] || "Usuario";
        if(profileName) profileName.textContent = currentUser.nombre;
        document.getElementById('profile-initial').textContent = currentUser.nombre.charAt(0).toUpperCase();
        loadHistory();
    }
}

function openProfile() {
    if (!currentUser) {
        Swal.fire({
            title: 'Tu Nombre',
            input: 'text',
            showCancelButton: true
        }).then(res => {
            if (res.value) {
                const n = res.value;
                Swal.fire({ title: 'Tu WhatsApp', input: 'tel' }).then(res2 => {
                    if(res2.value) {
                        currentUser = { nombre: n, telefono: res2.value };
                        localStorage.setItem('peluditos_user', JSON.stringify(currentUser));
                        updateUserUI();
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
    location.reload();
}

function checkout() {
    if (cart.length === 0) return;
    if (!currentUser) { openProfile(); return; }
    document.getElementById('checkout-modal').classList.add('active');
}

function sendWhatsApp() {
    // Lógica simplificada para el envío
    let msg = `Hola! Soy ${currentUser.nombre}. Mi pedido:\n`;
    cart.forEach(i => msg += `- ${i.qty} x ${i.name} ($${i.price})\n`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
}

function loadHistory() {
    const h = document.getElementById('history-container');
    if(h) h.innerHTML = "<p>No hay pedidos recientes</p>";
}

window.onload = init;