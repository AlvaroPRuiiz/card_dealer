// --- CONFIGURACIÓN DE SUPABASE ---
const SUB_URL = "https://qrxjuizgumbcdqfxcbiy.supabase.co"; 
const SUB_KEY = "sb_publishable_8sZxryCj8k2NfuukeyqEwQ_1VZ-0lC5"; 
const _supabase = supabase.createClient(SUB_URL, SUB_KEY);

// VARIABLES GLOBALES
let allReviews = []; 
let showingAll = false;
let cart = JSON.parse(localStorage.getItem('elco_cart')) || [];

// --- 1. LÓGICA DEL CARRITO (TOP) ---

window.changeQty = function(amount) {
    const qtyInput = document.getElementById('quantity');
    if (!qtyInput) return;
    let currentQty = parseInt(qtyInput.value) || 1;
    currentQty += amount;
    if (currentQty < 1) currentQty = 1;
    qtyInput.value = currentQty;
};

window.toggleCart = function() {
    const modal = document.getElementById('cart-modal');
    if (modal) modal.classList.toggle('hidden');
};

window.addToCart = function() {
    const qtyInput = document.getElementById('quantity');
    const qty = qtyInput ? parseInt(qtyInput.value) : 1;
    
    const product = {
        id: 'elco-pro',
        name: 'Elco-Dealer Pro',
        price: 99.99,
        quantity: qty,
        img: 'img/repartidor.jpg'
    };

    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.quantity += qty;
    } else {
        cart.push(product);
    }

    saveCart();
    // Abrimos el carrito para confirmar visualmente
    toggleCart(); 
};

function saveCart() {
    localStorage.setItem('elco_cart', JSON.stringify(cart));
    renderCart();
}

function renderCart() {
    const cartContainer = document.getElementById('cart-items');
    const totalDisplay = document.getElementById('cart-total');
    const countDisplay = document.getElementById('cart-count');
    
    if (!cartContainer) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="text-gray-500 text-center uppercase text-[10px] py-10 tracking-[0.2em]">Your cart is empty</p>';
    } else {
        cartContainer.innerHTML = cart.map((item, index) => `
            <div class="flex items-center space-x-4 bg-black/40 p-4 rounded-2xl border border-[#1f1410]">
                <img src="${item.img}" class="w-16 h-16 rounded-xl object-cover border border-[#1a1a1a]">
                <div class="flex-1 text-left">
                    <h4 class="text-white font-bold uppercase text-[10px] tracking-widest">${item.name}</h4>
                    <p class="text-[#c5a16f] font-black italic">€${item.price} x ${item.quantity}</p>
                </div>
                <button onclick="removeFromCart(${index})" class="text-red-900 hover:text-red-500 transition-colors text-xl">✕</button>
            </div>
        `).join('');
    }

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    if (totalDisplay) totalDisplay.innerText = `€${total.toFixed(2)}`;
    if (countDisplay) countDisplay.innerText = cart.reduce((acc, item) => acc + item.quantity, 0);
}

window.removeFromCart = function(index) {
    cart.splice(index, 1);
    saveCart();
};

window.checkout = function() {
    if (cart.length === 0) return alert("Your cart is empty!");
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2);
    alert(`🃏 ELCO-DEALER | CHECKOUT\n\nTotal to pay: €${total}\n\nRedirecting to secure gateway...`);
};

// --- 2. GESTIÓN DE RESEÑAS (ORDENADAS) ---

async function cargarReseñas() {
    const display = document.getElementById('reviews-display');
    if (!display) return;

    const { data: reviews, error } = await _supabase.from('reviews').select('*');
    if (error) return console.error(error);

    // Ordenar: 5 estrellas primero, y luego por ID más reciente
    allReviews = (reviews || []).sort((a, b) => {
        if (b.rating !== a.rating) return b.rating - a.rating;
        return b.id - a.id;
    }); 

    renderReviews();
}

function renderReviews() {
    const display = document.getElementById('reviews-display');
    const btnContainer = document.getElementById('show-more-container');
    const btn = document.getElementById('btn-toggle-reviews');
    if (!display) return;

    if (allReviews.length > 3 && btnContainer) btnContainer.classList.remove('hidden');

    const reviewsToDisplay = showingAll ? allReviews : allReviews.slice(0, 3);

    display.innerHTML = reviewsToDisplay.map(r => `
        <div class="casino-card p-8 rounded-[2.5rem] mb-6 text-left shadow-lg border border-[#1f1410]">
            <div class="text-[#c5a16f] mb-3 text-lg">${"★".repeat(r.rating || 5)}</div>
            <p class="text-gray-300 italic mb-6 text-xl">"${r.comment || 'No comment'}"</p>
            <div class="flex items-center space-x-4">
                <div class="w-10 h-10 bg-[#c5a16f] rounded-full flex items-center justify-center text-black font-bold text-xs">
                    ${r.name ? r.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <p class="text-white font-bold uppercase text-[10px] tracking-widest">${r.name || 'Anonymous'}</p>
            </div>
        </div>
    `).join('');

    if (btn) btn.innerText = showingAll ? "Show Less" : "Show More Reviews";
}

window.toggleReviews = function() {
    showingAll = !showingAll;
    renderReviews();
    if (!showingAll) document.getElementById('reviews').scrollIntoView({ behavior: 'smooth' });
};

window.enviarReseña = async function() {
    const name = document.getElementById('rev-name').value;
    const comment = document.getElementById('rev-comment').value;
    const rating = document.getElementById('rev-rating').value;

    if (!name || !comment) return alert("Please fill all fields.");

    const { error } = await _supabase.from('reviews').insert([{ name, comment, rating: parseInt(rating) }]);
    if (error) alert(error.message);
    else {
        document.getElementById('rev-name').value = "";
        document.getElementById('rev-comment').value = "";
        alert("Success!");
        cargarReseñas(); 
    }
};

// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    cargarReseñas();
    renderCart();
});