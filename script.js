document.addEventListener('DOMContentLoaded', () => {
    const qrText = document.getElementById('qr-text');
    const qrSize = document.getElementById('qr-size');
    const generateBtn = document.getElementById('generate-btn');
    const downloadBtn = document.getElementById('download-btn');
    const qrContainer = document.getElementById('qr-code');
    const qrOutput = document.querySelector('.qr-output');

    function generateQRCode() {
        if (!qrText.value) {
            alert("Please enter some text or Url!");
            return;
        }

        // Clear previous QR code
        qrContainer.innerHTML = '';
        
        // Calculate cellSize based on selected size
        const selectedSize = Number(qrSize.value);
        const cellSize = Math.floor(selectedSize / 25); // Adjust cell size based on QR version
        
        // Generate QR Code
        const qr = qrcode(0, 'L');
        qr.addData(qrText.value);
        qr.make();
        
        // Create QR code image with calculated cell size
        const qrImage = qr.createImgTag(cellSize);
        qrContainer.innerHTML = qrImage;
        
        // Adjust image size if needed
        const img = qrContainer.querySelector('img');
        if (img) {
            img.style.width = `${selectedSize}px`;
            img.style.height = `${selectedSize}px`;
        }
        
        // Show QR output section and download button
        qrOutput.classList.add('active');
        downloadBtn.classList.remove('hidden');
    }

    function downloadQRCode() {
        const qrImage = qrContainer.querySelector('img');
        if (!qrImage) {
            alert('Create a QR code first!');
            return;
        }

        // Create a new image to handle loading
        const img = new Image();
        img.crossOrigin = 'Anonymous'; // Handle CORS issues
        img.src = qrImage.src;
        
        img.onload = function() {
            // Create a temporary canvas
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const size = Number(qrSize.value);
            
            canvas.width = size;
            canvas.height = size;
            
            // Draw QR code on canvas with white background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, size, size);
            ctx.drawImage(img, 0, 0, size, size);
            
            try {
                // Create download link
                const link = document.createElement('a');
                link.download = 'qr-code.png';
                link.href = canvas.toDataURL('image/png');
                document.body.appendChild(link); // Needed for Firefox
                link.click();
                document.body.removeChild(link); // Clean up
            } catch (e) {
                alert('An error occurred while downloading the QR code. Please try again.');
                console.error('Download error:', e);
            }
        };

        img.onerror = function() {
            alert('An error occurred while loading the QR code image. Please try again.');
        };
    }

    // Event listeners
    generateBtn.addEventListener('click', generateQRCode);
    downloadBtn.addEventListener('click', downloadQRCode);
    qrText.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') generateQRCode();
    });

    // Generate QR code when size changes
    qrSize.addEventListener('change', () => {
        if (qrText.value) generateQRCode();
    });
}); 