'use client';

/**
 * © 2026 Project of HOUSSEM ABDALLAH MERAMRIA
 * MeraLaw - Admin Dashboard for Subscription Management
 */

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, Clock, Users, CreditCard, TrendingUp } from 'lucide-react';

interface PendingUser {
  id: string;
  name: string;
  email: string;
  profession: string;
  paymentReceiptUrl: string | null;
  createdAt: Date;
}

export default function AdminDashboard() {
  const { language } = useLanguage();
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pro: 0, pending: 0, revenue: 0 });

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const res = await fetch('/api/admin/activate');
      const data = await res.json();
      setPendingUsers(data.pendingUsers || []);
    } catch (error) {
      console.error('Error fetching pending users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (userId: string) => {
    try {
      const res = await fetch('/api/admin/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        setPendingUsers(pendingUsers.filter(u => u.id !== userId));
      }
    } catch (error) {
      console.error('Error activating user:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-navy rounded-xl">
            <TrendingUp className="h-8 w-8 text-gold" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-navy dark:text-white">
              {language === 'ar' ? 'لوحة تحكم المشرف' : language === 'fr' ? 'Tableau de bord Admin' : 'Admin Dashboard'}
            </h1>
            <p className="text-slate-500">MeraLaw by Prof. HOUSSEM ABDALLAH MERAMRIA</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-navy dark:text-white">156</p>
                  <p className="text-sm text-slate-500">
                    {language === 'ar' ? 'إجمالي المستخدمين' : language === 'fr' ? 'Total utilisateurs' : 'Total Users'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gold/20 rounded-full">
                  <CreditCard className="h-6 w-6 text-gold-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-navy dark:text-white">23</p>
                  <p className="text-sm text-slate-500">PRO</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                  <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-navy dark:text-white">5</p>
                  <p className="text-sm text-slate-500">
                    {language === 'ar' ? 'في انتظار الدفع' : language === 'fr' ? 'En attente' : 'Pending Payment'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-navy dark:text-white">8,500 DZD</p>
                  <p className="text-sm text-slate-500">
                    {language === 'ar' ? 'إيرادات الشهر' : language === 'fr' ? 'Revenus du mois' : 'Monthly Revenue'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Payments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              {language === 'ar' ? 'في انتظار التفعيل' : language === 'fr' ? 'En attente d\'activation' : 'Pending Activation'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-slate-500">Loading...</div>
            ) : pendingUsers.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                {language === 'ar' ? 'لا توجد طلبات في الانتظار' : language === 'fr' ? 'Aucune demande en attente' : 'No pending requests'}
              </div>
            ) : (
              <div className="space-y-4">
                {pendingUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <div>
                      <p className="font-medium text-navy dark:text-white">{user.name}</p>
                      <p className="text-sm text-slate-500">{user.email}</p>
                      <p className="text-xs text-slate-400">{user.profession}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleActivate(user.id)} size="sm" variant="gold">
                        <Check className="h-4 w-4 mr-1" />
                        {language === 'ar' ? 'تفعيل' : language === 'fr' ? 'Activer' : 'Activate'}
                      </Button>
                      <Button size="sm" variant="outline">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'ar' ? 'إجراءات سريعة' : language === 'fr' ? 'Actions rapides' : 'Quick Actions'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                {language === 'ar' ? 'إدارة المستخدمين' : language === 'fr' ? 'Gérer les utilisateurs' : 'Manage Users'}
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <CreditCard className="h-4 w-4 mr-2" />
                {language === 'ar' ? 'عرض الاشتراكات النشطة' : language === 'fr' ? 'Voir les abonnements actifs' : 'View Active Subscriptions'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}