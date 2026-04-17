'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Menu,
  X,
  Scale,
  BookOpen,
  Search,
  Bot,
  Briefcase,
  CreditCard,
  LayoutDashboard,
  User,
  LogOut,
  Moon,
  Sun,
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

const translations = {
  ar: {
    home: 'الرئيسية',
    laws: 'المكتبات القانونية',
    search: 'البحث',
    assistant: 'المساعد الذكي',
    cases: 'الملفات',
    pricing: 'الأسعار',
    dashboard: 'لوحة التحكم',
    profile: 'الملف الشخصي',
    logout: 'تسجيل الخروج',
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    premium: 'Premium',
    insights: 'المعرفة القانونية',
  },
  fr: {
    home: 'Accueil',
    laws: 'Bibliothèque juridique',
    search: 'Recherche',
    assistant: 'Assistant IA',
    cases: 'Dossiers',
    pricing: 'Tarifs',
    dashboard: 'Tableau de bord',
    profile: 'Profil',
    logout: 'Déconnexion',
    login: 'Connexion',
    register: "S'inscrire",
    premium: 'Premium',
    insights: 'Savoir juridique',
  },
  en: {
    home: 'Home',
    laws: 'Legal Library',
    search: 'Search',
    assistant: 'AI Assistant',
    cases: 'Cases',
    pricing: 'Pricing',
    dashboard: 'Dashboard',
    profile: 'Profile',
    logout: 'Logout',
    login: 'Login',
    register: 'Register',
    premium: 'Premium',
    insights: 'Legal Insights',
  },
};

export function Navbar() {
  const pathname = usePathname();
  const { language, setLanguage, dir, translations: t } = useLanguage();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const isPremium = session?.user?.plan === 'PRO';
  const langTrans = translations[language];

  const navLinks = [
    { href: '/', label: langTrans.home, icon: Scale },
    { href: '/insights', label: langTrans.insights, icon: BookOpen },
    { href: '/laws', label: langTrans.laws, icon: BookOpen },
    { href: '/search', label: langTrans.search, icon: Search },
    { href: '/assistant', label: langTrans.assistant, icon: Bot, premium: true },
    { href: '/cases', label: langTrans.cases, icon: Briefcase, premium: true },
    { href: '/pricing', label: langTrans.pricing, icon: CreditCard },
  ];

  const userLinks = session
    ? [
        { href: '/dashboard', label: langTrans.dashboard, icon: LayoutDashboard },
        { href: '/profile', label: langTrans.profile, icon: User },
      ]
    : [];

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 dark:bg-slate-950/95 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Scale className="h-8 w-8 text-navy" />
              <span className="text-xl font-bold text-navy font-cairo">MeraLaw</span>
              <span className="hidden md:inline-flex items-center px-2 py-0.5 text-[10px] font-medium bg-navy/10 text-navy rounded-full">
                By Prof. MERAMRIA
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-navy text-white'
                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                    {link.premium && !isPremium && (
                      <span className="px-1.5 py-0.5 text-[10px] bg-gold/20 text-gold-700 rounded">
                        PRO
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden">
              {(['ar', 'fr', 'en'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={cn(
                    'px-3 py-1.5 text-xs font-medium uppercase transition-colors',
                    language === lang
                      ? 'bg-navy text-white'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  )}
                >
                  {lang}
                </button>
              ))}
            </div>

            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {session ? (
              <div className="hidden lg:flex items-center gap-2">
                {userLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  );
                })}
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <LogOut className="h-4 w-4" />
                  {langTrans.logout}
                </button>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    {langTrans.login}
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">{langTrans.register}</Button>
                </Link>
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <Icon className="h-5 w-5" />
                    {link.label}
                    {link.premium && !isPremium && (
                      <span className="px-2 py-0.5 text-[10px] bg-gold/20 text-gold-700 rounded">
                        PRO
                      </span>
                    )}
                  </Link>
                );
              })}
              {session ? (
                <>
                  {userLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        <Icon className="h-5 w-5" />
                        {link.label}
                      </Link>
                    );
                  })}
                  <button
                    onClick={() => signOut()}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="h-5 w-5" />
                    {langTrans.logout}
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      {langTrans.login}
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full">{langTrans.register}</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
