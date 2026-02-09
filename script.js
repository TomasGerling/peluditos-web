// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
    GOOGLE_SHEET_URL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRbHFTGg7yD-wla-WTyuksMKmoPhblVtdrNAEf_BpQStuoAvVQZx2cwgigSYETo_A/pub?gid=1152455124&single=true&output=csv",
    WHATSAPP_NUMBER: "5492262677026",
    ENABLE_DELIVERY: false,
    SHOP_HOURS: {
        open: 9,
        close: 20
    }
};

// ============================================
// STATE
// ============================================

const state = {
    allProducts: [],
    cart: [],
    currentCategory: 'all',
    currentUser: null,
    userHistory: [],
    isLoading: false
};

// ============================================
// IMAGE MAPPINGS
// ============================================

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

// ============================================
// UTILITY FUNCTIONS
// ============================================

const utils = {
    normalize: (str) => {
        return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    },
    
    formatPrice: (n) => {
        return n.toLocaleString('es-AR');
    },
    
    escapeHtml: (text) => {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    },
    
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    isShopOpen: () => {
        const now = new Date();
        const day = now.getDay();
        const hour = now.getHours();
        
        // Cerrado los domingos (0)
        if (day === 0) return false;
        
        // Horario comercial
        return hour >= CONFIG.SHOP_HOURS.open && hour < CONFIG.SHOP_HOURS.close;
    },
    
    formatDate: (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
};

// ============================================
// STORAGE MANAGER
// ============================================

const storage = {
    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    },
    
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error writing to localStorage:', error);
            return false;
        }
    },
    
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    }
};

// ============================================
// THEME MANAGER
// ============================================

const themeManager = {
    init: () => {
        const savedTheme = storage.get('peluditos_theme') || 'light';
        themeManager.set(savedTheme);
        themeManager.updateIcon();
    },
    
    set: (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        storage.set('peluditos_theme', theme);
    },
    
    toggle: () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        themeManager.set(newTheme);
        themeManager.updateIcon();
    },
    
    updateIcon: () => {
        const theme = document.documentElement.getAttribute('data-theme') || 'light';
        const icon = document.querySelector('#themeBtn i');
        if (icon) {
            icon.className = theme === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
        }
    }
};

// ============================================
// SHOP STATUS
// ============================================

const shopStatus = {
    update: () => {
        const statusBadge = document.getElementById('shop-status');
        const statusText = document.getElementById('status-text');
        
        if (!statusBadge || !statusText) return;
        
        const isOpen = utils.isShopOpen();
        
        statusBadge.classList.remove('open', 'closed');
        statusBadge.classList.add(isOpen ? 'open' : 'closed');
        statusText.textContent = isOpen ? 'Abierto' : 'Cerrado';
    }
};

// ============================================
// DATA LOADER
// ============================================

