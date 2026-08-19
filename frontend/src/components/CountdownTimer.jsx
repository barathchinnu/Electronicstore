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
    <div className="flex items-center gap-2">
      {[hours, minutes, seconds].map((unit, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="glass rounded-xl px-3 py-2 min-w-[3rem] text-center">
            <span className="text-xl font-bold font-display text-white tabular-nums">{pad(unit)}</span>
            <p className="text-xs text-slate-500 mt-0.5">{['HRS', 'MIN', 'SEC'][i]}</p>
          </div>
          {i < 2 && <span className="text-slate-400 font-bold text-lg">:</span>}
        </div>
      ))}
    </div>
  );
}
