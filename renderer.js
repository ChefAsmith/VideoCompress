const dropArea = document.getElementById('drop-area');
const log = document.getElementById('log');
const progressBar = document.getElementById('progress-bar');

// Prevent default behavior for drag events
document.addEventListener('dragover', e => e.preventDefault());
document.addEventListener('drop', e => e.preventDefault());

dropArea.addEventListener('dragover', e => {
  e.preventDefault();
  dropArea.style.borderColor = '#00ffaa';
});

dropArea.addEventListener('dragleave', () => {
  dropArea.style.borderColor = '#555';
});

dropArea.addEventListener('drop', async e => {
    e.preventDefault();
    dropArea.style.borderColor = '#555';
  
    const items = e.dataTransfer.items;
  
    if (items.length > 0) {
      const entry = items[0].webkitGetAsEntry?.();
  
      if (entry && entry.isFile) {
        let filePath = entry.fullPath;
  
        console.log('Dropped file:', filePath); // Log file path
  
        // Check if the filePath starts with file://, and remove that prefix
        if (filePath.startsWith('file://')) {
          filePath = decodeURIComponent(filePath.slice(7)); // Remove 'file://' and decode URL-encoded parts
        }
  
        console.log('Resolved file path:', filePath); // Log resolved path
  
        log.textContent = `📁 Compressing file: ${filePath}\n`;
  
        try {
          // Send file path to main process to compress
          const result = await window.electronAPI.compressFile(filePath);
  
          if (result?.status === 'done') {
            const originalSize = (result.originalSize / 1024 / 1024).toFixed(2); // MB
            const compressedSize = (result.compressedSize / 1024 / 1024).toFixed(2); // MB
  
            log.textContent += `✅ ${result.file} - Original: ${originalSize}MB, Compressed: ${compressedSize}MB\n`;
          } else {
            log.textContent += `❌ ${result?.error || 'Unknown error'}\n`;
          }
        } catch (err) {
          log.textContent += `🚫 Failed to compress file: ${err.message}\n`;
        }
      } else {
        log.textContent = `❌ Please drop a file, not a folder.\n`;
      }
    }
  });
  