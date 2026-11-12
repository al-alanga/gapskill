"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, CircleAlert, GraduationCap, Target } from "lucide-react";

type Gap = {
  skillId: string; skillName: string; status: "matched" | "partial" | "not_evidenced";
  requiredLevel: number; candidateLevel: number | null; weight: number; mandatory: boolean; explanation: string;
};
type Report = {
  title: string; compatibilityScore: number | null; analysisConfidence: "low" | "medium" | "high";
  confidenceExplanation: string; requirements: { skillId: string; evidenceText: string; mandatory: boolean; weight: number; requiredLevel: number }[];
  gaps: Gap[]; matchedSkills: string[]; notEvidencedSkills: string[]; mandatoryGaps: number; disclaimer: string;
};
export default function ResultPage() {
  const [report, setReport] = useState<Report | null>(null);
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("gapskill:last-report");
      if (raw) setReport(JSON.parse(raw) as Report);
    } catch { setReport(null); }
  }, []);

  if (!report) return <main className="mx-auto max-w-3xl px-5 py-16"><h1 className="text-2xl font-bold text-ink">Resultado não encontrado</h1><p className="mt-3 text-slate-600">O resultado pode ter expirado ao fechar o navegador. Faz uma nova análise.</p><Link href="/" className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 font-semibold text-white"><ArrowLeft size={18}/> Voltar ao início</Link></main>;

  const score = report.compatibilityScore;
  return <main className="min-h-screen px-5 py-10 sm:py-14">
    <div className="mx-auto max-w-4xl">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-brand"><ArrowLeft size={16}/> Nova análise</Link>
      <header className="mt-7">
        <p className="text-sm font-bold uppercase tracking-[.18em] text-brand">Relatório GapSkill</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">{report.title}</h1>
        <p className="mt-3 max-w-2xl leading-7 text-slate-600">Compara os requisitos que o sistema identificou com evidências encontradas no CV que enviaste.</p>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Índice de compatibilidade</p>
          <p className="mt-2 text-4xl font-bold text-ink">{score === null ? "—" : `${score}%`}</p>
          <p className="mt-2 text-xs leading-5 text-slate-500">Pontuação preliminar baseada apenas nas competências reconhecidas.</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Competências identificadas</p>
          <p className="mt-2 text-4xl font-bold text-emerald-700">{report.matchedSkills.length}</p>
          <p className="mt-2 text-xs leading-5 text-slate-500">Competências com correspondência ao nível estimado.</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Requisitos obrigatórios em falta</p>
          <p className="mt-2 text-4xl font-bold text-amber-700">{report.mandatoryGaps}</p>
          <p className="mt-2 text-xs leading-5 text-slate-500">Requerem revisão; a ausência no CV não prova falta de capacidade.</p>
        </article>
      </section>

      <section className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/70 p-5">
        <div className="flex items-start gap-3"><Target className="mt-1 shrink-0 text-brand" size={21}/><div><h2 className="font-bold text-ink">Confiança da análise: {report.analysisConfidence === "high" ? "alta" : report.analysisConfidence === "medium" ? "média" : "baixa"}</h2><p className="mt-1 text-sm leading-6 text-slate-600">{report.confidenceExplanation}</p></div></div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-ink">Competências e lacunas</h2>
        {report.gaps.length === 0 ? <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900"><CircleAlert className="mb-2" size={20}/>Não foi possível reconhecer competências da taxonomia inicial no anúncio. A taxonomia ainda é limitada; revê o texto e não interpretes este resultado como avaliação definitiva.</div> :
        <div className="mt-4 space-y-3">{report.gaps.map(gap => <article key={gap.skillId} className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><h3 className="font-semibold text-ink">{gap.skillName}</h3><p className="mt-1 text-sm text-slate-500">{gap.mandatory ? "Requisito marcado como obrigatório" : "Requisito identificado"} · Nível exigido estimado: {gap.requiredLevel}/5</p></div>
            <span className={gap.status === "matched" ? "rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700" : gap.status === "partial" ? "rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800" : "rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"}>{gap.status === "matched" ? "Correspondência" : gap.status === "partial" ? "Parcial" : "Sem evidência no CV"}</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">{gap.explanation}</p>
        </article>)}</div>}
      </section>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex items-center gap-3"><GraduationCap className="text-brand" size={24}/><h2 className="text-xl font-bold text-ink">Próximo passo: formação</h2></div>
        <p className="mt-3 leading-7 text-slate-600">O catálogo de cursos ainda não está ligado. Usa as competências marcadas como parciais ou sem evidência como lista inicial de temas para estudar; as recomendações de cursos serão ativadas numa fase seguinte.</p>
        <div className="mt-4 flex flex-wrap gap-2">{report.gaps.filter(g=>g.status!=="matched").slice(0,8).map(g=><span key={g.skillId} className="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700">{g.skillName}</span>)}</div>
      </section>

      <div className="mt-8 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950"><CircleAlert className="mt-0.5 shrink-0" size={20}/><p>{report.disclaimer} O resultado é preliminar, usa uma taxonomia limitada e não é guardado numa conta nem numa base de dados nesta versão.</p></div>
      <div className="mt-8 flex justify-center"><Link href="/" className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 font-semibold text-white"><CheckCircle2 size={18}/> Analisar outra oportunidade</Link></div>
    </div>
  </main>;
}
