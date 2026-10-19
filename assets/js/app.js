import { auth, db, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "./firebase-config.js";
import { doc, setDoc, getDoc, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
    const landingPage = document.getElementById('landingPage');
    const mainApp = document.getElementById('mainApp');
    const emailModal = document.getElementById('emailModal');
    const btnMasuk = document.getElementById('btnMasuk');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const emailForm = document.getElementById('emailForm');
    const userEmailInput = document.getElementById('userEmailInput');
    const userAvatar = document.getElementById('userAvatar');
    
    const profileBtn = document.getElementById('profileBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const userEmailDisplay = document.getElementById('userEmailDisplay');
    const btnLogout = document.getElementById('btnLogout');

    // Option Menu (Lainnya)
    const btnLainnya = document.getElementById('btnLainnya');
    const optionMenuModal = document.getElementById('optionMenuModal');
    const btnCloseOption = document.getElementById('btnCloseOption');

    // Cek Status Auth Firebase
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            await simpanAtauPerbaruiUserKeFirestore(user);
            tampilkanHalamanUtama(user.email);
            loadDynamicBanner(); // Muat banner otomatis setelah berhasil login/masuk
        } else {
            tampilkanLandingPage();
        }
    });

    // Buka Modal Email
    if (btnMasuk) {
        btnMasuk.addEventListener('click', () => {
            emailModal.classList.remove('hidden');
        });
    }

    if (btnCloseModal) {
        btnCloseModal.addEventListener('click', () => {
            emailModal.classList.add('hidden');
        });
    }

    // Proses Login / Register dengan Firebase Auth & Firestore
    if (emailForm) {
        emailForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = userEmailInput.value.trim();
            const password = "defaultPassword123";

            try {
                let userCredential;
                try {
                    userCredential = await signInWithEmailAndPassword(auth, email, password);
                } catch (loginError) {
                    userCredential = await createUserWithEmailAndPassword(auth, email, password);
                }

                emailModal.classList.add('hidden');
            } catch (error) {
                alert("Gagal masuk: " + error.message);
            }
        });
    }

    // Fungsi untuk Menyimpan Data User ke Firestore
    async function simpanAtauPerbaruiUserKeFirestore(user) {
        try {
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    uid: user.uid,
                    email: user.email,
                    role: "Member Setia",
                    waktuDibuat: new Date().toISOString()
                });
            }
        } catch (error) {
            console.error("Gagal menyimpan ke Firestore: ", error);
        }
    }

    // Fungsi Memuat Banner Dinamis dari Firestore (Tanpa orderBy agar tidak butuh index tambahan)
    async function loadDynamicBanner() {
        const sliderContainer = document.getElementById('sliderContainer');
        const sliderDots = document.getElementById('sliderDots');

        if (!sliderContainer) return;

        try {
            const q = query(collection(db, "banner"), where("status", "==", true));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                sliderContainer.innerHTML = `
                    <div class="slide absolute inset-0 transition-opacity duration-700 opacity-100 flex items-center justify-center bg-gray-100 text-gray-400 text-xs">
                        Belum ada banner aktif
                    </div>
                `;
                if (sliderDots) sliderDots.innerHTML = "";
                return;
            }

            let slidesHTML = "";
            let dotsHTML = "";
            let index = 0;

            querySnapshot.forEach((docSnap) => {
                const data = docSnap.data();
                const opacityClass = index === 0 ? "opacity-100" : "opacity-0";
                const dotClass = index === 0 ? "bg-red-600 w-5" : "bg-gray-300 w-2";

                slidesHTML += `
                    <div class="slide absolute inset-0 transition-opacity duration-700 ${opacityClass}">
                        <img src="${data.gambar}" alt="${data.nama}" class="w-full h-full object-cover">
                        <div class="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-3 py-1 rounded-full backdrop-blur-xs">
                            ${data.nama}
                        </div>
                    </div>
                `;

                dotsHTML += `
                    <span class="dot h-2 rounded-full ${dotClass} transition-all duration-300 cursor-pointer" data-index="${index}"></span>
                `;
                index++;
            });

            sliderContainer.innerHTML = slidesHTML;
            if (sliderDots) sliderDots.innerHTML = dotsHTML;

            startSliderTimer();

        } catch (err) {
            console.error("Gagal memuat banner dinamis: ", err);
        }
    }

    // Fungsi Timer Slider Bergantian Otomatis
    function startSliderTimer() {
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.dot');
        if (slides.length <= 1) return;

        let currentIndex = 0;
        setInterval(() => {
            slides[currentIndex].classList.remove('opacity-100');
            slides[currentIndex].classList.add('opacity-0');
            if(dots[currentIndex]) {
                dots[currentIndex].classList.remove('bg-red-600', 'w-5');
                dots[currentIndex].classList.add('bg-gray-300', 'w-2');
            }

            currentIndex = (currentIndex + 1) % slides.length;

            slides[currentIndex].classList.remove('opacity-0');
            slides[currentIndex].classList.add('opacity-100');
            if(dots[currentIndex]) {
                dots[currentIndex].classList.remove('bg-gray-300', 'w-2');
                dots[currentIndex].classList.add('bg-red-600', 'w-5');
            }
        }, 3500);
    }

    // Toggle Dropdown Profil
    if (profileBtn) {
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('hidden');
        });
    }

    window.addEventListener('click', (e) => {
        if (dropdownMenu && !dropdownMenu.classList.contains('hidden') && !profileBtn.contains(e.target)) {
            dropdownMenu.classList.add('hidden');
        }
    });

    // Tombol Keluar (Logout Firebase)
    if (btnLogout) {
        btnLogout.addEventListener('click', async () => {
            await signOut(auth);
            dropdownMenu.classList.add('hidden');
        });
    }

    // Toggle Option Menu (Lainnya)
    if (btnLainnya) {
        btnLainnya.addEventListener('click', (e) => {
            e.stopPropagation();
            optionMenuModal.classList.remove('hidden');
        });
    }

    if (btnCloseOption) {
        btnCloseOption.addEventListener('click', () => {
            optionMenuModal.classList.add('hidden');
        });
    }

    window.addEventListener('click', (e) => {
        if (optionMenuModal && e.target === optionMenuModal) {
            optionMenuModal.classList.add('hidden');
        }
    });

    // Fungsi Transisi UI
    function tampilkanHalamanUtama(email) {
        if (landingPage) landingPage.classList.add('hidden');
        if (mainApp) {
            mainApp.classList.remove('hidden');
            mainApp.classList.add('flex');
        }
        if (userAvatar) userAvatar.textContent = email.charAt(0).toUpperCase();
        if (userEmailDisplay) userEmailDisplay.textContent = email;
    }

    function tampilkanLandingPage() {
        if (mainApp) {
            mainApp.classList.add('hidden');
            mainApp.classList.remove('flex');
        }
        if (landingPage) landingPage.classList.remove('hidden');
        if (userEmailInput) userEmailInput.value = '';
    }
});