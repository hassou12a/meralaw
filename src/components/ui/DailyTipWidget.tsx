'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Lightbulb, X } from 'lucide-react';

const tips = {
  ar: [
    { title: 'مبدأ عدم جوازiefs', content: 'لا يجوز للمحكمة أن تقضي بشيء لم يطلبه الخصوم، وفقاً لمبدأ الطلب.' },
    { title: 'التقادم في القانون المدني', content: 'التقادم عشرون سنة ما لم يرد نص يقصره، وفقاً للمادة 321 من القانون المدني.' },
    { title: 'حجية الأمر المقضي به', content: 'الحكم النهائي يكتسب حجية الشيء المقضي به، ولا يجوز إعادة مناقشته.' },
    { title: 'مبدأ سلامة الإجراءات', content: 'يضمن القانون حق الدفاع والمحاكمة العادلة لكل متهم.' },
    { title: 'الالتزام بالتعويض', content: 'كل ضرر يستوجب تعويضاً، ما لم يكن ناتجاً عن قوة قاهرة.' },
  ],
  fr: [
    { title: 'Principe de la demande', content: 'Le juge ne peut statuer sur ce qui n\'a pas été demandé par les parties.' },
    { title: 'Prescription en droit civil', content: 'La prescription est de 20 ans sauf texte particulier, selon l\'article 321 du Code civil.' },
    { title: 'Autorités de la chose jugée', content: 'Le jugement définitif acquiert l\'autorité de la chose jugée.' },
    { title: 'Droit de la défense', content: 'Tout accusé a droit à un procès équitable et à la défense.' },
    { title: 'Responsabilité délictuelle', content: 'Tout dommage ouvre droit à réparation, sauf force majeure.' },
  ],
  en: [
    { title: 'Principle of Claim', content: 'The court cannot rule on what has not been requested by the parties.' },
    { title: 'Prescription in Civil Law', content: 'Prescription is 20 years unless otherwise stipulated, per Article 321.' },
    { title: 'Res Judicata', content: 'Final judgments acquire the authority of res judicata.' },
    { title: 'Right to Defense', content: 'Every accused has the right to a fair trial and defense.' },
    { title: 'Tort Liability', content: 'Every damage gives right to compensation, except in cases of force majeure.' },
  ],
};

export function DailyTipWidget() {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips[language].length);
    }, 10000);
    return () => clearInterval(interval);
  }, [isVisible, language]);

  if (dismissed) return null;

  const languageTips = tips[language] || tips.fr;
  const tip = languageTips[currentTip];

  return (
    <div
      className={`fixed bottom-4 left-4 z-40 transition-all duration-500 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}
    >
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-4 max-w-sm">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-gold/10 rounded-lg">
            <Lightbulb className="h-5 w-5 text-gold" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gold uppercase tracking-wide">
                {language === 'ar' ? 'نصيحة اليوم' : language === 'fr' ? 'Conseil du jour' : 'Daily Tip'}
              </span>
              <button
                onClick={() => setDismissed(true)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <h4 className="font-semibold text-navy dark:text-white text-sm mb-1">{tip.title}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">{tip.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
}