const dataLoader = {
    fetch: async () => {
        state.isLoading = true;
        
        try {
            const response = await fetch(CONFIG.GOOGLE_SHEET_URL);
            const csvText = await response.text();
            
            Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    dataLoader.process(results.data);
                },
                error: (error) => {
                    console.error('Error parsing CSV:', error);
                    dataLoader.showError();
                }
            });
        } catch (error) {
            console.error('Error fetching data:', error);
            dataLoader.showError();
        }
    },
    
    process: (data) => {
        state.allProducts = data.map((row, index) => {
            const name = (row['nombre'] || '').trim();
            const normalizedName = utils.normalize(name);
            
            const category = (row['categoria'] || 'otros').toLowerCase();
            const precioKg = parseFloat(row['precio_kg']) || 0;
            const precioBolsa = parseFloat(row['precio_bolsa']) || 0;
            const weight = (row['peso'] || '').trim();
            const isOffer = (row['oferta'] || '').toLowerCase() === 'si';
            
            let catLabel = '';
            if (category === 'perro') catLabel = 'Perro';
            else if (category === 'gato') catLabel = 'Gato';
            
            let imgUrl = customImages[normalizedName] || '';
            if (!imgUrl) {
                for (const brand in brandImages) {
                    if (normalizedName.includes(brand)) {
                        imgUrl = brandImages[brand];
                        break;
                    }
                }
            }
            
            return {
                id: `product-${index}`,
                nombre: name,
                originalName: name,
                category,
                precioKg,
                precioBolsa,
                weight,
                isOffer,
                catLabel,
                imgUrl
            };
        }).filter(p => p.nombre && (p.precioKg > 0 || p.precioBolsa > 0));
        
        state.isLoading = false;
        productRenderer.render();
        
        // Hide loader
        document.getElementById('loader').style.display = 'none';
        document.getElementById('product-grid').style.display = 'grid';
    },
    
    showError: () => {
        const grid = document.getElementById('product-grid');
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <i class="fa-solid fa-circle-exclamation" style="font-size: 3rem; color: var(--offer); margin-bottom: 20px;"></i>
                <p style="color: var(--text); font-weight: 600; margin-bottom: 10px;">Error al cargar los productos</p>
                <p style="color: var(--text-light); font-size: 0.9rem;">Por favor, intenta recargar la página</p>
                <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                    Recargar
                </button>
            </div>
        `;
        document.getElementById('loader').style.display = 'none';
        document.getElementById('product-grid').style.display = 'grid';
    }
};

// ============================================
// PRODUCT RENDERER
// ============================================

const productRenderer = {
    render: () => {
        const grid = document.getElementById('product-grid');
        if (!grid) return;
        
        const searchTerm = document.getElementById('searchInput')?.value || '';
        const sortOrder = document.getElementById('priceSort')?.value || 'default';
        
        let filtered = state.allProducts.filter(p => {
            const matchCat = state.currentCategory === 'all' || p.category === state.currentCategory;
            const matchSearch = utils.normalize(p.originalName).includes(utils.normalize(searchTerm));
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
        
        if (filtered.length === 0) {
            grid.innerHTML = `
                <div style="grid-column:1/-1; text-align:center; padding:40px; color:var(--text-light);">
                    <i class="fa-solid fa-magnifying-glass" style="font-size: 2rem; margin-bottom: 10px; opacity: 0.5;"></i>
                    <p>No encontramos resultados 🐶🐱</p>
                </div>
            `;
            return;
        }
        
        const fragment = document.createDocumentFragment();
        
        filtered.forEach((p, index) => {
            const card = productRenderer.createCard(p, index);
            fragment.appendChild(card);
        });
        
        grid.innerHTML = '';
        grid.appendChild(fragment);
    },
    
    createCard: (product, index) => {
        const card = document.createElement('article');
        card.className = 'card';
        card.style.animationDelay = `${index * 0.05}s`;
        
        const badgeHtml = product.isOffer ? '<div class="offer-badge">OFERTA</div>' : '';
        const catLabelHtml = product.catLabel ? `<span class="category-label">${product.catLabel}</span>` : '';
        
        let defaultIcon = 'fa-bag-shopping';
        if (product.category === 'perro') defaultIcon = 'fa-dog';
        if (product.category === 'gato') defaultIcon = 'fa-cat';
        
        const imgHtml = product.imgUrl ? 
            `<img src="${product.imgUrl}" alt="${utils.escapeHtml(product.nombre)}" class="product-img" loading="lazy" width="200" height="200" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"><i class="fa-solid fa-paw placeholder-icon" style="display:none"></i>` : 
            `<i class="fa-solid ${defaultIcon} placeholder-icon"></i>`;
        
        let pricesHtml = '';
        const jsSafeName = product.nombre.replace(/'/g, "\\'");
        
        if (product.precioKg) {
            pricesHtml += `
                <div class="price-option">
                    <div class="price-info">
                        <span class="price-label">x Kg Suelto</span>
                        <span class="price-amount">$${utils.formatPrice(product.precioKg)}</span>
                    </div>
                    <button class="btn-add" onclick="cartManager.add('${jsSafeName}', 'Kg', ${product.precioKg})" aria-label="Agregar ${utils.escapeHtml(product.nombre)} suelto al carrito">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </div>
            `;
        }
        
        if (product.precioBolsa) {
            let labelBolsa = 'Unidad';
            if (product.weight) {
                const isNumber = !isNaN(parseFloat(product.weight)) && isFinite(product.weight);
                if (!isNumber || product.category === 'otros') {
                    labelBolsa = product.weight;
                } else {
                    labelBolsa = `Bolsa ${product.weight} Kg`;
                }
            }
            
            pricesHtml += `
                <div class="price-option">
                    <div class="price-info">
                        <span class="price-label">${labelBolsa}</span>
                        <span class="price-amount">$${utils.formatPrice(product.precioBolsa)}</span>
                    </div>
                    <button class="btn-add" onclick="cartManager.add('${jsSafeName}', '${labelBolsa}', ${product.precioBolsa})" aria-label="Agregar ${utils.escapeHtml(product.nombre)} ${labelBolsa} al carrito">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </div>
            `;
        }
        
        card.innerHTML = `
            <div class="card-img-container">
                ${badgeHtml}
                ${imgHtml}
                ${catLabelHtml}
            </div>
            <div style="flex:1; display:flex; flex-direction:column;">
                <div class="card-header">
                    <h2 class="card-title">${product.nombre}</h2>
                </div>
                <div class="card-body">
                    ${pricesHtml}
                </div>
            </div>
        `;
        
        return card;
    }
};

