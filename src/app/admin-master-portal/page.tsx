'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Users, FileText, Plus, Trash2, Search, 
  CreditCard, Save, Settings, Shield, Database, ExternalLink
} from 'lucide-react';

const ADMIN_EMAIL = 'admin@meralaw.dz';

const CATEGORIES = [
  { value: 'all', label: 'All / الكل' },
  { value: 'الدستور الجزائري', label: ' Constitution / الدستور' },
  { value: 'القانون المدني', label: 'Civil Code / القانون المدني' },
  { value: 'قانون الإجراءات المدنية والإدارية', label: 'Civil Procedure / الإجراءات' },
  { value: 'القانون التجاري', label: 'Commercial Code / التجاري' },
  { value: 'قانون العقوبات', label: 'Penal Code / العقوبات' },
  { value: 'قانون الأسرة', label: 'Family Code / الأسرة' },
  { value: 'قانون العمل', label: 'Labor Code / العمل' },
  { value: 'القانون الإداري', label: 'Administrative Law / القانون الإداري' },
  { value: 'المراسيم التنفيذية', label: 'Executive Decrees / المراسيم' },
  { value: 'الأوامر presidential', label: 'Presidential Orders / الأوامر' },
  { value: 'المناشير والتعليمات الوزارية', label: 'Circulars / المناشير' },
  { value: 'إداري', label: 'Administratif (Other)' },
  { value: 'مدني', label: 'Civil (Other)' },
  { value: 'جنائي', label: 'Criminal (Other)' },
  { value: 'تجاري', label: 'Commercial (Other)' },
  { value: 'شغل', label: 'Labor (Other)' },
  { value: 'أسري', label: 'Family (Other)' },
  { value: 'ضريبي', label: 'Tax / ضريبي' },
  { value: 'جمارك', label: 'Customs / جمارك' },
  { value: 'عقاري', label: 'Property / عقاري' },
];

const LAW_TYPES = [
  { value: 'loi', label: 'Law / قانون' },
  { value: 'decret', label: 'Decree / مرسوم' },
  { value: 'circulaire', label: 'Circular / منشور' },
  { value: 'arrete', label: 'Arrêté / قرار' },
];

interface User {
  id: string;
  name: string;
  email: string;
  profession: string;
  plan: string;
  isPaymentPending: boolean;
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
  source: string;
  sourceUrl: string;
  pdfUrlAr: string;
  pdfUrlFr: string;
  isPremium: boolean;
  isVerified: boolean;
}

interface Toast {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

function AdminMasterPortal() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{email: string; plan: string} | null>(null);
  const [activeNav, setActiveNav] = useState<'dashboard' | 'users' | 'laws' | 'add-law'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<Toast>({ show: false, message: '', type: 'success' });
  
