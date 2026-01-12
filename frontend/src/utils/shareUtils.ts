/**
 * Utility functions for sharing posts on various platforms
 */

export interface ShareData {
  url: string;
  title: string;
  description?: string;
}

/**
 * Generate share URLs for different platforms
 */
export const shareUrls = {
  twitter: (data: ShareData): string => {
    const text = encodeURIComponent(`${data.title} ${data.url}`);
    return `https://twitter.com/intent/tweet?text=${text}`;
  },

  facebook: (data: ShareData): string => {
    const url = encodeURIComponent(data.url);
    return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  },

  linkedin: (data: ShareData): string => {
    const url = encodeURIComponent(data.url);
    return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
  },

  whatsapp: (data: ShareData): string => {
    const text = encodeURIComponent(`${data.title}\n${data.url}`);
    return `https://wa.me/?text=${text}`;
  },

  reddit: (data: ShareData): string => {
    const url = encodeURIComponent(data.url);
    const title = encodeURIComponent(data.title);
    return `https://reddit.com/submit?url=${url}&title=${title}`;
  },

  email: (data: ShareData): string => {
    const subject = encodeURIComponent(data.title);
    const body = encodeURIComponent(
      `${data.description ? data.description + '\n\n' : ''}Read more: ${data.url}`
    );
    return `mailto:?subject=${subject}&body=${body}`;
  },

  telegram: (data: ShareData): string => {
    const text = encodeURIComponent(`${data.title}\n${data.url}`);
    return `https://t.me/share/url?url=${data.url}&text=${text}`;
  },
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        textArea.remove();
        return true;
      } catch (error) {
        console.error('Fallback: Oops, unable to copy', error);
        textArea.remove();
        return false;
      }
    }
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
};

/**
 * Use native Web Share API if available (mobile)
 */
export const canUseNativeShare = (): boolean => {
  return typeof navigator !== 'undefined' && 'share' in navigator;
};

export const nativeShare = async (data: ShareData): Promise<boolean> => {
  if (!canUseNativeShare()) {
    return false;
  }

  try {
    await navigator.share({
      title: data.title,
      text: data.description,
      url: data.url,
    });
    return true;
  } catch (error) {
    // User cancelled or share failed
    console.error('Native share failed:', error);
    return false;
  }
};

/**
 * Open share URL in a new window with optimal dimensions
 */
export const openShareWindow = (url: string, platform: string): void => {
  const width = 600;
  const height = 600;
  const left = window.screen.width / 2 - width / 2;
  const top = window.screen.height / 2 - height / 2;

  window.open(
    url,
    `share-${platform}`,
    `width=${width},height=${height},left=${left},top=${top},toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes`
  );
};
