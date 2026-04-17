'use client';

/**
 * © 2026 Project of HOUSSEM ABDALLAH MERAMRIA
 * MeraLaw - Premium Upgrade Page
 * Baridimob Payment Integration
 */

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useSession } from 'next-auth/react';
import { Check, Sparkles, Wallet, Upload, Send, Clock, Lock, Unlock, CreditCard } from 'lucide-react';

const PRO_PRICE = '499';
const BANK_NAME = 'Baridimob (Algérie Poste)';
const ACCOUNT_NAME = 'HOUSSEM ABDALLAH MERAMRIA';
const RIP_NUMBER = '00799999001746456591';

export default function PremiumUpgradePage() {
  const { language, translations: t } = useLanguage();
  const { data: session } = useSession();
  const [uploaded, setUploaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReceiptUpload = async () => {
    setLoading(true);
    // Simulate upload - in real app, implement file upload
    setTimeout(() => {
      setUploaded(true);
      setLoading(false);
    }, 1500);
  };

  const isPro = session?.user?.plan === 'PRO';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <section className="bg-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Sparkles className="h-16 w-16 text-gold mx-auto mb-6" />
          <h1 className="text-4xl font-bold font-cairo mb-4">
            {language === 'ar' ? 'ترقية إلى برو' : language === 'fr' ? 'Passer à Premium' : 'Upgrade to Premium'}
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            {language === 'ar'
              ? 'وصول كامل للنصوص القانونية الإدارية الرسمية'
              : language === 'fr'
              ? 'Accès complet aux textes juridiques administratifs officiels'
              : 'Full access to official Administrative Law texts'}
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Current Status */}
        {session && (
          <div className="mb-8 bg-gradient-to-r from-navy to-navy-600 rounded-xl p-6 text-white text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              {isPro ? (
                <>
                  <Unlock className="h-6 w-6 text-gold" />
                  <span className="text-2xl font-bold">{t['sub.current']}</span>
                </>
              ) : (
                <>
                  <Lock className="h-6 w-6" />
                  <span className="text-2xl font-bold">{t['tier.free']}</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Payment Card */}
        <Card className="border-2 border-gold shadow-xl">
          <CardHeader className="text-center bg-gradient-to-r from-navy to-navy-600 text-white rounded-t-xl">
            <CreditCard className="h-12 w-12 text-gold mx-auto mb-4" />
            <CardTitle className="text-3xl text-white">MeraLaw PRO</CardTitle>
            <CardDescription className="text-slate-300">
              {language === 'ar' ? 'اشتراك有效期 30 يوم' : language === 'fr' ? 'Abonnement 30 jours' : '30-day Subscription'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            {/* Price */}
            <div className="text-center mb-8">
              <span className="text-6xl font-bold text-navy">{PRO_PRICE}</span>
              <span className="text-2xl text-slate-500"> DZD</span>
              <p className="text-sm text-slate-400 mt-2">
                {language === 'ar' ? '/ شهر واحد' : language === 'fr' ? '/ mois' : '/ month'}
              </p>
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-8">
              {[
                language === 'ar' ? 'وصول كامل للنصوص القانونية' : language === 'fr' ? 'Accès complet aux textes juridiques' : 'Full access to legal texts',
                language === 'ar' ? 'روابط مصادر رسمية (JORADP)' : language === 'fr' ? 'Liens sources officielles (JORADP)' : 'Official source links (JORADP)',
                language === 'ar' ? 'ملفات PDF رسمية' : language === 'fr' ? 'Fichiers PDF officiels' : 'Official PDF documents',
                language === 'ar' ? ' دعم اولوية' : language === 'fr' ? 'Support prioritaire' : 'Priority support',
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-gold flex-shrink-0" />
                  <span className="text-slate-600 dark:text-slate-400">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Payment Instructions */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-bold text-navy dark:text-white mb-4 flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                {language === 'ar' ? 'تعليمات الدفع' : language === 'fr' ? 'Instructions de paiement' : 'Payment Instructions'}
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">{language === 'ar' ? 'البنك' : language === 'fr' ? 'Banque' : 'Bank'}:</span>
                  <span className="font-medium text-navy dark:text-white">{BANK_NAME}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{language === 'ar' ? 'اسم الحساب' : language === 'fr' ? 'Nom du compte' : 'Account Name'}:</span>
                  <span className="font-medium text-navy dark:text-white">{ACCOUNT_NAME}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">RIP:</span>
                  <span className="font-mono font-bold text-navy dark:text-white">{RIP_NUMBER}</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                {language === 'ar'
                  ? 'يرجى إرسال رسوم الاشتراك وتحميل الإيصال لتفعيل حسابك PRO'
                  : language === 'fr'
                  ? 'Veuillez envoyer les frais et télécharger le reçu pour activer votre compte PRO'
                  : 'Please send the subscription fee and upload the receipt to activate your PRO account'}
              </p>
            </div>

            {/* Upload Receipt */}
            {session && !isPro && (
              <div className="space-y-4">
                {!uploaded ? (
                  <Button 
                    onClick={handleReceiptUpload}
                    disabled={loading}
                    variant="gold" 
                    className="w-full"
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    {loading 
                      ? (language === 'ar' ? 'جاري التحميل...' : language === 'fr' ? 'Téléchargement...' : 'Uploading...')
                      : (language === 'ar' ? 'تحميل إيصال الدفع' : language === 'fr' ? 'Télécharger le reçu' : 'Upload Payment Receipt')
                    }
                  </Button>
                ) : (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 text-center">
                    <Check className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-green-700 dark:text-green-400 font-medium">
                      {language === 'ar' ? 'تم استلام إيصالك! ستتم مراجعة تفعيل حسابك قريباً' : language === 'fr' ? 'Reçu reçu! Votre activate sera examinée sous peu' : 'Receipt received! Your activation will be reviewed shortly'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Auth Buttons */}
            {!session && (
              <div className="flex gap-4">
                <Link href="/login" className="flex-1">
                  <Button variant="outline" className="w-full">
                    {t['nav.login']}
                  </Button>
                </Link>
                <Link href="/register" className="flex-1">
                  <Button variant="gold" className="w-full">
                    {t['nav.register']}
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Support Info */}
        <div className="mt-8 text-center text-slate-500">
          <p className="flex items-center justify-center gap-2">
            <Send className="h-4 w-4" />
            {language === 'ar'
              ? 'للمساعدة: contact@meralaw.dz'
              : language === 'fr'
              ? 'Pour assistance: contact@meralaw.dz'
              : 'For support: contact@meralaw.dz'}
          </p>
        </div>
      </div>
    </div>
  );
}