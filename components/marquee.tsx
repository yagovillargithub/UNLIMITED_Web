interface MarqueeProps {
  items: string[];
}

/** Infinite horizontal marquee — duplicates the track so the CSS keyframe
 *  loop reads as continuous. */
export function Marquee({ items }: MarqueeProps) {
  const renderTrack = (keyPrefix: string) =>
    items.map((item, i) => (
      <span key={`${keyPrefix}-${i}`}>
        {item}
        <span className="dot" aria-hidden="true" />
      </span>
    ));

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {renderTrack("a")}
        {renderTrack("b")}
      </div>
    </div>
  );
}
