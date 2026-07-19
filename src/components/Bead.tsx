type BeadProps = {
  colorClassName: string;
  index: number;
};

export function Bead({ colorClassName, index }: BeadProps) {
  return (
    <div
      aria-hidden="true"
      className={`absolute top-1/2 z-20 size-[clamp(1rem,3.2vw,2rem)] -translate-y-1/2 rounded-full border-[3px] border-ink ${colorClassName} shadow-[4px_4px_0_#171316] sm:border-4`}
      style={{
        left: `${7 + index * 3.6}%`,
      }}
    >
      <span className="absolute left-[18%] top-[18%] block size-[22%] rounded-full bg-white/70" />
    </div>
  );
}
