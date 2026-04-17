'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DailyTipWidget } from '@/components/ui/DailyTipWidget';
import { PWAInstallButton } from '@/components/ui/PWAInstallButton';
import { useSession } from 'next-auth/react';
import {
  Scale,
  BookOpen,
  Search,
  Bot,
  Briefcase,
  CheckCircle,
  ArrowLeft,
  Sparkles,
  Shield,
  FileText,
} from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    titleKey: 'features.library',
    descKey: 'features.libraryDesc',
  },
  {
    icon: Search,
    titleKey: 'features.search',
    descKey: 'features.searchDesc',
  },
  {
    icon: Bot,
    titleKey: 'features.ai',
    descKey: 'features.aiDesc',
  },
  {
    icon: Briefcase,
    titleKey: 'features.cases',
    descKey: 'features.casesDesc',
  },
];

const categories = [
  { key: 'categories.constitution', icon: Scale },
  { key: 'categories.civil', icon: BookOpen },
  { key: 'categories.civilProcedure', icon: FileText },
  { key: 'categories.commercial', icon: Scale },
  { key: 'categories.penal', icon: Shield },
  { key: 'categories.family', icon: BookOpen },
  { key: 'categories.labor', icon: FileText },
  { key: 'categories.admin', icon: Scale },
  { key: 'categories.decrees', icon: FileText },
  { key: 'categories.orders', icon: Sparkles },
  { key: 'categories.circulaires', icon: FileText },
];

export default function HomePage() {
  const { language, translations: t } = useLanguage();
  const { data: session } = useSession();
  const isPremium = session?.user?.plan === 'PRO';

  return (
    <div className="min-h-screen">
      <DailyTipWidget />
      <PWAInstallButton />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-navy to-navy-600 text-white overflow-hidden">
        {/* Background Image - add /images/hero-bg.jpg to public folder */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/images/hero-bg.jpg)' }}
        />
        <div className="absolute inset-0 bg-navy/70" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-gold rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
              <Scale className="h-5 w-5 text-gold" />
              <span className="text-sm font-medium">
                {language === 'ar'
                  ? 'منصة قانونية جزائرية'
                  : language === 'fr'
                  ? 'Plateforme juridique algérienne'
                  : 'Algerian Legal Platform'}
              </span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 font-cairo leading-tight">
              {t['hero.title']}
            </h1>
            <p className="text-xl text-slate-300 mb-8">{t['hero.subtitle']}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/laws">
                <Button size="lg" variant="gold" className="text-lg px-8">
                  {t['hero.cta']}
                </Button>
              </Link>
              <Link href="/search">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 border-white text-white hover:bg-white hover:text-navy"
                >
                  {t['hero.learnMore']}
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-navy dark:text-white mb-4">
              {t['features.title']}
            </h2>
            <div className="w-20 h-1 bg-gold mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.titleKey} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mx-auto p-4 bg-navy/10 rounded-2xl w-fit mb-4">
                      <Icon className="h-8 w-8 text-navy" />
                    </div>
                    <CardTitle className="text-xl">{t[feature.titleKey]}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 dark:text-slate-400">
                      {t[feature.descKey]}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-navy dark:text-white mb-4">
              {t['categories.title']}
            </h2>
            <div className="w-20 h-1 bg-gold mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.key}
                  href={`/laws?category=${encodeURIComponent(t[cat.key])}`}
                  className="flex flex-col items-center gap-3 p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-navy hover:bg-navy/5 transition-all group"
                >
                  <div className="p-3 bg-navy/10 rounded-xl group-hover:bg-navy group-hover:text-white transition-colors">
                    <Icon className="h-6 w-6 text-navy group-hover:text-white" />
                  </div>
                  <span className="text-sm font-medium text-center text-slate-700 dark:text-slate-300">
                    {t[cat.key]}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Tier */}
            <Card className="border-2 border-slate-200">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl">{t['tier.free']}</CardTitle>
                <p className="text-4xl font-bold text-navy mt-4">0 DZD</p>
                <p className="text-slate-500">
                  {language === 'ar' ? 'للأبد' : language === 'fr' ? 'Pour toujours' : 'Forever'}
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    'sub.features.free',
                    'sub.features.search',
                    'categories.constitution',
                    'categories.civil',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-slate-600 dark:text-slate-400">{t[item]}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="block mt-6">
                  <Button className="w-full">{t['sub.getStarted']}</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Premium Tier */}
            <Card className="border-2 border-gold relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gold text-navy text-xs font-bold px-4 py-1 rounded-bl-lg">
                {t['tier.premium']}
              </div>
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl">{t['tier.premium']}</CardTitle>
                <p className="text-4xl font-bold text-navy mt-4">{t['sub.price']}</p>
                <p className="text-slate-500">
                  {language === 'ar' ? 'اشتراك شهري' : language === 'fr' ? 'Abonnement mensuel' : 'Monthly subscription'}
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    'sub.features.free',
                    'sub.features.search',
                    'sub.features.ai',
                    'sub.features.cases',
                    'sub.features.export',
                    'sub.features.notes',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-gold" />
                      <span className="text-slate-600 dark:text-slate-400">{t[item]}</span>
                    </li>
                  ))}
                </ul>
                {!isPremium && (
                  <Link href="/pricing" className="block mt-6">
                    <Button variant="gold" className="w-full">
                      {t['btn.upgrade']}
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Scale className="h-16 w-16 text-gold mx-auto mb-6" />
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 font-cairo">
            {language === 'ar'
              ? 'ابدأ رحلتك القانونية اليوم'
              : language === 'fr'
              ? 'Commencez votre parcours juridique aujourd\'hui'
              : 'Start your legal journey today'}
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            {language === 'ar'
              ? 'انضم إلى آلاف المهنيين القانونيين الجزائريين الذين يثقون بـ MeraLaw'
              : language === 'fr'
              ? 'Rejoignez des milliers de professionnels du droit algériens qui font confiance à MeraLaw'
              : 'Join thousands of Algerian legal professionals who trust MeraLaw'}
          </p>
          <Link href="/register">
            <Button size="lg" variant="gold" className="text-lg px-8">
              {t['hero.cta']}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
