'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useSession } from 'next-auth/react';
import { User, Mail, Briefcase, CreditCard, Check, Sparkles } from 'lucide-react';
import Link from 'next/link';

const professionOptions = [
  { value: 'محامي', labelAr: 'محامي', labelFr: 'Avocat', labelEn: 'Lawyer' },
  { value: 'قاضي', labelAr: 'قاضي', labelFr: 'Juge', labelEn: 'Judge' },
  { value: 'محضر', labelAr: 'محضر', labelFr: 'Huissier', labelEn: 'Bailiff' },
  { value: 'موثق', labelAr: 'موثق', labelFr: 'Notaire', labelEn: 'Notary' },
  { value: 'باحث', labelAr: 'باحث', labelFr: 'Chercheur', labelEn: 'Researcher' },
  { value: 'طالب', labelAr: 'طالب', labelFr: 'Étudiant', labelEn: 'Student' },
  { value: 'أخرى', labelAr: 'أخرى', labelFr: 'Autre', labelEn: 'Other' },
];

export default function ProfilePage() {
  const router = useRouter();
  const { language, translations: t } = useLanguage();
  const { data: session, status, update } = useSession();
  const isPremium = session?.user?.plan === 'PRO';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profession, setProfession] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [createdAt, setCreatedAt] = useState<string>('');
  const [lawCount, setLawCount] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login?callbackUrl=/profile');
      return;
    }
    setName(session.user?.name || '');
    setEmail(session.user?.email || '');
    setProfession(session.user?.profession || '');

    async function loadProfile() {
      try {
        const [profileRes, lawsRes] = await Promise.all([
          fetch('/api/profile'),
          fetch('/api/laws?limit=1'),
        ]);

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          if (profileData?.user) {
            setName(profileData.user.name || '');
            setEmail(profileData.user.email || '');
            setProfession(profileData.user.profession || '');
            setCreatedAt(profileData.user.createdAt || '');
          }
        }

        if (lawsRes.ok) {
          const lawsData = await lawsRes.json();
          setLawCount(lawsData?.pagination?.total || 0);
        }
      } catch (error) {
        console.error('Profile load error:', error);
      }
    }

    loadProfile();
  }, [session, status, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setErrorMessage('');

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, profession }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to save profile');
      }

      await update({
        ...session,
        user: {
          ...session?.user,
          name: data.user.name,
          profession: data.user.profession,
        },
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const getProfessionLabel = (prof: string) => {
    const p = professionOptions.find((x) => x.value === prof);
    return p ? (language === 'ar' ? p.labelAr : language === 'fr' ? p.labelFr : p.labelEn) : prof;
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-navy border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <section className="bg-navy text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-xl">
              <User className="h-8 w-8 text-gold" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-cairo">{t['page.profile']}</h1>
              <p className="text-slate-300">
                {language === 'ar'
                  ? 'إدارة معلوماتك الشخصية'
                  : language === 'fr'
                  ? 'Gérez vos informations personnelles'
                  : 'Manage your personal information'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Profile Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {language === 'ar' ? 'المعلومات الشخصية' : language === 'fr' ? 'Informations personnelles' : 'Personal Information'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <Input
                  label={t['form.name']}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                />

                <Input
                  label={t['form.email']}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  dir="ltr"
                  disabled
                />

                <Select
                  label={t['form.profession']}
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  options={professionOptions.map((p) => ({
                    value: p.value,
                    label: language === 'ar' ? p.labelAr : language === 'fr' ? p.labelFr : p.labelEn,
                  }))}
                />

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1" disabled={saving}>
                    {saving ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        {language === 'ar' ? 'جاري الحفظ...' : language === 'fr' ? 'Enregistrement...' : 'Saving...'}
                      </span>
                    ) : saved ? (
                      <span className="flex items-center gap-2">
                        <Check className="h-4 w-4" />
                        {t['common.success']}
                      </span>
                    ) : (
                      t['btn.save']
                    )}
                  </Button>
                </div>
                {errorMessage && (
                  <p className="text-sm text-red-500">{errorMessage}</p>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Subscription */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                {t['sub.current']}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full ${
                  isPremium
                    ? 'bg-gold/20 text-gold'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  {isPremium ? (
                    <>
                      <Sparkles className="h-5 w-5" />
                      <span className="font-semibold">{t['tier.premium']}</span>
                    </>
                  ) : (
                    <>
                      <User className="h-5 w-5" />
                      <span className="font-semibold">{t['tier.free']}</span>
                    </>
                  )}
                </div>

                {isPremium ? (
                  <div className="mt-6 space-y-2">
                    <p className="text-sm text-slate-500">
                      {language === 'ar'
                        ? 'تاريخ الانتهاء'
                        : language === 'fr'
                        ? "Date d'expiration"
                        : 'Expiration date'}
                    </p>
                    <p className="font-medium">
                      {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-slate-500 mt-4">499 DZD / {language === 'ar' ? 'شهر' : language === 'fr' ? 'mois' : 'month'}</p>
                  </div>
                ) : (
                  <div className="mt-6 space-y-4">
                    <p className="text-sm text-slate-500">
                      {language === 'ar'
                        ? 'قم بالترقية للوصول إلى جميع الميزات'
                        : language === 'fr'
                        ? "Passez à Premium pour accéder à toutes les fonctionnalités"
                        : 'Upgrade to access all features'}
                    </p>
                    <Link href="/premium">
                      <Button variant="gold">
                        <Sparkles className="h-4 w-4" />
                        {t['btn.upgrade']}
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Account Stats */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>{t['dash.stats']}</CardTitle>
              <CardDescription>
                {language === 'ar'
                  ? 'إحصائيات حسابك'
                  : language === 'fr'
                  ? 'Statistiques de votre compte'
                  : 'Your account statistics'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-navy">{lawCount}</p>
                  <p className="text-sm text-slate-500">
                    {language === 'ar' ? 'القوانين المتاحة' : language === 'fr' ? 'Lois disponibles' : 'Available Laws'}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-navy">
                    {session?.user?.profession ? getProfessionLabel(session.user.profession) : '-'}
                  </p>
                  <p className="text-sm text-slate-500">
                    {language === 'ar' ? 'المهنة' : language === 'fr' ? 'Profession' : 'Profession'}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-navy">
                    {createdAt ? new Date(createdAt).toLocaleDateString() : '-'}
                  </p>
                  <p className="text-sm text-slate-500">
                    {language === 'ar' ? 'تاريخ التسجيل' : language === 'fr' ? "Date d'inscription" : 'Registration Date'}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-navy">
                    {isPremium ? '✓' : '—'}
                  </p>
                  <p className="text-sm text-slate-500">
                    {language === 'ar' ? 'Premium' : 'Premium'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
