import { db } from "./firebase-config.js";
import { collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Contoh Fungsi Simpan Pesanan ke Firestore
export async function simpanPesananKeDB(userEmail, detailPesanan) {
    try {
        const docRef = await addDoc(collection(db, "pesanan"), {
            email: userEmail,
            pesanan: detailPesanan,
            waktu: new Date().toISOString()
        });
        console.log("Pesanan berhasil disimpan dengan ID: ", docRef.id);
        return true;
    } catch (e) {
        console.error("Gagal menyimpan pesanan: ", e);
        return false;
    }
}

// Contoh Fungsi Ambil Data Pesanan Berdasarkan Email
export async function ambilPesananUser(userEmail) {
    try {
        const q = query(collection(db, "pesanan"), where("email", "==", userEmail));
        const querySnapshot = await getDocs(q);
        let dataList = [];
        querySnapshot.forEach((doc) => {
            dataList.push({ id: doc.id, ...doc.data() });
        });
        return dataList;
    } catch (e) {
        console.error("Gagal mengambil data: ", e);
        return [];
    }
}