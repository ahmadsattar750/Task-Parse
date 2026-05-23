// Custom Task Parse logo
// A small SVG icon (rounded square with a checklist + slash mark)
// next to the brand name. Pure SVG so it stays crisp at any size.

export default function Logo({ size = 36, withText = true }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="relative inline-flex items-center justify-center rounded-xl shadow-sm"
        style={{ width: size, height: size }}
      >
        {/* Gradient background */}
        <svg
          viewBox="0 0 40 40"
          width={size}
          height={size}
          className="absolute inset-0"
        >
          <defs>
            <linearGradient id="tp-logo-bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1e40af" />
            </linearGradient>
          </defs>
          <rect
            x="0"
            y="0"
            width="40"
            height="40"
            rx="10"
            fill="url(#tp-logo-bg)"
          />
          {/* Subtle inner highlight */}
          <rect
            x="0.5"
            y="0.5"
            width="39"
            height="39"
            rx="9.5"
            fill="none"
            stroke="rgba(255,255,255,0.18)"
          />

          {/* Stylized checklist + parse "/" mark */}
          {/* Three short list lines */}
          <rect x="10" y="11" width="14" height="2.2" rx="1.1" fill="#ffffff" opacity="0.95" />
          <rect x="10" y="18.9" width="11" height="2.2" rx="1.1" fill="#ffffff" opacity="0.7" />
          <rect x="10" y="26.8" width="8" height="2.2" rx="1.1" fill="#ffffff" opacity="0.5" />

          {/* Forward slash representing the "parse" action */}
          <path
            d="M30 8 L24 32"
            stroke="#bae6fd"
            strokeWidth="2.6"
            strokeLinecap="round"
          />

          {/* Tiny check tick on top line */}
          <path
            d="M27 11.6 L28.2 12.8 L30.4 10.4"
            stroke="#ffffff"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </span>

      {withText && (
        <span className="font-semibold tracking-tight text-slate-800 text-[17px]">
          Task<span className="text-blue-600">Parse</span>
        </span>
      )}
    </div>
  );
}
