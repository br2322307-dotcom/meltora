export function ProductArtwork({ id }) {
  switch (id) {
    case "cadbury":
      return (
        <svg viewBox="0 0 96 56">
          <rect x="4" y="10" width="88" height="36" rx="3" fill="#461887" />
          <rect x="2" y="10" width="4" height="36" fill="#320E66" />
          <rect x="90" y="10" width="4" height="36" fill="#320E66" />
          <text x="36" y="24" fill="#F8CA49" fontFamily="Playfair Display, serif" fontStyle="italic" fontWeight="700" fontSize="10.5" textAnchor="middle">Cadbury</text>
          <text x="36" y="37" fill="#FFFFFF" fontFamily="Poppins, sans-serif" fontWeight="700" fontSize="9.5" textAnchor="middle">Dairy Milk</text>
          <path d="M66 28 Q72 16 78 28 T88 26" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="68" y="29" width="16" height="11" rx="1.5" fill="#59230C" stroke="#8C421E" strokeWidth="0.8" />
        </svg>
      );
    case "amul-choco":
      return (
        <svg viewBox="0 0 96 56">
          <rect x="4" y="10" width="88" height="36" rx="3" fill="#4E210D" />
          <rect x="2" y="10" width="4" height="36" fill="#331306" />
          <rect x="90" y="10" width="4" height="36" fill="#331306" />
          <rect x="11" y="14" width="22" height="10" rx="2" fill="#F9C933" />
          <text x="22" y="21.5" fill="#D91E26" fontFamily="Poppins, sans-serif" fontWeight="700" fontSize="7" textAnchor="middle">Amul</text>
          <text x="11" y="32" fill="#F8CA49" fontFamily="Poppins, sans-serif" fontWeight="700" fontSize="7.5">DARK</text>
          <text x="11" y="40" fill="#FFFFFF" fontFamily="Poppins, sans-serif" fontWeight="600" fontSize="6.3">CHOCOLATE</text>
          <polygon points="58,15 86,12 88,42 60,44" fill="#6E3015" stroke="#9B4C27" strokeWidth="0.8" />
          <line x1="72" y1="13" x2="74" y2="43" stroke="#361405" strokeWidth="1.3" />
          <line x1="59" y1="28" x2="87" y2="27" stroke="#361405" strokeWidth="1.3" />
        </svg>
      );
    case "nestle":
      return (
        <svg viewBox="0 0 96 56">
          <rect x="4" y="10" width="88" height="36" rx="3" fill="#E11B22" />
          <rect x="2" y="10" width="4" height="36" fill="#A80E14" />
          <rect x="90" y="10" width="4" height="36" fill="#A80E14" />
          <rect x="14" y="15" width="48" height="16" rx="8" fill="#FFFFFF" stroke="#B51218" strokeWidth="1" />
          <text x="38" y="26.5" fill="#D91B22" fontFamily="Poppins, sans-serif" fontWeight="700" fontSize="10.5" textAnchor="middle">Nestlé</text>
          <text x="38" y="40" fill="#FFE169" fontFamily="Poppins, sans-serif" fontWeight="700" fontSize="7.5" textAnchor="middle">CLASSIC</text>
          <rect x="68" y="16" width="16" height="24" rx="2" fill="#59220B" stroke="#F8CA49" strokeWidth="0.8" />
        </svg>
      );
    case "hersheys":
      return (
        <svg viewBox="0 0 96 56">
          <rect x="4" y="10" width="88" height="36" rx="3" fill="#461E14" />
          <rect x="2" y="10" width="4" height="36" fill="#2D110A" />
          <rect x="90" y="10" width="4" height="36" fill="#2D110A" />
          <text x="48" y="28" fill="#F2ECE9" fontFamily="Poppins, sans-serif" fontWeight="700" fontSize="11.5" letterSpacing="0.4" textAnchor="middle">HERSHEY&apos;S</text>
          <text x="48" y="38.5" fill="#E3C9BC" fontFamily="Poppins, sans-serif" fontWeight="500" fontSize="6.8" textAnchor="middle">Milk Chocolate</text>
        </svg>
      );
    case "meltora-ghee":
      return (
        <svg viewBox="0 0 64 60">
          <rect x="17" y="4" width="30" height="8" rx="2.5" fill="#FFE11B" stroke="#E0B800" strokeWidth="0.8" />
          <rect x="14" y="12" width="36" height="43" rx="7" fill="#FFD319" stroke="#E6AE00" strokeWidth="0.9" />
          <rect x="16" y="21" width="32" height="24" rx="4" fill="#FFF7D6" stroke="#D99B16" strokeWidth="0.8" />
          <text x="32" y="31" fill="#5E260E" fontFamily="Playfair Display, serif" fontStyle="italic" fontWeight="700" fontSize="8.2" textAnchor="middle">Meltora</text>
          <text x="32" y="39" fill="#B56510" fontFamily="Poppins, sans-serif" fontWeight="700" fontSize="5.6" textAnchor="middle">Desi Ghee</text>
        </svg>
      );
    case "patanjali-ghee":
      return (
        <svg viewBox="0 0 64 60">
          <rect x="17" y="4" width="30" height="8" rx="2.5" fill="#FFE11B" stroke="#E0B800" strokeWidth="0.8" />
          <rect x="14" y="12" width="36" height="43" rx="7" fill="#FFD319" stroke="#E6AE00" strokeWidth="0.9" />
          <rect x="16" y="20" width="32" height="26" rx="3" fill="#FFFDF5" stroke="#2D8A3E" strokeWidth="0.8" />
          <text x="32" y="29" fill="#D9251D" fontFamily="Poppins, sans-serif" fontWeight="700" fontSize="6.2" textAnchor="middle">Patanjali</text>
          <text x="32" y="37" fill="#287D36" fontFamily="Poppins, sans-serif" fontWeight="700" fontSize="5.6" textAnchor="middle">Desi Ghee</text>
          <circle cx="32" cy="42" r="2.2" fill="#F5A623" />
        </svg>
      );
    case "amul-ghee":
      return (
        <svg viewBox="0 0 64 60">
          <rect x="14" y="5" width="36" height="3.5" rx="1.5" fill="#D6D6D6" />
          <rect x="15" y="8.5" width="34" height="17" fill="#E32227" />
          <text x="32" y="17" fill="#FFFFFF" fontFamily="Poppins, sans-serif" fontWeight="700" fontSize="8.2" textAnchor="middle">Amul</text>
          <text x="32" y="23.5" fill="#FFF275" fontFamily="Poppins, sans-serif" fontWeight="600" fontSize="5.6" textAnchor="middle">Pure Ghee</text>
          <rect x="15" y="25.5" width="34" height="27.5" fill="#FFE01B" />
          <path d="M18 45 Q26 36 34 45 T46 43" fill="none" stroke="#2E8B3C" strokeWidth="2.5" />
          <circle cx="26" cy="36" r="3" fill="#E32227" />
          <circle cx="38" cy="35" r="2.8" fill="#1D70B8" />
          <rect x="14" y="53" width="36" height="3" rx="1.5" fill="#C7C7C7" />
        </svg>
      );
    case "gowardhan-ghee":
      return (
        <svg viewBox="0 0 64 60">
          <rect x="17" y="4" width="30" height="8" rx="2.5" fill="#FFE11B" stroke="#E0B800" strokeWidth="0.8" />
          <rect x="14" y="12" width="36" height="43" rx="7" fill="#FFD319" stroke="#E6AE00" strokeWidth="0.9" />
          <rect x="16" y="20" width="32" height="25" rx="3" fill="#FFF8D6" stroke="#D9251D" strokeWidth="0.8" />
          <rect x="18" y="22" width="28" height="9" rx="2" fill="#D9251D" />
          <text x="32" y="28.5" fill="#FFFFFF" fontFamily="Poppins, sans-serif" fontWeight="700" fontSize="5.2" textAnchor="middle">Gowardhan</text>
          <text x="32" y="39" fill="#5E260E" fontFamily="Poppins, sans-serif" fontWeight="700" fontSize="5.6" textAnchor="middle">Desi Ghee</text>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 64 60">
          <rect x="8" y="8" width="48" height="44" rx="6" fill="#FBF0DB" stroke="#D99B16" strokeWidth="1.2" />
          <circle cx="32" cy="28" r="14" fill="#EAB543" />
          <text x="32" y="32" fill="#2B0E04" fontFamily="Playfair Display, serif" fontStyle="italic" fontWeight="700" fontSize="12" textAnchor="middle">M</text>
          <text x="32" y="46" fill="#8C3911" fontFamily="Poppins, sans-serif" fontWeight="700" fontSize="5.5" textAnchor="middle">MELTORA</text>
        </svg>
      );
  }
}

