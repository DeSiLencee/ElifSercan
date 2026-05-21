document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('file-input');
    const dropZone = document.getElementById('drop-zone');
    const galleryGrid = document.getElementById('gallery-grid');

    // Handle file selection via button
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    // Handle Drag & Drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--color-gold-hover)';
        dropZone.style.backgroundColor = 'rgba(197, 160, 89, 0.05)';
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = 'var(--color-gold)';
        dropZone.style.backgroundColor = '#fff';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--color-gold)';
        dropZone.style.backgroundColor = '#fff';
        
        const files = e.dataTransfer.files;
        handleFiles(files);
    });

    /**
     * Process files and generate previews
     * @param {FileList} files 
     */
    function handleFiles(files) {
        Array.from(files).forEach(file => {
            if (!file.type.startsWith('image/')) return;

            const reader = new FileReader();
            
            reader.onload = (e) => {
                const imgContainer = document.createElement('div');
                imgContainer.className = 'gallery-item';
                
                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = 'Yüklenen fotoğraf';
                
                imgContainer.appendChild(img);
                galleryGrid.appendChild(imgContainer);
            };

            reader.readAsDataURL(file);
        });
    }
});
