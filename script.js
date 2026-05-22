document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("file-input");
    const dropZone = document.getElementById("drop-zone");
    const galleryGrid = document.getElementById("gallery-grid");

    // Sayfa açıldığında mevcut fotoğrafları yükle
    loadPhotos();

    async function loadPhotos() {
        try {
            const response = await fetch('/api/get-photos');
            const photos = await response.json();
            
            if (photos.error) throw new Error(photos.error);
            
            galleryGrid.innerHTML = ''; // Temizle
            photos.forEach(photo => {
                addPhotoToGallery(photo.url);
            });
        } catch (error) {
            console.error('Fotoğraflar yüklenemedi:', error);
        }
    }

    async function handleFiles(files) {
        for (const file of files) {
            if (!file.type.startsWith("image/")) continue;

            // Geçici yükleniyor durumu
            const tempItem = document.createElement('div');
            tempItem.className = 'gallery-item';
            tempItem.style.opacity = '0.5';
            tempItem.innerText = 'Yükleniyor...';
            galleryGrid.prepend(tempItem);

            try {
                // Vercel Blob API'sine gönder
                const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
                    method: "POST",
                    body: file
                });

                const data = await res.json();

                if (data.url) {
                    tempItem.remove(); // Geçici öğeyi kaldır
                    addPhotoToGallery(data.url);
                } else {
                    throw new Error("Yükleme başarısız");
                }

            } catch (err) {
                console.error("Upload error:", err);
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
        galleryGrid.prepend(imgContainer); // En yeni en başta
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
