'use client';

import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => setIsVisible(true), 2000);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    const prompt = deferredPrompt as any;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
  };

  if (!isVisible || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 animate-fade-in">
      <div className="bg-navy text-white p-4 rounded-lg shadow-lg flex items-center gap-3">
        <Download className="h-5 w-5 text-gold" />
        <div>
          <p className="text-sm font-medium">تثبيت التطبيق</p>
          <p className="text-xs text-slate-300">Installer l'application</p>
        </div>
        <Button size="sm" variant="gold" onClick={handleInstall}>
          تثبيت
        </Button>
      </div>
    </div>
  );
}