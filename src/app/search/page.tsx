'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { LawCard } from '@/components/ui/law-card';
import { Search, FileText, ArrowRight } from 'lucide-react';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const { language, translations: t } = useLanguage();

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Array<{
    id: string;
    titleAr: string;
    titleFr: string;
    category: string;
    referenceNumber: string;
    year: number;
  }>>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categoryOptions = [
    { value: 'all', label: 'All' },
    { value: 'دستور', label: 'دستور' },
    { value: 'إجراءات قضائية إدارية', label: 'إجراءات قضائية' },
    { value: 'وظيف عمومي', label: 'وظيف عمومي' },
    { value: 'إدارة محلية', label: 'إدارة محلية' },
    { value: 'صفقات عمومية', label: 'صفقات عمومية' },
    { value: 'مالية عامة', label: 'مالية عامة' },
    { value: 'قوانين مرجعية', label: 'قوانين مرجعية' },
  ];

  useEffect(() => {
    if (initialQuery) {
      handleSearch();
    }
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const params = new URLSearchParams();
      params.set('q', query);
      if (categoryFilter && categoryFilter !== 'all') {
        params.set('category', categoryFilter);
      }

      const res = await fetch(`/api/search?${params.toString()}`);
      const data = await res.json();
      setResults(data.laws || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl lg:text-4xl font-bold text-navy dark:text-white mb-8">
          {language === 'ar' ? 'البحث في القوانين' : language === 'fr' ? 'Recherche juridique' : 'Legal Search'}
        </h1>

        <form onSubmit={handleSearch} className="max-w-3xl">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder={language === 'ar' ? 'ابحث...' : language === 'fr' ? 'Rechercher...' : 'Search...'}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-14 text-lg bg-white"
              />
            </div>
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              options={categoryOptions}
              className="w-48"
            />
            <Button type="submit" size="lg" className="h-14 px-8">
              <Search className="h-5 w-5 mr-2" />
              {language === 'ar' ? 'بحث' : language === 'fr' ? 'Rechercher' : 'Search'}
            </Button>
          </div>
        </form>

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto"></div>
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">
              {language === 'ar' ? 'لم يتم العثور على نتائج' : language === 'fr' ? 'Aucun résultat trouvé' : 'No results found'}
            </p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="grid gap-4 mt-8">
            {results.map((law) => (
              <Link key={law.id} href={`/laws/${law.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-navy mb-2">
                      {language === 'ar' ? law.titleAr : law.titleFr}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {law.referenceNumber} - {law.year} - {law.category}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}