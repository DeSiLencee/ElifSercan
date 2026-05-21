import { upload } from "@vercel/blob/client";

document.addEventListener("DOMContentLoaded", () => {

    const fileInput = document.getElementById("file-input");
    const dropZone = document.getElementById("drop-zone");
    const galleryGrid = document.getElementById("gallery-grid");

    async function handleFiles(files) {

        for (const file of files) {

            if (!file.type.startsWith("image/")) continue;

            try {

                const blob = await upload(file.name, file, {
                    access: "public",
                    handleUploadUrl: "/api/upload",
                });

                console.log("Uploaded:", blob.url);

                const img = document.createElement("img");
                img.src = blob.url;

                galleryGrid.appendChild(img);

            } catch (err) {
                console.error(err);
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