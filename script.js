document.addEventListener("DOMContentLoaded", () => {

    const fileInput = document.getElementById("file-input");
    const dropZone = document.getElementById("drop-zone");
    const galleryGrid = document.getElementById("gallery-grid");

    // Upload to Vercel Blob
    async function uploadToVercel(file) {

        const res = await fetch("/api/upload", {
            method: "POST",
            body: file
        });

        const data = await res.json();
        return data.url;
    }

    // Handle files
    async function handleFiles(files) {

        for (const file of files) {

            if (!file.type.startsWith("image/")) continue;

            try {
                const url = await uploadToVercel(file);

                console.log("Uploaded:", url);

                const img = document.createElement("img");
                img.src = url;
                img.className = "gallery-item";

                galleryGrid.appendChild(img);

            } catch (err) {
                console.error("Upload error:", err);
            }
        }
    }

    // File input
    fileInput.addEventListener("change", (e) => {
        handleFiles(e.target.files);
    });

    // Drag & drop
    dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
    });

});