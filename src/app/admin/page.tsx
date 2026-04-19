'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Check, X, Users, CreditCard, FileText, Plus, Trash2, Edit, Eye, Search, Trash, UserCheck, UserX } from 'lucide-react';

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
  category: string;
  lawType: string;
  referenceNumber: string;
  year: number;
  isPremium: boolean;
  isVerified: boolean;
  sourceUrl: string | null;
}

type Tab = 'users' | 'laws' | 'add-law';

export default function AdminDashboard() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [laws, setLaws] = useState<Law[]>([]);
  const [stats, setStats] = useState({ total: 0, pro: 0, free: 0, pending: 0, lawsTotal: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [lawForm, setLawForm] = useState({
    titleFr: '', titleAr: '', titleEn: '', category: 'إداري', lawType: 'loi',
    referenceNumber: '', year: new Date().getFullYear().toString(),
    publicationDate: '', journalOfficiel: '', descriptionFr: '', descriptionAr: '',
    contentFr: '', contentAr: '', source: '', sourceUrl: '',
    jorfNumber: '', jorfYear: '', isPremium: false, isVerified: true,
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users') {
        const res = await fetch('/api/admin/users');
        const data = await res.json();
        setUsers(data.users || []);
        setStats(prev => ({ ...prev, total: data.stats.total, pro: data.stats.pro, free: data.stats.free, pending: data.stats.pending }));
      } else if (activeTab === 'laws') {
        const res = await fetch('/api/admin/laws');
        const data = await res.json();
        setLaws(data.laws || []);
        setStats(prev => ({ ...prev, lawsTotal: data.stats.total }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (userId: string, newPlan: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, plan: newPlan }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا المستخدم؟' : language === 'fr' ? 'Êtes-vous sûr de vouloir supprimer cet utilisateur?' : 'Are you sure you want to delete this user?')) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/users?id=${userId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleDeleteLaw = async (lawId: string) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا القانون؟' : language === 'fr' ? 'Êtes-vous sûr de vouloir supprimer cette loi?' : 'Are you sure you want to delete this law?')) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/laws?id=${lawId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting law:', error);
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
        alert(language === 'ar' ? 'تمت إضافة القانون بنجاح!' : language === 'fr' ? 'Loi ajoutée avec succès!' : 'Law added successfully!');
        setLawForm({
          titleFr: '', titleAr: '', titleEn: '', category: 'إداري', lawType: 'loi',
          referenceNumber: '', year: new Date().getFullYear().toString(),
          publicationDate: '', journalOfficiel: '', descriptionFr: '', descriptionAr: '',
          contentFr: '', contentAr: '', source: '', sourceUrl: '',
          jorfNumber: '', jorfYear: '', isPremium: false, isVerified: true,
        });
        setActiveTab('laws');
      }
    } catch (error) {
      console.error('Error adding law:', error);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLaws = laws.filter(l =>
    l.titleFr.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [
    { value: 'إداري', label: language === 'ar' ? 'إداري' : language === 'fr' ? 'Administratif' : 'Administrative' },
    { value: 'مدني', label: language === 'ar' ? 'مدني' : language === 'fr' ? 'Civil' : 'Civil' },
    { value: 'جنائي', label: language === 'ar' ? 'جنائي' : language === 'fr' ? 'Pénal' : 'Criminal' },
    { value: 'تجاري', label: language === 'ar' ? 'تجاري' : language === 'fr' ? 'Commercial' : 'Commercial' },
    { value: 'شغل', label: language === 'ar' ? 'شغل' : language === 'fr' ? 'Travail' : 'Labor' },
    { value: 'أسري', label: language === 'ar' ? 'أسري' : language === 'fr' ? 'Famille' : 'Family' },
    { value: 'ضريبي', label: language === 'ar' ? 'ضريبي' : language === 'fr' ? 'Fiscal' : 'Tax' },
  ];

  const lawTypes = [
    { value: 'loi', label: language === 'ar' ? 'قانون' : language === 'fr' ? 'Loi' : 'Law' },
    { value: 'decret', label: language === 'ar' ? 'مرسوم' : language === 'fr' ? 'Décret' : 'Decree' },
    { value: 'circulaire', label: language === 'ar' ? 'منشور' : language === 'fr' ? 'Circulaire' : 'Circular' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-navy rounded-xl">
            <CreditCard className="h-8 w-8 text-gold" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-navy dark:text-white">
              {language === 'ar' ? 'لوحة تحكم المشرف' : language === 'fr' ? 'Tableau de bord Admin' : 'Admin Dashboard'}
            </h1>
            <p className="text-slate-500">MeraLaw by Prof. HOUSSEM ABDALLAH MERAMRIA</p>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className={`cursor-pointer ${activeTab === 'users' ? 'ring-2 ring-navy rounded-lg' : ''}`} onClick={() => setActiveTab('users')}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-navy" />
                  <div>
                    <p className="font-bold text-navy">{stats.total}</p>
                    <p className="text-xs text-slate-500">{language === 'ar' ? 'المستخدمين' : language === 'fr' ? 'Utilisateurs' : 'Users'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className={`cursor-pointer ${activeTab === 'laws' ? 'ring-2 ring-navy rounded-lg' : ''}`} onClick={() => setActiveTab('laws')}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-navy" />
                  <div>
                    <p className="font-bold text-navy">{stats.lawsTotal}</p>
                    <p className="text-xs text-slate-500">{language === 'ar' ? 'القوانين' : language === 'fr' ? 'Lois' : 'Laws'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className={`cursor-pointer ${activeTab === 'add-law' ? 'ring-2 ring-navy rounded-lg' : ''}`} onClick={() => setActiveTab('add-law')}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Plus className="h-5 w-5 text-navy" />
                  <div>
                    <p className="font-bold text-navy">+</p>
                    <p className="text-xs text-slate-500">{language === 'ar' ? 'إضافة' : language === 'fr' ? 'Ajouter' : 'Add'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-gold" />
                  <div>
                    <p className="font-bold text-navy">{stats.pro}</p>
                    <p className="text-xs text-slate-500">PRO</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mb-4">
          <Input
            placeholder={language === 'ar' ? ' بحث...' : language === 'fr' ? 'Rechercher...' : 'Search...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        {activeTab === 'users' && (
          <Card>
            <CardHeader>
              <CardTitle>{language === 'ar' ? 'المستخدمين' : language === 'fr' ? 'Gestion des utilisateurs' : 'User Management'}</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="animate-pulse space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-12 bg-slate-200 rounded" />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-right p-3">{language === 'ar' ? 'الاسم' : language === 'fr' ? 'Nom' : 'Name'}</th>
                        <th className="text-right p-3">{language === 'ar' ? 'البريد' : language === 'fr' ? 'Email' : 'Email'}</th>
                        <th className="text-right p-3">{language === 'ar' ? 'المهنة' : language === 'fr' ? 'Profession' : 'Profession'}</th>
                        <th className="text-right p-3">{language === 'ar' ? 'ال套餐' : language === 'fr' ? 'Plan' : 'Plan'}</th>
                        <th className="text-right p-3">{language === 'ar' ? 'الحالة' : language === 'fr' ? 'Statut' : 'Status'}</th>
                        <th className="text-right p-3">{language === 'ar' ? 'إجراءات' : language === 'fr' ? 'Actions' : 'Actions'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-slate-50">
                          <td className="p-3">{user.name}</td>
                          <td className="p-3">{user.email}</td>
                          <td className="p-3">{user.profession}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded text-xs ${user.plan === 'PRO' ? 'bg-gold text-white' : 'bg-slate-200'}`}>
                              {user.plan}
                            </span>
                          </td>
                          <td className="p-3">
                            {user.isPaymentPending ? (
                              <span className="text-orange-500 text-xs">{language === 'ar' ? 'معلق' : language === 'fr' ? 'En attente' : 'Pending'}</span>
                            ) : user.plan === 'PRO' ? (
                              <span className="text-green-500 text-xs">{language === 'ar' ? 'نشط' : language === 'fr' ? 'Actif' : 'Active'}</span>
                            ) : (
                              <span className="text-slate-500 text-xs">{language === 'ar' ? 'مجاني' : language === 'fr' ? 'Gratuit' : 'Free'}</span>
                            )}
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              {user.plan === 'FREE' ? (
                                <Button size="sm" variant="gold" onClick={() => handleUpdateUser(user.id, 'PRO')}>
                                  <UserCheck className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button size="sm" variant="outline" onClick={() => handleUpdateUser(user.id, 'FREE')}>
                                  <UserX className="h-4 w-4" />
                                </Button>
                              )}
                              <Button size="sm" variant="outline" className="text-red-500 hover:bg-red-50" onClick={() => handleDeleteUser(user.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
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

        {activeTab === 'laws' && (
          <Card>
            <CardHeader>
              <CardTitle>{language === 'ar' ? 'إدارة القوانين' : language === 'fr' ? 'Gestion des lois' : 'Law Management'}</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="animate-pulse space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-12 bg-slate-200 rounded" />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-right p-3">{language === 'ar' ? 'العنوان' : language === 'fr' ? 'Titre' : 'Title'}</th>
                        <th className="text-right p-3">{language === 'ar' ? 'المرجع' : language === 'fr' ? 'Référence' : 'Reference'}</th>
                        <th className="text-right p-3">{language === 'ar' ? 'النوع' : language === 'fr' ? 'Type' : 'Type'}</th>
                        <th className="text-right p-3">{language === 'ar' ? 'السنة' : language === 'fr' ? 'Année' : 'Year'}</th>
                        <th className="text-right p-3">{language === 'ar' ? 'إجراءات' : language === 'fr' ? 'Actions' : 'Actions'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLaws.map((law) => (
                        <tr key={law.id} className="border-b hover:bg-slate-50">
                          <td className="p-3">{law.titleFr}</td>
                          <td className="p-3">{law.referenceNumber}</td>
                          <td className="p-3">
                            <span className="px-2 py-1 rounded text-xs bg-navy/10 text-navy">
                              {law.lawType.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-3">{law.year}</td>
                          <td className="p-3">
                            <Button size="sm" variant="outline" className="text-red-500 hover:bg-red-50" onClick={() => handleDeleteLaw(law.id)}>
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

        {activeTab === 'add-law' && (
          <Card>
            <CardHeader>
              <CardTitle>{language === 'ar' ? 'إضافة قانون جديد' : language === 'fr' ? 'Ajouter une nouvelle loi' : 'Add New Law'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddLaw} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {language === 'ar' ? 'العنوان بالفرنسية' : language === 'fr' ? 'Titre (Français)' : 'Title (French)'}
                    </label>
                    <Input
                      value={lawForm.titleFr}
                      onChange={(e) => setLawForm({ ...lawForm, titleFr: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {language === 'ar' ? 'العنوان بالعربية' : language === 'fr' ? 'Titre (Arabe)' : 'Title (Arabic)'}
                    </label>
                    <Input
                      value={lawForm.titleAr}
                      onChange={(e) => setLawForm({ ...lawForm, titleAr: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {language === 'ar' ? 'المرجع' : language === 'fr' ? 'Référence' : 'Reference'}
                    </label>
                    <Input
                      value={lawForm.referenceNumber}
                      onChange={(e) => setLawForm({ ...lawForm, referenceNumber: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {language === 'ar' ? 'السنة' : language === 'fr' ? 'Année' : 'Year'}
                    </label>
                    <Input
                      type="number"
                      value={lawForm.year}
                      onChange={(e) => setLawForm({ ...lawForm, year: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {language === 'ar' ? 'الفئة' : language === 'fr' ? 'Catégorie' : 'Category'}
                    </label>
                    <select
                      className="w-full p-2 border rounded"
                      value={lawForm.category}
                      onChange={(e) => setLawForm({ ...lawForm, category: e.target.value })}
                    >
                      {categories.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {language === 'ar' ? 'النوع' : language === 'fr' ? 'Type' : 'Type'}
                    </label>
                    <select
                      className="w-full p-2 border rounded"
                      value={lawForm.lawType}
                      onChange={(e) => setLawForm({ ...lawForm, lawType: e.target.value })}
                    >
                      {lawTypes.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {language === 'ar' ? 'الجريدة الرسمية' : language === 'fr' ? 'Journal Officiel' : 'Official Gazette'}
                    </label>
                    <Input
                      value={lawForm.journalOfficiel}
                      onChange={(e) => setLawForm({ ...lawForm, journalOfficiel: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {language === 'ar' ? 'رابط المصدر' : language === 'fr' ? 'Lien source' : 'Source Link'}
                    </label>
                    <Input
                      type="url"
                      value={lawForm.sourceUrl}
                      onChange={(e) => setLawForm({ ...lawForm, sourceUrl: e.target.value })}
                      placeholder="https://www.joradp.dz/..."
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {language === 'ar' ? 'الوصف بالفرنسية' : language === 'fr' ? 'Description' : 'Description'}
                  </label>
                  <textarea
                    className="w-full p-2 border rounded"
                    rows={3}
                    value={lawForm.descriptionFr}
                    onChange={(e) => setLawForm({ ...lawForm, descriptionFr: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  {language === 'ar' ? 'إضافة القانون' : language === 'fr' ? 'Ajouter la loi' : 'Add Law'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}