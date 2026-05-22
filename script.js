// Supabase Konfigürasyonu
const SUPABASE_URL = "https://dzxjbtpwlvthlncbhkmx.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6eGpidHB3bHZ0aGxuY2Joa214Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0MjkwNDQsImV4cCI6MjA5NTAwNTA0NH0.BXROHnxMp1GtFXmh-_YFEhxj7dd4r90colc5TGO9_cY";
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("file-input");
    const dropZone = document.getElementById("drop-zone");
    const uploadToast = document.getElementById("upload-toast");
    const successToast = document.getElementById("success-toast");
    const progressFill = document.getElementById("progress-fill");

    function showSuccessToast() {
        successToast.classList.add('show');
        setTimeout(() => {
            successToast.classList.remove('show');
        }, 4000);
    }

    async function handleFiles(files) {
        for (const file of files) {
            if (!file.type.startsWith("image/")) continue;

            // Yükleme barını göster ve sıfırla
            progressFill.style.width = "0%";
            uploadToast.classList.add('show');

            // İlerlemeyi simüle et (Gerçekçi bir deneyim için)
            let progress = 0;
            const progressInterval = setInterval(() => {
                if (progress < 90) {
                    progress += Math.random() * 5;
                    progressFill.style.width = `${Math.min(progress, 90)}%`;
                }
            }, 200);

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

                // İşlem başarılı: Barı %100 yap ve kapat
                clearInterval(progressInterval);
                progressFill.style.width = "100%";
                
                setTimeout(() => {
                    uploadToast.classList.remove('show');
                    setTimeout(showSuccessToast, 500); // Başarı mesajını göster
                }, 500);

            } catch (err) {
                clearInterval(progressInterval);
                console.error("Yükleme hatası:", err.message);
                uploadToast.classList.remove('show');
                alert("Yükleme sırasında bir hata oluştu: " + err.message);
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
