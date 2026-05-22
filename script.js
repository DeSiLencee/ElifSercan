// Supabase Konfigürasyonu
const SUPABASE_URL = "https://dzxjbtpwlvthlncbhkmx.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6eGpidHB3bHZ0aGxuY2Joa214Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0MjkwNDQsImV4cCI6MjA5NTAwNTA0NH0.BXROHnxMp1GtFXmh-_YFEhxj7dd4r90colc5TGO9_cY";
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("file-input");
    const dropZone = document.getElementById("drop-zone");
    const galleryGrid = document.getElementById("gallery-grid");
    const successToast = document.getElementById("success-toast");

    function showSuccessToast() {
        successToast.classList.add('show');
        setTimeout(() => {
            successToast.classList.remove('show');
        }, 4000);
    }

    async function handleFiles(files) {
        for (const file of files) {
            if (!file.type.startsWith("image/")) continue;

            // Yükleniyor durumu bildirimi (küçük bir yazı olarak kalsın)
            const loadingText = document.createElement('p');
            loadingText.innerText = 'Fotoğrafınız gönderiliyor...';
            loadingText.style.textAlign = 'center';
            loadingText.style.color = 'var(--color-gold)';
            loadingText.style.fontSize = '0.9rem';
            loadingText.style.marginTop = '1rem';
            galleryGrid.prepend(loadingText);

            try {
                // 1. Dosyayı Supabase Storage 'photos' bucket'ına yükle
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
                const filePath = fileName;

                const { data: uploadData, error: uploadError } = await _supabase.storage
                    .from('photos')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                // 2. Dosyanın halka açık URL'sini al
                const { data: { publicUrl } } = _supabase.storage
                    .from('photos')
                    .getPublicUrl(filePath);

                // 3. URL'yi 'photos' tablosuna kaydet
                const { error: dbError } = await _supabase
                    .from('photos')
                    .insert([{ url: publicUrl }]);

                if (dbError) throw dbError;

                // Başarılı yükleme bildirimi (Ekranda kalpli toast çıkar)
                loadingText.remove();
                showSuccessToast();

            } catch (err) {
                console.error("Yükleme hatası:", err.message);
                loadingText.innerText = 'Yükleme sırasında bir hata oluştu.';
                loadingText.style.color = 'red';
                setTimeout(() => loadingText.remove(), 3000);
            }
        }
    }

    fileInput.addEventListener("change", (e) => {
        handleFiles(e.target.files);
    });

    dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZone.style.borderColor = "var(--color-gold)";
    });

    dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZone.style.borderColor = "var(--color-gold)";
        handleFiles(e.dataTransfer.files);
    });
});
