'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  BookOpen,
  Briefcase,
  FileText,
  Clock,
  ArrowRight,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

interface Stats {
  totalLaws: number;
  myCases: number;
  savedNotes: number;
}

interface RecentActivity {
  id: string;
  type: 'law_viewed' | 'case_created' | 'search_performed';
  description: string;
  timestamp: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { language, translations: t } = useLanguage();
  const { data: session, status } = useSession();
  const isPremium = session?.user?.plan === 'PRO';

  const [stats, setStats] = useState<Stats>({ totalLaws: 0, myCases: 0, savedNotes: 0 });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login?callbackUrl=/dashboard');
      return;
    }
    fetchDashboardData();
  }, [session, status]);

  const fetchDashboardData = async () => {
    try {
      const [lawsRes, casesRes] = await Promise.all([
        fetch('/api/laws?limit=1'),
        fetch('/api/cases'),
      ]);

      const lawsData = await lawsRes.json();
      const casesData = await casesRes.json();

      setStats({
        totalLaws: lawsData.pagination?.total || 16,
        myCases: casesData.cases?.length || 0,
        savedNotes: casesData.cases?.reduce((acc: number, c: { _count?: { notes: number } }) => acc + (c._count?.notes || 0), 0) || 0,
      });

      setRecentActivity([
        {
          id: '1',
          type: 'law_viewed',
          description: language === 'ar' ? 'تم تصفح القانون المدني' : 'Consultation du Code Civil',
          timestamp: new Date().toISOString(),
        },
        {
          id: '2',
          type: 'search_performed',
          description: language === 'ar' ? 'بحث عن: نزاع عقاري' : 'Recherche: contentieux immobilier',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-navy border-t-transparent rounded-full" />
      </div>
    );
  }

  const statCards = [
    {
      title: t['dash.totalLaws'],
      value: stats.totalLaws,
      icon: BookOpen,
      color: 'text-navy',
      bg: 'bg-navy/10',
      href: '/laws',
    },
    {
      title: t['dash.myCases'],
      value: stats.myCases,
      icon: Briefcase,
      color: 'text-gold',
      bg: 'bg-gold/10',
      href: '/cases',
    },
    {
      title: t['dash.savedNotes'],
      value: stats.savedNotes,
      icon: FileText,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
      href: '/cases',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <section className="bg-navy text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-xl">
              <LayoutDashboard className="h-8 w-8 text-gold" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-cairo">
                {t['dash.welcome']}, {session?.user?.name}
              </h1>
              <p className="text-slate-300">
                {language === 'ar'
                  ? 'إليك ملخص نشاطك'
                  : language === 'fr'
                  ? 'Voici un résumé de votre activité'
                  : 'Here is a summary of your activity'}
              </p>
            </div>
            {isPremium && (
              <div className="mr-auto flex items-center gap-2 px-4 py-2 bg-gold/20 rounded-full">
                <Sparkles className="h-5 w-5 text-gold" />
                <span className="text-sm font-medium text-gold">Premium</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.title} href={stat.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-500 mb-1">{stat.title}</p>
                        <p className="text-3xl font-bold">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-xl ${stat.bg}`}>
                        <Icon className={`h-8 w-8 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle>{t['dash.recentActivity']}</CardTitle>
                <Button variant="ghost" size="sm">
                  {t['dash.viewAll']}
                </Button>
              </CardHeader>
              <CardContent>
                {recentActivity.length === 0 ? (
                  <p className="text-center text-slate-500 py-8">
                    {language === 'ar'
                      ? 'لا يوجد نشاط حديث'
                      : language === 'fr'
                      ? 'Aucune activité récente'
                      : 'No recent activity'}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <div className="p-2 bg-navy/10 rounded-lg">
                          <Clock className="h-5 w-5 text-navy" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.description}</p>
                          <p className="text-xs text-slate-500">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>{t['dash.quickActions']}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/laws" className="block">
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      {t['nav.laws']}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/search" className="block">
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      {t['nav.search']}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                {isPremium ? (
                  <>
                    <Link href="/assistant" className="block">
                      <Button variant="outline" className="w-full justify-between">
                        <span className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4" />
                          {t['nav.assistant']}
                        </span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/cases" className="block">
                      <Button variant="outline" className="w-full justify-between">
                        <span className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          {t['nav.cases']}
                        </span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Link href="/pricing" className="block">
                    <Button variant="gold" className="w-full">
                      <Sparkles className="h-4 w-4" />
                      {t['btn.upgrade']}
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>

            {/* Profile Summary */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>{t['nav.profile']}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-navy/10 rounded-full flex items-center justify-center">
                      <span className="text-lg font-semibold text-navy">
                        {session?.user?.name?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{session?.user?.name}</p>
                      <p className="text-sm text-slate-500">{session?.user?.email}</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-slate-500">
                      {language === 'ar' ? 'المهنة' : language === 'fr' ? 'Profession' : 'Profession'}
                    </p>
                    <p className="font-medium">{session?.user?.profession}</p>
                  </div>
                  <Link href="/profile" className="block pt-2">
                    <Button variant="outline" size="sm" className="w-full">
                      {t['btn.edit']} {t['nav.profile']}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
