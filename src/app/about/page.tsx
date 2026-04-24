import Link from 'next/link';
import { LibraryBig, Scale, ShieldCheck } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <section className="bg-navy text-white py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm">
            <Scale className="h-4 w-4 text-gold" />
            MeraLaw
          </div>
          <h1 className="mt-6 text-4xl font-bold font-cairo">About MeraLaw</h1>
          <p className="mt-4 max-w-2xl text-slate-300">
            A focused Algerian legal SaaS built to make administrative law easier to browse,
            search, verify, and use in practice.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <LibraryBig className="h-8 w-8 text-navy" />
          <h2 className="mt-4 text-xl font-semibold">Verified Library</h2>
          <p className="mt-2 text-sm text-slate-600">
            The platform is being structured around official JORADP references and direct PDF links.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <ShieldCheck className="h-8 w-8 text-gold" />
          <h2 className="mt-4 text-xl font-semibold">Practical Workflow</h2>
          <p className="mt-2 text-sm text-slate-600">
            Search, law details, case organization, and admin tooling are designed for daily legal work.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <Scale className="h-8 w-8 text-emerald-600" />
          <h2 className="mt-4 text-xl font-semibold">Administrative Focus</h2>
          <p className="mt-2 text-sm text-slate-600">
            Public service, local administration, public procurement, administrative procedure, and public finance.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <Link href="/laws" className="text-navy font-medium hover:underline">
          Browse the legal library
        </Link>
      </div>
    </div>
  );
}
