// assets/js/navigation.js
export function initNavigation(activePage = '') {
    // Pengecekan role dihapus, sehingga semua menu (termasuk admin) akan selalu tampil
    const isAdmin = true;

    // Menggunakan path absolut berbasis root (diawali garis miring /)
    const homeHref = '/index.html';
    const paketanHref = '/pages/paketan-view.html';
    const pesanHref = '/pages/pesan.html';
    const produkHref = '/pages/produk-view.html';
    const profilHref = '/pages/profil.html'; // Diubah dari /pages/profil-pelanggan.html menjadi /pages/profil.html
    const manajemenHref = '/pages/manajemen.html';
    const produkAdminHref = '/pages/produk.html';
    const pesanOrderHref = '/pages/pesan-order.html';

    const navContainer = document.getElementById('appNavigation');
    if (!navContainer) return;

    navContainer.innerHTML = '';

    // 1. Buat Navigasi Bawah
    const nav = document.createElement('nav');
    nav.className = "fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2.5 px-6 flex justify-between items-center z-50 max-w-md mx-auto shadow-lg rounded-t-3xl";

    // Beranda
    const aHome = document.createElement('a');
    aHome.href = homeHref;
    aHome.className = `flex flex-col items-center font-medium text-[11px] w-12 transition ${activePage === 'home' ? 'text-red-600' : 'text-gray-400 hover:text-red-600'}`;
    aHome.innerHTML = '<span class="text-xl">🏠</span><span>Beranda</span>';
    nav.appendChild(aHome);

    // Paketan
    const aPaketan = document.createElement('a');
    aPaketan.href = paketanHref;
    aPaketan.className = `flex flex-col items-center font-medium text-[11px] w-12 transition ${activePage === 'paketan' ? 'text-red-600' : 'text-gray-400 hover:text-red-600'}`;
    aPaketan.innerHTML = '<span class="text-xl">🎁</span><span>Paketan</span>';
    nav.appendChild(aPaketan);

    // Tombol Tengah Order
    const divOrder = document.createElement('div');
    divOrder.className = "relative -top-6 flex flex-col items-center";
    const aOrder = document.createElement('a');
    aOrder.href = pesanHref;
    aOrder.className = "w-14 h-14 bg-gradient-to-tr from-red-600 to-rose-500 text-white rounded-full shadow-lg shadow-red-600/40 flex items-center justify-center text-2xl transition hover:scale-105 border-4 border-gray-100 cursor-pointer";
    aOrder.title = "Order";
    aOrder.innerHTML = '📦';
    const spanOrder = document.createElement('span');
    spanOrder.className = "text-[10px] font-bold text-gray-600 mt-0.5";
    spanOrder.textContent = 'Order';
    divOrder.appendChild(aOrder);
    divOrder.appendChild(spanOrder);
    nav.appendChild(divOrder);

    // Produk
    const aProduk = document.createElement('a');
    aProduk.href = produkHref;
    aProduk.className = `flex flex-col items-center font-medium text-[11px] w-12 transition ${activePage === 'produk' ? 'text-red-600' : 'text-gray-400 hover:text-red-600'}`;
    aProduk.innerHTML = '<span class="text-xl">📦</span><span>Produk</span>';
    nav.appendChild(aProduk);

    // Tombol Lainnya (Menu)
    const btnLainnya = document.createElement('button');
    btnLainnya.id = 'btnLainnya';
    btnLainnya.className = "flex flex-col items-center text-gray-400 text-[11px] font-medium bg-transparent border-none cursor-pointer focus:outline-none w-12 hover:text-red-600 transition";
    btnLainnya.innerHTML = '<span class="text-xl">☰</span><span>Lainnya</span>';
    nav.appendChild(btnLainnya);

    navContainer.appendChild(nav);

    // 2. Buat Modal Option Menu
    const modalDiv = document.createElement('div');
    modalDiv.id = 'optionMenuModal';
    modalDiv.className = "fixed inset-0 bg-black/30 flex items-end justify-end pb-20 pr-4 z-50 hidden";

    let manajemenHTML = '';
    if (isAdmin) {
        manajemenHTML = `
            <a href="${manajemenHref}" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-gray-700">
                <span class="text-red-600 text-base">🏷️</span>
                <span>Manajemen</span>
            </a>
        `;
    }

    modalDiv.innerHTML = `
        <div class="bg-white text-gray-800 w-52 rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div class="bg-red-600 text-white px-4 py-2.5 flex justify-between items-center">
                <span class="font-bold tracking-wider text-xs uppercase">OPTION MENU</span>
                <button id="btnCloseOption" class="text-white hover:text-gray-200 font-bold text-sm cursor-pointer">✕</button>
            </div>
            <div class="py-1 divide-y divide-gray-100 text-xs font-medium">
                <a href="${profilHref}" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-gray-700">
                    <span class="text-red-600 text-base">⚙️</span>
                    <span>Pengaturan</span>
                </a>
                ${manajemenHTML}
                <a href="${produkAdminHref}" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-gray-700">
                    <span class="text-red-600 text-base">📦</span>
                    <span>Produk</span>
                </a>
                <a href="${pesanOrderHref}" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-gray-700">
                    <span class="text-red-600 text-base">📦</span>
                    <span>Lihat Pesanan</span>
                </a>
            </div>
        </div>
    `;

    navContainer.appendChild(modalDiv);

    // 3. Event Listener Modal
    const optionMenuModal = document.getElementById('optionMenuModal');
    const btnCloseOption = document.getElementById('btnCloseOption');
    const triggerBtn = document.getElementById('btnLainnya');

    if (triggerBtn && optionMenuModal) {
        triggerBtn.addEventListener('click', () => {
            optionMenuModal.classList.remove('hidden');
        });
        btnCloseOption.addEventListener('click', () => {
            optionMenuModal.classList.add('hidden');
        });
        window.addEventListener('click', (e) => {
            if (!optionMenuModal.classList.contains('hidden') && !optionMenuModal.querySelector('div').contains(e.target) && !triggerBtn.contains(e.target)) {
                optionMenuModal.classList.add('hidden');
            }
        });
    }
}