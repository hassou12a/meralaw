'use client';

/**
 * © 2026 Project of HOUSSEM ABDALLAH MERAMRIA
 * MeraLaw - Algerian Legal Platform
 */

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Scale, Heart, Code } from 'lucide-react';

export function Footer() {
  const { language, translations: t } = useLanguage();

  return (
    <footer className="bg-navy text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Scale className="h-8 w-8 text-gold" />
              <span className="text-2xl font-bold font-cairo">MeraLaw</span>
            </div>
            <p className="text-slate-300 text-sm mb-4">
              {language === 'ar'
                ? 'منصتك القانونية الجزائرية المرجعية للمهنيين القانونيين'
                : language === 'fr'
                ? 'Votre plateforme juridique algérienne de référence pour les professionnels du droit'
                : 'Your reference Algerian legal platform for legal professionals'}
            </p>
            <div className="flex gap-4">
              {['ar', 'fr', 'en'].map((lang) => (
                <span key={lang} className="text-xs text-slate-400">
                  {lang.toUpperCase()}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">
              {language === 'ar' ? 'روابط سريعة' : language === 'fr' ? 'Liens rapides' : 'Quick Links'}
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <Link href="/insights" className="hover:text-gold transition-colors">
                  {language === 'ar' ? 'المعرفة القانونية' : language === 'fr' ? 'Savoir juridique' : 'Legal Insights'}
                </Link>
              </li>
              <li>
                <Link href="/laws" className="hover:text-gold transition-colors">
                  {language === 'ar' ? 'المكتبات القانونية' : language === 'fr' ? 'Bibliothèque juridique' : 'Legal Library'}
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-gold transition-colors">
                  {language === 'ar' ? 'البحث المتقدم' : language === 'fr' ? 'Recherche avancée' : 'Advanced Search'}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-gold transition-colors">
                  {language === 'ar' ? 'الأسعار' : language === 'fr' ? 'Tarifs' : 'Pricing'}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">
              {language === 'ar' ? 'المعلومات' : language === 'fr' ? 'Informations' : 'Information'}
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <Link href="/about" className="hover:text-gold transition-colors">
                  {language === 'ar' ? 'عن LexDZ' : language === 'fr' ? 'À propos' : 'About'}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gold transition-colors">
                  {language === 'ar' ? 'اتصل بنا' : language === 'fr' ? 'Contact' : 'Contact'}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gold transition-colors">
                  {language === 'ar' ? 'سياسة الخصوصية' : language === 'fr' ? 'Confidentialité' : 'Privacy'}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400">
            © 2026 MeraLaw. {language === 'ar' ? 'جميع الحقوق محفوظة' : language === 'fr' ? 'Tous droits réservés' : 'All rights reserved'}.
          </p>
          <p className="text-sm text-slate-400 flex items-center gap-2">
            <Code className="h-4 w-4 text-gold" />
            {language === 'ar' 
              ? 'صُنع بدقة by Prof. HOUSSEM ABDALLAH MERAMRIA | IT Educator & Developer' 
              : language === 'fr' 
              ? 'Créé avec précision par Prof. HOUSSEM ABDALLAH MERAMRIA | IT Educator & Developer' 
              : 'Crafted with precision by Prof. HOUSSEM ABDALLAH MERAMRIA | IT Educator & Developer'}
          </p>
        </div>
      </div>
    </footer>
  );
}


