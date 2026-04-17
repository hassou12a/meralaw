'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSession } from 'next-auth/react';
import {
  ArrowRight,
  ArrowLeft,
  Download,
  Calendar,
  FileText,
  Scale,
  Shield,
  BookOpen,
} from 'lucide-react';

interface Law {
  id: string;
  titleAr: string;
  titleFr: string;
  titleEn: string;
  category: string;
  referenceNumber: string;
  year: number;
  publicationDate: string;
  journalOfficiel: string;
  descriptionAr: string;
  descriptionFr: string;
  descriptionEn: string;
  contentAr: string;
  contentFr: string;
  isPremium: boolean;
}

const categoryIcons: Record<string, React.ElementType> = {
  'الدستور الجزائري': Scale,
  'القانون المدني': BookOpen,
  'قانون الإجراءات المدنية والإدارية': FileText,
  'القانون التجاري': Scale,
  'قانون العقوبات': Shield,
  'قانون الأسرة': BookOpen,
  'قانون العمل': FileText,
  'القانون الإداري': Scale,
  'المراسيم التنفيذية': FileText,
  'الأوامر presidential': Scale,
  'المناشير والتعليمات الوزارية': FileText,
};

export default function LawDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { language, translations: t, dir } = useLanguage();
  const { data: session } = useSession();
  const isPremium = session?.user?.plan === 'PRO';

  const [law, setLaw] = useState<Law | null>(null);
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    fetchLaw();
  }, [params.id]);

  const fetchLaw = async () => {
    try {
      const res = await fetch(`/api/laws/${params.id}`);
      if (!res.ok) throw new Error('Law not found');
      const data = await res.json();
      setLaw(data);

      if (!data.isPremium || isPremium) {
        setShowContent(true);
      }
    } catch (error) {
      console.error('Error fetching law:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = () => {
    if (session) {
      router.push('/pricing');
    } else {
      router.push('/login?callbackUrl=/laws/' + params.id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-navy border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!law) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center py-12 px-8">
          <CardContent>
            <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">{t['common.error']}</h3>
            <Link href="/laws" className="mt-4 inline-block">
              <Button variant="outline">{t['common.back']}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const Icon = categoryIcons[law.category] || BookOpen;
  const title = language === 'ar' ? law.titleAr : language === 'fr' ? law.titleFr : law.titleEn;
  const description = language === 'ar' ? law.descriptionAr : language === 'fr' ? law.descriptionFr : law.descriptionEn;
  const content = language === 'ar' ? law.contentAr : language === 'fr' ? law.contentFr : law.contentFr;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <section className="bg-navy text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-slate-300 mb-4">
            <Link href="/laws" className="hover:text-white flex items-center gap-1">
              {dir === 'rtl' ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
              {t['page.laws']}
            </Link>
            <span>/</span>
            <span className="text-white">{title}</span>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/10 rounded-xl">
              <Icon className="h-8 w-8 text-gold" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold font-cairo">{title}</h1>
                {law.isPremium && (
                  <span className="px-3 py-1 bg-gold/20 text-gold text-sm rounded-full">
                    Premium
                  </span>
                )}
              </div>
              <p className="text-slate-300">{description}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">{t['law.reference']}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500">{t['law.reference']}</p>
                  <p className="font-medium">{law.referenceNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">{t['law.year']}</p>
                  <p className="font-medium">{law.year}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">{t['law.publicationDate']}</p>
                  <p className="font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {law.publicationDate}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">{t['law.journalOfficiel']}</p>
                  <p className="font-medium text-sm">{law.journalOfficiel}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">
                    {language === 'ar' ? 'التصنيف' : language === 'fr' ? 'Catégorie' : 'Category'}
                  </p>
                  <p className="font-medium">{law.category}</p>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Download className="h-4 w-4" />
                    PDF
                  </Button>
                  <Link href="/search" className="flex-1">
                    <Button variant="outline" className="w-full">
                      {t['nav.search']}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Content */}
          <main className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{t['law.content']}</CardTitle>
              </CardHeader>
              <CardContent>
                {showContent ? (
                  <div className="prose dark:prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed bg-slate-50 dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
                      {content}
                    </pre>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Shield className="h-16 w-16 text-gold mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-navy dark:text-white mb-2">
                      {t['premium.required']}
                    </h3>
                    <p className="text-slate-500 mb-6 max-w-md mx-auto">
                      {t['premium.upgrade']}
                    </p>
                    <Button variant="gold" onClick={handleUnlock}>
                      {t['btn.upgrade']}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Related Laws */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>
                  {language === 'ar' ? 'قوانين ذات صلة' : language === 'fr' ? 'Lois connexes' : 'Related Laws'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Link
                      key={i}
                      href={`/laws/related-${i}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <FileText className="h-5 w-5 text-slate-400" />
                      <span className="text-sm">
                        {language === 'ar'
                          ? `قانون ذو صلة ${i}`
                          : language === 'fr'
                          ? `Loi connexe ${i}`
                          : `Related Law ${i}`}
                      </span>
                      {dir === 'rtl' ? (
                        <ArrowLeft className="h-4 w-4 mr-auto text-slate-400" />
                      ) : (
                        <ArrowRight className="h-4 w-4 ml-auto text-slate-400" />
                      )}
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}
