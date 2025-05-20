// import { Html5QrcodeScanner } from 'html5-qrcode';

document.addEventListener("DOMContentLoaded", function () {
  // Elements
  const openScannerButton = document.getElementById("open-scanner");
  const stopScannerButton = document.getElementById("stop-scan");
  const scannerSection = document.getElementById("scanner-section");
  const resultElement = document.getElementById("qr-result");
  const permanentResultElement = document.getElementById("scan-result");

  let html5QrcodeScanner = null;

  // Open scanner
  openScannerButton.addEventListener("click", () => {
    // Check if Html5QrcodeScanner is defined
    if (typeof Html5QrcodeScanner === "undefined") {
      console.error("QR code scanner library not loaded!");
      resultElement.textContent = "Error: QR code scanner library not loaded.";
      resultElement.style.color = "red";
      return;
    }

    scannerSection.style.display = "block";
    openScannerButton.disabled = true;
    resultElement.textContent = "Initializing camera...";
    resultElement.style.color = "blue";

    
    html5QrcodeScanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        formatsToSupport: [
          Html5QrcodeSupportedFormats.QR_CODE,
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
        ],
        rememberLastUsedCamera: true,
        showTorchButtonIfSupported: true,
        showZoomSliderIfSupported: true,
      },
      /* verbose= */ false
    );

    // Start scanning
    html5QrcodeScanner.render(
      (decodedText) => {
        // Success callback
        console.log(`QR Code detected: ${decodedText}`);
        resultElement.textContent = `Scanned: ${decodedText}`;
        resultElement.style.color = "green";

        // Process the scanned text to extract SKU
        let productSku = extractSkuFromText(decodedText);

        // Update the permanent result element
        permanentResultElement.textContent = `SKU encontrado: ${productSku}`;
        document.getElementById("productId").value = productSku;

        // Show the result section
        document.getElementById("result-section").style.display = "block";

        stopScannerButton.click();
      },
      (errorMessage) => {
        console.warn(`QR Code scan error: ${errorMessage}`);
      }
    );
  });

  // Stop scanner
  stopScannerButton.addEventListener("click", () => {
    if (html5QrcodeScanner) {
      html5QrcodeScanner.clear().catch((error) => {
        console.error("Failed to clear scanner", error);
      });
      html5QrcodeScanner = null;
    }
    scannerSection.style.display = "none";
    openScannerButton.disabled = false;
    // resultElement.textContent = '';
  });
});

// Function to extract SKU from text (either direct SKU or JSON)
function extractSkuFromText(text) {
  try {
    // Check if it's valid JSON
    const jsonData = JSON.parse(text);

    // If parsing succeeded, extract the SKU from the JSON
    if (jsonData && jsonData.SKU) {
      return jsonData.SKU;
    } else if (jsonData && jsonData.sku) {
      return jsonData.sku;
    } else {
      // JSON is valid but doesn't have SKU field
      console.warn("JSON doesn't contain SKU field:", jsonData);
      return text; // Return original as fallback
    }
  } catch (e) {
    // If it's not valid JSON, assume it's a direct SKU
    console.log("Using direct SKU value");
    return text;
  }
}

// import { BrowserMultiFormatReader } from 'https://cdn.jsdelivr.net/npm/@zxing/library@0.19.1/esm/index.min.js';

// document.addEventListener('DOMContentLoaded', function () {
//     const video = document.getElementById('qr-video');
//     const openScannerButton = document.getElementById('open-scanner');
//     const stopScannerButton = document.getElementById('stop-scan');
//     const scannerSection = document.getElementById('scanner-section');
//     const resultElement = document.getElementById('qr-result');

//     let codeReader = null;

//     openScannerButton.addEventListener('click', async () => {
//         scannerSection.style.display = 'block';
//         openScannerButton.disabled = true;

//         try {
//             codeReader = new BrowserMultiFormatReader();

//             await codeReader.decodeFromVideoDevice(
//                 { facingMode: "environment" },
//                 video,
//                 (result, err) => {
//                     if (result) {
//                         console.log(`QR Code detected: ${result.getText()}`);
//                         resultElement.textContent = `Scanned: ${result.getText()}`;
//                         resultElement.style.color = 'green';
//                         stopScannerButton.click();
//                     }
//                 }
//             );
//         } catch (error) {
//             console.error('Error initializing scanner:', error);
//             resultElement.textContent = 'Error initializing scanner.';
//         }
//     });

//     stopScannerButton.addEventListener('click', () => {
//         if (codeReader) {
//             codeReader.reset();
//             codeReader = null;
//         }
//         scannerSection.style.display = 'none';
//         openScannerButton.disabled = false;
//         resultElement.textContent = '';
//     });
// });

// document.addEventListener('DOMContentLoaded', function () {
//     // Elements
//     const video = document.getElementById('qr-video');
//     const openScannerButton = document.getElementById('open-scanner');
//     const stopScannerButton = document.getElementById('stop-scan');
//     const scannerSection = document.getElementById('scanner-section');
//     const resultElement = document.getElementById('qr-result');

//     let videoStream = null;

//     // Open scanner
//     openScannerButton.addEventListener('click', async () => {
//         scannerSection.style.display = 'block';
//         openScannerButton.disabled = true;

//         try {
//             videoStream = await navigator.mediaDevices.getUserMedia({
//                 video: { facingMode: 'environment' },
//             });
//             video.srcObject = videoStream;
//             video.play();
//             resultElement.textContent = 'Scanning...';

//             // Start scanning for QR codes
//             scanQRCode();
//         } catch (error) {
//             console.error('Error accessing camera:', error);
//             resultElement.textContent = 'Error accessing camera.';
//         }
//     });

//     // Stop scanner
//     stopScannerButton.addEventListener('click', () => {
//         if (videoStream) {
//             videoStream.getTracks().forEach((track) => track.stop());
//             video.srcObject = null;
//             videoStream = null;
//         }
//         scannerSection.style.display = 'none';
//         openScannerButton.disabled = false;
//         resultElement.textContent = '';
//     });

//     // Scan QR Code
//     function scanQRCode() {
//         const canvas = document.createElement('canvas');
//         const context = canvas.getContext('2d');

//         function processFrame() {
//             if (!videoStream) return;

//             canvas.width = video.videoWidth;
//             canvas.height = video.videoHeight;
//             context.drawImage(video, 0, 0, canvas.width, canvas.height);

//             const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
//             const code = jsQR(imageData.data, imageData.width, imageData.height);

//             console.log('Processing frame...');
//             if (code) {
//                 resultElement.textContent = `Scanned: ${code.data}`;
//                 resultElement.style.color = 'green';
//                 console.log(`QR Code detected: ${code.data}`);
//                 stopScannerButton.click(); // Para o scanner após o sucesso
//             } else {
//                 resultElement.textContent = 'No QR Code detected';
//                 resultElement.style.color = 'red';
//                 requestAnimationFrame(processFrame);
//             }
//         }

//         requestAnimationFrame(processFrame);
//     }
// });
