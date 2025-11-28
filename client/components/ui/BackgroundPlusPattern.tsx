export function BackgroundPlusPattern() {
  // Premium SVG pattern with subtle base opacity
  const svgPattern = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'><text x='20' y='20' text-anchor='middle' dominant-baseline='central' fill='rgba(255,255,255,0.035)' font-size='14' font-weight='600'>+</text></svg>`;

  return (
    <div
      className="fixed inset-0 -z-20 pointer-events-none overflow-hidden"
      style={{
        backgroundColor: '#090909',
        backgroundImage: `url("${svgPattern}")`,
        backgroundSize: '40px 40px',
        backgroundPosition: '0 0',
        backgroundRepeat: 'repeat',
        backgroundAttachment: 'fixed',
      }}
    >

      {/* Ultra-subtle noise/grain texture layer */}
      <div
        className="absolute inset-0 opacity-[0.01]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' seed='2' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
