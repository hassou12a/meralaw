'use client';

import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { BookOpen, FileText, Scale, Sparkles, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface LawCardProps {
  id: string;
  titleAr: string;
  titleFr: string;
  titleEn: string;
  category: string;
  referenceNumber: string;
  year: number;
  publicationDate: string;
  descriptionAr: string;
  descriptionFr: string;
  descriptionEn: string;
  isNew?: boolean;
  isPremium?: boolean;
  language: 'ar' | 'fr' | 'en';
  onRead: (id: string) => void;
  onDownload: (id: string) => void;
  sourceUrl?: string | null;
}

const categoryIcons: Record<string, React.ElementType> = {
  'الدستور الجزائري': Scale,
  'القانون المدني': BookOpen,
  'قانون الإجراءات المدنية والإدارية': FileText,
  'القانون التجاري': Scale,
  'قانون العقوبات': Scale,
  'قانون الأسرة': BookOpen,
  'قانون العمل': FileText,
  'القانون الإداري': Scale,
  'المراسيم التنفيذية': FileText,
  'الأوامر presidential': Sparkles,
  'المناشير والتعليمات الوزارية': FileText,
};

export function LawCard({
  id,
  titleAr,
  titleFr,
  titleEn,
  category,
  referenceNumber,
  year,
  descriptionAr,
  descriptionFr,
  descriptionEn,
  isNew,
  isPremium,
  language,
  onRead,
  onDownload,
  sourceUrl,
}: LawCardProps) {
  const Icon = categoryIcons[category] || BookOpen;
  const title = language === 'ar' ? titleAr : language === 'fr' ? titleFr : titleEn;
  const description = language === 'ar' ? descriptionAr : language === 'fr' ? descriptionFr : descriptionEn;

  const handleDownload = () => {
    onDownload(id);
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-navy/10">
              <Icon className="h-5 w-5 text-navy" />
            </div>
            <div>
              <CardTitle className="text-lg line-clamp-1">{title}</CardTitle>
              <CardDescription className="text-xs mt-1">
                {referenceNumber} - {year}
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            {isNew && (
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                {language === 'ar' ? 'جديد' : language === 'fr' ? 'Nouveau' : 'New'}
              </span>
            )}
            {isPremium && (
              <span className="px-2 py-1 text-xs font-medium bg-gold/20 text-gold-700 rounded-full">
                Premium
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
          {description}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => onRead(id)}
            className="flex-1 px-4 py-2 text-sm font-medium bg-navy text-white rounded-lg hover:bg-navy-600 transition-colors"
          >
            {language === 'ar' ? 'اقرأ' : language === 'fr' ? 'Lire' : 'Read'}
          </button>
          {sourceUrl ? (
            <Link
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm font-medium border border-navy text-navy rounded-lg hover:bg-navy hover:text-white transition-colors flex items-center gap-1"
            >
              <ExternalLink className="h-3 w-3" />
              {language === 'ar' ? 'المصدر' : language === 'fr' ? 'Source' : 'Source'}
            </Link>
          ) : (
            <button
              onClick={handleDownload}
              className="px-4 py-2 text-sm font-medium border border-navy text-navy rounded-lg hover:bg-navy hover:text-white transition-colors"
            >
              {language === 'ar' ? 'PDF' : 'PDF'}
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
