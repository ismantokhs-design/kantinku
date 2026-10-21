// assets/js/navigation.js
export function initNavigation(currentPage = '') {
    const navHTML = `
        <!-- Navigasi Bawah -->
        <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2.5 px-6 flex justify-between items-center z-50 max-w-md mx-auto shadow-lg rounded-t-3xl">
            <a href="${currentPage === 'home' ? 'index.html' : '../index.html'}" class="flex flex-col items-center ${currentPage === 'home' ? 'text-red-600 font-semibold' : 'text-gray-400 font-medium'} text-[11px] w-12 hover:text-red-600 transition">
                <span class="text-xl">🏠</span>
                <span>Beranda</span>
            </a>
            <a href="${currentPage === 'home' ? 'pages/paketan-view.html' : 'paketan-view.html'}" class="flex flex-col items-center ${currentPage === 'paketan' ? 'text-red-600 font-semibold' : 'text-gray-400 font-medium'} text-[11px] w-12 hover:text-red-600 transition">
                <span class="text-xl">🎁</span>
                <span>Paketan</span>
            </a>
            
            <!-- Tombol Tengah Order (Membuat Pesanan) -> pesan.html -->
            <div class="relative -top-6 flex flex-col items-center">
                <a href="${currentPage === 'home' ? 'pages/pesan.html' : 'pesan.html'}" class="w-14 h-14 bg-gradient-to-tr from-red-600 to-rose-500 text-white rounded-full shadow-lg shadow-red-600/40 flex items-center justify-center text-2xl transition hover:scale-105 border-4 border-gray-100 cursor-pointer" title="Order">
                    📦
                </a>
                <span class="text-[10px] font-bold ${currentPage === 'order' ? 'text-red-600' : 'text-gray-600'} mt-0.5">Order</span>
            </div>

            <!-- Ikon Produk di Navigasi Bawah -> produk-view.html -->
            <a href="${currentPage === 'home' ? 'pages/produk-view.html' : 'produk-view.html'}" class="flex flex-col items-center ${currentPage === 'produk' ? 'text-red-600 font-semibold' : 'text-gray-400 font-medium'} text-[11px] w-12 hover:text-red-600 transition">
                <span class="text-xl">📦</span>
                <span>Produk</span>
            </a>
            <button id="btnLainnya" class="flex flex-col items-center text-gray-400 text-[11px] font-medium bg-transparent border-none cursor-pointer focus:outline-none w-12">
                <span class="text-xl">☰</span>
                <span>Lainnya</span>
            </button>
        </nav>

        <!-- Option Menu Modal -->
        <div id="optionMenuModal" class="fixed inset-0 bg-black/30 flex items-end justify-end pb-20 pr-4 z-50 hidden">
            <div class="bg-white text-gray-800 w-52 rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                <div class="bg-red-600 text-white px-4 py-2.5 flex justify-between items-center">
                    <span class="font-bold tracking-wider text-xs uppercase">OPTION MENU</span>
                    <button id="btnCloseOption" class="text-white hover:text-gray-200 font-bold text-sm cursor-pointer">✕</button>
                </div>
                <div class="py-1 divide-y divide-gray-100 text-xs font-medium">
                    <a href="${currentPage === 'home' ? 'pages/profil.html' : 'profil.html'}" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-gray-700">
                        <span class="text-red-600 text-base">⚙️</span>
                        <span>Pengaturan</span>
                    </a>
                    <a href="${currentPage === 'home' ? 'pages/manajemen.html' : 'manajemen.html'}" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-gray-700">
                        <span class="text-red-600 text-base">🏷️</span>
                        <span>Manajemen</span>
                    </a>
                    <!-- Menu Produk di dalam Pop-up Lainnya dikembalikan ke produk.html -->
                    <a href="${currentPage === 'home' ? 'pages/produk.html' : 'produk.html'}" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-gray-700">
                        <span class="text-red-600 text-base">📦</span>
                        <span>Produk</span>
                    </a>
                    <!-- Menu Lihat Pesanan -> pesan-order.html -->
                    <a href="${currentPage === 'home' ? 'pages/pesan-order.html' : 'pesan-order.html'}" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-gray-700">
                        <span class="text-red-600 text-base">📦</span>
                        <span>Lihat Pesanan</span>
                    </a>
                </div>
            </div>
        </div>
    `;

    // Sisipkan ke dalam elemen penampung di HTML
    const navContainer = document.getElementById('appNavigation');
    if (navContainer) {
        navContainer.innerHTML = navHTML;

        // Script interaksi modal "Lainnya"
        const btnLainnya = document.getElementById('btnLainnya');
        const optionMenuModal = document.getElementById('optionMenuModal');
        const btnCloseOption = document.getElementById('btnCloseOption');

        if (btnLainnya && optionMenuModal) {
            btnLainnya.addEventListener('click', () => optionMenuModal.classList.remove('hidden'));
            btnCloseOption.addEventListener('click', () => optionMenuModal.classList.add('hidden'));
            window.addEventListener('click', (e) => {
                if (!optionMenuModal.classList.contains('hidden') && !optionMenuModal.querySelector('div').contains(e.target) && !btnLainnya.contains(e.target)) {
                    optionMenuModal.classList.add('hidden');
                }
            });
        }
    }
}