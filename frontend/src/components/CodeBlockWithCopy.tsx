import React from 'react';

export const addCopyButtonsToCodeBlocks = () => {
  // Find all code blocks
  const codeBlocks = document.querySelectorAll('pre code');

  codeBlocks.forEach((codeBlock) => {
    const pre = codeBlock.parentElement;
    if (!pre || pre.querySelector('.copy-code-button')) return; // Already has button

    // Create wrapper for positioning
    if (pre.style.position !== 'relative') {
      pre.style.position = 'relative';
    }

    // Create copy button
    const button = document.createElement('button');
    button.className = 'copy-code-button';
    button.innerHTML = `
      <svg class="copy-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
      <svg class="check-icon hidden" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    `;

    button.addEventListener('click', async () => {
      const code = codeBlock.textContent || '';

      try {
        await navigator.clipboard.writeText(code);

        // Show check icon
        const copyIcon = button.querySelector('.copy-icon');
        const checkIcon = button.querySelector('.check-icon');
        if (copyIcon && checkIcon) {
          copyIcon.classList.add('hidden');
          checkIcon.classList.remove('hidden');
          button.classList.add('copied');
        }

        // Reset after 2 seconds
        setTimeout(() => {
          if (copyIcon && checkIcon) {
            copyIcon.classList.remove('hidden');
            checkIcon.classList.add('hidden');
            button.classList.remove('copied');
          }
        }, 2000);
      } catch (err) {
        console.error('Failed to copy code:', err);
      }
    });

    pre.appendChild(button);
  });
};

// Hook to add copy buttons after content loads
export const useCodeBlockCopy = () => {
  React.useEffect(() => {
    // Add buttons after a short delay to ensure content is rendered
    const timeout = setTimeout(() => {
      addCopyButtonsToCodeBlocks();
    }, 100);

    return () => clearTimeout(timeout);
  }, []);
};
