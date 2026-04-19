'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Users, FileText, Plus, Trash2, Edit, Search, CreditCard, 
  CheckCircle, XCircle, AlertCircle, Save, LogOut, LayoutDashboard,
  Settings, Shield, Database, Calendar, Link as LinkIcon, BookOpen
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  profession: string;
  plan: string;
  isPaymentPending: boolean;
  subscriptionEndDate: Date | null;
  createdAt: Date;
}

interface Law {
  id: string;
  titleFr: string;
  titleAr: string;
  titleEn: string;
  category: string;
  lawType: string;
  referenceNumber: string;
  year: number;
  publicationDate: string;
  journalOfficiel: string;
  descriptionFr: string;
  descriptionAr: string;
  contentFr: string;
  contentAr: string;
  sourceUrl: string | null;
  pdfUrlAr: string | null;
  pdfUrlFr: string | null;
  isPremium: boolean;
  isVerified: boolean;
}

type Tab = 'dashboard' | 'users' | 'laws' | 'add-law';

interface Toast {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({ totalUsers: 0, proUsers: 0, freeUsers: 0, totalLaws: 0 });
  const [users, setUsers] = useState<User[]>([]);
  const [laws, setLaws] = useState<Law[]>([]);
  const [toast, setToast] = useState<Toast>({ show: false, message: '', type: 'success' });

