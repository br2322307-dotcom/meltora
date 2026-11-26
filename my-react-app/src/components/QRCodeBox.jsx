import { useEffect, useState } from "react";
import QRCode from "qrcode";

export default function QRCodeBox({ value, title = "Product QR", size = 156 }) {
  const [dataUrl, setDataUrl] = useState("");

  useEffect(() => {
    let cancelled = false;
    if (!value) return;
    QRCode.toDataURL(value, {
      width: size * 2,
      margin: 2,
      color: {
        dark: "#2B0E04",
        light: "#FFFDF9",
      },
    })
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [value, size]);

  const handleCopy = () => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(value).catch(() => {});
    }
  };

  return (
    <div className="qr-code-box">
      {dataUrl ? (
        <img
          src={dataUrl}
          alt={title}
          width={size}
          height={size}
          className="qr-code-img"
        />
      ) : (
        <div className="qr-code-placeholder" style={{ width: size, height: size }}>
          Generating QR...
        </div>
      )}
      <div className="qr-code-actions">
        {dataUrl && (
          <a
            href={dataUrl}
            download={`${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-qr.png`}
            className="qr-mini-btn"
          >
            ⬇ Save QR
          </a>
        )}
        <button type="button" className="qr-mini-btn" onClick={handleCopy}>
          🔗 Copy Link
        </button>
      </div>
    </div>
  );
}
