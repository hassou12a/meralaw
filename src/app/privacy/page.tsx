export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-navy text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold font-cairo">Privacy Policy</h1>
          <p className="mt-4 max-w-2xl text-slate-300">
            This page explains the main principles for account data, session handling, and support requests.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6 text-sm text-slate-700">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Account Data</h2>
          <p className="mt-2">
            MeraLaw stores the account information needed to authenticate users and personalize the platform.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Legal Searches</h2>
          <p className="mt-2">
            Search logs may be used to improve the relevance of the legal catalog and the search experience.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Support Requests</h2>
          <p className="mt-2">
            Messages sent for support or corrections may be retained to resolve issues and improve the service.
          </p>
        </div>
      </section>
    </div>
  );
}
