// Very faint, slow-moving soft blobs — adds the slightest sense of life to the hero
// without breaking the minimal aesthetic. Respects prefers-reduced-motion.
export default function SubtleBackground() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none motion-reduce:opacity-0">
      <div className="absolute -top-1/4 -left-1/4 w-[60vw] h-[60vw] rounded-full bg-[#F26522]/[0.04] blur-3xl animate-[drift1_28s_ease-in-out_infinite]" />
      <div className="absolute -bottom-1/4 -right-1/4 w-[55vw] h-[55vw] rounded-full bg-[#111111]/[0.03] blur-3xl animate-[drift2_36s_ease-in-out_infinite]" />
      <style>{`
        @keyframes drift1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(4%, 6%) scale(1.08); }
        }
        @keyframes drift2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-5%, -4%) scale(1.06); }
        }
      `}</style>
    </div>
  );
}