// ============================================
// CART MANAGER
// ============================================

const cartManager = {
    load: () => {
        const saved = storage.get('peluditos_cart');
        if (saved) {
            state.cart = saved;
            cartManager.updateUI();
        }
    },
    
    save: () => {
        storage.set('peluditos_cart', state.cart);
    },
    
    add: (name, type, price) => {
        const existing = state.cart.find(i => i.name === name && i.type === type);
        
        if (existing) {
            existing.qty++;
        } else {
            state.cart.push({ name, type, price, qty: 1 });
        }
        
        cartManager.save();
        cartManager.updateUI();
        
        // Show toast notification
        if (typeof Swal !== 'undefined') {
            const Toast = Swal.mixin({
                toast: true,
                position: 'bottom-end',
                showConfirmButton: false,
                timer: 1500,
                background: 'var(--white)',
                color: 'var(--text)',
                timerProgressBar: true
            });
            Toast.fire({
                icon: 'success',
                title: 'Agregado al carrito'
            });
        }
    },
    
    changeQty: (index, delta) => {
        state.cart[index].qty += delta;
        
        if (state.cart[index].qty <= 0) {
            state.cart.splice(index, 1);
        }
        
        cartManager.save();
        cartManager.updateUI();
    },
    
    updateUI: () => {
        const container = document.getElementById('cart-items');
        const totalEl = document.getElementById('cart-total');
        const countEl = document.getElementById('cart-count');
        
        if (!container || !totalEl || !countEl) return;
        
        container.innerHTML = '';
        let total = 0;
        let count = 0;
        
        if (state.cart.length === 0) {
            container.innerHTML = `
                <div style="text-align:center; color:var(--text-light); margin-top:50px;">
                    <i class="fa-solid fa-basket-shopping" style="font-size: 3rem; opacity: 0.3; margin-bottom: 15px;"></i>
                    <p>Tu carrito está vacío 🦴</p>
                </div>
            `;
        } else {
            state.cart.forEach((item, index) => {
                total += item.price * item.qty;
                count += item.qty;
                
                const itemEl = document.createElement('div');
                itemEl.className = 'cart-item';
                itemEl.setAttribute('role', 'listitem');
                itemEl.innerHTML = `
                    <div style="flex-grow:1">
                        <div style="font-weight:600; font-size:0.9rem; text-transform:capitalize;">
                            ${item.name.toLowerCase()}
                        </div>
                        <div style="font-size:0.8rem; color:var(--text-light);">
                            ${item.type} × $${utils.formatPrice(item.price)}
                        </div>
                    </div>
                    <div class="qty-control">
                        <button class="qty-btn" onclick="cartManager.changeQty(${index}, -1)" aria-label="Disminuir cantidad">
                            −
                        </button>
                        <span>${item.qty}</span>
                        <button class="qty-btn" onclick="cartManager.changeQty(${index}, 1)" aria-label="Aumentar cantidad">
                            +
                        </button>
                    </div>
                `;
                container.appendChild(itemEl);
            });
        }
        
        totalEl.innerText = `$${utils.formatPrice(total)}`;
        countEl.innerText = count;
        countEl.style.display = count > 0 ? 'flex' : 'none';
    },
    
    clear: () => {
        state.cart = [];
        cartManager.save();
        cartManager.updateUI();
    }
};

