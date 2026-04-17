'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LawCard } from '@/components/ui/law-card';
import { useSession } from 'next-auth/react';
import { Scale, BookOpen, Search, Sparkles, FileText, ArrowLeft } from 'lucide-react';

const categories = [
  { key: 'all', labelAr: 'الكل', labelFr: 'Tous', labelEn: 'All' },
  { key: 'الدستور الجزائري', labelAr: 'الدستور الجزائري', labelFr: 'Constitution', labelEn: 'Constitution' },
  { key: 'القانون المدني', labelAr: 'القانون المدني', labelFr: 'Code civil', labelEn: 'Civil Code' },
  { key: 'قانون الإجراءات المدنية والإدارية', labelAr: 'قانون الإجراءات المدنية', labelFr: 'Procédure civile', labelEn: 'Civil Procedure' },
  { key: 'القانون التجاري', labelAr: 'القانون التجاري', labelFr: 'Code de commerce', labelEn: 'Commercial Code' },
  { key: 'قانون العقوبات', labelAr: 'قانون العقوبات', labelFr: 'Code pénal', labelEn: 'Penal Code' },
  { key: 'قانون الأسرة', labelAr: 'قانون الأسرة', labelFr: 'Code de la famille', labelEn: 'Family Code' },
  { key: 'قانون العمل', labelAr: 'قانون العمل', labelFr: 'Code du travail', labelEn: 'Labor Code' },
  { key: 'القانون الإداري', labelAr: 'القانون الإداري', labelFr: 'Droit administratif', labelEn: 'Administrative Law' },
  { key: 'المراسيم التنفيذية', labelAr: 'المراسيم التنفيذية', labelFr: 'Décrets exécutifs', labelEn: 'Executive Decrees' },
  { key: 'الأوامر presidential', labelAr: 'الأوامر presidential', labelFr: 'Ordonnances', labelEn: 'Presidential Orders' },
  { key: 'المناشير والتعليمات الوزارية', labelAr: 'المناشير الوزارية', labelFr: 'Circulaires', labelEn: 'Ministerial Circulars' },
];

function LawsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const { language, translations: t } = useLanguage();
  const { data: session } = useSession();
  const isPremium = session?.user?.plan === 'PRO';

  const [laws, setLaws] = useState<Array<{
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
    isPremium: boolean;
    createdAt: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  const categoryOptions = categories.map((cat) => ({
    value: cat.key,
    label: language === 'ar' ? cat.labelAr : language === 'fr' ? cat.labelFr : cat.labelEn,
  }));

  const yearOptions = [
    { value: '', label: t['filter.all'] },
    { value: '2024', label: '2024' },
    { value: '2021', label: '2021' },
    { value: '2020', label: '2020' },
    { value: '2019', label: '2019' },
    { value: '2015', label: '2015' },
    { value: '2010', label: '2010' },
    { value: '2002', label: '2002' },
    { value: '1997', label: '1997' },
    { value: '1996', label: '1996' },
    { value: '1995', label: '1995' },
    { value: '1990', label: '1990' },
    { value: '1984', label: '1984' },
    { value: '1975', label: '1975' },
    { value: '1966', label: '1966' },
  ];

  useEffect(() => {
    fetchLaws();
  }, [selectedCategory, yearFilter]);

  const fetchLaws = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'all') {
        params.set('category', selectedCategory);
      }
      if (yearFilter) {
        params.set('year', yearFilter);
      }
      if (searchQuery) {
        params.set('q', searchQuery);
      }

      const res = await fetch(`/api/laws?${params.toString()}`);
      const data = await res.json();
      setLaws(data.laws || []);
    } catch (error) {
      console.error('Error fetching laws:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLaws();
  };

  const handleRead = (id: string) => {
    window.location.href = `/laws/${id}`;
  };

  const handleDownload = (id: string) => {
    window.location.href = `/api/laws/${id}/pdf`;
  };

  const getCategoryLabel = (key: string) => {
    const cat = categories.find((c) => c.key === key);
    return cat ? (language === 'ar' ? cat.labelAr : language === 'fr' ? cat.labelFr : cat.labelEn) : key;
  };

  const isNewLaw = (createdAt: string) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return new Date(createdAt) > thirtyDaysAgo;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <section className="bg-navy text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <BookOpen className="h-10 w-10 text-gold" />
            <h1 className="text-3xl font-bold font-cairo">{t['page.laws']}</h1>
          </div>
          <p className="text-slate-300">
            {language === 'ar'
              ? 'تصفح مجموعة شاملة من القوانين والتشريعات الجزائرية'
              : language === 'fr'
              ? 'Parcourez une collection complète de lois et règlements algériens'
              : 'Browse a comprehensive collection of Algerian laws and regulations'}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="font-semibold text-navy dark:text-white mb-4 flex items-center gap-2">
                <Search className="h-4 w-4" />
                {language === 'ar' ? 'الفلاتر' : language === 'fr' ? 'Filtres' : 'Filters'}
              </h3>

              <div className="space-y-4">
                <Select
                  label={t['filter.category']}
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  options={categoryOptions}
                />

                <Select
                  label={t['filter.year']}
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  options={yearOptions}
                />

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSelectedCategory('all');
                    setYearFilter('');
                    setSearchQuery('');
                  }}
                >
                  {t['filter.clear']}
                </Button>
              </div>

              {/* Premium Banner */}
              {!isPremium && (
                <div className="mt-6 p-4 bg-gold/10 rounded-lg border border-gold/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-gold" />
                    <span className="font-semibold text-navy">Premium</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                    {language === 'ar'
                      ? 'الوصول إلى جميع القوانين والمراسيم'
                      : language === 'fr'
                      ? "Accédez à toutes les lois et décrets"
                      : 'Access all laws and decrees'}
                  </p>
                  <Link href="/pricing">
                    <Button size="sm" variant="gold" className="w-full">
                      {t['btn.upgrade']}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-8">
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    placeholder={t['form.search']}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12"
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                  />
                </div>
                <Button type="submit" size="lg" className="h-12">
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </form>

            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-slate-500">
                {laws.length} {language === 'ar' ? 'نتيجة' : language === 'fr' ? 'résultats' : 'results'}
              </p>
              {selectedCategory !== 'all' && (
                <span className="px-3 py-1 bg-navy/10 text-navy rounded-full text-sm">
                  {getCategoryLabel(selectedCategory)}
                </span>
              )}
            </div>

            {/* Laws Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-slate-200 rounded w-3/4" />
                      <div className="h-4 bg-slate-200 rounded w-1/2 mt-2" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 bg-slate-200 rounded w-full" />
                      <div className="h-4 bg-slate-200 rounded w-2/3 mt-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : laws.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400">
                    {t['page.noResults']}
                  </h3>
                  <p className="text-slate-500 mt-2">
                    {language === 'ar'
                      ? 'حاول تعديل الفلاتر أو البحث بكلمات مختلفة'
                      : language === 'fr'
                      ? 'Essayez de modifier les filtres ou de rechercher avec d\'autres mots'
                      : 'Try modifying filters or searching with different keywords'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {laws.map((law) => (
                  <LawCard
                    key={law.id}
                    id={law.id}
                    titleAr={law.titleAr}
                    titleFr={law.titleFr}
                    titleEn={law.titleEn}
                    category={law.category}
                    referenceNumber={law.referenceNumber}
                    year={law.year}
                    publicationDate={law.publicationDate}
                    descriptionAr={law.descriptionAr}
                    descriptionFr={law.descriptionFr}
                    descriptionEn={law.descriptionEn}
                    isNew={isNewLaw(law.createdAt)}
                    isPremium={law.isPremium}
                    language={language}
                    onRead={handleRead}
                    onDownload={handleDownload}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LawsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-navy border-t-transparent rounded-full" />
      </div>
    }>
      <LawsContent />
    </Suspense>
  );
}
