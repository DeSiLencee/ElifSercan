document.addEventListener("DOMContentLoaded", () => {

    const fileInput = document.getElementById("file-input");
    const dropZone = document.getElementById("drop-zone");
    const galleryGrid = document.getElementById("gallery-grid");

    async function handleFiles(files) {

        for (const file of files) {

            if (!file.type.startsWith("image/")) continue;

            try {

                const formData = new FormData();
                formData.append("file", file);

                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: file
                });

                const data = await res.json();

                console.log("Uploaded:", data.url);

                const img = document.createElement("img");
                img.src = data.url;
                img.className = "gallery-item";

                galleryGrid.appendChild(img);

            } catch (err) {
                console.error("Upload error:", err);
            }
        }
    }

    fileInput.addEventListener("change", (e) => {
        handleFiles(e.target.files);
    });

    dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
    });

});