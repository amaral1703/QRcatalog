document.addEventListener('DOMContentLoaded', function() {
    const skuInput = document.getElementById('sku');
    const nameInput = document.getElementById('name');
    const priceInput = document.getElementById('price');
    const qrTextInput = document.getElementById('qr_text');
    
    document.getElementById('fillSku').addEventListener('click', function() {
        if (skuInput.value) {
            qrTextInput.value = skuInput.value;
        } else {
            alert('Please enter a SKU first');
        }
    });
    
    document.getElementById('fillJson').addEventListener('click', function() {
        if (nameInput.value && skuInput.value && priceInput.value) {
            const productData = {
                name: nameInput.value,
                sku: skuInput.value,
                price: priceInput.value
            };
            qrTextInput.value = JSON.stringify(productData, null, 2);
        } else {
            alert('Please fill in Name, SKU and Price fields first');
        }
    });
});