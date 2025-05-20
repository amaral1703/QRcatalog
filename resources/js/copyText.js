document.getElementById('copyBtn').addEventListener('click', function() {
    const skuValue = document.getElementById('productId').value;
    
    // Create temporary textarea to copy text
    const textarea = document.createElement('textarea');
    textarea.value = skuValue;
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        // Execute copy command
        document.execCommand('copy');
        // Show feedback to user
        this.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            this.innerHTML = '<i class="fas fa-copy"></i> Copy SKU';
        }, 2000);
    } catch (err) {
        console.error('Failed to copy SKU:', err);
    } finally {
        document.body.removeChild(textarea);
    }
});