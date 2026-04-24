'use client';

import { useState } from 'react';

type Ansicht = 'formular' | 'laden' | 'ergebnis';

export default function Home() {
  const [ansicht, setAnsicht] = useState<Ansicht>('formular');
  const [formDaten, setFormDaten] = useState({
    markenname: '',
    website: '',
    branche: '',
    herausforderung: '',
  });
  const [report, setReport] = useState('');

  const analyseStarten = async () => {
    setAnsicht('laden');
    try {
      const antwort = await fetch('/api/brandcheck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formDaten),
      });
      const daten = await antwort.json();
      setReport(daten.report);
      setAnsicht('ergebnis');
    } catch {
      alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
      setAnsicht('formular');
    }
  };

  // LADEANSICHT
  if (ansicht === 'laden') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-stone-900 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <p className="text-stone-400 text-xs tracking-widest uppercase">
            Ihre Marke wird analysiert
          </p>
        </div>
      </div>
    );
  }

  // ERGEBNISANSICHT
  if (ansicht === 'ergebnis') {
    return (
      <div className="min-h-screen bg-stone-50 py-16 px-6">
        <div className="max-w-2xl mx-auto">

          <div className="mb-10">
            <p className="text-xs tracking-widest uppercase text-stone-400 mb-1">Spry</p>
            <h1 className="text-3xl font-light text-stone-900">Ihre Markenanalyse</h1>
          </div>

          {/* Report */}
          <div className="bg-white border border-stone-100 p-8 mb-8">
            {(report || '').split('\n').map((zeile, i) => {
              if (zeile.startsWith('## '))
                return <h2 key={i} className="text-xl font-medium text-stone-900 mb-4">{zeile.replace('## ', '')}</h2>;
              if (zeile.startsWith('### '))
                return <h3 key={i} className="text-sm font-semibold text-stone-900 mt-8 mb-2 tracking-wide uppercase">{zeile.replace('### ', '')}</h3>;
              if (zeile.startsWith('**') && zeile.endsWith('**'))
                return <p key={i} className="font-medium text-stone-900 mt-1">{zeile.replace(/\*\*/g, '')}</p>;
              if (zeile === '---')
                return <hr key={i} className="border-stone-100 my-6" />;
              if (zeile === '')
                return <div key={i} className="h-2" />;
              // Fettdruck innerhalb von Zeilen
              const teile = zeile.split(/\*\*(.*?)\*\*/g);
              return (
                <p key={i} className="text-stone-600 leading-relaxed">
                  {teile.map((teil, j) =>
                    j % 2 === 1 ? <strong key={j} className="text-stone-900 font-medium">{teil}</strong> : teil
                  )}
                </p>
              );
            })}
          </div>

          {/* Lead Capture */}
          <div className="bg-stone-900 text-white p-8">
            <p className="text-xs tracking-widest uppercase text-stone-400 mb-1">Nächster Schritt</p>
            <h2 className="text-xl font-light mb-3">Sprechen wir über Ihre Marke.</h2>
            <p className="text-stone-400 text-sm mb-6 leading-relaxed">
              Markus Klingelhöfer – über 30 Jahre Erfahrung auf Beratungs- und Unternehmensseite in nationalen und internationalen Markenprojekten. Persönlich, erfahren, effizient ohne unnötigen Overhead. Hinterlassen Sie Ihre E-Mail und wir melden uns direkt.
            </p>
            <KontaktFormular markenname={formDaten.markenname} />
          </div>

        </div>
      </div>
    );
  }

  // FORMULARANSICHT
  return (
    <div className="min-h-screen bg-stone-50">

      {/* Header */}
      <div className="border-b border-stone-100 bg-white px-6 py-4">
        <p className="text-sm font-semibold tracking-widest uppercase text-stone-900">Spry</p>
      </div>

      {/* Intro */}
      <div className="max-w-2xl mx-auto px-6 pt-16 pb-10">
        <p className="text-xs tracking-widest uppercase text-stone-400 mb-4">BrandCheck</p>
        <h1 className="text-4xl font-light text-stone-900 leading-tight mb-4">
          Wie stark ist Ihre Marke<br />im Zeitalter von KI?
        </h1>
        <p className="text-stone-500 leading-relaxed">
          KI verändert Markenführung fundamental. Wer heute keine klare 
Positionierung hat, wird morgen unsichtbar – überflutet von 
KI-generiertem Content ohne Profil und Haltung.

Spry verbindet über 30 Jahre Markenerfahrung für Konzerne wie BMW, 
Porsche und Bertelsmann mit modernsten KI-Tools. Das Ergebnis: 
schnellere Diagnosen, schärfere Strategien, effizientere Umsetzung – 
zum besten Preis-Leistungs-Verhältnis im Markt.

Starten Sie jetzt. Ihr kostenloser BrandCheck dauert 60 Sekunden.
        </p>
      </div>

      {/* Formular */}
      <div className="max-w-2xl mx-auto px-6 pb-20">
        <div className="bg-white border border-stone-100 p-8 space-y-6">

          <div>
            <label className="block text-xs tracking-widest uppercase text-stone-400 mb-2">
              Markenname *
            </label>
            <input
              type="text"
              placeholder="z.B. Muster GmbH"
              value={formDaten.markenname}
              onChange={e => setFormDaten({ ...formDaten, markenname: e.target.value })}
              className="w-full border border-stone-200 px-4 py-3 text-stone-900 placeholder-stone-300 focus:outline-none focus:border-stone-900 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs tracking-widest uppercase text-stone-400 mb-2">
              Website
            </label>
            <input
              type="text"
              placeholder="z.B. www.muster.de"
              value={formDaten.website}
              onChange={e => setFormDaten({ ...formDaten, website: e.target.value })}
              className="w-full border border-stone-200 px-4 py-3 text-stone-900 placeholder-stone-300 focus:outline-none focus:border-stone-900 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs tracking-widest uppercase text-stone-400 mb-2">
              Branche *
            </label>
            <input
              type="text"
              placeholder="z.B. Maschinenbau, Finanzdienstleistungen, Handel"
              value={formDaten.branche}
              onChange={e => setFormDaten({ ...formDaten, branche: e.target.value })}
              className="w-full border border-stone-200 px-4 py-3 text-stone-900 placeholder-stone-300 focus:outline-none focus:border-stone-900 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs tracking-widest uppercase text-stone-400 mb-2">
              Größte Herausforderung Ihrer Marke
            </label>
            <textarea
              placeholder="Was beschäftigt Sie gerade am meisten, wenn Sie an Ihre Marke denken?"
              value={formDaten.herausforderung}
              onChange={e => setFormDaten({ ...formDaten, herausforderung: e.target.value })}
              rows={3}
              className="w-full border border-stone-200 px-4 py-3 text-stone-900 placeholder-stone-300 focus:outline-none focus:border-stone-900 transition-colors resize-none"
            />
          </div>

          <button
            onClick={analyseStarten}
            disabled={!formDaten.markenname || !formDaten.branche}
            className="w-full bg-stone-900 text-white py-4 text-xs tracking-widest uppercase hover:bg-stone-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Marke analysieren
          </button>

          <p className="text-center text-xs text-stone-300">
            Kostenlos · Unverbindlich · In 60 Sekunden
          </p>

        </div>
      </div>
    </div>
  );
}

