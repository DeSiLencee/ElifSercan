import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

document.addEventListener('DOMContentLoaded', () => {

    const fileInput = document.getElementById('file-input');
    const dropZone = document.getElementById('drop-zone');
    const galleryGrid = document.getElementById('gallery-grid');


    // Init Firebase
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);

    // File input
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    // Drag over
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--color-gold-hover)';
        dropZone.style.backgroundColor = 'rgba(197, 160, 89, 0.05)';
    });

    // Drag leave
    dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = 'var(--color-gold)';
        dropZone.style.backgroundColor = '#fff';
    });

    // Drop
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--color-gold)';
        dropZone.style.backgroundColor = '#fff';

        handleFiles(e.dataTransfer.files);
    });

    // MAIN FUNCTION
    async function handleFiles(files) {

        Array.from(files).forEach(async (file) => {

            if (!file.type.startsWith('image/')) return;

            try {

                // Firebase storage path
                const storageRef = ref(
                    storage,
                    `uploads/${Date.now()}-${file.name}`
                );

                // Upload file
                await uploadBytes(storageRef, file);

                // Get URL
                const downloadURL = await getDownloadURL(storageRef);

                console.log("Uploaded:", downloadURL);

                // Preview
                const reader = new FileReader();

                reader.onload = (e) => {

                    const imgContainer = document.createElement('div');
                    imgContainer.className = 'gallery-item';

                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.alt = 'Yüklenen fotoğraf';

                    // Firebase URL (istersen kullanırsın sonra)
                    img.setAttribute("data-url", downloadURL);

                    imgContainer.appendChild(img);
                    galleryGrid.appendChild(imgContainer);
                };

                reader.readAsDataURL(file);

            } catch (error) {
                console.error("Upload error:", error);
                alert("Fotoğraf yüklenemedi!");
            }
        });
    }

});