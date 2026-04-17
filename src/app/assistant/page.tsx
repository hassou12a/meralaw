'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSession } from 'next-auth/react';
import {
  Bot,
  Send,
  Copy,
  FileText,
  Sparkles,
  Trash2,
  ChevronRight,
  Shield,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{
    law: string;
    article: string;
    reference: string;
  }>;
}

export default function AssistantPage() {
  const router = useRouter();
  const { language, translations: t } = useLanguage();
  const { data: session, status } = useSession();
  const isPremium = session?.user?.plan === 'PRO';

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCase, setSelectedCase] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login?callbackUrl=/assistant');
    }
  }, [session, status, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          caseId: selectedCase,
          history: messages,
        }),
      });

      const data = await res.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content || data.error || 'An error occurred',
        sources: data.sources,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Assistant error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const clearChat = () => {
    setMessages([]);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-navy border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isPremium) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="py-12">
            <Shield className="h-20 w-20 text-gold mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-navy dark:text-white mb-4">
              {t['premium.required']}
            </h2>
            <p className="text-slate-500 mb-8">{t['premium.locked']}</p>
            <Link href="/pricing">
              <Button variant="gold" size="lg" className="px-8">
                {t['btn.upgrade']}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      {/* Sidebar */}
      <aside className="w-80 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="h-6 w-6 text-gold" />
            <h2 className="font-semibold text-navy dark:text-white">{t['page.aiAssistant']}</h2>
          </div>
          <p className="text-sm text-slate-500">{t['ai.description']}</p>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          <div className="mb-4">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 block">
              {language === 'ar' ? 'الملف المرتبط' : language === 'fr' ? 'Dossier lié' : 'Linked Case'}
            </label>
            <select
              value={selectedCase}
              onChange={(e) => setSelectedCase(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
            >
              <option value="">
                {language === 'ar' ? 'بدون ملف' : language === 'fr' ? 'Sans dossier' : 'No case'}
              </option>
              <option value="case-1">
                {language === 'ar' ? 'قضية نزاع عقاري' : 'Affaire contentieux immobilier'}
              </option>
            </select>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {t['ai.history']}
            </h3>
            <button
              onClick={clearChat}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 rounded-lg"
            >
              <Trash2 className="h-4 w-4" />
              {language === 'ar' ? 'محادثة جديدة' : language === 'fr' ? 'Nouvelle conversation' : 'New Chat'}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-navy/10 rounded-lg">
              <Bot className="h-6 w-6 text-navy" />
            </div>
            <div>
              <h1 className="font-semibold text-navy dark:text-white">{t['page.aiAssistant']}</h1>
              <p className="text-xs text-slate-500">
                {language === 'ar' ? 'مدعوم بالذكاء الاصطناعي' : language === 'fr' ? 'alimenté par IA' : 'AI powered'}
              </p>
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <Bot className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400">
                {language === 'ar'
                  ? 'كيف يمكنني مساعدتك؟'
                  : language === 'fr'
                  ? 'Comment puis-je vous aider ?'
                  : 'How can I help you?'}
              </h3>
              <p className="text-slate-500 mt-2 max-w-md mx-auto">
                {language === 'ar'
                  ? 'صف موقفك القانوني وسأقترح عليك القوانين والمراسيم المعمول بها'
                  : language === 'fr'
                  ? 'Décrivez votre situation juridique et je vous suggérerai les lois applicables'
                  : 'Describe your legal situation and I will suggest applicable laws and decrees'}
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-2xl ${
                  message.role === 'user'
                    ? 'bg-navy text-white'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
                } rounded-2xl p-4`}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-200 dark:border-slate-700">
                    <Bot className="h-5 w-5 text-navy" />
                    <span className="text-sm font-medium text-navy">LexDZ AI</span>
                    <button
                      onClick={() => handleCopy(message.content)}
                      className="mr-auto p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                    >
                      <Copy className="h-4 w-4 text-slate-500" />
                    </button>
                  </div>
                )}
                <div className="prose dark:prose-invert max-w-none text-sm">
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>

                {message.sources && message.sources.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-sm font-medium mb-2">{t['ai.sources']}:</p>
                    <ul className="space-y-1">
                      {message.sources.map((source, i) => (
                        <li key={i} className="text-sm flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gold" />
                          <span>
                            {source.law} - {source.article} ({source.reference})
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <Bot className="h-5 w-5 text-navy" />
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-navy rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-navy rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-navy rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t['ai.placeholder']}
              className="flex-1 min-h-[60px] max-h-32"
              dir={language === 'ar' ? 'rtl' : 'ltr'}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <Button
              type="submit"
              size="lg"
              disabled={!input.trim() || loading}
              className="self-end"
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
          <p className="text-xs text-slate-400 mt-2 text-center">
            {language === 'ar'
              ? 'الذكاء الاصطناعي قد يرتكب أخطاء. تحقق من المصادر دائماً.'
              : language === 'fr'
              ? 'L\'IA peut faire des erreurs. Vérifiez toujours les sources.'
              : 'AI may make mistakes. Always verify sources.'}
          </p>
        </div>
      </main>
    </div>
  );
}
