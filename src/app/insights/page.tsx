'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSession } from 'next-auth/react';
import {
  BookOpen,
  Scale,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  FileText,
  Loader2,
} from 'lucide-react';

interface Tip {
  title: string;
  content: string;
}

interface Article {
  id: string;
  title: string;
  desc: string;
  category: string;
  reference: string;
  year: number;
}

export default function InsightsPage() {
  const { language, translations: t } = useLanguage();
  const { data: session } = useSession();
  const isPro = session?.user?.plan === 'PRO';

  const [tips, setTips] = useState<Tip[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadInsights() {
      try {
        const res = await fetch(`/api/insights?lang=${language}`);
        if (!res.ok) throw new Error('Failed to fetch insights');
        const data = await res.json();
        setTips(data.dailyTips || []);
        setArticles(data.articles || []);
      } catch (err) {
        console.error('Error loading insights:', err);
        setError(
          language === 'ar'
            ? 'حدث خطأ أثناء تحميل المعرفة القانونية'
            : language === 'fr'
            ? 'Erreur lors du chargement des connaissances juridiques'
            : 'Error loading legal insights'
        );
      } finally {
        setLoading(false);
      }
    }

    loadInsights();
  }, [language]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-navy" />
          <span className="text-slate-600 dark:text-slate-400">
            {language === 'ar' ? 'جاري التحميل...' : language === 'fr' ? 'Chargement...' : 'Loading...'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <section className="bg-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <BookOpen className="h-16 w-16 text-gold mx-auto mb-6" />
            <h1 className="text-4xl font-bold font-cairo mb-4">
              {language === 'ar' ? 'المعرفة القانونية' : language === 'fr' ? 'Savoir juridique' : 'Legal Insights'}
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              {language === 'ar'
                ? 'نصائح يومية ومقالات قانونية لتعزيز معرفتك القانونية'
                : language === 'fr'
                ? 'Conseils quotidiens et articles juridiques pour approfondir vos connaissances'
                : 'Daily tips and legal articles to enhance your legal knowledge'}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-8">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-navy dark:text-white mb-6 flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-gold" />
              {language === 'ar' ? 'نصائح اليوم' : language === 'fr' ? 'Conseils du jour' : 'Daily Tips'}
            </h2>
            <div className="space-y-4">
              {tips.map((tip, i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-4">
                    <h3 className="font-semibold text-navy dark:text-white mb-2">{tip.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">{tip.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-navy dark:text-white mb-6 flex items-center gap-2">
              <FileText className="h-6 w-6 text-gold" />
              {language === 'ar' ? 'مقالات قانونية' : language === 'fr' ? 'Articles juridiques' : 'Legal Articles'}
            </h2>
            <div className="space-y-4">
              {articles.map((article) => (
                <Link key={article.id} href={`/laws/${article.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer mb-4">
                    <CardContent className="pt-4">
                      <h3 className="font-semibold text-navy dark:text-white mb-2">{article.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">{article.desc}</p>
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-navy/10 text-navy rounded-full">
                        {article.category} - {article.year}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-bold text-navy dark:text-white mb-6 text-center">
            {language === 'ar' ? 'مقارنة الخطط' : language === 'fr' ? 'Comparaison des plans' : 'Plan Comparison'}
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 border-slate-200">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{t['tier.free']}</CardTitle>
                <p className="text-4xl font-bold text-navy mt-4">0 DZD</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {['sub.features.free', 'sub.features.search', 'categories.constitution'].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-slate-600">{t[item]}</span>
                    </li>
                  ))}
                  <li className="flex items-center gap-3 text-slate-400">
                    <FileText className="h-5 w-5" />
                    <span>{language === 'ar' ? 'المقالات القانونية' : language === 'fr' ? 'Articles juridiques' : 'Legal Articles'}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-gold relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gold text-navy text-xs font-bold px-4 py-1 rounded-bl-lg">
                PRO
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{t['tier.premium']}</CardTitle>
                <p className="text-4xl font-bold text-navy mt-4">{t['sub.price']}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {['sub.features.free', 'sub.features.search', 'sub.features.ai', 'sub.features.cases'].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-gold" />
                      <span className="text-slate-600">{t[item]}</span>
                    </li>
                  ))}
                  <li className="flex items-center gap-3 text-gold font-medium">
                    <Sparkles className="h-5 w-5" />
                    <span>{language === 'ar' ? 'جميع المقالات القانونية' : language === 'fr' ? 'Tous les articles juridiques' : 'All Legal Articles'}</span>
                  </li>
                </ul>
                {!isPro && (
                  <Link href="/premium" className="block mt-6">
                    <Button variant="gold" className="w-full">
                      {t['btn.upgrade']}
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mt-16 text-center">
          <Card className="bg-navy border-0">
            <CardContent className="py-12">
              <Scale className="h-12 w-12 text-gold mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">
                {language === 'ar' ? 'هل تبحث عن قانون معين؟' : language === 'fr' ? 'Cherchez-vous une loi spécifique?' : 'Looking for a specific law?'}
              </h3>
              <p className="text-slate-300 mb-6 max-w-xl mx-auto">
                {language === 'ar'
                  ? 'اطلب أي قانون جزائري وسنوفره لك في أسرع وقت'
                  : language === 'fr'
                  ? 'Demandez n\'importe quelle loi algérienne et nous vous la fournirons rapidement'
                  : 'Request any Algerian law and we will provide it to you quickly'}
              </p>
              <Link href="/laws">
                <Button size="lg" variant="gold">
                  {language === 'ar' ? 'تصفح القوانين' : language === 'fr' ? 'Parcourir les lois' : 'Browse Laws'}
                  <ArrowRight className="mr-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
