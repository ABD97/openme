import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, PartyPopper, Music, Pause, Sparkles, Heart } from "lucide-react";

// 🎉 Single-file, production-ready birthday page
// - Tailwind CSS for styling (auto-available in this environment)
// - Framer Motion animations
// - Interactive confetti + floating balloons + glowing candles
// - Easy customization at the CONFIG section below
//
// ✅ How to customize:
// 1) Change values in CONFIG (name, message, colors, photo).
// 2) Export and host as a single page (Vercel, Netlify, GitHub Pages, etc.).
// 3) Optional: add your own music file URL.

const CONFIG = {
  recipientName: "Shreya",
  senderName: "From Adarsh",
  mainMessage:
    "May your day be filled with laughter, love, and the kind of joy that lingers long after the candles go out.",
  highlightMessage:
    `🎂 Let dreams come true, both old and new,
    And may joy arrive in skies of blue,
    Let love stay near through all your days,
    And light your path in gentle ways,
    Let every breeze sing and trees gently sway,
    Because you are the gift the world gets today,
    ✨ Wishing you a very warm Happy Birthday🥳`,
  // Optional photo (square works best). Leave empty for none.
  photoUrl:
    "/img.jpg",
  // Optional: add a short MP3 URL you have rights to.
  musicUrl: "https://www.youtube.com/watch?v=Bh_QhurLUwU",
  theme: {
    from: "#7c3aed", // violet-600
    via: "#ec4899", // pink-500
    to: "#f59e0b", // amber-500
  },
};

// Utility: random float
const rf = (min: number, max: number) => Math.random() * (max - min) + min;

