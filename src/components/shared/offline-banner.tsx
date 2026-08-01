import { useState, useEffect } from 'react';
import { icons } from '@/config/icons';

export const OfflineBanner = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[300] flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-amber-600 shadow-xl backdrop-blur-md dark:text-amber-400">
      <icons.WifiOff className="h-5 w-5 shrink-0 animate-pulse" />
      <div className="text-xs">
        <p className="font-semibold">You are currently offline</p>
        <p className="text-muted-foreground">Cached health records and offline data are active.</p>
      </div>
    </div>
  );
};

export default OfflineBanner;