export function ProductVisual({ item, className = "item-custom-img" }) {
  const imgUrl = item?.imageUrl || item?.image_url;
  if (imgUrl) {
    return (
      <img
        src={imgUrl}
        alt={item.fullName || item.full_name}
        className={className}
        onError={(e) => {
          e.target.style.display = "none";
        }}
      />
    );
  }
  return <ProductArtwork id={item?.id} />;
}

export function HeroSlideArtwork({ slide }) {
  if (slide.customImageUrl) {
    return (
      <div className="hero-custom-img-wrap">
        <img src={slide.customImageUrl} alt={slide.brand} className="hero-custom-img" />
        <div className="hero-custom-overlay" />
      </div>
    );
  }

  if (slide.theme === "ghee") {
    return (
      <svg className="hero-bg-art ghee-art" viewBox="0 0 410 180" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="gheePotGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#D97706" />
            <stop offset="50%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>
          <linearGradient id="gheeLiquidGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="35%" stopColor="#FDE047" />
            <stop offset="70%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <radialGradient id="gheeGlow" cx="65%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FDE047" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#78350F" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="410" height="180" fill="url(#gheeGlow)" />
        <path d="M220,150 Q260,110 280,140 T340,115 T410,135 L410,180 L220,180 Z" fill="#92400E" opacity="0.5" />
        <path d="M250,160 Q280,130 310,150 T380,130 T430,150 L430,180 L250,180 Z" fill="#D97706" opacity="0.35" />
        <g transform="translate(245, 22)">
          <ellipse cx="65" cy="18" rx="36" ry="9" fill="#92400E" stroke="#B45309" strokeWidth="2" />
          <ellipse cx="65" cy="18" rx="30" ry="7" fill="url(#gheeLiquidGrad)" />
          <path d="M32,22 C20,50 15,85 30,112 C44,136 86,136 100,112 C115,85 110,50 98,22 Z" fill="url(#gheePotGrad)" stroke="#B45309" strokeWidth="1.8" />
          <path d="M42,22 C34,48 30,78 44,102 C54,120 76,120 86,102 C100,78 96,48 88,22 Z" fill="none" stroke="#FBBF24" strokeWidth="1.2" opacity="0.4" />
          <ellipse cx="65" cy="22" rx="26" ry="6" fill="#FDE047" opacity="0.9" />
          <ellipse cx="60" cy="21" rx="14" ry="3" fill="#FFFBEB" />
          <path d="M65,30 C63,40 54,48 54,58 C54,64 59,69 65,69 C71,69 76,64 76,58 C76,48 67,40 65,30 Z" fill="url(#gheeLiquidGrad)" stroke="#B45309" strokeWidth="0.8" />
          <circle cx="62" cy="55" r="2.5" fill="#FFFBEB" opacity="0.85" />
          <circle cx="65" cy="94" r="14" fill="#78350F" stroke="#F59E0B" strokeWidth="1.5" />
          <text x="65" y="97.5" fill="#FDE047" fontFamily="Noto Serif Bengali, serif" fontSize="9.5" fontWeight="700" textAnchor="middle">ঘি</text>
        </g>
        <circle cx="230" cy="55" r="4" fill="#FDE047" opacity="0.8" />
        <circle cx="370" cy="40" r="3" fill="#FBBF24" opacity="0.75" />
        <circle cx="395" cy="85" r="4.5" fill="#F59E0B" opacity="0.7" />
        <circle cx="215" cy="110" r="3" fill="#FDE047" opacity="0.6" />
      </svg>
    );
  }

  if (slide.theme === "combo") {
    return (
      <svg className="hero-bg-art combo-art" viewBox="0 0 410 180" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="comboBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#451A03" />
            <stop offset="60%" stopColor="#2E1005" />
            <stop offset="100%" stopColor="#14532D" />
          </linearGradient>
          <linearGradient id="comboChoco" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#78350F" />
            <stop offset="100%" stopColor="#3B1706" />
          </linearGradient>
          <linearGradient id="comboGold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="100%" stopColor="#EAB308" />
          </linearGradient>
        </defs>
        <rect width="410" height="180" fill="url(#comboBg)" />
        <g transform="translate(195, 32)">
          <rect x="0" y="20" width="68" height="84" rx="6" fill="url(#comboChoco)" stroke="#92400E" strokeWidth="1.5" />
          <rect x="6" y="26" width="25" height="34" rx="3" fill="#451A03" stroke="#B45309" strokeWidth="0.8" />
          <rect x="37" y="26" width="25" height="34" rx="3" fill="#451A03" stroke="#B45309" strokeWidth="0.8" />
          <rect x="6" y="65" width="25" height="34" rx="3" fill="#451A03" stroke="#B45309" strokeWidth="0.8" />
          <rect x="37" y="65" width="25" height="34" rx="3" fill="#451A03" stroke="#B45309" strokeWidth="0.8" />
        </g>
        <g transform="translate(280, 36)">
          <rect x="10" y="4" width="46" height="10" rx="3" fill="#FDE047" stroke="#CA8A04" strokeWidth="1" />
          <rect x="6" y="16" width="54" height="74" rx="8" fill="url(#comboGold)" stroke="#CA8A04" strokeWidth="1.5" />
          <rect x="12" y="32" width="42" height="36" rx="4" fill="#FFFDF5" stroke="#B45309" strokeWidth="1" />
          <text x="33" y="48" fill="#78350F" fontFamily="Playfair Display, serif" fontStyle="italic" fontWeight="700" fontSize="9.5" textAnchor="middle">Meltora</text>
          <text x="33" y="59" fill="#B45309" fontFamily="Poppins, sans-serif" fontWeight="700" fontSize="6.5" textAnchor="middle">PURE GHEE</text>
        </g>
        <g transform="translate(350, 110)">
          <circle cx="16" cy="16" r="16" fill="#22C55E" />
          <path d="M12 9 C8.7 9 6 11.7 6 15 c0 1.2 .4 2.3 1 3.2 L6 22 l3.9-1 c.9 .5 1.9 .8 3.1 .8 3.3 0 6-2.7 6-6 s-2.7-6-6-6 z" fill="#FFF" />
        </g>
      </svg>
    );
  }

  return (
    <svg className="hero-bg-art choco-art" viewBox="0 0 410 180" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="meltoraChocoFlow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8B401B" />
          <stop offset="45%" stopColor="#58230B" />
          <stop offset="100%" stopColor="#2E1004" />
        </linearGradient>
        <linearGradient id="meltoraChocoBlock" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6B2E12" />
          <stop offset="100%" stopColor="#361405" />
        </linearGradient>
        <linearGradient id="meltoraGloss" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#C97A4A" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#5C250C" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g opacity="0.14" fill="#A65A2E">
        <ellipse cx="22" cy="35" rx="18" ry="8" transform="rotate(-30 22 35)" />
        <ellipse cx="45" cy="70" rx="20" ry="9" transform="rotate(20 45 70)" />
        <ellipse cx="18" cy="125" rx="22" ry="9" transform="rotate(-25 18 125)" />
      </g>
      <g transform="translate(215, 38)">
        <polygon points="35,20 115,5 135,45 55,62" fill="url(#meltoraChocoBlock)" stroke="#8B4520" strokeWidth="1" />
        <line x1="62" y1="15" x2="82" y2="56" stroke="#2B0E03" strokeWidth="2" />
        <line x1="88" y1="10" x2="108" y2="51" stroke="#2B0E03" strokeWidth="2" />
        <line x1="45" y1="40" x2="125" y2="24" stroke="#2B0E03" strokeWidth="2" />
        <polygon points="10,65 95,48 115,92 28,110" fill="url(#meltoraChocoBlock)" stroke="#9C4E24" strokeWidth="1" />
        <line x1="38" y1="59" x2="58" y2="103" stroke="#260C02" strokeWidth="2.2" />
        <line x1="66" y1="54" x2="86" y2="98" stroke="#260C02" strokeWidth="2.2" />
        <line x1="19" y1="87" x2="104" y2="70" stroke="#260C02" strokeWidth="2.2" />
        <polygon points="-25,102 32,88 46,120 -12,134" fill="#4A1D09" stroke="#853E1B" strokeWidth="1" />
      </g>
      <path d="M322,0 C320,38 326,75 330,108 C333,125 352,132 372,126 C392,120 405,134 396,152 C384,174 315,180 282,165 C255,152 268,128 296,124 C312,122 315,105 314,72 C313,38 310,15 308,0 Z" fill="url(#meltoraChocoFlow)" />
      <path d="M318,4 C317,45 321,85 324,112" stroke="url(#meltoraGloss)" strokeWidth="3" fill="none" />
      <ellipse cx="332" cy="146" rx="46" ry="16" fill="none" stroke="#B86B3D" strokeWidth="2" opacity="0.65" />
      <ellipse cx="334" cy="148" rx="28" ry="9" fill="none" stroke="#D98A59" strokeWidth="1.5" opacity="0.7" />
    </svg>
  );
}
