const GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRbHFTGg7yD-wla-WTyuksMKmoPhblVtdrNAEf_BpQStuoAvVQZx2cwgigSYETo_A/pub?gid=1152455124&single=true&output=csv";
const WHATSAPP_NUMBER = "5492262677026"; 

let allProducts = [];
let cart = [];
let currentCategory = 'all';
let currentUser = null; 

// IMÁGENES POR DEFECTO Y ESPECÍFICAS
const customImages = {
    "advance bio adulto r. pequena": "./img/advance-bio-adulto-r-pequena.webp",
    "advance bio adulto": "./img/advance-bio-adulto.webp",
    "agility": "https://agility.com.ar/wp-content/uploads/2020/09/Logo-Agility.png",
    "dog chow": "https://www.purina.com.ar/sites/default/files/styles/webp/public/2021-02/Dog%20Chow%20Logo.png.webp"
};

const defaultImage = "https://cdn-icons-png.flaticon.com/512/2171/2171991.png";

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    initTheme();
    
    // Botón Volver arriba
    window.onscroll = () => {
        const btn = document.getElementById('back-to-top');
        if (window.scrollY > 300) btn?.classList.remove('translate-y-20', 'opacity-0');
        else btn?.classList.add('translate-y-20', 'opacity-0');
    };
});

function fetchProducts() {
    const loader = document.getElementById('loading');
    loader?.classList.remove('hidden');

    Papa.parse(GOOGLE_SHEET_URL, {
        download: true,
        header: false, // Leemos filas crudas para saltar el encabezado del Excel
        complete: function(results) {
            processSheetData(results.data);
            loader?.classList.add('hidden');
        }
    });
}

function processSheetData(rows) {
    allProducts = [];
    let idCounter = 0;

    // Empezamos desde la fila 5 (índice 5) para saltar encabezados de tu Excel
    for (let i = 5; i < rows.length; i++) {
        const row = rows[i];
        const nombreRaw = row[2]; // Columna C
        if (!nombreRaw || nombreRaw.trim() === "" || nombreRaw.includes("DESCRIPCION")) continue;

        const peso = row[3]; // Columna D
        const precioSuelto = parsePrice(row[7]); // Columna H
        const precioBolsa = parsePrice(row[8]);  // Columna I
        
        const lowerName = nombreRaw.toLowerCase();
        
        // Categorización
        let cat = 'otros';
        if (lowerName.match(/gato|cat|felin/)) cat = 'gato';
        else if (lowerName.match(/perro|dog|cachorro|adulto|canin/)) cat = 'perro';
        else if (lowerName.match(/piedra|arena|collar|correa/)) cat = 'accesorios';

        // Imagen: Primero busca en el mapeo exacto, luego por palabra clave
        let imgSrc = defaultImage;
        const matchingKey = Object.keys(customImages).find(key => lowerName === key);
        if (matchingKey) {
            imgSrc = customImages[matchingKey];
        } else {
            const partialKey = Object.keys(customImages).find(key => lowerName.includes(key));
            if (partialKey) imgSrc = customImages[partialKey];
        }

        // Crear item por KG si existe precio
        if (precioSuelto > 0) {
            allProducts.push({
                id: `s-${idCounter++}`,
                name: nombreRaw.trim(),
                price: precioSuelto,
                type: "x Kg Suelto",
                category: cat,
                image: imgSrc
            });
        }

        // Crear item por BOLSA si existe precio
        if (precioBolsa > 0) {
            allProducts.push({
                id: `b-${idCounter++}`,
                name: nombreRaw.trim(),
                price: precioBolsa,
                type: peso ? `Bolsa ${peso}kg` : "Unidad",
                category: cat,
                image: imgSrc
            });
        }
    }
    renderProducts();
}

function parsePrice(val) {
    if (!val) return 0;
    // Limpia símbolos de moneda y puntos de miles, convierte coma en punto decimal
    let clean = val.toString().replace(/\$/g, '').replace(/\./g, '').replace(',', '.').trim();
    return parseFloat(clean) || 0;
}

function renderProducts(searchTerm = '') {
    const grid = document.getElementById('products-grid');
    const noResults = document.getElementById('no-results');
    if (!grid) return;

    grid.innerHTML = '';
    const term = searchTerm.toLowerCase();

    const filtered = allProducts.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(term);
        const matchesCat = currentCategory === 'all' || p.category === currentCategory;
        return matchesSearch && matchesCat;
    });

    if (filtered.length === 0) {
        noResults?.classList.remove('hidden');
    } else {
        noResults?.classList.add('hidden');
        filtered.forEach(p => {
            grid.innerHTML += `
                <div class="product-card group bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md transition-all">
                    <div class="relative h-48 bg-gray-50 flex items-center justify-center p-4">
                        <img src="${p.image}" class="product-img max-h-full object-contain group-hover:scale-105 transition-transform">
                        <span class="absolute top-2 left-2 bg-white/80 backdrop-blur px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-tighter">${p.type}</span>
                    </div>
                    <div class="p-4">
                        <h3 class="font-bold text-sm h-10 overflow-hidden line-clamp-2">${p.name}</h3>
                        <p class="text-primary font-bold text-xl mt-2">$${p.price.toLocaleString('es-AR')}</p>
                        <button onclick="addToCart('${p.id}', event)" class="w-full mt-3 bg-primary text-white py-2 rounded-xl text-sm font-bold hover:bg-primary-dark transition-colors">
                            Agregar
                        </button>
                    </div>
                </div>
            `;
        });
    }
}

// Función Fly to Cart (Animación)
function flyToCart(e) {
    const cartBtn = document.getElementById('cart-btn');
    const card = e.target.closest('.product-card');
    const img = card.querySelector('.product-img');

    if (img && cartBtn) {
        const clone = img.cloneNode(true);
        const rect = img.getBoundingClientRect();
        const cartRect = cartBtn.getBoundingClientRect();

        Object.assign(clone.style, {
            position: 'fixed',
            top: rect.top + 'px',
            left: rect.left + 'px',
            width: rect.width + 'px',
            height: rect.height + 'px',
            zIndex: 1000,
            transition: 'all 0.8s ease-in-out',
            pointerEvents: 'none'
        });

        document.body.appendChild(clone);

        setTimeout(() => {
            Object.assign(clone.style, {
                top: cartRect.top + 'px',
                left: cartRect.left + 'px',
                width: '20px',
                height: '20px',
                opacity: 0
            });
        }, 50);

        setTimeout(() => clone.remove(), 850);
    }
}

function addToCart(id, event) {
    flyToCart(event);
    const product = allProducts.find(p => p.id === id);
    const inCart = cart.find(item => item.id === id);
    if (inCart) inCart.qty++;
    else cart.push({...product, qty: 1});
    
    updateCartUI();
}

function updateCartUI() {
    const count = cart.reduce((acc, item) => acc + item.qty, 0);
    const badge = document.getElementById('cart-count');
    if (badge) badge.innerText = count;
}

function initTheme() {
    if (localStorage.theme === 'dark') document.documentElement.classList.add('dark');
    document.getElementById('theme-toggle')?.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        localStorage.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    });
}