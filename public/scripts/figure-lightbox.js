(() => {
  const initialize = () => {
    const selector = '.sl-markdown-content a[data-figure-zoom]';
    const dialog = document.createElement('dialog');
    const closeButton = document.createElement('button');
    const image = document.createElement('img');
    const caption = document.createElement('p');
    let opener = null;

    dialog.className = 'figure-lightbox';
    dialog.setAttribute('aria-label', 'Enlarged figure');

    closeButton.className = 'figure-lightbox__close';
    closeButton.type = 'button';
    closeButton.setAttribute('aria-label', 'Close enlarged figure');
    closeButton.textContent = '×';

    image.className = 'figure-lightbox__image';
    caption.className = 'figure-lightbox__caption';

    dialog.append(closeButton, image, caption);
    document.body.append(dialog);

    document.addEventListener('click', (event) => {
      const link = event.target.closest(selector);

      if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      if (typeof dialog.showModal !== 'function') {
        return;
      }

      event.preventDefault();
      opener = link;
      image.src = link.href;
      image.alt = link.querySelector('img')?.alt || '';
      caption.textContent = link.closest('figure')?.querySelector('figcaption')?.textContent?.trim() || '';
      dialog.showModal();
      closeButton.focus();
    });

    closeButton.addEventListener('click', () => dialog.close());

    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) {
        dialog.close();
      }
    });

    dialog.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && dialog.open) {
        event.preventDefault();
        dialog.close();
      }
    });

    dialog.addEventListener('close', () => {
      image.removeAttribute('src');
      opener?.focus();
      opener = null;
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
})();