  const [users, setUsers] = useState<User[]>([]);
  const [laws, setLaws] = useState<Law[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, proUsers: 0, freeUsers: 0, totalLaws: 0 });
  
  const [lawForm, setLawForm] = useState({
    id: '', titleFr: '', titleAr: '', titleEn: '', category: 'القانون الإداري', lawType: 'loi',
    referenceNumber: '', year: new Date().getFullYear().toString(),
    publicationDate: new Date().toISOString().split('T')[0], journalOfficiel: '',
    descriptionFr: '', descriptionAr: '', contentFr: '', contentAr: '', 
    source: '', sourceUrl: '', pdfUrlAr: '', pdfUrlFr: '',
    isPremium: false, isVerified: true,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  function showToast(message: string, type: 'success' | 'error') {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  }

  async function checkAuth() {
    try {
      const res = await fetch('/api/auth/session');
      const data = await res.json();
      if (!data.user || data.user.email !== ADMIN_EMAIL) {
        router.push('/login');
        return;
      }
      setUser(data.user);
      fetchData();
    } catch (error) {
      router.push('/login');
    }
  }

  async function fetchData() {
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
  }

  async function handleUpgradeUser(userId: string, newPlan: string) {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, plan: newPlan }),
      });
      if (res.ok) {
        showToast(newPlan === 'PRO' ? '✅ Upgraded to PRO!' : '✅ Subscription cancelled!', 'success');
        fetchData();
      }
    } catch (error) {
      showToast('❌ Error occurred', 'error');
    }
  }

  async function handleDeleteUser(userId: string) {
    if (!confirm('Delete this user?')) return;
    try {
      const res = await fetch(`/api/admin/users?id=${userId}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('✅ User deleted!', 'success');
        fetchData();
      }
    } catch (error) {
      showToast('❌ Error occurred', 'error');
    }
  }

  async function handleDeleteLaw(lawId: string) {
    if (!confirm('Delete this law?')) return;
    try {
      const res = await fetch(`/api/admin/laws?id=${lawId}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('✅ Law deleted!', 'success');
        fetchData();
      }
    } catch (error) {
      showToast('❌ Error occurred', 'error');
    }
  }

  function handleEditLaw(law: Law) {
    setLawForm({
      id: law.id,
      titleFr: law.titleFr || '',
      titleAr: law.titleAr || '',
      titleEn: law.titleEn || '',
      category: law.category || 'إداري',
      lawType: law.lawType || 'loi',
      referenceNumber: law.referenceNumber || '',
      year: law.year?.toString() || new Date().getFullYear().toString(),
      publicationDate: law.publicationDate || new Date().toISOString().split('T')[0],
      journalOfficiel: law.journalOfficiel || '',
      descriptionFr: law.descriptionFr || '',
      descriptionAr: law.descriptionAr || '',
      contentFr: law.contentFr || '',
      contentAr: law.contentAr || '',
      source: law.source || '',
      sourceUrl: law.sourceUrl || '',
      pdfUrlAr: law.pdfUrlAr || '',
      pdfUrlFr: law.pdfUrlFr || '',
      isPremium: law.isPremium || false,
      isVerified: law.isVerified || false,
    });
    setActiveNav('add-law');
  }

  async function handleAddLaw(e: React.FormEvent) {
    e.preventDefault();
    try {
      const method = lawForm.id ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/laws', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lawForm),
      });
      if (res.ok) {
        showToast(lawForm.id ? '✅ Law updated!' : '✅ Law added!', 'success');
        setLawForm({
          id: '', titleFr: '', titleAr: '', titleEn: '', category: 'القانون الإداري', lawType: 'loi',
          referenceNumber: '', year: new Date().getFullYear().toString(),
          publicationDate: new Date().toISOString().split('T')[0], journalOfficiel: '',
          descriptionFr: '', descriptionAr: '', contentFr: '', contentAr: '', 
          source: '', sourceUrl: '', pdfUrlAr: '', pdfUrlFr: '',
          isPremium: false, isVerified: true,
        });
        setActiveNav('laws');
        fetchData();
      }
    } catch (error) {
      showToast('❌ Error saving law', 'error');
    }
  }

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLaws = laws.filter(l =>
    l.titleFr?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.referenceNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function resetForm() {
    setLawForm({
      id: '', titleFr: '', titleAr: '', titleEn: '', category: 'القانون الإداري', lawType: 'loi',
      referenceNumber: '', year: new Date().getFullYear().toString(),
      publicationDate: new Date().toISOString().split('T')[0], journalOfficiel: '',
      descriptionFr: '', descriptionAr: '', contentFr: '', contentAr: '', 
      source: '', sourceUrl: '', pdfUrlAr: '', pdfUrlFr: '',
      isPremium: false, isVerified: true,
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const toastClass = 'fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ' + 
    (toast.type === 'success' ? 'bg-green-600' : 'bg-red-600') + ' text-white font-medium';

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {toast.show ? (
        <div className={toastClass}>{toast.message}</div>
      ) : null}

      <aside className="w-64 bg-slate-900 border-r border-slate-800 min-h-screen">
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500 rounded-lg">
              <Shield className="h-6 w-6 text-slate-900" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">MeraLaw</h1>
              <p className="text-xs text-amber-400">Master Admin</p>
            </div>
          </div>
        </div>
        
        <nav className="p-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'laws', label: 'Laws', icon: FileText },
            { id: 'add-law', label: 'Add/Edit Law', icon: Plus },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveNav(item.id as typeof activeNav);
                if (item.id === 'add-law') resetForm();
              }}
              className={'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ' +
                (activeNav === item.id ? 'bg-amber-500/20 text-amber-400' : 'text-slate-400 hover:text-white hover:bg-slate-800')}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>
        
        <div className="absolute bottom-0 w-64 p-4 border-t border-slate-800">
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white text-sm"
          >
            <ExternalLink className="h-4 w-4" />
            Back to Site
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-500"
            />
          </div>
        </div>

        {activeNav === 'dashboard' ? (
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/20 rounded-full"><Users className="h-6 w-6 text-blue-400" /></div>
                <div><p className="text-3xl font-bold text-white">{stats.totalUsers}</p><p className="text-sm text-slate-400">Total Users</p></div>
              </div>
            </div>
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-500/20 rounded-full"><CreditCard className="h-6 w-6 text-amber-400" /></div>
                <div><p className="text-3xl font-bold text-white">{stats.proUsers}</p><p className="text-sm text-slate-400">PRO Users</p></div>
              </div>
            </div>
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/20 rounded-full"><FileText className="h-6 w-6 text-green-400" /></div>
                <div><p className="text-3xl font-bold text-white">{stats.totalLaws}</p><p className="text-sm text-slate-400">Total Laws</p></div>
              </div>
            </div>
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/20 rounded-full"><Database className="h-6 w-6 text-purple-400" /></div>
                <div><p className="text-3xl font-bold text-white">{stats.freeUsers}</p><p className="text-sm text-slate-400">Free Users</p></div>
              </div>
            </div>
          </div>
        ) : activeNav === 'users' ? (
          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2"><Users className="h-5 w-5" />User Management</h2>
            </div>
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr className="text-slate-400 text-sm">
                  <th className="text-right p-4">Name</th>
                  <th className="text-right p-4">Email</th>
                  <th className="text-right p-4">Profession</th>
                  <th className="text-right p-4">Plan</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="border-t border-slate-800 hover:bg-slate-800/30">
                    <td className="p-4 text-white">{u.name}</td>
                    <td className="p-4 text-slate-300">{u.email}</td>
                    <td className="p-4 text-slate-300">{u.profession}</td>
                    <td className="p-4">
                      <span className={'px-2 py-1 rounded text-xs ' + (u.plan === 'PRO' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700 text-slate-300')}>
                        {u.plan}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {u.plan === 'FREE' && (
                          <button onClick={() => handleUpgradeUser(u.id, 'PRO')} className="px-3 py-1 bg-amber-500 text-slate-900 rounded text-sm font-medium hover:bg-amber-600">Grant PRO</button>
                        )}
                        {u.plan === 'PRO' && (
                          <button onClick={() => handleUpgradeUser(u.id, 'FREE')} className="px-3 py-1 border border-slate-600 text-slate-300 rounded text-sm hover:bg-slate-800">Revoke</button>
                        )}
                        <button onClick={() => handleDeleteUser(u.id)} className="px-3 py-1 border border-red-600 text-red-400 rounded text-sm hover:bg-red-900/20">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : activeNav === 'laws' ? (
          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2"><FileText className="h-5 w-5" />Law Management</h2>
            </div>
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr className="text-slate-400 text-sm">
                  <th className="text-right p-4">Title</th>
                  <th className="text-right p-4">Category</th>
                  <th className="text-right p-4">Reference</th>
                  <th className="text-right p-4">Year</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLaws.map((law) => (
                  <tr key={law.id} className="border-t border-slate-800 hover:bg-slate-800/30">
                    <td className="p-4 text-white">{law.titleFr}</td>
                    <td className="p-4 text-slate-300">{law.category}</td>
                    <td className="p-4 text-slate-300">{law.referenceNumber}</td>
                    <td className="p-4 text-slate-300">{law.year}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleEditLaw(law)} className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">Edit</button>
                        <button onClick={() => handleDeleteLaw(law.id)} className="px-3 py-1 border border-red-600 text-red-400 rounded text-sm hover:bg-red-900/20">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-6"><Plus className="h-5 w-5" />{lawForm.id ? 'Edit Law' : 'Add New Law'}</h2>
            <form onSubmit={handleAddLaw} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Title (French) *</label>
                  <input type="text" value={lawForm.titleFr} onChange={(e) => setLawForm({ ...lawForm, titleFr: e.target.value })} required className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Title (Arabic) *</label>
                  <input type="text" value={lawForm.titleAr} onChange={(e) => setLawForm({ ...lawForm, titleAr: e.target.value })} required className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Reference *</label>
                  <input type="text" value={lawForm.referenceNumber} onChange={(e) => setLawForm({ ...lawForm, referenceNumber: e.target.value })} placeholder="LOI-2024-001" required className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Year *</label>
                  <input type="number" value={lawForm.year} onChange={(e) => setLawForm({ ...lawForm, year: e.target.value })} required className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Category *</label>
                  <select value={lawForm.category} onChange={(e) => setLawForm({ ...lawForm, category: e.target.value })} className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-white">
                    {CATEGORIES.map((cat) => (<option key={cat.value} value={cat.value}>{cat.label}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Type</label>
                  <select value={lawForm.lawType} onChange={(e) => setLawForm({ ...lawForm, lawType: e.target.value })} className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-white">
                    {LAW_TYPES.map((t) => (<option key={t.value} value={t.value}>{t.label}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Publication Date</label>
                  <input type="date" value={lawForm.publicationDate} onChange={(e) => setLawForm({ ...lawForm, publicationDate: e.target.value })} className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Journal Officiel</label>
                  <input type="text" value={lawForm.journalOfficiel} onChange={(e) => setLawForm({ ...lawForm, journalOfficiel: e.target.value })} placeholder="الجريدة الرسمية عدد 50" className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Source URL (JORADP)</label>
                  <input type="url" value={lawForm.sourceUrl} onChange={(e) => setLawForm({ ...lawForm, sourceUrl: e.target.value })} placeholder="https://www.joradp.dz/..." className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">PDF URL</label>
                  <input type="url" value={lawForm.pdfUrlAr} onChange={(e) => setLawForm({ ...lawForm, pdfUrlAr: e.target.value })} className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-white" />
                </div>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-slate-300">
                    <input type="checkbox" checked={lawForm.isPremium} onChange={(e) => setLawForm({ ...lawForm, isPremium: e.target.checked })} className="rounded" />
                    Premium
                  </label>
                  <label className="flex items-center gap-2 text-slate-300">
                    <input type="checkbox" checked={lawForm.isVerified} onChange={(e) => setLawForm({ ...lawForm, isVerified: e.target.checked })} className="rounded" />
                    Verified
                  </label>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                  <textarea value={lawForm.descriptionFr} onChange={(e) => setLawForm({ ...lawForm, descriptionFr: e.target.value })} rows={3} className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-white" />
                </div>
              </div>
              <button type="submit" className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium rounded-lg flex items-center justify-center gap-2">
                <Save className="h-5 w-5" />
                {lawForm.id ? 'Update Law' : 'Add Law'}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminMasterPortal;