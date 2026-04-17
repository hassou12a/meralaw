'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Scale, ArrowRight } from 'lucide-react';

const professions = [
  { value: 'محامي', labelAr: 'محامي', labelFr: 'Avocat', labelEn: 'Lawyer' },
  { value: 'قاضي', labelAr: 'قاضي', labelFr: 'Juge', labelEn: 'Judge' },
  { value: 'محضر', labelAr: 'محضر', labelFr: 'Huissier', labelEn: 'Bailiff' },
  { value: 'موثق', labelAr: 'موثق', labelFr: 'Notaire', labelEn: 'Notary' },
  { value: 'باحث', labelAr: 'باحث', labelFr: 'Chercheur', labelEn: 'Researcher' },
  { value: 'طالب', labelAr: 'طالب', labelFr: 'Étudiant', labelEn: 'Student' },
  { value: 'أخرى', labelAr: 'أخرى', labelFr: 'Autre', labelEn: 'Other' },
];

export default function RegisterPage() {
  const router = useRouter();
  const { language, translations: t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profession, setProfession] = useState('محامي');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getProfessionLabel = (prof: string) => {
    const p = professions.find((x) => x.value === prof);
    return p ? (language === 'ar' ? p.labelAr : language === 'fr' ? p.labelFr : p.labelEn) : prof;
  };

  const professionOptions = professions.map((p) => ({
    value: p.value,
    label: language === 'ar' ? p.labelAr : language === 'fr' ? p.labelFr : p.labelEn,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(
        language === 'ar'
          ? 'كلمتا المرور غير متطابقتين'
          : language === 'fr'
          ? 'Les mots de passe ne correspondent pas'
          : 'Passwords do not match'
      );
      return;
    }

    if (password.length < 6) {
      setError(
        language === 'ar'
          ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
          : language === 'fr'
          ? 'Le mot de passe doit contenir au moins 6 caractères'
          : 'Password must be at least 6 characters'
      );
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, profession }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'An error occurred');
        setLoading(false);
        return;
      }

      router.push('/login?registered=true');
    } catch {
      setError('An error occurred. Please try again.');
      setLoading(false);
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
          <h1 className="text-2xl font-bold text-navy dark:text-white">{t['auth.createAccount']}</h1>
          <p className="text-slate-500 mt-2">
            {language === 'ar' ? 'مجاناً للأبد' : language === 'fr' ? 'Gratuit pour toujours' : 'Free forever'}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Input
              label={t['form.name']}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={language === 'ar' ? 'أحمد بن علي' : language === 'fr' ? 'Ahmed Ben Ali' : 'Ahmed Ben Ali'}
              required
            />

            <Input
              label={t['form.email']}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.dz"
              required
              dir="ltr"
            />

            <Select
              label={t['form.profession']}
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              options={professionOptions}
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

            <Input
              label={t['form.confirmPassword']}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              dir="ltr"
            />

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
                  {t['auth.register']}
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              {t['auth.hasAccount']}{' '}
              <Link href="/login" className="text-navy font-medium hover:underline">
                {t['auth.login']}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
