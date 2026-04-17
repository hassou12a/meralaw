'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Scale, ArrowRight } from 'lucide-react';
import { Suspense } from 'react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const { language, translations: t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError(
        language === 'ar'
          ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
          : language === 'fr'
          ? 'Email ou mot de passe incorrect'
          : 'Incorrect email or password'
      );
      setLoading(false);
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Scale className="h-10 w-10 text-navy" />
            <span className="text-3xl font-bold text-navy font-cairo">LexDZ</span>
          </Link>
          <h1 className="text-2xl font-bold text-navy dark:text-white">{t['auth.welcomeBack']}</h1>
          <p className="text-slate-500 mt-2">{t['auth.login']}</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Input
              label={t['form.email']}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@lexdz.dz"
              required
              dir="ltr"
            />

            <Input
              label={t['form.password']}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              dir="ltr"
            />

            <div className="flex items-center justify-between">
              <Link
                href="/forgot-password"
                className="text-sm text-navy hover:underline"
              >
                {t['auth.forgotPassword']}
              </Link>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {language === 'ar' ? 'جاري التحميل...' : language === 'fr' ? 'Chargement...' : 'Loading...'}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {t['auth.login']}
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              {t['auth.noAccount']}{' '}
              <Link href="/register" className="text-navy font-medium hover:underline">
                {t['auth.register']}
              </Link>
            </p>
          </div>

          <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <p className="text-xs text-slate-500 mb-2">
              {language === 'ar' ? 'للاختبار:' : language === 'fr' ? 'Pour tester:' : 'To test:'}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-mono">
              admin@lexdz.dz / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-navy border-t-transparent rounded-full" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
