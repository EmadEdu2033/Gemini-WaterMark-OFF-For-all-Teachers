const SEGMENT = 'Designed by Coach Emad with all ❤️ for all Teachers\u00a0\u00a0—\u00a0\u00a0لكل المعلمين ❤️ صمم بواسطة كوتش عماد بكل ❤️\u00a0\u00a0—\u00a0\u00a0';
const REPEATS = 10;

export function TickerBar() {
  const fullText = SEGMENT.repeat(REPEATS);

  return (
    <div className="ticker-wrap" role="marquee" aria-label="Credits">
      <div className="ticker-track">
        {fullText}
      </div>
    </div>
  );
}
