import { useEffect, useRef, useState } from 'react';
import { formatCurrency } from '../utils/format';

const TICK_INTERVAL_MS = 1000;

interface CurrencyTickerProps {
  currency: number;
  cps: number;
  className?: string;
}

export function CurrencyTicker({ currency, cps, className }: CurrencyTickerProps) {
  const [displayedCurrency, setDisplayedCurrency] = useState(currency);
  const baseline = useRef({ currency, timestamp: 0 });

  useEffect(() => {
    baseline.current = { currency, timestamp: Date.now() };

    const intervalId = setInterval(() => {
      const elapsedSeconds = (Date.now() - baseline.current.timestamp) / 1000;
      setDisplayedCurrency(baseline.current.currency + cps * elapsedSeconds);
    }, TICK_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [currency, cps]);

  return <p className={className}>{formatCurrency(displayedCurrency)}</p>;
}
