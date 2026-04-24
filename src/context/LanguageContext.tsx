'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: Record<string, string>;
  dir: 'rtl' | 'ltr';
}

const translations: Record<Language, Record<string, string>> = {
   ar: {
      // Navigation
      'nav.home': 'الرئيسية',
    'nav.laws': 'المكتبات القانونية',
    'nav.search': 'البحث',
    'nav.assistant': 'المساعد الذكي',
    'nav.cases': 'الملفات',
    'nav.pricing': 'الأسعار',
    'nav.dashboard': 'لوحة التحكم',
    'nav.profile': 'الملف الشخصي',
    'nav.logout': 'تسجيل الخروج',
    'nav.login': 'تسجيل الدخول',
    'nav.register': 'إنشاء حساب',
    
    // Hero
    'hero.title': 'مرجعك القانوني الجزائري',
    'hero.subtitle': 'منصة شاملة للمهنيين القانونيين الجزائريين',
    'hero.cta': 'ابدأ الآن مجاناً',
    'hero.learnMore': 'اعرف المزيد',
    
    // Features
    'features.title': 'مميزات المنصة',
    'features.library': 'مكتبة القوانين',
    'features.libraryDesc': 'الوصول إلى مجموعة شاملة من القوانين والتشريعات الجزائرية',
    'features.search': 'بحث متقدم',
    'features.searchDesc': 'ابحث في النصوص القانونية بسرعة ودقة',
    'features.ai': 'مساعد ذكي',
    'features.aiDesc': 'احصل على توصيات قانونية مدعومة بالذكاء الاصطناعي',
    'features.cases': 'إدارة الملفات',
    'features.casesDesc': 'نظم ملفاتك القانونية وسجلاتك بسهولة',
    
    // Categories
    'categories.title': 'التصنيفات القانونية',
    'categories.constitution': 'الدستور الجزائري',
    'categories.civil': 'القانون المدني',
    'categories.civilProcedure': 'قانون الإجراءات المدنية',
    'categories.commercial': 'القانون التجاري',
    'categories.penal': 'قانون العقوبات',
    'categories.family': 'قانون الأسرة',
    'categories.labor': 'قانون العمل',
    'categories.admin': 'القانون الإداري',
    'categories.decrees': 'المراسيم التنفيذية',
    'categories.orders': 'الأوامر presidential',
    'categories.circulaires': 'المناشير الوزارية',
    
    // Buttons
    'btn.read': 'اقرأ المزيد',
    'btn.download': 'تحميل PDF',
    'btn.submit': 'إرسال',
    'btn.cancel': 'إلغاء',
    'btn.save': 'حفظ',
    'btn.delete': 'حذف',
    'btn.edit': 'تعديل',
    'btn.export': 'تصدير',
    'btn.copy': 'نسخ',
    'btn.upgrade': 'ترقية',
    'btn.create': 'إنشاء',
    'btn.archive': 'أرشفة',
    
    // Forms
    'form.email': 'البريد الإلكتروني',
    'form.password': 'كلمة المرور',
    'form.name': 'الاسم الكامل',
    'form.confirmPassword': 'تأكيد كلمة المرور',
    'form.profession': 'المهنة',
    'form.search': 'بحث...',
    'form.caseName': 'اسم الملف',
    'form.caseDesc': 'وصف الملف',
    'form.note': 'ملاحظة',
    'form.message': 'رسالتك',
    
     // Professions
     'profession.lawyer': 'محامي',
     'admin.feed': 'التغذية من المصادر الرسمية',
     'admin.feed.maxResults': 'الحد الأقصى للنتائج',
     'feed.results': 'النتائج',
     'feed.selectLaw': 'اختيار هذا القانون',
     'feed.selected': 'محدد',
    'profession.judge': 'قاضي',
    'profession.bailiff': 'محضر',
    'profession.notary': 'موثق',
    'profession.researcher': 'باحث',
    'profession.student': 'طالب',
    'profession.other': 'أخرى',
    
    // Pages
    'page.laws': 'المكتبات القانونية',
    'page.latestUpdates': 'آخر التحديثات',
    'page.searchResults': 'نتائج البحث',
    'page.noResults': 'لا توجد نتائج',
    'page.lawDetail': 'تفاصيل القانون',
    'page.aiAssistant': 'المساعد الذكي',
    'page.caseManager': 'مدير الملفات',
    'page.pricing': 'الأسعار والاشتراكات',
    'page.dashboard': 'لوحة التحكم',
    'page.profile': 'الملف الشخصي',
    
    // Auth
    'auth.login': 'تسجيل الدخول',
    'auth.register': 'إنشاء حساب جديد',
    'auth.forgotPassword': 'نسيت كلمة المرور؟',
    'auth.noAccount': 'ليس لديك حساب؟',
    'auth.hasAccount': 'لديك حساب بالفعل؟',
    'auth.welcomeBack': 'مرحباً بعودتك',
    'auth.createAccount': 'أنشئ حسابك المجاني',
    'auth.resetPassword': 'إعادة تعيين كلمة المرور',
    'auth.resetSent': 'تم إرسال رابط إعادة التعيين إلى بريدك',
    
    // Subscription
    'sub.free': 'مجاني',
    'sub.premium': 'Premium',
    'sub.price': '499 د.ج / شهرياً',
    'sub.compare': 'قارن الخطط',
    'sub.features.free': 'الوصول إلى مكتبة القوانين',
    'sub.features.search': 'بحث متقدم',
    'sub.features.ai': 'المساعد الذكي',
    'sub.features.cases': 'إدارة الملفات',
    'sub.features.export': 'تصدير PDF',
    'sub.features.notes': 'ملاحظات قانونية',
    'sub.getStarted': 'ابدأ الآن',
    'sub.current': 'الاشتراك الحالي',
    
    // Tiers
    'tier.free': 'مجاني',
    'tier.premium': 'Premium',
    
    // AI Assistant
    'ai.placeholder': 'صف موقفك القانوني هنا...',
    'ai.description': 'سيقوم مساعدنا الذكي بتحليل موقفك واقتراح القوانين والمراسيم المعمول بها.',
    'ai.history': 'سجل المحادثة',
    'ai.newChat': 'محادثة جديدة',
    'ai.copyResponse': 'نسخ الاستجابة',
    'ai.exportPdf': 'تصدير PDF',
    'ai.sources': 'المصادر',
    
    // Cases
    'cases.myCases': 'ملفاتي',
    'cases.newCase': 'ملف جديد',
    'cases.attachLaw': 'إرفاق قانون',
    'cases.addNote': 'إضافة ملاحظة',
    'cases.archived': 'ملفات مؤرشفة',
    'cases.noCases': 'لا توجد ملفات بعد',
    
    // Dashboard
    'dash.welcome': 'مرحباً',
    'dash.stats': 'الإحصائيات',
    'dash.recentActivity': 'النشاط الأخير',
    'dash.quickActions': 'إجراءات سريعة',
    'dash.viewAll': 'عرض الكل',
    'dash.totalLaws': 'إجمالي القوانين',
    'dash.myCases': 'ملفاتي',
    'dash.savedNotes': 'ملاحظاتي',
    
    // Filters
    'filter.category': 'التصنيف',
    'filter.year': 'السنة',
    'filter.type': 'النوع',
    'filter.all': 'الكل',
    'filter.clear': 'مسح الفلاتر',
    
    // Law details
    'law.reference': 'المرجع',
    'law.year': 'السنة',
    'law.publicationDate': 'تاريخ النشر',
    'law.journalOfficiel': 'الجريدة الرسمية',
    'law.description': 'الوصف',
     'law.content': 'المحتوى',
     'law.pdf_ar': 'التحميل بالعربية',
     'law.pdf_fr': 'التحميل بالفرنسية',
     'law.pdf_en': 'التحميل بالإنجليزية',
    
    // Premium
    'premium.required': 'يتطلب اشتراك Premium',
    'premium.upgrade': 'قم بالترقية للوصول إلى هذه الميزة',
    'premium.locked': 'هذه الميزة متاحة للمشتركين Premium فقط',
    
    // Footer
    'footer.about': 'عن LexDZ',
    'footer.contact': 'اتصل بنا',
    'footer.privacy': 'سياسة الخصوصية',
    'footer.terms': 'شروط الاستخدام',
    'footer.rights': 'جميع الحقوق محفوظة',
    
    // Common
    'common.loading': 'جاري التحميل...',
    'common.error': 'حدث خطأ',
    'common.success': 'تم بنجاح',
    'common.close': 'إغلاق',
    'common.back': 'رجوع',
    'common.new': 'جديد',
    'common.viewAll': 'عرض الكل',
    'common.openOfficial': 'فتح في الجريدة الرسمية',

    // Latest laws section (home)
    'home.latest.title': 'أحدث القوانين والمراسيم',
    'home.latest.subtitle': 'تابع آخر النصوص القانونية المنشورة في الجريدة الرسمية الجزائرية',
    'home.latest.empty': 'لم يتم نشر قوانين بعد. يرجى المحاولة لاحقاً.',
    'home.latest.viewAll': 'تصفح المكتبة كاملة',

    // Official sources (home)
    'home.sources.title': 'المصادر القانونية الرسمية',
    'home.sources.subtitle': 'روابط مباشرة لأهم المواقع القانونية والمؤسساتية الجزائرية',
    'home.sources.joradp': 'الجريدة الرسمية للجمهورية الجزائرية',
    'home.sources.joradpDesc': 'النشر الرسمي للقوانين والمراسيم والأوامر',
    'home.sources.mjustice': 'وزارة العدل',
    'home.sources.mjusticeDesc': 'البوابة الرسمية لوزارة العدل الجزائرية',
    'home.sources.conseilConst': 'المحكمة الدستورية',
    'home.sources.conseilConstDesc': 'قرارات وآراء المحكمة الدستورية',
    'home.sources.conseilEtat': 'مجلس الدولة',
    'home.sources.conseilEtatDesc': 'أعلى جهة قضاء إداري في الجزائر',
    'home.sources.courSupreme': 'المحكمة العليا',
    'home.sources.courSupremeDesc': 'أعلى درجة تقاضي في القضاء العادي',
    'home.sources.apn': 'المجلس الشعبي الوطني',
    'home.sources.apnDesc': 'الغرفة التشريعية الأولى',
    'home.sources.conseilNation': 'مجلس الأمة',
    'home.sources.conseilNationDesc': 'الغرفة التشريعية الثانية',
    'home.sources.premierMinistre': 'رئاسة الحكومة',
    'home.sources.premierMinistreDesc': 'البوابة الرسمية لرئاسة الحكومة',
    'home.sources.visit': 'زيارة الموقع',
  },
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.laws': 'Bibliothèque juridique',
    'nav.search': 'Recherche',
    'nav.assistant': 'Assistant IA',
    'nav.cases': 'Dossiers',
    'nav.pricing': 'Tarifs',
    'nav.dashboard': 'Tableau de bord',
    'nav.profile': 'Profil',
    'nav.logout': 'Déconnexion',
    'nav.login': 'Connexion',
    'nav.register': "S'inscrire",
    
    // Hero
    'hero.title': 'Votre référence juridique algérienne',
    'hero.subtitle': 'Plateforme complète pour les professionnels du droit algériens',
    'hero.cta': 'Commencer gratuitement',
    'hero.learnMore': 'En savoir plus',
    
    // Features
    'features.title': 'Fonctionnalités',
    'features.library': 'Bibliothèque de lois',
    'features.libraryDesc': 'Accédez à une collection complète de lois et règlements algériens',
    'features.search': 'Recherche avancée',
    'features.searchDesc': 'Recherchez dans les textes juridiques rapidement et avec précision',
    'features.ai': 'Assistant intelligent',
    'features.aiDesc': 'Obtenez des recommandations juridiques assistées par l IA',
    'features.cases': 'Gestion des dossiers',
    'features.casesDesc': 'Organisez vos dossiers et notes juridiques facilement',
    
    // Categories
    'categories.title': 'Catégories juridiques',
    'categories.constitution': 'Constitution algérienne',
    'categories.civil': 'Code civil',
    'categories.civilProcedure': "Code de procédure civile",
    'categories.commercial': 'Code de commerce',
    'categories.penal': 'Code pénal',
    'categories.family': 'Code de la famille',
    'categories.labor': 'Code du travail',
    'categories.admin': 'Droit administratif',
    'categories.decrees': 'Décrets exécutifs',
    'categories.orders': 'Ordonnances présidentielles',
    'categories.circulaires': 'Circulaires ministérielles',
    
    // Buttons
    'btn.read': 'Lire la suite',
    'btn.download': 'Télécharger PDF',
    'btn.submit': 'Soumettre',
    'btn.cancel': 'Annuler',
    'btn.save': 'Enregistrer',
    'btn.delete': 'Supprimer',
    'btn.edit': 'Modifier',
    'btn.export': 'Exporter',
    'btn.copy': 'Copier',
    'btn.upgrade': 'Passer à Premium',
    'btn.create': 'Créer',
    'btn.archive': 'Archiver',
    
    // Forms
    'form.email': 'Adresse e-mail',
    'form.password': 'Mot de passe',
    'form.name': 'Nom complet',
    'form.confirmPassword': 'Confirmer le mot de passe',
    'form.profession': 'Profession',
    'form.search': 'Rechercher...',
    'form.caseName': 'Nom du dossier',
    'form.caseDesc': 'Description du dossier',
    'form.note': 'Note',
    'form.message': 'Votre message',
    
    // Professions
    'profession.lawyer': 'Avocat',
    'profession.judge': 'Juge',
    'profession.bailiff': 'Huissier',
    'profession.notary': 'Notaire',
    'profession.researcher': 'Chercheur',
    'profession.student': 'Étudiant',
    'profession.other': 'Autre',
    
    // Pages
    'page.laws': 'Bibliothèque juridique',
    'page.latestUpdates': 'Dernières mises à jour',
    'page.searchResults': 'Résultats de recherche',
    'page.noResults': 'Aucun résultat trouvé',
    'page.lawDetail': 'Détails de la loi',
    'page.aiAssistant': 'Assistant IA',
    'page.caseManager': 'Gestionnaire de dossiers',
    'page.pricing': 'Tarifs et abonnements',
    'page.dashboard': 'Tableau de bord',
    'page.profile': 'Profil',
    
    // Auth
    'auth.login': 'Connexion',
    'auth.register': "Créer un compte",
    'auth.forgotPassword': 'Mot de passe oublié ?',
    'auth.noAccount': "Pas encore de compte ?",
    'auth.hasAccount': 'Déjà un compte ?',
    'auth.welcomeBack': 'Bon retour',
    'auth.createAccount': 'Créez votre compte gratuit',
    'auth.resetPassword': 'Réinitialiser le mot de passe',
    'auth.resetSent': 'Un lien de réinitialisation a été envoyé',
    
    // Subscription
    'sub.free': 'Gratuit',
    'sub.premium': 'Premium',
    'sub.price': '499 DA / mois',
    'sub.compare': 'Comparer les plans',
    'sub.features.free': "Accès à la bibliothèque de lois",
    'sub.features.search': 'Recherche avancée',
    'sub.features.ai': 'Assistant IA',
    'sub.features.cases': 'Gestion des dossiers',
    'sub.features.export': 'Export PDF',
    'sub.features.notes': 'Notes juridiques',
    'sub.getStarted': 'Commencer',
    'sub.current': 'Abonnement actuel',
    
    // Tiers
    'tier.free': 'Gratuit',
    'tier.premium': 'Premium',
    
    // AI Assistant
    'ai.placeholder': 'Décrivez votre situation juridique ici...',
    'ai.description': "Notre assistant analysera votre situation et suggérera les lois et décrets applicables.",
    'ai.history': 'Historique',
    'ai.newChat': 'Nouvelle conversation',
    'ai.copyResponse': "Copier l'analyse",
    'ai.exportPdf': 'Exporter en PDF',
    'ai.sources': 'Sources',
    
    // Cases
    'cases.myCases': 'Mes dossiers',
    'cases.newCase': 'Nouveau dossier',
    'cases.attachLaw': 'Attacher une loi',
    'cases.addNote': 'Ajouter une note',
    'cases.archived': 'Dossiers archivés',
    'cases.noCases': 'Aucun dossier pour le moment',
    
    // Dashboard
    'dash.welcome': 'Bienvenue',
    'dash.stats': 'Statistiques',
    'dash.recentActivity': 'Activité récente',
    'dash.quickActions': 'Actions rapides',
    'dash.viewAll': 'Voir tout',
    'dash.totalLaws': 'Total des lois',
    'dash.myCases': 'Mes dossiers',
    'dash.savedNotes': 'Mes notes',
    
    // Filters
    'filter.category': 'Catégorie',
    'filter.year': 'Année',
    'filter.type': 'Type',
    'filter.all': 'Tous',
    'filter.clear': 'Effacer les filtres',
    
    // Law details
    'law.reference': 'Référence',
    'law.year': 'Année',
    'law.publicationDate': 'Date de publication',
    'law.journalOfficiel': 'Journal Officiel',
    'law.description': 'Description',
     'law.content': 'Contenu',
     'law.pdf_ar': 'Télécharger en arabe',
     'law.pdf_fr': 'Télécharger en français',
     'law.pdf_en': 'Télécharger en anglais',
    
    // Premium
    'premium.required': 'Abonnement Premium requis',
    'premium.upgrade': "Passez à Premium pour accéder à cette fonctionnalité",
    'premium.locked': 'Cette fonctionnalité est réservée aux abonnés Premium',
    
    // Footer
    'footer.about': 'À propos de LexDZ',
    'footer.contact': 'Contactez-nous',
    'footer.privacy': 'Politique de confidentialité',
    'footer.terms': "Conditions d'utilisation",
    'footer.rights': 'Tous droits réservés',
    
    // Common
    'common.loading': 'Chargement...',
    'common.error': 'Une erreur est survenue',
    'common.success': 'Succès',
    'common.close': 'Fermer',
    'common.back': 'Retour',
    'common.new': 'Nouveau',
    'common.viewAll': 'Voir tout',
    'common.openOfficial': 'Ouvrir sur le Journal Officiel',

    // Latest laws section (home)
    'home.latest.title': 'Dernières lois et décrets',
    'home.latest.subtitle': "Suivez les textes juridiques récemment publiés au Journal Officiel de la République Algérienne",
    'home.latest.empty': "Aucune loi publiée pour le moment. Veuillez réessayer plus tard.",
    'home.latest.viewAll': 'Parcourir toute la bibliothèque',

    // Official sources (home)
    'home.sources.title': 'Sources juridiques officielles',
    'home.sources.subtitle': 'Liens directs vers les principaux sites juridiques et institutionnels algériens',
    'home.sources.joradp': 'Journal Officiel de la République Algérienne',
    'home.sources.joradpDesc': "Publication officielle des lois, décrets et ordonnances",
    'home.sources.mjustice': 'Ministère de la Justice',
    'home.sources.mjusticeDesc': "Portail officiel du Ministère de la Justice",
    'home.sources.conseilConst': 'Cour Constitutionnelle',
    'home.sources.conseilConstDesc': "Décisions et avis de la Cour Constitutionnelle",
    'home.sources.conseilEtat': "Conseil d'État",
    'home.sources.conseilEtatDesc': "Plus haute juridiction administrative d'Algérie",
    'home.sources.courSupreme': 'Cour Suprême',
    'home.sources.courSupremeDesc': 'Plus haute juridiction de l’ordre judiciaire',
    'home.sources.apn': 'Assemblée Populaire Nationale',
    'home.sources.apnDesc': 'Première chambre législative',
    'home.sources.conseilNation': 'Conseil de la Nation',
    'home.sources.conseilNationDesc': 'Seconde chambre législative',
    'home.sources.premierMinistre': 'Premier Ministère',
    'home.sources.premierMinistreDesc': 'Portail officiel du Premier Ministère',
    'home.sources.visit': 'Visiter le site',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.laws': 'Legal Library',
    'nav.search': 'Search',
    'nav.assistant': 'AI Assistant',
    'nav.cases': 'Cases',
    'nav.pricing': 'Pricing',
    'nav.dashboard': 'Dashboard',
    'nav.profile': 'Profile',
    'nav.logout': 'Logout',
    'nav.login': 'Login',
    'nav.register': 'Register',
    
    // Hero
    'hero.title': 'Your Algerian Legal Reference',
    'hero.subtitle': 'Comprehensive platform for Algerian legal professionals',
    'hero.cta': 'Get Started Free',
    'hero.learnMore': 'Learn More',
    
    // Features
    'features.title': 'Features',
    'features.library': 'Laws Library',
    'features.libraryDesc': 'Access a comprehensive collection of Algerian laws and regulations',
    'features.search': 'Advanced Search',
    'features.searchDesc': 'Search legal texts quickly and accurately',
    'features.ai': 'Smart Assistant',
    'features.aiDesc': 'Get AI-powered legal recommendations',
    'features.cases': 'Case Management',
    'features.casesDesc': 'Organize your legal files and notes easily',
    
    // Categories
    'categories.title': 'Legal Categories',
    'categories.constitution': 'Algerian Constitution',
    'categories.civil': 'Civil Code',
    'categories.civilProcedure': 'Civil Procedure Code',
    'categories.commercial': 'Commercial Code',
    'categories.penal': 'Penal Code',
    'categories.family': 'Family Code',
    'categories.labor': 'Labor Code',
    'categories.admin': 'Administrative Law',
    'categories.decrees': 'Executive Decrees',
    'categories.orders': 'Presidential Orders',
    'categories.circulaires': 'Ministerial Circulars',
    
    // Buttons
    'btn.read': 'Read More',
    'btn.download': 'Download PDF',
    'btn.submit': 'Submit',
    'btn.cancel': 'Cancel',
    'btn.save': 'Save',
    'btn.delete': 'Delete',
    'btn.edit': 'Edit',
    'btn.export': 'Export',
    'btn.copy': 'Copy',
    'btn.upgrade': 'Upgrade',
    'btn.create': 'Create',
    'btn.archive': 'Archive',
    
    // Forms
    'form.email': 'Email',
    'form.password': 'Password',
    'form.name': 'Full Name',
    'form.confirmPassword': 'Confirm Password',
    'form.profession': 'Profession',
    'form.search': 'Search...',
    'form.caseName': 'Case Name',
    'form.caseDesc': 'Case Description',
    'form.note': 'Note',
    'form.message': 'Your Message',
    
    // Professions
    'profession.lawyer': 'Lawyer',
    'profession.judge': 'Judge',
    'profession.bailiff': 'Bailiff',
    'profession.notary': 'Notary',
    'profession.researcher': 'Researcher',
    'profession.student': 'Student',
    'profession.other': 'Other',
    
    // Pages
    'page.laws': 'Legal Library',
    'page.latestUpdates': 'Latest Updates',
    'page.searchResults': 'Search Results',
    'page.noResults': 'No results found',
    'page.lawDetail': 'Law Details',
    'page.aiAssistant': 'AI Assistant',
    'page.caseManager': 'Case Manager',
    'page.pricing': 'Pricing & Subscriptions',
    'page.dashboard': 'Dashboard',
    'page.profile': 'Profile',
    
    // Auth
    'auth.login': 'Login',
    'auth.register': 'Create Account',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.welcomeBack': 'Welcome Back',
    'auth.createAccount': 'Create Your Free Account',
    'auth.resetPassword': 'Reset Password',
    'auth.resetSent': 'Reset link sent to your email',
    
    // Subscription
    'sub.free': 'Free',
    'sub.premium': 'Premium',
    'sub.price': '499 DZD / month',
    'sub.compare': 'Compare Plans',
    'sub.features.free': 'Access to laws library',
    'sub.features.search': 'Advanced search',
    'sub.features.ai': 'AI Assistant',
    'sub.features.cases': 'Case management',
    'sub.features.export': 'PDF export',
    'sub.features.notes': 'Legal notes',
    'sub.getStarted': 'Get Started',
    'sub.current': 'Current Subscription',
    
    // Tiers
    'tier.free': 'Free',
    'tier.premium': 'Premium',
    
    // AI Assistant
    'ai.placeholder': 'Describe your legal situation here...',
    'ai.description': 'Our smart assistant will analyze your situation and suggest applicable laws and decrees.',
    'ai.history': 'History',
    'ai.newChat': 'New Chat',
    'ai.copyResponse': 'Copy Response',
    'ai.exportPdf': 'Export PDF',
    'ai.sources': 'Sources',
    
    // Cases
    'cases.myCases': 'My Cases',
    'cases.newCase': 'New Case',
    'cases.attachLaw': 'Attach Law',
    'cases.addNote': 'Add Note',
    'cases.archived': 'Archived Cases',
    'cases.noCases': 'No cases yet',
    
    // Dashboard
    'dash.welcome': 'Welcome',
    'dash.stats': 'Statistics',
    'dash.recentActivity': 'Recent Activity',
    'dash.quickActions': 'Quick Actions',
    'dash.viewAll': 'View All',
    'dash.totalLaws': 'Total Laws',
    'dash.myCases': 'My Cases',
    'dash.savedNotes': 'My Notes',
    
    // Filters
    'filter.category': 'Category',
    'filter.year': 'Year',
    'filter.type': 'Type',
    'filter.all': 'All',
     'filter.clear': 'Clear Filters',
     'admin.feed': 'Feed from Official Sources',
     'admin.feed.maxResults': 'Max Results',
    
    // Law details
    'law.reference': 'Reference',
    'law.year': 'Year',
    'law.publicationDate': 'Publication Date',
    'law.journalOfficiel': 'Official Gazette',
    'law.description': 'Description',
     'law.content': 'Content',
     'law.pdf_ar': 'Download Arabic PDF',
     'law.pdf_fr': 'Download French PDF',
     'law.pdf_en': 'Download English PDF',
    
    // Premium
    'premium.required': 'Premium Subscription Required',
    'premium.upgrade': 'Upgrade to access this feature',
    'premium.locked': 'This feature is available to Premium subscribers only',
    
    // Footer
    'footer.about': 'About LexDZ',
    'footer.contact': 'Contact Us',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.rights': 'All Rights Reserved',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.success': 'Success',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.new': 'New',
    'common.viewAll': 'View all',
    'common.openOfficial': 'Open on the Official Gazette',

    // Latest laws section (home)
    'home.latest.title': 'Latest laws and decrees',
    'home.latest.subtitle': 'Follow the legal texts recently published in the Algerian Official Gazette',
    'home.latest.empty': 'No laws published yet. Please try again later.',
    'home.latest.viewAll': 'Browse the full library',

    // Official sources (home)
    'home.sources.title': 'Official legal sources',
    'home.sources.subtitle': 'Direct links to the main Algerian legal and institutional portals',
    'home.sources.joradp': 'Algerian Official Gazette',
    'home.sources.joradpDesc': 'Official publication of laws, decrees and orders',
    'home.sources.mjustice': 'Ministry of Justice',
    'home.sources.mjusticeDesc': 'Official portal of the Algerian Ministry of Justice',
    'home.sources.conseilConst': 'Constitutional Court',
    'home.sources.conseilConstDesc': 'Decisions and opinions of the Constitutional Court',
    'home.sources.conseilEtat': 'Council of State',
    'home.sources.conseilEtatDesc': 'Highest administrative court of Algeria',
    'home.sources.courSupreme': 'Supreme Court',
    'home.sources.courSupremeDesc': 'Highest court of the judicial order',
    'home.sources.apn': 'People’s National Assembly',
    'home.sources.apnDesc': 'First legislative chamber',
    'home.sources.conseilNation': 'Council of the Nation',
    'home.sources.conseilNationDesc': 'Second legislative chamber',
    'home.sources.premierMinistre': 'Prime Ministry',
    'home.sources.premierMinistreDesc': 'Official portal of the Prime Ministry',
    'home.sources.visit': 'Visit website',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ar');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem('lexdz-language') as Language;
    if (savedLang && ['ar', 'fr', 'en'].includes(savedLang)) {
      setLanguageState(savedLang);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language, mounted]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('lexdz-language', lang);
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';
  const currentTranslations = translations[language] || translations.ar;

  if (!mounted) {
    return <div className="min-h-screen bg-white dark:bg-slate-900" />;
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        translations: currentTranslations,
        dir,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}


