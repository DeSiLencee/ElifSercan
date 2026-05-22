// Supabase Konfigürasyonu
const SUPABASE_URL = "https://dzxjbtpwlvthlncbhkmx.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6eGpidHB3bHZ0aGxuY2Joa214Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0MjkwNDQsImV4cCI6MjA5NTAwNTA0NH0.BXROHnxMp1GtFXmh-_YFEhxj7dd4r90colc5TGO9_cY";
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("file-input");
    const dropZone = document.getElementById("drop-zone");
    const galleryGrid = document.getElementById("gallery-grid");

    // Sayfa açıldığında mevcut fotoğrafları Supabase'den yükle
    loadPhotos();

    async function loadPhotos() {
        try {
            // 'photos' tablosundan tüm kayıtları çek
            const { data, error } = await _supabase
                .from('photos')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            galleryGrid.innerHTML = '';
            data.forEach(photo => {
                addPhotoToGallery(photo.url);
            });
        } catch (error) {
            console.error('Fotoğraflar yüklenemedi:', error.message);
        }
    }

    async function handleFiles(files) {
        for (const file of files) {
            if (!file.type.startsWith("image/")) continue;

            // Yükleniyor durumu
            const tempItem = document.createElement('div');
            tempItem.className = 'gallery-item';
            tempItem.style.opacity = '0.5';
            tempItem.innerText = 'Yükleniyor...';
            galleryGrid.prepend(tempItem);

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

                // Başarılı
                tempItem.remove();
                addPhotoToGallery(publicUrl);

            } catch (err) {
                console.error("Yükleme hatası:", err.message);
                tempItem.innerText = 'Hata!';
                tempItem.style.color = 'red';
                setTimeout(() => tempItem.remove(), 2000);
            }
        }
    }

    function addPhotoToGallery(url) {
        const imgContainer = document.createElement('div');
        imgContainer.className = 'gallery-item';
        
        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Yüklenen fotoğraf';
        img.loading = 'lazy';
        
        imgContainer.appendChild(img);
        galleryGrid.prepend(imgContainer);
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
