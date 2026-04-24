import { Building2, Mail, Shield } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-navy text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold font-cairo">Contact</h1>
          <p className="mt-4 max-w-2xl text-slate-300">
            Use this page for product support, legal content corrections, and partnership requests.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <Mail className="h-7 w-7 text-navy" />
          <h2 className="mt-4 font-semibold">Email</h2>
          <p className="mt-2 text-sm text-slate-600">contact@meralaw.dz</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <Shield className="h-7 w-7 text-gold" />
          <h2 className="mt-4 font-semibold">Corrections</h2>
          <p className="mt-2 text-sm text-slate-600">Report broken links, metadata issues, or legal text corrections.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <Building2 className="h-7 w-7 text-emerald-600" />
          <h2 className="mt-4 font-semibold">Professional Access</h2>
          <p className="mt-2 text-sm text-slate-600">For chambers, firms, institutions, and training partners.</p>
        </div>
      </section>
    </div>
  );
}
