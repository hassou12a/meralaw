import { buildJoradpUrl } from '@/lib/joradp';

export type CatalogLaw = {
  titleAr: string;
  titleFr: string;
  titleEn: string;
  category: string;
  lawType: string;
  referenceNumber: string;
  year: number;
  publicationDate: string;
  journalOfficiel: string;
  descriptionAr: string;
  descriptionFr: string;
  descriptionEn: string;
  contentAr: string;
  contentFr: string;
  contentEn: string;
  source: string;
  sourceUrl: string;
  pdfUrlAr: string;
  pdfUrlFr: string;
  isPremium: boolean;
  isVerified: boolean;
  tags: string[];
  jorfYear: number;
  jorfNumber: number;
};

type CatalogSeed = Omit<
  CatalogLaw,
  | 'publicationDate'
  | 'journalOfficiel'
  | 'descriptionAr'
  | 'descriptionFr'
  | 'descriptionEn'
  | 'contentAr'
  | 'contentFr'
  | 'contentEn'
  | 'source'
  | 'sourceUrl'
  | 'pdfUrlAr'
  | 'pdfUrlFr'
  | 'isPremium'
  | 'isVerified'
  | 'tags'
> & {
  summaryAr: string;
  summaryFr: string;
  summaryEn: string;
};

const OFFICIAL_SOURCE = 'JORADP';

