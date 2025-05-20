document.getElementById('printQrCode').addEventListener('click', function() {
        const printWindow = window.open('', '_blank');
        const qrCodeImage = document.getElementById('qrCodeImage').src;
        const qrCodetext = document.getElementById('qrText').value;
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print QR Code</title>
                </head>
                <body>
                    <div style="text-align: center;">
                        <img src="${qrCodeImage}" alt="QR Code">
                        <p> Date: ${new Date().toLocaleDateString()} time: ${new Date().toLocaleTimeString()}</p>
                        <p> text: ${qrCodetext}</p>
                    </div>
                    
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    });
