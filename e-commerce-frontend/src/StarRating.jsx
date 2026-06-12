/**
 * StarRating — renders up to 5 stars using SVG clip-path for
 * precise half-star fills. Consistent cross-platform (no ½ char).
 *
 * Props:
 *   stars  — number 0–5 (decimals OK)
 *   size   — px size of each star (default 14)
 *   showValue — whether to show the numeric value (default true)
 */
function StarRating({ stars, size = 14, showValue = true }) {
  if (stars == null) return null;
  const clamped = Math.max(0, Math.min(5, stars));

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.min(1, Math.max(0, clamped - i)); // 0, 0–1, or 1
        const id = `star-clip-${i}-${Math.round(clamped * 10)}`;
        return (
          <svg
            key={i}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            style={{ flexShrink: 0 }}
            aria-hidden="true"
          >
            <defs>
              <clipPath id={id}>
                <rect x="0" y="0" width={24 * fill} height="24" />
              </clipPath>
            </defs>
            {/* Empty star */}
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill="none"
              stroke="rgba(200,168,130,0.25)"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Filled portion */}
            {fill > 0 && (
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill="#f5a623"
                stroke="#f5a623"
                strokeWidth="1.5"
                strokeLinejoin="round"
                clipPath={`url(#${id})`}
              />
            )}
          </svg>
        );
      })}
      {showValue && (
        <span style={{ fontSize: size - 2, fontWeight: 600, color: "#f5a623", lineHeight: 1 }}>
          {clamped.toFixed(1)}
        </span>
      )}
    </span>
  );
}

export default StarRating;