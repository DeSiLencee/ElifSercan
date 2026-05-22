const SUPABASE_URL = "https://dzxjbtpwlvthlncbhkmx.supabase.co/rest/v1/";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6eGpidHB3bHZ0aGxuY2Joa214Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0MjkwNDQsImV4cCI6MjA5NTAwNTA0NH0.BXROHnxMp1GtFXmh-_YFEhxj7dd4r90colc5TGO9_cY";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", () => {

    const fileInput = document.getElementById("file-input");
    const dropZone = document.getElementById("drop-zone");
    const galleryGrid = document.getElementById("gallery-grid");

    async function uploadFile(file) {

        const fileName = `${Date.now()}-${file.name}`;

        const { data, error } = await supabase
            .storage
            .from("photos")
            .upload(fileName, file);

        if (error) throw error;

        const { data: urlData } = supabase
            .storage
            .from("photos")
            .getPublicUrl(fileName);

        return urlData.publicUrl;
    }

    async function handleFiles(files) {

        for (const file of files) {

            if (!file.type.startsWith("image/")) continue;

            try {

                const url = await uploadFile(file);

                console.log("Uploaded:", url);

                const img = document.createElement("img");
                img.src = url;
                img.className = "gallery-item";

                galleryGrid.appendChild(img);

            } catch (err) {
                console.error("Upload error:", err.message);
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