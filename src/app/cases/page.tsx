'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSession } from 'next-auth/react';
import {
  Briefcase,
  Plus,
  Archive,
  Trash2,
  FileText,
  Calendar,
  Edit,
  Shield,
  X,
} from 'lucide-react';

interface Case {
  id: string;
  name: string;
  description: string | null;
  archived: boolean;
  createdAt: string;
  _count?: {
    notes: number;
    caseLaws: number;
  };
}

export default function CasesPage() {
  const router = useRouter();
  const { language, translations: t } = useLanguage();
  const { data: session, status } = useSession();
  const isPremium = session?.user?.plan === 'PRO';

  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newCaseName, setNewCaseName] = useState('');
  const [newCaseDesc, setNewCaseDesc] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login?callbackUrl=/cases');
      return;
    }
    fetchCases();
  }, [session, status]);

  const fetchCases = async () => {
    try {
      const res = await fetch('/api/cases');
      const data = await res.json();
      setCases(data.cases || []);
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaseName.trim()) return;

    try {
      const res = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCaseName,
          description: newCaseDesc,
        }),
      });

      if (res.ok) {
        setShowModal(false);
        setNewCaseName('');
        setNewCaseDesc('');
        fetchCases();
      }
    } catch (error) {
      console.error('Error creating case:', error);
    }
  };

  const handleDeleteCase = async (id: string) => {
    if (!confirm('Are you sure you want to delete this case?')) return;

    try {
      await fetch(`/api/cases/${id}`, { method: 'DELETE' });
      fetchCases();
    } catch (error) {
      console.error('Error deleting case:', error);
    }
  };

  const handleArchiveCase = async (id: string) => {
    try {
      await fetch(`/api/cases/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archived: true }),
      });
      fetchCases();
    } catch (error) {
      console.error('Error archiving case:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-navy border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isPremium) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="py-12">
            <Shield className="h-20 w-20 text-gold mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-navy dark:text-white mb-4">
              {t['premium.required']}
            </h2>
            <p className="text-slate-500 mb-8">{t['premium.locked']}</p>
            <Link href="/pricing">
              <Button variant="gold" size="lg" className="px-8">
                {t['btn.upgrade']}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const activeCases = cases.filter((c) => !c.archived);
  const archivedCases = cases.filter((c) => c.archived);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <section className="bg-navy text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Briefcase className="h-10 w-10 text-gold" />
              <div>
                <h1 className="text-2xl font-bold font-cairo">{t['page.caseManager']}</h1>
                <p className="text-slate-300">
                  {language === 'ar'
                    ? 'نظم ملفاتك القانونية'
                    : language === 'fr'
                    ? 'Organisez vos dossiers juridiques'
                    : 'Organize your legal cases'}
                </p>
              </div>
            </div>
            <Button variant="gold" onClick={() => setShowModal(true)}>
              <Plus className="h-5 w-5" />
              {t['cases.newCase']}
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Active Cases */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-navy dark:text-white mb-4 flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            {t['cases.myCases']} ({activeCases.length})
          </h2>

          {activeCases.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Briefcase className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400">
                  {t['cases.noCases']}
                </h3>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setShowModal(true)}
                >
                  <Plus className="h-4 w-4" />
                  {t['cases.newCase']}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeCases.map((caseItem) => (
                <Card key={caseItem.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg line-clamp-1">{caseItem.name}</CardTitle>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleArchiveCase(caseItem.id)}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                          title={t['btn.archive']}
                        >
                          <Archive className="h-4 w-4 text-slate-500" />
                        </button>
                        <button
                          onClick={() => handleDeleteCase(caseItem.id)}
                          className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                          title={t['btn.delete']}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {caseItem.description && (
                      <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                        {caseItem.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(caseItem.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {caseItem._count?.notes || 0} {t['form.note']}
                      </span>
                    </div>
                    <Link href={`/assistant?case=${caseItem.id}`}>
                      <Button variant="outline" className="w-full" size="sm">
                        <Edit className="h-4 w-4" />
                        {language === 'ar' ? 'فتح الملف' : language === 'fr' ? 'Ouvrir' : 'Open'}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Archived Cases */}
        {archivedCases.length > 0 && (
          <section>
            <button
              onClick={() => setShowArchived(!showArchived)}
              className="flex items-center gap-2 text-lg font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-4"
            >
              <Archive className="h-5 w-5" />
              {t['cases.archived']} ({archivedCases.length})
            </button>

            {showArchived && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {archivedCases.map((caseItem) => (
                  <Card key={caseItem.id} className="opacity-60">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg line-clamp-1">{caseItem.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-500 mb-4">
                        {caseItem.description || 'No description'}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCase(caseItem.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      {/* Create Case Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>{t['cases.newCase']}</CardTitle>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateCase} className="space-y-4">
                <Input
                  label={t['form.caseName']}
                  value={newCaseName}
                  onChange={(e) => setNewCaseName(e.target.value)}
                  placeholder={language === 'ar' ? 'قضية نزاع عقاري' : 'Affaire immobilier'}
                  required
                />
                <Textarea
                  label={t['form.caseDesc']}
                  value={newCaseDesc}
                  onChange={(e) => setNewCaseDesc(e.target.value)}
                  placeholder={language === 'ar' ? 'وصف الملف...' : 'Description du dossier...'}
                />
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowModal(false)}
                  >
                    {t['btn.cancel']}
                  </Button>
                  <Button type="submit" className="flex-1">
                    {t['btn.create']}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
