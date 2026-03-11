"use client";

export function AudioVisualizer() {
  return (
    <>
      <style>{`
        @keyframes audio-bar {
          0% { height: 4px; }
          100% { height: 20px; }
        }
        .audio-bar {
          animation: audio-bar 0.8s ease-in-out infinite alternate;
        }
      `}</style>
      <div className="flex items-center gap-[3px] h-6" aria-label="Listening...">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="audio-bar w-1 rounded-full bg-primary"
            style={{
              animationDelay: `${i * 0.1}s`,
              height: "4px",
            }}
          />
        ))}
      </div>
    </>
  );
}