const ADMINISTRATIVE_LAW_SEEDS: CatalogSeed[] = [
  {
    titleAr: 'الدستور الجزائري',
    titleFr: 'Constitution algérienne',
    titleEn: 'Algerian Constitution',
    category: 'دستور',
    lawType: 'مرسوم رئاسي',
    referenceNumber: '96-438',
    year: 1996,
    jorfYear: 1996,
    jorfNumber: 76,
    summaryAr: 'النص الدستوري المرجعي الذي يؤطر تنظيم السلطات والرقابة على الإدارة والحقوق والحريات.',
    summaryFr: "Texte constitutionnel de référence encadrant l'organisation des pouvoirs, le contrôle de l'administration et les libertés.",
    summaryEn: 'Foundational constitutional text governing public powers, administrative oversight, and rights.',
  },
  {
    titleAr: 'التعديل الدستوري 2020',
    titleFr: 'Révision constitutionnelle de 2020',
    titleEn: '2020 Constitutional Amendment',
    category: 'دستور',
    lawType: 'قانون',
    referenceNumber: '20-01',
    year: 2020,
    jorfYear: 2020,
    jorfNumber: 82,
    summaryAr: 'التعديل الدستوري الأحدث الذي عزز الرقابة الدستورية وبعض مبادئ الحكامة.',
    summaryFr: 'Révision constitutionnelle ayant renforcé le contrôle constitutionnel et plusieurs principes de gouvernance publique.',
    summaryEn: 'Constitutional revision strengthening constitutional review and public governance principles.',
  },
  {
    titleAr: 'قانون الإجراءات المدنية والإدارية',
    titleFr: 'Code de procédure civile et administrative',
    titleEn: 'Code of Civil and Administrative Procedure',
    category: 'إجراءات قضائية إدارية',
    lawType: 'قانون',
    referenceNumber: '08-09',
    year: 2008,
    jorfYear: 2008,
    jorfNumber: 21,
    summaryAr: 'المرجع الأساسي للدعوى الإدارية والطعن ووقف التنفيذ والاختصاص القضائي الإداري.',
    summaryFr: "Référence principale pour le contentieux administratif, l'annulation, le sursis à exécution et les règles de compétence.",
    summaryEn: 'Primary procedural code for administrative litigation, annulment claims, stay of execution, and jurisdiction.',
  },
  {
    titleAr: 'القانون الأساسي العام للوظيفة العمومية',
    titleFr: 'Statut général de la fonction publique',
    titleEn: 'General Civil Service Statute',
    category: 'وظيف عمومي',
    lawType: 'أمر',
    referenceNumber: '06-03',
    year: 2006,
    jorfYear: 2006,
    jorfNumber: 46,
    summaryAr: 'النص المركزي لتنظيم المسار المهني للموظف العمومي وحقوقه وواجباته وتأديبه.',
    summaryFr: 'Texte central régissant la carrière, les droits, obligations et la discipline du fonctionnaire.',
    summaryEn: 'Core civil service statute governing career progression, rights, duties, and discipline of public servants.',
  },
  {
    titleAr: 'المرسوم التنفيذي المتعلق بممارسة حق الإضراب في الوظيف العمومي',
    titleFr: 'Décret exécutif relatif au droit de grève dans la fonction publique',
    titleEn: 'Executive Decree on the Right to Strike in Civil Service',
    category: 'وظيف عمومي',
    lawType: 'مرسوم تنفيذي',
    referenceNumber: '90-02',
    year: 1990,
    jorfYear: 1990,
    jorfNumber: 2,
    summaryAr: 'ينظم شروط ممارسة الإضراب والخدمات الدنيا في المرافق العمومية.',
    summaryFr: 'Organise les conditions d’exercice du droit de grève et le service minimum dans les services publics.',
    summaryEn: 'Regulates strike conditions and minimum service obligations in public services.',
  },
  {
    titleAr: 'قانون البلدية',
    titleFr: 'Loi relative à la commune',
    titleEn: 'Municipality Law',
    category: 'إدارة محلية',
    lawType: 'قانون',
    referenceNumber: '11-10',
    year: 2011,
    jorfYear: 2011,
    jorfNumber: 37,
    summaryAr: 'ينظم البلدية واختصاصاتها وعلاقة المجلس الشعبي البلدي بالإدارة والوصاية.',
    summaryFr: 'Organise la commune, ses compétences et le fonctionnement des organes communaux sous tutelle.',
    summaryEn: 'Defines municipalities, their powers, elected bodies, and supervisory oversight.',
  },
  {
    titleAr: 'قانون الولاية',
    titleFr: 'Loi relative à la wilaya',
    titleEn: 'Wilaya Law',
    category: 'إدارة محلية',
    lawType: 'قانون',
    referenceNumber: '12-07',
    year: 2012,
    jorfYear: 2012,
    jorfNumber: 12,
    summaryAr: 'يحدد تنظيم الولاية واختصاصات الوالي والمجلس الشعبي الولائي والرقابة الإدارية.',
    summaryFr: 'Détermine l’organisation de la wilaya, les compétences du wali et de l’assemblée de wilaya.',
    summaryEn: 'Sets out the structure of the wilaya, powers of the wali, and local administrative oversight.',
  },
  {
    titleAr: 'قانون الصفقات العمومية وتفويضات المرفق العام',
    titleFr: 'Marchés publics et délégations de service public',
    titleEn: 'Public Procurement and Public Service Delegations',
    category: 'صفقات عمومية',
    lawType: 'مرسوم رئاسي',
    referenceNumber: '15-247',
    year: 2015,
    jorfYear: 2015,
    jorfNumber: 50,
    summaryAr: 'الإطار المرجعي لإبرام الصفقات العمومية وتفويضات المرفق العام والرقابة عليها.',
    summaryFr: 'Cadre de référence pour la passation des marchés publics et les délégations de service public.',
    summaryEn: 'Reference framework for public procurement and public service delegation contracts.',
  },
  {
    titleAr: 'تعديل الصفقات العمومية 2023',
    titleFr: 'Modification des marchés publics 2023',
    titleEn: '2023 Public Procurement Amendment',
    category: 'صفقات عمومية',
    lawType: 'مرسوم رئاسي',
    referenceNumber: '23-316',
    year: 2023,
    jorfYear: 2023,
    jorfNumber: 68,
    summaryAr: 'تحديث حديث لمنظومة الصفقات العمومية وإجراءاتها.',
    summaryFr: 'Mise à jour récente du régime des marchés publics et de ses procédures.',
    summaryEn: 'Recent update to the public procurement regime and its procedures.',
  },
  {
    titleAr: 'قانون تنظيم السجن وإعادة الإدماج الاجتماعي للمحبوسين',
    titleFr: "Loi relative à l'organisation pénitentiaire et à la réinsertion sociale",
    titleEn: 'Law on Penitentiary Organization and Social Reintegration',
    category: 'تنظيم إداري',
    lawType: 'قانون',
    referenceNumber: '05-04',
    year: 2005,
    jorfYear: 2005,
    jorfNumber: 12,
    summaryAr: 'نص تنظيمي إداري يتعلق بإدارة المؤسسات العقابية وإعادة الإدماج.',
    summaryFr: 'Texte d’organisation administrative des établissements pénitentiaires et de la réinsertion.',
    summaryEn: 'Administrative organization law for penitentiary institutions and reintegration.',
  },
  {
    titleAr: 'المرسوم التنفيذي المتعلق بتنظيم الإدارة المركزية',
    titleFr: "Décret exécutif relatif à l'organisation de l'administration centrale",
    titleEn: 'Executive Decree on Central Administration Organization',
    category: 'تنظيم إداري',
    lawType: 'مرسوم تنفيذي',
    referenceNumber: '20-140',
    year: 2020,
    jorfYear: 2020,
    jorfNumber: 24,
    summaryAr: 'يضبط هيكلة الإدارة المركزية وتوزيع الصلاحيات داخل المصالح الإدارية.',
    summaryFr: "Fixe l’architecture de l'administration centrale et la répartition des compétences.",
    summaryEn: 'Defines central administration structure and internal distribution of powers.',
  },
  {
    titleAr: 'قانون المالية العامة',
    titleFr: 'Loi relative aux lois de finances',
    titleEn: 'Public Finance Framework Law',
    category: 'مالية عامة',
    lawType: 'قانون',
    referenceNumber: '84-17',
    year: 1984,
    jorfYear: 1984,
    jorfNumber: 28,
    summaryAr: 'ينظم إعداد وتنفيذ قوانين المالية والميزانية العامة والرقابة المالية.',
    summaryFr: 'Organise la préparation, l’exécution et le contrôle des lois de finances.',
    summaryEn: 'Organizes preparation, execution, and control of public finance laws.',
  },
];

