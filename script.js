document.addEventListener('DOMContentLoaded', function() {
    const linkInput = document.getElementById('linkInput');
    const openLinkButton = document.getElementById('openLinkButton');
    const lastUsedList = document.getElementById('lastUsedList');

    let links = [];

    linkInput.addEventListener('input', function() {
        links = linkInput.value.split('\n').filter(link => link.trim() !== '');
    });

    openLinkButton.addEventListener('click', function() {
        if (links.length === 0) {
            M.toast({html: 'No more links to open!'});
            return;
        }

        const linkToOpen = links.shift();
        linkInput.value = links.join('\n');

        // Add to the beginning of the last used list
        const listItem = document.createElement('li');
        listItem.className = 'collection-item';
        listItem.innerHTML = `
            <a href="${linkToOpen}" target="_blank">${linkToOpen}</a>
            <button class="copy-button" data-link="${linkToOpen}">Copy</button>
        `;
        lastUsedList.insertBefore(listItem, lastUsedList.firstChild); // Insert at the top

        window.open(linkToOpen, '_blank');
    });

    // Delegated event handler for copy buttons
    lastUsedList.addEventListener('click', function(event) {
        if (event.target && event.target.classList.contains('copy-button')) {
            const link = event.target.getAttribute('data-link');
            copyToClipboard(link);
        }
    });
});

function copyToClipboard(text) {
    // Using Clipboard API if available
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            M.toast({html: 'Link copied to clipboard!'});
        }).catch(err => {
            console.error('Clipboard API copy failed', err);
            fallbackCopyTextToClipboard(text);
        });
    } else {
        // Fallback to using execCommand if Clipboard API is not available
        fallbackCopyTextToClipboard(text);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';  // Prevent scrolling to bottom of page in MS Edge.
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');
        M.toast({html: 'Link copied to clipboard!'});
    } catch (err) {
        M.toast({html: 'Failed to copy link!'});
        console.error('Fallback copy failed', err);
    }
    
    document.body.removeChild(textArea);
}
