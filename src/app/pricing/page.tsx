'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useSession } from 'next-auth/react';
import { Check, Sparkles, BookOpen, Search, Bot, Briefcase, FileText, FileDown } from 'lucide-react';

const freeFeatures = [
  { key: 'sub.features.free', icon: BookOpen },
  { key: 'sub.features.search', icon: Search },
  { key: 'categories.constitution', icon: BookOpen },
  { key: 'categories.civil', icon: BookOpen },
];

const premiumFeatures = [
  { key: 'sub.features.free', icon: BookOpen },
  { key: 'sub.features.search', icon: Search },
  { key: 'sub.features.ai', icon: Bot },
  { key: 'sub.features.cases', icon: Briefcase },
  { key: 'sub.features.export', icon: FileDown },
  { key: 'sub.features.notes', icon: FileText },
];

export default function PricingPage() {
  const { language, translations: t } = useLanguage();
  const { data: session } = useSession();
  const isPremium = session?.user?.plan === 'PRO';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <section className="bg-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Sparkles className="h-16 w-16 text-gold mx-auto mb-6" />
          <h1 className="text-4xl font-bold font-cairo mb-4">{t['page.pricing']}</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            {language === 'ar'
              ? 'اختر الخطة المناسبة لممارستك القانونية'
              : language === 'fr'
              ? 'Choisissez le plan adapté à votre pratique juridique'
              : 'Choose the plan that fits your legal practice'}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {/* Free Tier */}
          <Card className="border-2 border-slate-200">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto p-3 bg-slate-100 dark:bg-slate-800 rounded-full w-fit mb-4">
                <BookOpen className="h-8 w-8 text-navy" />
              </div>
              <CardTitle className="text-2xl">{t['tier.free']}</CardTitle>
              <CardDescription>
                {language === 'ar'
                  ? 'للمهنيين والباحثين'
                  : language === 'fr'
                  ? 'Pour les professionnels et chercheurs'
                  : 'For professionals and researchers'}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-2">
              <div className="mb-6">
                <span className="text-5xl font-bold text-navy">0</span>
                <span className="text-slate-500"> DZD</span>
              </div>
              <p className="text-sm text-slate-500 mb-6">
                {language === 'ar' ? 'للأبد' : language === 'fr' ? 'Pour toujours' : 'Forever'}
              </p>
              <ul className="space-y-3 text-right">
                {freeFeatures.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <li key={feature.key} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-600 dark:text-slate-400">{t[feature.key]}</span>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
            <CardFooter className="justify-center">
              {session ? (
                <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  {language === 'ar' ? 'اشتراكك الحالي' : language === 'fr' ? 'Votre abonnement actuel' : 'Your current plan'}
                </p>
              ) : (
                <Link href="/register">
                  <Button className="w-full">{t['sub.getStarted']}</Button>
                </Link>
              )}
            </CardFooter>
          </Card>

          {/* Premium Tier */}
          <Card className="border-2 border-gold relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gold text-navy text-sm font-bold px-6 py-2 rounded-bl-lg flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              {language === 'ar' ? 'الأكثر شعبية' : language === 'fr' ? 'Le plus populaire' : 'Most Popular'}
            </div>
            <CardHeader className="text-center pb-2">
              <div className="mx-auto p-3 bg-gold/10 rounded-full w-fit mb-4">
                <Bot className="h-8 w-8 text-gold" />
              </div>
              <CardTitle className="text-2xl">{t['tier.premium']}</CardTitle>
              <CardDescription>
                {language === 'ar'
                  ? 'للمحامين والممارسين'
                  : language === 'fr'
                  ? "Pour les avocats et praticiens"
                  : 'For lawyers and practitioners'}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-2">
              <div className="mb-6">
                <span className="text-5xl font-bold text-navy">499</span>
                <span className="text-slate-500"> DZD</span>
                <p className="text-sm text-slate-500 mt-1">
                  {language === 'ar' ? '/ شهرياً' : language === 'fr' ? '/ mois' : '/ month'}
                </p>
              </div>
              <ul className="space-y-3 text-right">
                {premiumFeatures.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <li key={feature.key} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-gold flex-shrink-0" />
                      <span className="text-slate-600 dark:text-slate-400">{t[feature.key]}</span>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
            <CardFooter className="justify-center">
              {isPremium ? (
                <p className="text-sm text-gold flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  {t['sub.current']}
                </p>
              ) : session ? (
                <Link href="/premium">
                  <Button variant="gold" className="w-full">
                    {t['btn.upgrade']}
                  </Button>
                </Link>
              ) : (
                <Link href="/register">
                  <Button variant="gold" className="w-full">
                    {t['sub.getStarted']}
                  </Button>
                </Link>
              )}
            </CardFooter>
          </Card>
        </div>

        {/* Comparison Table */}
        <Card>
          <CardHeader>
            <CardTitle>{t['sub.compare']}</CardTitle>
            <CardDescription>
              {language === 'ar'
                ? 'قارن بين الخطط'
                : language === 'fr'
                ? 'Comparez les plans'
                : 'Compare plans'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-right py-4 px-4 font-medium text-slate-600 dark:text-slate-400">
                      {language === 'ar' ? 'الميزة' : language === 'fr' ? 'Fonctionnalité' : 'Feature'}
                    </th>
                    <th className="text-center py-4 px-4 font-medium text-navy">
                      {t['tier.free']}
                    </th>
                    <th className="text-center py-4 px-4 font-medium text-gold">
                      {t['tier.premium']}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'sub.features.free', free: true, premium: true },
                    { label: 'sub.features.search', free: true, premium: true },
                    { label: 'sub.features.ai', free: false, premium: true },
                    { label: 'sub.features.cases', free: false, premium: true },
                    { label: 'sub.features.export', free: false, premium: true },
                    { label: 'sub.features.notes', free: false, premium: true },
                    {
                      label: language === 'ar' ? 'دعم priority' : language === 'fr' ? 'Support prioritaire' : 'Priority support',
                      free: false,
                      premium: true
                    },
                  ].map((row) => (
                    <tr key={row.label} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-4 px-4">{t[row.label]}</td>
                      <td className="text-center py-4 px-4">
                        {row.free ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="text-center py-4 px-4">
                        {row.premium ? (
                          <Check className="h-5 w-5 text-gold mx-auto" />
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Payment Placeholder */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>
              {language === 'ar' ? 'طرق الدفع' : language === 'fr' ? 'Modes de paiement' : 'Payment Methods'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['CCP', 'BaridiMob', 'SATIM', 'Virement'].map((method) => (
                <div
                  key={method}
                  className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg text-center text-sm text-slate-500"
                >
                  {method}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-4 text-center">
              {language === 'ar'
                ? 'ال دفع غير مفعل في هذه النسخة التجريبية'
                : language === 'fr'
                ? 'Le paiement nest pas activé dans cette démo'
                : 'Payment is not enabled in this demo'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
