/**
 * تصویر تزئینی صفحه‌ی ورود
 */
function SloganIllustration({ className }: { className?: string }) {
  const p = 'hsl(var(--primary))';
  return (
    <svg className={className} fill="none" viewBox="0 0 520 400">
      <ellipse cx="260" cy="370" fill={p} opacity="0.08" rx="220" ry="18" />
      {/* پنجره‌ی داشبورد */}
      <rect fill="hsl(var(--card))" height="250" rx="18" stroke="hsl(var(--border))" width="380" x="70" y="70" />
      <rect fill={p} height="34" opacity="0.12" rx="18" width="380" x="70" y="70" />
      <circle cx="96" cy="87" fill="#ff5f57" r="6" />
      <circle cx="116" cy="87" fill="#febc2e" r="6" />
      <circle cx="136" cy="87" fill="#28c840" r="6" />
      {/* نوار کناری */}
      <rect fill={p} height="200" opacity="0.08" rx="10" width="70" x="86" y="112" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect fill={p} height="8" key={i} opacity={i === 1 ? 0.9 : 0.35} rx="4" width="46" x="98" y={128 + i * 26} />
      ))}
      {/* کارت‌های آمار */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect fill="hsl(var(--background-deep))" height="56" rx="10" width="84" x={170 + i * 92} y="114" />
          <rect fill={p} height="8" opacity="0.4" rx="4" width="40" x={182 + i * 92} y="128" />
          <rect fill={p} height="12" opacity="0.85" rx="4" width="56" x={182 + i * 92} y="146" />
        </g>
      ))}
      {/* نمودار */}
      <rect fill="hsl(var(--background-deep))" height="118" rx="10" width="268" x="170" y="182" />
      <path
        d="M184 276 C214 250 232 262 256 236 S300 214 324 234 S372 216 424 200"
        stroke={p}
        strokeLinecap="round"
        strokeWidth="4"
      >
        <animate attributeName="stroke-dasharray" dur="2.4s" from="0,400" to="400,0" />
      </path>
      <path d="M184 276 C214 250 232 262 256 236 S300 214 324 234 S372 216 424 200 V290 H184Z" fill={p} opacity="0.12" />
      {/* عناصر شناور */}
      <g>
        <rect fill={p} height="64" rx="14" width="64" x="410" y="36" />
        <path d="M428 70l10 10 20-22" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" />
        <animateTransform attributeName="transform" dur="5s" repeatCount="indefinite" type="translate" values="0 0;0 -10;0 0" />
      </g>
      <g>
        <circle cx="62" cy="290" fill="hsl(var(--success))" opacity="0.85" r="26" />
        <animateTransform attributeName="transform" dur="6s" repeatCount="indefinite" type="translate" values="0 0;0 12;0 0" />
      </g>
      <circle cx="40" cy="120" fill={p} opacity="0.2" r="14" />
    </svg>
  );
}

export { SloganIllustration };
