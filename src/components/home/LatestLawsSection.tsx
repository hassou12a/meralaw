'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookOpen, FileText, Scale, Download, ArrowRight, Calendar, Sparkles } from 'lucide-react';

interface LawItem {
  id: string;
  titleAr: string;
  titleFr: string;
  titleEn: string;
  category: string;
  referenceNumber: string;
  year: number;
  publicationDate: string;
  journalOfficiel?: string | null;
  descriptionAr?: string | null;
  descriptionFr?: string | null;
  descriptionEn?: string | null;
  pdfUrlAr?: string | null;
  pdfUrlFr?: string | null;
  isPremium?: boolean;
  isVerified?: boolean;
  isNew?: boolean;
  createdAt?: string;
}

const categoryIcons: Record<string, React.ElementType> = {
  'دستور': Scale,
  'قوانين مرجعية': BookOpen,
  'إجراءات قضائية إدارية': FileText,
  'وظيف عمومي': FileText,
  'إدارة محلية': Scale,
  'صفقات عمومية': FileText,
  'تنظيم إداري': Scale,
  'مالية عامة': FileText,
  'المراسيم التنفيذية': FileText,
};

export function LatestLawsSection() {
  const { language, translations: t } = useLanguage();
  const [laws, setLaws] = useState<LawItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch('/api/laws?limit=6', { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) setLaws(Array.isArray(data?.laws) ? data.laws : []);
      } catch (e) {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const pickTitle = (l: LawItem) =>
    language === 'ar' ? l.titleAr : language === 'fr' ? l.titleFr : l.titleEn || l.titleFr || l.titleAr;
  const pickDesc = (l: LawItem) =>
    language === 'ar' ? l.descriptionAr : language === 'fr' ? l.descriptionFr : l.descriptionEn;
  const pickPdf = (l: LawItem) =>
    language === 'ar' ? l.pdfUrlAr || l.pdfUrlFr : l.pdfUrlFr || l.pdfUrlAr;

  return (
    <section className="py-20 bg-white dark:bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-3 text-gold">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                {t['page.latestUpdates']}
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-navy dark:text-white mb-3 font-cairo">
              {t['home.latest.title']}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
              {t['home.latest.subtitle']}
            </p>
            <div className="w-20 h-1 bg-gold rounded-full mt-4" />
          </div>
          <Link href="/laws" className="shrink-0">
            <Button variant="outline" className="gap-2">
              {t['home.latest.viewAll']}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : laws.length === 0 || error ? (
          <Card className="text-center py-12 border-dashed">
            <CardContent>
              <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">{t['home.latest.empty']}</p>
              <Link href="/laws" className="inline-block mt-4">
                <Button variant="outline">{t['home.latest.viewAll']}</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {laws.map((law) => {
              const Icon = categoryIcons[law.category] || BookOpen;
              const pdf = pickPdf(law);
              const title = pickTitle(law);
              const desc = pickDesc(law);
              return (
                <Card
                  key={law.id}
                  className="group hover:shadow-xl hover:-translate-y-1 transition-all border-slate-200 dark:border-slate-700"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 rounded-lg bg-navy/10 dark:bg-navy/30 shrink-0">
                          <Icon className="h-5 w-5 text-navy dark:text-gold" />
                        </div>
                        <div className="min-w-0">
                          <CardTitle className="text-base line-clamp-2">{title}</CardTitle>
                          <CardDescription className="text-xs mt-1 flex items-center gap-2 flex-wrap">
                            <span className="font-mono">{law.referenceNumber}</span>
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {law.year}
                            </span>
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 items-end shrink-0">
                        {law.isNew && (
                          <span className="px-2 py-0.5 text-[10px] font-semibold bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 rounded-full">
                            {t['common.new']}
                          </span>
                        )}
                        {law.isPremium && (
                          <span className="px-2 py-0.5 text-[10px] font-semibold bg-gold/20 text-gold-700 dark:text-gold rounded-full">
                            Premium
                          </span>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {desc ? (
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
                        {desc}
                      </p>
                    ) : (
                      <p className="text-sm text-slate-500 italic line-clamp-2 mb-4">
                        {law.category}
                        {law.journalOfficiel ? ` — ${law.journalOfficiel}` : ''}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Link href={`/laws/${law.id}`} className="flex-1">
                        <Button className="w-full" size="sm">
                          {t['btn.read']}
                        </Button>
                      </Link>
                      {pdf && (
                        <a
                          href={pdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={t['common.openOfficial']}
                        >
                          <Button variant="outline" size="sm" className="gap-1">
                            <Download className="h-4 w-4" />
                            PDF
                          </Button>
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