  const [lawForm, setLawForm] = useState({
    titleFr: '', titleAr: '', titleEn: '', category: 'إداري', lawType: 'loi',
    referenceNumber: '', year: new Date().getFullYear().toString(),
    publicationDate: new Date().toISOString().split('T')[0], journalOfficiel: '',
    descriptionFr: '', descriptionAr: '', contentFr: '', contentAr: '', 
    sourceUrl: '', pdfUrlAr: '', pdfUrlFr: '',
    jorfNumber: '', jorfYear: new Date().getFullYear().toString(),
    isPremium: false, isVerified: true,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      if (session?.user?.plan !== 'ADMIN') {
        router.push('/dashboard');
      } else {
        fetchData();
      }
    }
  }, [status, session]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, lawsRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/laws'),
      ]);
      const usersData = await usersRes.json();
      const lawsData = await lawsRes.json();
      
      setUsers(usersData.users || []);
      setLaws(lawsData.laws || []);
      setStats({
        totalUsers: usersData.stats?.total || 0,
        proUsers: usersData.stats?.pro || 0,
        freeUsers: usersData.stats?.free || 0,
        totalLaws: lawsData.stats?.total || 0,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradeUser = async (userId: string, newPlan: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, plan: newPlan }),
      });
      if (res.ok) {
        showToast(
          newPlan === 'PRO' 
            ? (language === 'ar' ? 'تم ترقية المستخدم بنجاح!' : 'User upgraded to PRO!')
            : (language === 'ar' ? 'تم إلغاء الاشتراك!' : 'Subscription cancelled!'),
          'success'
        );
        fetchData();
      }
    } catch (error) {
      showToast(language === 'ar' ? 'حدث خطأ' : 'Error occurred', 'error');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm(language === 'ar' ? 'حذف هذا المستخدم؟' : 'Delete this user?')) return;
    try {
      const res = await fetch(`/api/admin/users?id=${userId}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(language === 'ar' ? 'تم الحذف!' : 'User deleted!', 'success');
        fetchData();
      }
    } catch (error) {
      showToast(language === 'ar' ? 'حدث خطأ' : 'Error occurred', 'error');
    }
  };

  const handleDeleteLaw = async (lawId: string) => {
    if (!confirm(language === 'ar' ? 'حذف هذا القانون؟' : 'Delete this law?')) return;
    try {
      const res = await fetch(`/api/admin/laws?id=${lawId}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(language === 'ar' ? 'تم حذف القانون!' : 'Law deleted!', 'success');
        fetchData();
      }
    } catch (error) {
      showToast(language === 'ar' ? 'حدث خطأ' : 'Error occurred', 'error');
    }
  };

  const handleAddLaw = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/laws', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lawForm),
      });
      if (res.ok) {
        showToast(language === 'ar' ? 'تمت إضافة القانون!' : 'Law added successfully!', 'success');
        setLawForm({
          titleFr: '', titleAr: '', titleEn: '', category: 'إداري', lawType: 'loi',
          referenceNumber: '', year: new Date().getFullYear().toString(),
          publicationDate: new Date().toISOString().split('T')[0], journalOfficiel: '',
          descriptionFr: '', descriptionAr: '', contentFr: '', contentAr: '', 
          sourceUrl: '', pdfUrlAr: '', pdfUrlFr: '',
          jorfNumber: '', jorfYear: new Date().getFullYear().toString(),
          isPremium: false, isVerified: true,
        });
        setActiveTab('laws');
        fetchData();
      }
    } catch (error) {
      showToast(language === 'ar' ? 'حدث خطأ في الإضافة' : 'Error adding law', 'error');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLaws = laws.filter(l =>
    l.titleFr?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.referenceNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (status === 'loading' || loading && status === 'authenticated') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (session?.user?.plan !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        } text-white`}>
          {toast.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500 rounded-lg">
                <Shield className="h-6 w-6 text-slate-900" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">MeraLaw Admin</h1>
                <p className="text-sm text-slate-400">Prof. HOUSSEM ABDALLAH MERAMRIA</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm flex items-center gap-1">
                <Shield className="h-4 w-4" />
                ADMIN
              </span>
              <Button variant="outline" size="sm" onClick={() => router.push('/dashboard')}>
                <LogOut className="h-4 w-4 mr-1" />
                {language === 'ar' ? 'خروج' : 'Logout'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex gap-1 overflow-x-auto">
            {[
              { id: 'dashboard', label: language === 'ar' ? 'لوحة القيادة' : 'Dashboard', icon: LayoutDashboard },
              { id: 'users', label: language === 'ar' ? 'المستخدمين' : 'Users', icon: Users },
              { id: 'laws', label: language === 'ar' ? 'القوانين' : 'Laws', icon: FileText },
              { id: 'add-law', label: language === 'ar' ? 'إضافة قانون' : 'Add Law', icon: Plus },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`px-4 py-3 flex items-center gap-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-amber-500 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              placeholder={language === 'ar' ? 'بحث...' : 'Search...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/20 rounded-full">
                    <Users className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                    <p className="text-sm text-slate-400">{language === 'ar' ? 'إجمالي المستخدمين' : 'Total Users'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-500/20 rounded-full">
                    <CreditCard className="h-6 w-6 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white">{stats.proUsers}</p>
                    <p className="text-sm text-slate-400">PRO {language === 'ar' ? 'مشتركين' : 'Subscribers'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500/20 rounded-full">
                    <FileText className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white">{stats.totalLaws}</p>
                    <p className="text-sm text-slate-400">{language === 'ar' ? 'القوانين' : 'Laws'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/20 rounded-full">
                    <Database className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white">{stats.freeUsers}</p>
                    <p className="text-sm text-slate-400">{language === 'ar' ? 'مستخدمين مجانيين' : 'Free Users'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="border-b border-slate-800">
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5" />
                {language === 'ar' ? 'إدارة المستخدمين' : 'User Management'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>{language === 'ar' ? 'لا يوجد مستخدمين' : 'No users found'}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 text-sm">
                        <th className="text-right p-3">{language === 'ar' ? 'الاسم' : 'Name'}</th>
                        <th className="text-right p-3">{language === 'ar' ? 'البر��د' : 'Email'}</th>
                        <th className="text-right p-3">{language === 'ar' ? 'المهنة' : 'Profession'}</th>
                        <th className="text-right p-3">{language === 'ar' ? 'ال套餐' : 'Plan'}</th>
                        <th className="text-right p-3">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                        <th className="text-right p-3">{language === 'ar' ? 'إجراءات' : 'Actions'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                          <td className="p-3 text-white">{user.name}</td>
                          <td className="p-3 text-slate-300">{user.email}</td>
                          <td className="p-3 text-slate-300">{user.profession}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded text-xs ${
                              user.plan === 'PRO' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700 text-slate-300'
                            }`}>
                              {user.plan}
                            </span>
                          </td>
                          <td className="p-3">
                            {user.isPaymentPending ? (
                              <span className="text-orange-400 text-xs flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {language === 'ar' ? 'معلق' : 'Pending'}
                              </span>
                            ) : user.plan === 'PRO' ? (
                              <span className="text-green-400 text-xs flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                {language === 'ar' ? 'نشط' : 'Active'}
                              </span>
                            ) : (
                              <span className="text-slate-500 text-xs">
                                {language === 'ar' ? 'مجاني' : 'Free'}
                              </span>
                            )}
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              {user.plan === 'FREE' || user.plan === 'ADMIN' ? (
                                user.plan !== 'ADMIN' && (
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleUpgradeUser(user.id, 'PRO')}
                                    className="bg-amber-500 hover:bg-amber-600 text-slate-900"
                                  >
                                    <CreditCard className="h-4 w-4" />
                                  </Button>
                                )
                              ) : (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleUpgradeUser(user.id, 'FREE')}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              )}
                              {user.plan !== 'ADMIN' && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="text-red-400 hover:text-red-300"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Laws Tab */}
        {activeTab === 'laws' && (
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="border-b border-slate-800">
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {language === 'ar' ? 'إدارة القوانين' : 'Law Management'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredLaws.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>{language === 'ar' ? 'لا يوجد قوانين' : 'No laws found'}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 text-sm">
                        <th className="text-right p-3">{language === 'ar' ? 'العنوان' : 'Title'}</th>
                        <th className="text-right p-3">{language === 'ar' ? 'المرجع' : 'Reference'}</th>
                        <th className="text-right p-3">{language === 'ar' ? 'النوع' : 'Type'}</th>
                        <th className="text-right p-3">{language === 'ar' ? 'السنة' : 'Year'}</th>
                        <th className="text-right p-3">{language === 'ar' ? 'إجراءات' : 'Actions'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLaws.map((law) => (
                        <tr key={law.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                          <td className="p-3 text-white">{law.titleFr}</td>
                          <td className="p-3 text-slate-300">{law.referenceNumber}</td>
                          <td className="p-3">
                            <span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400">
                              {law.lawType?.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-3 text-slate-300">{law.year}</td>
                          <td className="p-3">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDeleteLaw(law.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Add Law Tab */}
        {activeTab === 'add-law' && (
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="border-b border-slate-800">
              <CardTitle className="text-white flex items-center gap-2">
                <Plus className="h-5 w-5" />
                {language === 'ar' ? 'إضافة قانون جديد' : 'Add New Law'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddLaw} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      {language === 'ar' ? 'العنوان بالفرنسية *' : 'Title (French) *'}
                    </label>
                    <Input
                      value={lawForm.titleFr}
                      onChange={(e) => setLawForm({ ...lawForm, titleFr: e.target.value })}
                      required
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      {language === 'ar' ? 'العنوان بالعربية *' : 'Title (Arabic) *'}
                    </label>
                    <Input
                      value={lawForm.titleAr}
                      onChange={(e) => setLawForm({ ...lawForm, titleAr: e.target.value })}
                      required
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      {language === 'ar' ? 'المرجع *' : 'Reference *'}
                    </label>
                    <Input
                      value={lawForm.referenceNumber}
                      onChange={(e) => setLawForm({ ...lawForm, referenceNumber: e.target.value })}
                      placeholder="LOI-2024-001"
                      required
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      {language === 'ar' ? 'السنة *' : 'Year *'}
                    </label>
                    <Input
                      type="number"
                      value={lawForm.year}
                      onChange={(e) => setLawForm({ ...lawForm, year: e.target.value })}
                      required
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      {language === 'ar' ? 'الفئة' : 'Category'}
                    </label>
                    <select
                      className="w-full p-2 bg-slate-800 border-slate-700 text-white rounded"
                      value={lawForm.category}
                      onChange={(e) => setLawForm({ ...lawForm, category: e.target.value })}
                    >
                      <option value="إداري">{language === 'ar' ? 'إداري' : 'Administrative'}</option>
                      <option value="مدني">{language === 'ar' ? 'مدني' : 'Civil'}</option>
                      <option value="جنائي">{language === 'ar' ? 'جنائي' : 'Criminal'}</option>
                      <option value="تجاري">{language === 'ar' ? 'تجاري' : 'Commercial'}</option>
                      <option value="شغل">{language === 'ar' ? 'شغل' : 'Labor'}</option>
                      <option value="أسري">{language === 'ar' ? 'أسري' : 'Family'}</option>
                      <option value="ضريبي">{language === 'ar' ? 'ضريبي' : 'Tax'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      {language === 'ar' ? 'النوع' : 'Type'}
                    </label>
                    <select
                      className="w-full p-2 bg-slate-800 border-slate-700 text-white rounded"
                      value={lawForm.lawType}
                      onChange={(e) => setLawForm({ ...lawForm, lawType: e.target.value })}
                    >
                      <option value="loi">{language === 'ar' ? 'قانون' : 'Law'}</option>
                      <option value="decret">{language === 'ar' ? 'مرسوم' : 'Decree'}</option>
                      <option value="circulaire">{language === 'ar' ? 'منشور' : 'Circular'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      {language === 'ar' ? 'تاريخ النشر' : 'Publication Date'}
                    </label>
                    <Input
                      type="date"
                      value={lawForm.publicationDate}
                      onChange={(e) => setLawForm({ ...lawForm, publicationDate: e.target.value })}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      {language === 'ar' ? 'الجريدة الرسمية' : 'Official Gazette'}
                    </label>
                    <Input
                      value={lawForm.journalOfficiel}
                      onChange={(e) => setLawForm({ ...lawForm, journalOfficiel: e.target.value })}
                      placeholder="الجريدة الرسمية عدد 50"
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      {language === 'ar' ? 'رابط المصدر (JORADP)' : 'Source Link (JORADP)'}
                    </label>
                    <Input
                      type="url"
                      value={lawForm.sourceUrl}
                      onChange={(e) => setLawForm({ ...lawForm, sourceUrl: e.target.value })}
                      placeholder="https://www.joradp.dz/..."
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      {language === 'ar' ? 'الوصف' : 'Description'}
                    </label>
                    <textarea
                      className="w-full p-2 bg-slate-800 border-slate-700 text-white rounded"
                      rows={3}
                      value={lawForm.descriptionFr}
                      onChange={(e) => setLawForm({ ...lawForm, descriptionFr: e.target.value })}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900">
                  <Save className="h-4 w-4 mr-2" />
                  {language === 'ar' ? 'حفظ القانون' : 'Save Law'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}