// ============================================
// MODAL MANAGER
// ============================================

const modalManager = {
    open: (modalId) => {
        modalManager.closeAll();
        const modal = document.getElementById(modalId);
        const overlay = document.getElementById('cart-overlay');
        
        if (modal && overlay) {
            modal.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Focus management for accessibility
            const firstFocusable = modal.querySelector('button, input, select, textarea');
            if (firstFocusable) {
                setTimeout(() => firstFocusable.focus(), 100);
            }
        }
    },
    
    closeAll: () => {
        document.querySelectorAll('.cart-modal').forEach(m => m.classList.remove('active'));
        document.getElementById('cart-overlay')?.classList.remove('active');
        document.body.style.overflow = '';
    }
};

// ============================================
// USER MANAGER
// ============================================

const userManager = {
    load: () => {
        state.currentUser = storage.get('peluditos_user');
        if (state.currentUser) {
            userManager.updateUI();
            userManager.loadHistory();
        }
    },
    
    save: (userData) => {
        state.currentUser = userData;
        storage.set('peluditos_user', userData);
        userManager.updateUI();
    },
    
    logout: () => {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: '¿Cerrar sesión?',
                text: 'Tu carrito se mantendrá guardado',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí, cerrar',
                cancelButtonText: 'Cancelar',
                background: 'var(--white)',
                color: 'var(--text)'
            }).then((result) => {
                if (result.isConfirmed) {
                    state.currentUser = null;
                    state.userHistory = [];
                    storage.remove('peluditos_user');
                    userManager.updateUI();
                    modalManager.closeAll();
                    
                    Swal.fire({
                        title: 'Sesión cerrada',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false,
                        background: 'var(--white)',
                        color: 'var(--text)'
                    });
                }
            });
        }
    },
    
    updateUI: () => {
        const userBtn = document.getElementById('user-btn-display');
        if (!userBtn) return;
        
        if (state.currentUser) {
            const span = userBtn.querySelector('span');
            if (span) {
                span.textContent = state.currentUser.name.split(' ')[0];
            }
        } else {
            const span = userBtn.querySelector('span');
            if (span) {
                span.textContent = 'Ingresar';
            }
        }
    },
    
    loadHistory: () => {
        if (!state.currentUser) return;
        
        const phone = state.currentUser.phone.replace(/\D/g, '');
        const historyKey = `peluditos_history_${phone}`;
        state.userHistory = storage.get(historyKey) || [];
        
        userManager.renderHistory();
    },
    
    renderHistory: () => {
        const container = document.getElementById('history-container');
        if (!container) return;
        
        if (state.userHistory.length === 0) {
            container.innerHTML = `
                <p style="text-align:center; color:var(--text-light); padding:20px;">
                    Aún no tienes pedidos
                </p>
            `;
            return;
        }
        
        container.innerHTML = '';
        
        // Show last 10 orders
        state.userHistory.slice(-10).reverse().forEach((order, index) => {
            const orderEl = document.createElement('div');
            orderEl.className = 'history-card';
            orderEl.setAttribute('role', 'listitem');
            orderEl.style.animationDelay = `${index * 0.05}s`;
            
            const itemsList = order.items.map(i => 
                `${i.qty}× ${i.name} (${i.type})`
            ).join('<br>');
            
            orderEl.innerHTML = `
                <div class="history-header">
                    <span><i class="fa-regular fa-calendar"></i> ${utils.formatDate(order.date)}</span>
                    <span>${order.items.reduce((sum, i) => sum + i.qty, 0)} productos</span>
                </div>
                <div class="history-items">${itemsList}</div>
                <div class="history-footer">
                    <span class="history-price">$${utils.formatPrice(order.total)}</span>
                    <button class="btn-repeat" onclick="userManager.repeatOrder(${state.userHistory.length - 1 - index})">
                        <i class="fa-solid fa-rotate-right"></i> Repetir
                    </button>
                </div>
            `;
            
            container.appendChild(orderEl);
        });
    },
    
    repeatOrder: (index) => {
        const realIndex = state.userHistory.length - 1 - index;
        const order = state.userHistory[realIndex];
        
        if (!order) return;
        
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: '¿Repetir pedido?',
                text: 'Se agregará al carrito actual',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí, agregar',
                cancelButtonText: 'Cancelar',
                background: 'var(--white)',
                color: 'var(--text)'
            }).then((result) => {
                if (result.isConfirmed) {
                    order.items.forEach(item => {
                        const existing = state.cart.find(i => i.name === item.name && i.type === item.type);
                        if (existing) {
                            existing.qty += item.qty;
                        } else {
                            state.cart.push({ ...item });
                        }
                    });
                    
                    cartManager.save();
                    cartManager.updateUI();
                    modalManager.closeAll();
                    
                    Swal.fire({
                        title: 'Pedido agregado',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false,
                        background: 'var(--white)',
                        color: 'var(--text)'
                    });
                }
            });
        }
    }
};