function KontaktFormular({ markenname }: { markenname: string }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'laden' | 'erfolg' | 'fehler'>('idle');

  if (status === 'erfolg') {
    return (
      <p className="text-stone-300 text-sm">
        ✓ Vielen Dank. Wir melden uns persönlich bei Ihnen.
      </p>
    );
  }

  const absenden = async () => {
    if (!email) return;
    setStatus('laden');
    try {
      const antwort = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, markenname }),
      });
      if (!antwort.ok) throw new Error();
      setStatus('erfolg');
    } catch {
      setStatus('fehler');
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <input
          type="email"
          placeholder="Ihre E-Mail-Adresse"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && absenden()}
          className="flex-1 bg-stone-800 border border-stone-700 px-4 py-3 text-white placeholder-stone-500 focus:outline-none focus:border-stone-400 transition-colors text-sm"
        />
        <button
          onClick={absenden}
          disabled={!email || status === 'laden'}
          className="bg-white text-stone-900 px-5 py-3 text-xs tracking-widest uppercase hover:bg-stone-100 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'laden' ? '...' : 'Anfragen'}
        </button>
      </div>
      {status === 'fehler' && (
        <p className="text-red-400 text-xs">
          Etwas hat nicht geklappt. Bitte schreiben Sie uns direkt: jo@spry.works
        </p>
      )}
    </div>
  );
}
