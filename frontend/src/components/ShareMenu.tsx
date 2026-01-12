import React from 'react';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@nextui-org/react';
import {
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  MessageCircle,
  Mail,
  Link,
  QrCode,
  Share,
} from 'lucide-react';
import { shareUrls, copyToClipboard, openShareWindow, canUseNativeShare, nativeShare, ShareData } from '../utils/shareUtils';
import { toast } from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';

interface ShareMenuProps {
  url: string;
  title: string;
  description?: string;
}

const ShareMenu: React.FC<ShareMenuProps> = ({ url, title, description }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const showNativeShare = canUseNativeShare();

  const shareData: ShareData = {
    url,
    title,
    description,
  };

  const handleCopyLink = async () => {
    const success = await copyToClipboard(url);
    if (success) {
      toast.success('Link copied to clipboard!');
    } else {
      toast.error('Failed to copy link');
    }
  };

  const handleShare = (platform: string) => {
    let shareUrl: string;

    switch (platform) {
      case 'twitter':
        shareUrl = shareUrls.twitter(shareData);
        break;
      case 'facebook':
        shareUrl = shareUrls.facebook(shareData);
        break;
      case 'linkedin':
        shareUrl = shareUrls.linkedin(shareData);
        break;
      case 'whatsapp':
        shareUrl = shareUrls.whatsapp(shareData);
        break;
      case 'reddit':
        shareUrl = shareUrls.reddit(shareData);
        break;
      case 'telegram':
        shareUrl = shareUrls.telegram(shareData);
        break;
      case 'email':
        shareUrl = shareUrls.email(shareData);
        window.location.href = shareUrl;
        return;
      default:
        return;
    }

    openShareWindow(shareUrl, platform);
  };

  const handleNativeShare = async () => {
    const success = await nativeShare(shareData);
    if (!success) {
      toast.error('Share cancelled or failed');
    }
  };

  const downloadQRCode = () => {
    const svg = document.getElementById('qr-code-svg') as unknown as SVGSVGElement;
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      const link = document.createElement('a');
      link.download = `qr-code-${title.replace(/\s+/g, '-').toLowerCase()}.svg`;
      link.href = svgUrl;
      link.click();
      URL.revokeObjectURL(svgUrl);
    }
  };

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button
            variant="flat"
            startContent={<Share2 size={16} />}
            size="sm"
          >
            Share
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Share options">
          {showNativeShare ? (
            <DropdownItem
              key="native"
              startContent={<Share size={18} />}
              onClick={handleNativeShare}
            >
              Share...
            </DropdownItem>
          ) : null}

          <DropdownItem
            key="copy"
            startContent={<Link size={18} />}
            onClick={handleCopyLink}
          >
            Copy Link
          </DropdownItem>

          <DropdownItem
            key="qr"
            startContent={<QrCode size={18} />}
            onClick={onOpen}
          >
            QR Code
          </DropdownItem>

          <DropdownItem
            key="twitter"
            startContent={<Twitter size={18} />}
            onClick={() => handleShare('twitter')}
          >
            Twitter/X
          </DropdownItem>

          <DropdownItem
            key="facebook"
            startContent={<Facebook size={18} />}
            onClick={() => handleShare('facebook')}
          >
            Facebook
          </DropdownItem>

          <DropdownItem
            key="linkedin"
            startContent={<Linkedin size={18} />}
            onClick={() => handleShare('linkedin')}
          >
            LinkedIn
          </DropdownItem>

          <DropdownItem
            key="whatsapp"
            startContent={<MessageCircle size={18} />}
            onClick={() => handleShare('whatsapp')}
          >
            WhatsApp
          </DropdownItem>

          <DropdownItem
            key="reddit"
            startContent={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
              </svg>
            }
            onClick={() => handleShare('reddit')}
          >
            Reddit
          </DropdownItem>

          <DropdownItem
            key="telegram"
            startContent={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.781-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.14.12.098.153.23.169.324.016.094.036.306.02.472z"/>
              </svg>
            }
            onClick={() => handleShare('telegram')}
          >
            Telegram
          </DropdownItem>

          <DropdownItem
            key="email"
            startContent={<Mail size={18} />}
            onClick={() => handleShare('email')}
          >
            Email
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      {/* QR Code Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="sm">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Share QR Code
          </ModalHeader>
          <ModalBody className="flex items-center justify-center py-6">
            <div className="bg-white p-4 rounded-lg">
              <QRCodeSVG
                id="qr-code-svg"
                value={url}
                size={256}
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="text-sm text-center text-default-500 mt-4">
              Scan this QR code to open the post
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>
              Close
            </Button>
            <Button color="primary" onPress={downloadQRCode}>
              Download QR Code
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ShareMenu;
