const GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRbHFTGg7yD-wla-WTyuksMKmoPhblVtdrNAEf_BpQStuoAvVQZx2cwgigSYETo_A/pub?gid=1152455124&single=true&output=csv";
const WHATSAPP_NUMBER = "5492262677026"; 

let allProducts = [];
let cart = [];
let currentCategory = 'all';

// IMÁGENES ESPECÍFICAS
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
    
    // Scroll para botón arriba
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
        header: false,
        complete: function(results) {
            try {
                processSheetData(results.data);
                loader?.classList.add('hidden');
            } catch (error) {
                console.error("Error procesando datos:", error);
                if(loader) loader.innerHTML = "Error al procesar los productos.";
            }
        },
        error: function(err) {
            console.error("Error en PapaParse:", err);
            if(loader) loader.innerHTML = "Error de conexión con Google.";
        }
    });
}

function processSheetData(rows) {
    allProducts = [];
    let idCounter = 0;

    // Ajuste: Empezamos en la fila 4 (índice 3 del array)
    // Cambiar a 3 si la fila 4 es la primera con datos, o a 4 si la fila 4 es encabezado.
    for (let i = 3; i < rows.length; i++) {
        const row = rows[i];
        if (!row || row.length < 3) continue;

        const nombreRaw = row[2]; // Columna C
        if (!nombreRaw || nombreRaw.trim() === "" || nombreRaw.includes("---")) continue;

        const peso = row[3]; // Columna D
        const precioSuelto = parsePrice(row[7]); // Columna H
        const precioBolsa = parsePrice(row[8]);  // Columna I
        
        const lowerName = nombreRaw.toLowerCase().trim();
        
        // Categorización simple
        let cat = 'otros';
        if (lowerName.match(/gato|cat|kitten|felin|7 vidas|gati|whiskas/)) cat = 'gato';
        else if (lowerName.match(/perro|dog|cachorro|adulto|canin|junior|agility|advance|sieger|old prince/)) cat = 'perro';
        else if (lowerName.match(/piedra|arena|collar|correa|juguete/)) cat = 'accesorios';

        // Lógica de imagen mejorada para evitar conflictos
        let imgSrc = defaultImage;
        
        // 1. Prioridad: Coincidencia exacta de nombre
        if (customImages[lowerName]) {
            imgSrc = customImages[lowerName];
        } else {
            // 2. Segunda opción: Buscar palabra clave
            const partialKey = Object.keys(customImages).find(key => lowerName.includes(key));
            if (partialKey) imgSrc = customImages[partialKey];
        }

        // Crear producto Suelto
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

        // Crear producto Bolsa/Unidad
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
    // Limpia todo excepto números, puntos y comas
    let clean = val.toString().replace(/[^\d.,]/g, '');
    // Si tiene puntos de miles (ej: 1.500,00), quitamos el punto y cambiamos la coma por punto
    if (clean.includes('.') && clean.includes(',')) {
        clean = clean.replace(/\./g, '').replace(',', '.');
    } else {
        // Si solo tiene coma, la cambiamos por punto
        clean = clean.replace(',', '.');
    }
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
            const card = document.createElement('div');
            card.className = "product-card group bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md transition-all";
            card.innerHTML = `
                <div class="relative h-48 bg-gray-50 flex items-center justify-center p-4">
                    <img src="${p.image}" class="product-img max-h-full object-contain group-hover:scale-105 transition-transform" onerror="this.src='${defaultImage}'">
                    <span class="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-tighter shadow-sm text-gray-700">${p.type}</span>
                </div>
                <div class="p-4">
                    <h3 class="font-bold text-sm h-10 overflow-hidden line-clamp-2 text-gray-800 dark:text-gray-100">${p.name}</h3>
                    <p class="text-primary font-bold text-xl mt-2">$${p.price.toLocaleString('es-AR')}</p>
                    <button onclick="addToCart('${p.id}', event)" class="w-full mt-3 bg-primary text-white py-2.5 rounded-xl text-sm font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20">
                        Agregar
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });
    }
}

// Lógica de Carrito y Animación
function addToCart(id, event) {
    flyToCart(event);
    const product = allProducts.find(p => p.id === id);
    const inCart = cart.find(item => item.id === id);
    if (inCart) inCart.qty++;
    else cart.push({...product, qty: 1});
    
    updateCartUI();
}

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
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            pointerEvents: 'none',
            borderRadius: '50%'
        });

        document.body.appendChild(clone);

        setTimeout(() => {
            Object.assign(clone.style, {
                top: (cartRect.top + 10) + 'px',
                left: (cartRect.left + 10) + 'px',
                width: '20px',
                height: '20px',
                opacity: 0
            });
        }, 50);

        setTimeout(() => clone.remove(), 850);
    }
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