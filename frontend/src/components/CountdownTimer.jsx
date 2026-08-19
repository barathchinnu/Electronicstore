import { useState, useEffect } from 'react';

export default function CountdownTimer({ targetHours = 8 }) {
  const [time, setTime] = useState(targetHours * 3600);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => (prev <= 0 ? targetHours * 3600 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetHours]);

  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {[hours, minutes, seconds].map((unit, i) => (
        <div key={i} className="flex items-center gap-1.5 sm:gap-2">
          <div className="bg-slate-900 text-white rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-2 min-w-[2.75rem] text-center border border-slate-800 shadow-sm">
            <span className="text-base sm:text-lg font-black font-display text-amber-400 tabular-nums leading-none block">
              {pad(unit)}
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">
              {['HRS', 'MIN', 'SEC'][i]}
            </span>
          </div>
          {i < 2 && <span className="text-slate-700 font-black text-sm sm:text-base">:</span>}
        </div>
      ))}
    </div>
  );
}