function buildLaw(seed: CatalogSeed): CatalogLaw {
  const {
    summaryAr,
    summaryFr,
    summaryEn,
    ...base
  } = seed;

  return {
    ...base,
    publicationDate: `${seed.year}-01-01`,
    journalOfficiel: `JORADP ${seed.jorfNumber}/${seed.jorfYear}`,
    descriptionAr: summaryAr,
    descriptionFr: summaryFr,
    descriptionEn: summaryEn,
    contentAr: `${seed.titleAr}\n\n${summaryAr}\n\nالمصدر الرسمي: الجريدة الرسمية الجزائرية.`,
    contentFr: `${seed.titleFr}\n\n${summaryFr}\n\nSource officielle : Journal officiel algérien.`,
    contentEn: `${seed.titleEn}\n\n${summaryEn}\n\nOfficial source: Algerian Official Gazette.`,
    source: OFFICIAL_SOURCE,
    sourceUrl: buildJoradpUrl(seed.jorfYear, seed.jorfNumber, 'ar'),
    pdfUrlAr: buildJoradpUrl(seed.jorfYear, seed.jorfNumber, 'ar'),
    pdfUrlFr: buildJoradpUrl(seed.jorfYear, seed.jorfNumber, 'fr'),
    isPremium: false,
    isVerified: true,
    tags: [seed.category, seed.lawType, 'administrative-law'],
  };
}

export const ADMINISTRATIVE_LAW_CATALOG: CatalogLaw[] = ADMINISTRATIVE_LAW_SEEDS.map(buildLaw);

export function getAdministrativeLawCatalog(category?: string) {
  if (!category || category === 'all' || category === 'جميع') {
    return ADMINISTRATIVE_LAW_CATALOG;
  }

  const normalized = category.trim().toLowerCase();
  return ADMINISTRATIVE_LAW_CATALOG.filter((law) => {
    return (
      law.category.toLowerCase().includes(normalized) ||
      law.lawType.toLowerCase().includes(normalized) ||
      law.titleAr.toLowerCase().includes(normalized) ||
      law.titleFr.toLowerCase().includes(normalized)
    );
  });
}
