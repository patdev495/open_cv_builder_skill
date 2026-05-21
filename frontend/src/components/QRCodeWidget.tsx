import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeWidgetProps {
  slug: string;
  size?: number;
}

export function QRCodeWidget({ slug, size = 70 }: QRCodeWidgetProps) {
  const [qrUrl, setQrUrl] = useState<string>('');

  useEffect(() => {
    if (typeof window === 'undefined' || !slug) return;
    const url = `${window.location.origin}/${slug}`;
    QRCode.toDataURL(url, {
      margin: 1,
      width: size,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
      .then(setQrUrl)
      .catch(err => console.error('Failed to generate QR code', err));
  }, [slug, size]);

  if (!qrUrl) return null;

  return (
    <div className="flex flex-col items-center gap-1 p-1.5 bg-white rounded-lg border border-slate-200 shadow-sm print:border-slate-300 print:shadow-none select-none">
      <img 
        src={qrUrl} 
        alt="Scan to view online portfolio" 
        style={{ width: `${size}px`, height: `${size}px` }} 
        className="object-contain"
      />
      <span className="text-[7px] font-extrabold text-slate-500 font-mono tracking-tight uppercase text-center print:text-black">
        Interactive CV
      </span>
    </div>
  );
}
