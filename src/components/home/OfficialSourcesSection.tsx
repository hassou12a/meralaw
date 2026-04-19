'use client';

import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import {
  BookMarked,
  Gavel,
  Landmark,
  Scale,
  Building2,
  Users,
  Crown,
  Briefcase,
  ExternalLink,
} from 'lucide-react';

type Source = {
  key: string;
  url: string;
  icon: React.ElementType;
  accent: string;
};

const sources: Source[] = [
  {
    key: 'joradp',
    url: 'https://www.joradp.dz/',
    icon: BookMarked,
    accent: 'from-gold/20 to-gold/5 text-gold',
  },
  {
    key: 'mjustice',
    url: 'https://www.mjustice.dz/',
    icon: Gavel,
    accent: 'from-navy/20 to-navy/5 text-navy',
  },
  {
    key: 'conseilConst',
    url: 'https://www.cour-constitutionnelle.dz/',
    icon: Landmark,
    accent: 'from-blue-500/20 to-blue-500/5 text-blue-600',
  },
  {
    key: 'conseilEtat',
    url: 'https://www.conseildetat.dz/',
    icon: Scale,
    accent: 'from-indigo-500/20 to-indigo-500/5 text-indigo-600',
  },
  {
    key: 'courSupreme',
    url: 'https://www.coursupreme.dz/',
    icon: Building2,
    accent: 'from-emerald-500/20 to-emerald-500/5 text-emerald-600',
  },
  {
    key: 'apn',
    url: 'https://www.apn.dz/',
    icon: Users,
    accent: 'from-rose-500/20 to-rose-500/5 text-rose-600',
  },
  {
    key: 'conseilNation',
    url: 'https://www.majliselouma.dz/',
    icon: Crown,
    accent: 'from-amber-500/20 to-amber-500/5 text-amber-600',
  },
  {
    key: 'premierMinistre',
    url: 'https://www.premier-ministre.gov.dz/',
    icon: Briefcase,
    accent: 'from-slate-500/20 to-slate-500/5 text-slate-600',
  },
];

export function OfficialSourcesSection() {
  const { translations: t } = useLanguage();

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-3 text-navy dark:text-gold">
            <Landmark className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">
              {t['home.sources.title']}
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-navy dark:text-white mb-3 font-cairo">
            {t['home.sources.title']}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t['home.sources.subtitle']}
          </p>
          <div className="w-20 h-1 bg-gold mx-auto rounded-full mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {sources.map((s) => {
            const Icon = s.icon;
            const title = t[`home.sources.${s.key}`];
            const desc = t[`home.sources.${s.key}Desc`];
            return (
              <a
                key={s.key}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-xl"
              >
                <Card className="h-full border-slate-200 dark:border-slate-700 hover:border-gold hover:shadow-xl transition-all group-hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${s.accent} mb-4`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-navy dark:text-white mb-1 line-clamp-2">
                      {title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                      {desc}
                    </p>
                    <div className="inline-flex items-center gap-1 text-xs font-medium text-gold group-hover:underline">
                      {t['home.sources.visit']}
                      <ExternalLink className="h-3 w-3" />
                    </div>
                    <div className="mt-2 text-[10px] font-mono text-slate-400 truncate" dir="ltr">
                      {s.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                    </div>
                  </CardContent>
                </Card>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