// Confetti piece component
const ConfettiField: React.FC<{ running: boolean }> = ({ running }) => {
  const PIECES = 140;
  const confetti = useMemo(
    () =>
      Array.from({ length: PIECES }).map((_, i) => ({
        id: i,
        left: rf(0, 100), // vw
        size: rf(6, 14),
        delay: rf(0, 2),
        duration: rf(3.5, 7),
        rotate: rf(-180, 180),
        hue: Math.floor(rf(0, 360)),
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <AnimatePresence>
        {running && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            {confetti.map((c) => (
              <span
                key={c.id}
                style={{
                  left: `${c.left}vw`,
                  width: c.size,
                  height: c.size * 0.38,
                  background: `hsl(${c.hue} 90% 55%)`,
                  animationDelay: `${c.delay}s`,
                  animationDuration: `${c.duration}s`,
                  transform: `rotate(${c.rotate}deg)`,
                }}
                className="absolute -top-10 rounded-sm opacity-90 confetti-piece"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Floating balloons background
const Balloons: React.FC = () => {
  const BALLOONS = 10;
  const balloons = useMemo(
    () =>
      Array.from({ length: BALLOONS }).map((_, i) => ({
        id: i,
        left: rf(0, 100),
        size: rf(60, 110),
        delay: rf(0, 4),
        duration: rf(8, 16),
        hue: Math.floor(rf(0, 360)),
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {balloons.map((b) => (
        <div
          key={b.id}
          style={{
            left: `${b.left}vw`,
            width: b.size,
            height: b.size * 1.2,
            background: `radial-gradient(circle at 35% 30%, hsl(${b.hue} 90% 80%), hsl(${b.hue} 90% 55%))`,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
          }}
          className="absolute bottom-[-20%] rounded-full shadow-xl balloon"
        >
          <div className="absolute left-1/2 top-[95%] h-8 w-0.5 -translate-x-1/2 bg-white/60" />
        </div>
      ))}
    </div>
  );
};

// Candle component for cake
const Candle: React.FC<{ lit: boolean }> = ({ lit }) => (
  <div className="relative mx-1 flex h-10 w-2 flex-col items-center">
    <div className="h-7 w-full rounded bg-white/90" />
    <div className="h-3 w-[1px] bg-white/70" />
    <div className={`flame ${lit ? "opacity-100" : "opacity-0"}`} />
  </div>
);

const Cake: React.FC<{ lit: boolean }> = ({ lit }) => (
  <div className="relative mx-auto mt-6 w-full max-w-sm">
    <div className="rounded-2xl bg-white/80 p-4 shadow-xl backdrop-blur">
      <div className="mx-auto h-28 w-full rounded-xl bg-[conic-gradient(at_60%_40%,#fde68a_0_25%,#fca5a5_25%_50%,#93c5fd_50%_75%,#a7f3d0_75%_100%)]" />
      <div className="-mt-2 flex justify-center">
        {[...Array(6)].map((_, i) => (
          <Candle key={i} lit={lit} />
        ))}
      </div>
    </div>
  </div>
);

const GradientBackdrop: React.FC = () => (
  <div
    className="fixed inset-0 -z-10"
    style={{
      background:
        `radial-gradient(60% 70% at 70% 20%, ${CONFIG.theme.via}33 0%, transparent 60%),` +
        `radial-gradient(60% 70% at 20% 80%, ${CONFIG.theme.from}33 0%, transparent 60%),` +
        `linear-gradient(135deg, ${CONFIG.theme.from}, ${CONFIG.theme.via}, ${CONFIG.theme.to})`,
    }}
  />
);

const GlassCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl ${className}`}>
    {children}
  </div>
);

export default function BirthdayPage() {
  const [confetti, setConfetti] = useState(true);
  const [confettiKey, setConfettiKey] = useState(0);
  const [candlesLit, setCandlesLit] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current || !CONFIG.musicUrl) return;
    if (playing) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [playing]);

  // Auto confetti burst on load for 4s
  useEffect(() => {
    const t = setTimeout(() => setConfetti(false), 4500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen text-white">
      <GradientBackdrop />
      <Balloons />
{/*       <ConfettiField running={confetti} /> */}
<ConfettiField key={confettiKey} running={true} />

      {!!CONFIG.musicUrl && (
        <audio ref={audioRef} src={CONFIG.musicUrl} preload="auto" loop />
      )}

      <main className="mx-auto flex max-w-5xl flex-col items-center px-4 py-10 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur"
        >
          <Sparkles className="h-4 w-4" />
          A special day for {CONFIG.recipientName}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9 }}
          className="text-center text-5xl font-extrabold leading-tight drop-shadow md:text-6xl"
          style={{ textShadow: "0 8px 30px rgba(0,0,0,.35)" }}
        >
          Happy Birthday,
          <span className="ml-3 bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
            {CONFIG.recipientName}!
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mt-4 max-w-2xl text-center text-base md:text-lg text-white/90"
        >
          {CONFIG.mainMessage}
        </motion.p>

        <div className="mt-8 grid w-full grid-cols-1 items-stretch gap-6 md:grid-cols-2">
          <GlassCard>
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl ring-2 ring-white/30">
                {CONFIG.photoUrl ? (
                  <img
                    src={CONFIG.photoUrl}
                    alt="birthday"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-white/20">
                    <Gift className="h-8 w-8" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold">A note for you</h3>
                <p className="mt-1 text-white/90">
  {CONFIG.highlightMessage.split("\n").map((line, idx) => (
    <React.Fragment key={idx}>
      {line}
      <br />
    </React.Fragment>
  ))}
</p>

                <p className="mt-3 text-sm text-white/70">— {CONFIG.senderName}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="mb-3 text-xl font-semibold">Make it magical</h3>
            <div className="flex flex-wrap gap-3">

              <button
  onClick={() => setConfettiKey((k) => k + 1)}
  className="rounded-2xl px-4 py-2 ring-1 ring-white/25 backdrop-blur transition hover:scale-105 hover:bg-white/15 active:scale-95"
>
  <span className="inline-flex items-center gap-2">
    <PartyPopper className="h-4 w-4" />
    Pop Confetti
  </span>
</button>
              <button
                onClick={() => setCandlesLit((v) => !v)}
                className="rounded-2xl px-4 py-2 ring-1 ring-white/25 backdrop-blur transition hover:scale-105 hover:bg-white/15 active:scale-95"
              >
                <span className="inline-flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  {candlesLit ? "Blow Out Candles" : "Light Candles"}
                </span>
              </button>
              <button
                onClick={() => setPlaying((p) => !p)}
                disabled={!CONFIG.musicUrl}
                className={`rounded-2xl px-4 py-2 ring-1 ring-white/25 backdrop-blur transition hover:scale-105 hover:bg-white/15 active:scale-95 ${
                  CONFIG.musicUrl ? "opacity-100" : "opacity-50 cursor-not-allowed"
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  {playing ? <Pause className="h-4 w-4" /> : <Music className="h-4 w-4" />}
                  {playing ? "Pause Music" : "Play Music"}
                </span>
              </button>
            </div>
            <Cake lit={candlesLit} />
          </GlassCard>
        </div>

        
      </main>

      {/* Styles for animations */}
      <style>{`
        .confetti-piece {
          animation-name: confettiFall;
          animation-timing-function: cubic-bezier(.2,.7,.2,1);
          animation-iteration-count: 1;
        }
        @keyframes confettiFall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: .9; }
        }
        .balloon { animation: floatUp linear infinite; }
        @keyframes floatUp {
          0% { transform: translateY(0) translateX(0); opacity: .0; }
          10% { opacity: .9; }
          50% { transform: translateY(-60vh) translateX(3vw); }
          100% { transform: translateY(-120vh) translateX(-2vw); opacity: .0; }
        }
        .flame {
          width: 12px;
          height: 18px;
          background: radial-gradient(closest-side, #fde68a, #f59e0b 60%, transparent 70%);
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
          margin-top: -24px;
          filter: drop-shadow(0 0 8px rgba(245, 158, 11, .9));
          transition: opacity .3s ease;
          animation: flicker .15s infinite alternate;
        }
        @keyframes flicker {
          from { transform: translateY(-1px) scale(0.98); filter: drop-shadow(0 0 6px rgba(245,158,11,.9)); }
          to { transform: translateY(1px) scale(1.02); filter: drop-shadow(0 0 10px rgba(245,158,11,1)); }
        }
      `}</style>
    </div>
  );
}