// ============================================
// CHECKOUT MANAGER
// ============================================

const checkoutManager = {
    init: () => {
        if (state.cart.length === 0) {
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    title: 'Carrito vacío',
                    text: 'Agrega productos antes de hacer un pedido',
                    icon: 'warning',
                    background: 'var(--white)',
                    color: 'var(--text)'
                });
            }
            return;
        }
        
        modalManager.closeAll();
        
        // Configure delivery option
        const deliveryOpt = document.getElementById('opt-delivery');
        const deliveryText = document.getElementById('delivery-text');
        
        if (deliveryOpt && deliveryText) {
            if (!CONFIG.ENABLE_DELIVERY) {
                deliveryOpt.disabled = true;
                deliveryText.innerText = "(No disponible)";
            } else {
                deliveryOpt.disabled = false;
                deliveryText.innerText = "Envío a domicilio";
            }
        }
        
        // Pre-fill user data
        if (state.currentUser) {
            const nameInput = document.getElementById('cx-name');
            const phoneInput = document.getElementById('cx-phone');
            
            if (nameInput) nameInput.value = state.currentUser.name;
            if (phoneInput) phoneInput.value = state.currentUser.phone;
        }
        
        modalManager.open('checkout-modal');
    },
    
    toggleAddress: (show) => {
        const section = document.getElementById('address-section');
        if (section) {
            if (show) {
                section.classList.remove('hidden');
            } else {
                section.classList.add('hidden');
            }
        }
    },
    
    send: () => {
        const name = document.getElementById('cx-name')?.value.trim();
        const phone = document.getElementById('cx-phone')?.value.trim();
        
        if (!name || !phone) {
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    title: 'Datos incompletos',
                    text: 'Por favor completa tu nombre y teléfono',
                    icon: 'error',
                    background: 'var(--white)',
                    color: 'var(--text)'
                });
            }
            return;
        }
        
        const deliveryType = document.querySelector('input[name="deliveryType"]:checked')?.value || 'retiro';
        const paymentType = document.querySelector('input[name="paymentType"]:checked')?.value || 'efectivo';
        const obs = document.getElementById('cx-obs')?.value.trim() || '';
        
        let addressText = "";
        
        if (deliveryType === 'delivery') {
            const calle = document.getElementById('cx-calle')?.value.trim();
            const extra = document.getElementById('cx-piso')?.value.trim();
            const entre = document.getElementById('cx-entre')?.value.trim();
            
            if (!calle) {
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        text: 'Por favor indica la dirección de entrega',
                        icon: 'warning',
                        background: 'var(--white)',
                        color: 'var(--text)'
                    });
                }
                return;
            }
            
            addressText = `📍 *Envío a:* ${calle}${extra ? ' (' + extra + ')' : ''}\n`;
            if (entre) addressText += `   Entre: ${entre}\n`;
        } else {
            addressText = `🏪 *Retiro en Local*\n`;
        }
        
        // Build WhatsApp message
        let msg = `Hola Peluditos! 👋 Soy *${name}*.\n`;
        msg += `📞 Tel: ${phone}\n\n`;
        msg += `📋 *MI PEDIDO:*\n`;
        
        let total = 0;
        state.cart.forEach(item => {
            const subtotal = item.price * item.qty;
            total += subtotal;
            msg += `▪️ ${item.qty}× ${item.name} (${item.type}) = $${utils.formatPrice(subtotal)}\n`;
        });
        
        msg += `\n💰 *TOTAL: $${utils.formatPrice(total)}*\n`;
        msg += `------------------\n`;
        msg += addressText;
        msg += `💳 *Pago:* ${paymentType.toUpperCase()}\n`;
        if (obs) msg += `📝 *Nota:* ${obs}\n`;
        
        // Save order to history
        const orderRecord = {
            date: new Date().toISOString(),
            items: [...state.cart],
            total: total
        };
        
        const historyKey = `peluditos_history_${phone.replace(/\D/g, '')}`;
        let currentHistory = storage.get(historyKey) || [];
        currentHistory.push(orderRecord);
        storage.set(historyKey, currentHistory);
        
        // Update current user history if logged in
        if (state.currentUser && state.currentUser.phone === phone) {
            state.userHistory = currentHistory;
        }
        
        // Clear cart and open WhatsApp
        cartManager.clear();
        modalManager.closeAll();
        
        window.open(`https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    }
};

// ============================================
// LOGIN MANAGER
// ============================================

const loginManager = {
    openOrProfile: () => {
        if (state.currentUser) {
            // Show profile
            const profileName = document.getElementById('profile-name');
            const profilePhone = document.getElementById('profile-phone');
            const profileInitial = document.getElementById('profile-initial');
            
            if (profileName) profileName.textContent = state.currentUser.name;
            if (profilePhone) profilePhone.textContent = state.currentUser.phone;
            if (profileInitial) {
                profileInitial.textContent = state.currentUser.name.charAt(0).toUpperCase();
            }
            
            userManager.loadHistory();
            modalManager.open('profile-modal');
        } else {
            // Show login
            modalManager.open('login-modal');
        }
    },
    
    check: () => {
        const phone = document.getElementById('login-phone')?.value.trim();
        
        if (!phone) {
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    text: 'Ingresa tu número de teléfono',
                    icon: 'warning',
                    background: 'var(--white)',
                    color: 'var(--text)'
                });
            }
            return;
        }
        
        const historyKey = `peluditos_history_${phone.replace(/\D/g, '')}`;
        const history = storage.get(historyKey);
        
        if (history && history.length > 0) {
            // User exists - get name from first order or ask
            const savedUser = storage.get('peluditos_user');
            if (savedUser && savedUser.phone === phone) {
                userManager.save(savedUser);
                modalManager.closeAll();
                
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        title: `¡Bienvenido ${savedUser.name}!`,
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false,
                        background: 'var(--white)',
                        color: 'var(--text)'
                    });
                }
            } else {
                // Show name input for returning user
                document.getElementById('step-phone')?.classList.add('hidden');
                document.getElementById('step-name')?.classList.remove('hidden');
            }
        } else {
            // New user
            document.getElementById('step-phone')?.classList.add('hidden');
            document.getElementById('step-name')?.classList.remove('hidden');
        }
    },
    
    register: () => {
        const phone = document.getElementById('login-phone')?.value.trim();
        const name = document.getElementById('login-name')?.value.trim();
        
        if (!name) {
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    text: 'Por favor ingresa tu nombre',
                    icon: 'warning',
                    background: 'var(--white)',
                    color: 'var(--text)'
                });
            }
            return;
        }
        
        const userData = { name, phone };
        userManager.save(userData);
        
        // Reset login form
        document.getElementById('step-phone')?.classList.remove('hidden');
        document.getElementById('step-name')?.classList.add('hidden');
        document.getElementById('login-phone').value = '';
        document.getElementById('login-name').value = '';
        
        modalManager.closeAll();
        
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: `¡Bienvenido ${name}!`,
                text: 'Tu cuenta ha sido creada',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                background: 'var(--white)',
                color: 'var(--text)'
            });
        }
    }
};

// ============================================
// FILTER MANAGER
// ============================================

const filterManager = {
    setCategory: (category, buttonElement) => {
        state.currentCategory = category;
        
        // Update active button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        if (buttonElement) {
            buttonElement.classList.add('active');
        }
        
        productRenderer.render();
    }
};

// ============================================
// EVENT LISTENERS
// ============================================

const setupEventListeners = () => {
    // Escape key to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modalManager.closeAll();
        }
    });
    
    // Debounced search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', utils.debounce(() => {
            productRenderer.render();
        }, 300));
    }
};

// ============================================
// GLOBAL FUNCTIONS (for onclick handlers)
// ============================================

function toggleTheme() {
    themeManager.toggle();
}

function setCategory(category, buttonElement) {
    filterManager.setCategory(category, buttonElement);
}

function applyFilters() {
    productRenderer.render();
}

function toggleCart() {
    modalManager.open('cart-modal');
}

function closeAllModals() {
    modalManager.closeAll();
}

function checkout() {
    checkoutManager.init();
}

function closeCheckout() {
    modalManager.closeAll();
    modalManager.open('cart-modal');
}

function toggleAddress(show) {
    checkoutManager.toggleAddress(show);
}

function sendOrder() {
    checkoutManager.send();
}

function openLoginOrProfile() {
    loginManager.openOrProfile();
}

function handleLoginCheck() {
    loginManager.check();
}

function handleRegister() {
    loginManager.register();
}

function logout() {
    userManager.logout();
}

function checkEnter(event, action) {
    if (event.key === 'Enter') {
        if (action === 'checkPhone') handleLoginCheck();
        if (action === 'register') handleRegister();
    }
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Set support button
    document.getElementById('supportBtn').href = 
        `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola Peluditos! Tengo una consulta...")}`;
    
    // Initialize modules
    themeManager.init();
    shopStatus.update();
    userManager.load();
    cartManager.load();
    setupEventListeners();
    
    // Fetch product data
    dataLoader.fetch();
    
    // Update shop status every minute
    setInterval(shopStatus.update, 60000);
});

// ============================================
// SERVICE WORKER REGISTRATION (Optional)
// ============================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable PWA features
        // navigator.serviceWorker.register('/sw.js');
    });
}