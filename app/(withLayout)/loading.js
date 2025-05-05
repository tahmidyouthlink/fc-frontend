export default function Loading() {
  const colors = ["#d4ffce", "#ffddc2", "#fffac9"];

  return (
    <div className="fixed inset-0 z-[100] flex h-dvh w-dvw items-center justify-center bg-neutral-500/50 backdrop-blur-md">
      <svg
        className="h-24 w-24"
        viewBox="0 0 64 64"
        role="img"
        aria-label="5-point star slowly rotating clockwise with animated encircling lines"
      >
        <g
          className="pl__star"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="28.63 162.25"
          strokeDashoffset="0"
          style={{
            animation: "spin 10s linear infinite",
            transformOrigin: "32px 32px",
          }}
        >
          {[0, 72, 144, 216, 288].map((rotate, i) => (
            <path
              key={"loading-spinner-" + rotate + colors[i % colors.length] + i}
              className="pl__worm"
              stroke={colors[i % colors.length]}
              d="M 31.94 3.191 L 40.388 20.309 L 59.279 23.054 L 45.61 36.379 L 48.836 55.193 L 31.94 46.31 L 15.044 55.193 L 18.27 36.379 L 4.601 23.054 L 23.492 20.309 Z"
              transform={`rotate(${rotate},32,32)`}
              style={{
                animation:
                  "worm-length 10s linear infinite, worm-move 5s linear infinite",
              }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
