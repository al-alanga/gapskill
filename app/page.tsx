"use client";

import { FormEvent, useState } from "react";
import {
  ArrowRight, BrainCircuit, BriefcaseBusiness, CheckCircle2, FileText,
  GraduationCap, Link2, MessageCircle, ShieldCheck, Sparkles, Target, UploadCloud,
} from "lucide-react";

type SubmitState = { kind: "idle" } | { kind: "loading" } | { kind: "success"; message: string } | { kind: "error"; message: string };

const steps = [
  { number: "01", title: "Partilha a oportunidade", text: "Cola a descrição da vaga ou partilha o link para referência." },
  { number: "02", title: "Envia o teu CV", text: "O teu perfil será comparado com os requisitos identificados na oportunidade." },
  { number: "03", title: "Descobre os teus gaps", text: "Recebe um diagnóstico inicial das competências identificadas e das lacunas." },
];

export default function HomePage() {
  const [jobUrl, setJobUrl] = useState("");
  const [jobText, setJobText] = useState("");
  const [cv, setCv] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<SubmitState>({ kind: "idle" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!consent) {
      setState({ kind: "error", message: "Confirma que compreendes como os teus dados serão utilizados para esta análise." });
      return;
    }
    if (!jobUrl.trim() && !jobText.trim()) {
      setState({ kind: "error", message: "Cola a descrição da vaga ou indica o URL. A leitura automática de links ainda não está disponível." });
      return;
    }
    if (!cv) {
      setState({ kind: "error", message: "Carrega o teu CV em PDF ou DOCX." });
      return;
    }

    setState({ kind: "loading" });
    const formData = new FormData();
    formData.set("jobUrl", jobUrl);
    formData.set("jobText", jobText);
    formData.set("cv", cv);
    formData.set("consent", "true");

    try {
      const response = await fetch("/api/analyze", { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Não foi possível enviar a análise.");
      if (data.status === "completed" && data.report) {
        sessionStorage.setItem("gapskill:last-report", JSON.stringify(data.report));
        window.location.assign("/resultado");
        return;
      }
      if (data.code === "JOB_TEXT_REQUIRED") {
        setState({ kind: "error", message: data.error });
        return;
      }
      setState({ kind: "success", message: data.message ?? "Submissão recebida." });
    } catch (error) {
      setState({ kind: "error", message: error instanceof Error ? error.message : "Ocorreu um erro inesperado." });
    }
  }

  return (
    <main className="min-h-screen overflow-hidden">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
        <a href="#" className="flex items-center gap-3" aria-label="GapSkill início">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white shadow-soft"><BrainCircuit size={23} /></span>
          <span className="text-xl font-bold tracking-tight">gap<span className="text-brand">skill</span></span>
        </a>
        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
          <a href="#como-funciona" className="hover:text-brand">Como funciona</a>
          <a href="#beneficios" className="hover:text-brand">O que vais descobrir</a>
          <a href="#analise" className="rounded-full bg-ink px-5 py-2.5 text-white transition hover:bg-brand">Analisar uma vaga</a>
        </nav>
        <a href="#analise" className="rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white md:hidden">Começar</a>
      </header>

      <section className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-12 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-8 lg:pb-28 lg:pt-20">
        <div className="absolute -left-36 top-10 -z-10 h-80 w-80 rounded-full bg-blue-100/70 blur-3xl" />
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1.5 text-xs font-semibold text-brand shadow-sm"><Sparkles size={14} /> O teu próximo passo profissional começa aqui</div>
          <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl lg:text-6xl">O que te falta para chegares à <span className="text-brand">próxima oportunidade?</span></h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">Compara o teu CV com uma vaga real, identifica competências a desenvolver e descobre formações alinhadas com os teus objetivos profissionais.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#analise" className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-blue-700">Analisar uma vaga <ArrowRight size={18} /></a>
            <a href="#como-funciona" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 font-semibold text-ink transition hover:border-slate-300">Como funciona</a>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
            <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-600" /> Orientado a vagas reais</span>
            <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-emerald-600" /> Privacidade em primeiro lugar</span>
          </div>
        </div>

        <div id="analise" className="scroll-mt-8 rounded-3xl border border-white bg-white p-6 shadow-soft sm:p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div><p className="text-sm font-semibold text-brand">ANÁLISE DE OPORTUNIDADE</p><h2 className="mt-2 text-2xl font-bold tracking-tight text-ink">Começa com dois elementos</h2><p className="mt-2 text-sm leading-6 text-slate-500">A descrição da vaga e o teu CV. Sem cadastro empresarial.</p></div>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-brand"><Target size={24} /></span>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="jobUrl" className="mb-2 block text-sm font-semibold text-ink">Link da oportunidade (opcional se colares a descrição)</label>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 transition focus-within:border-brand focus-within:ring-4 focus-within:ring-blue-50">
                <Link2 size={19} className="shrink-0 text-slate-400" />
                <input id="jobUrl" type="url" value={jobUrl} onChange={(event) => setJobUrl(event.target.value)} placeholder="https://site.com/vaga..." className="min-w-0 flex-1 py-4 text-sm outline-none placeholder:text-slate-400" />
              </div>
              <p className="mt-2 text-xs text-slate-500">A leitura automática de links ainda está em desenvolvimento. Por agora, cola a descrição abaixo.</p>
            </div>
            <div>
              <label htmlFor="jobText" className="mb-2 block text-sm font-semibold text-ink">Descrição da vaga</label>
              <textarea id="jobText" value={jobText} onChange={(event) => setJobText(event.target.value)} rows={5} maxLength={30000} placeholder="Cola aqui o texto completo do anúncio: responsabilidades, requisitos e qualificações..." className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none transition focus:border-brand focus:ring-4 focus:ring-blue-50" />
              <p className="mt-2 text-xs text-slate-500">{jobText.length.toLocaleString("pt-PT")} / 30.000 caracteres</p>
            </div>
            <div>
              <label htmlFor="cv" className="mb-2 block text-sm font-semibold text-ink">O teu Curriculum Vitae</label>
              <label htmlFor="cv" className="flex cursor-pointer items-center gap-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/70 p-4 transition hover:border-brand hover:bg-blue-50/50">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-brand shadow-sm"><UploadCloud size={22} /></span>
                <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-ink">{cv ? cv.name : "Escolhe o teu CV"}</span><span className="mt-1 block text-xs text-slate-500">PDF ou DOCX · Máximo 8 MB</span></span>
                <FileText size={20} className="shrink-0 text-slate-400" />
                <input id="cv" type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="sr-only" onChange={(event) => setCv(event.target.files?.[0] ?? null)} />
              </label>
            </div>
            <label className="flex items-start gap-3 text-xs leading-5 text-slate-500">
              <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1 h-4 w-4 rounded border-slate-300 accent-brand" />
              <span>Autorizo a utilização do URL e do CV para processar esta análise. A utilização dos dados para inteligência agregada deverá ser objeto de consentimento próprio.</span>
            </label>
            <button type="submit" disabled={state.kind === "loading"} className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60">
              {state.kind === "loading" ? "A validar submissão..." : "Enviar para análise"} <ArrowRight size={18} />
            </button>
            {state.kind === "success" && <div role="status" className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">{state.message}</div>}
            {state.kind === "error" && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{state.message}</div>}
            <p className="text-center text-xs text-slate-400">Nesta versão inicial, a submissão é validada; a extração e análise reais ainda não estão ativadas.</p>
          </form>
        </div>
      </section>

      <section id="como-funciona" className="border-y border-slate-200/70 bg-white py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto max-w-2xl text-center"><p className="text-sm font-bold uppercase tracking-[.18em] text-brand">Simples e orientado a resultados</p><h2 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl">Três passos para conheceres os teus gaps</h2><p className="mt-4 leading-7 text-slate-600">Sem depender de as empresas criarem contas ou preencherem formulários na plataforma.</p></div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {steps.map((step) => <article key={step.number} className="rounded-2xl border border-slate-200 p-6 transition hover:-translate-y-1 hover:shadow-soft"><p className="text-sm font-bold text-brand">{step.number}</p><h3 className="mt-5 text-xl font-bold text-ink">{step.title}</h3><p className="mt-3 leading-7 text-slate-600">{step.text}</p></article>)}
          </div>
        </div>
      </section>

      <section id="beneficios" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div><p className="text-sm font-bold uppercase tracking-[.18em] text-brand">Mais do que analisar um CV</p><h2 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl">Transforma lacunas em próximos passos.</h2><p className="mt-4 leading-7 text-slate-600">A plataforma liga requisitos de oportunidades reais a competências e formações relevantes. O objetivo não é prometer emprego: é ajudar-te a preparar melhor o teu próximo passo.</p></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-2xl bg-white p-5 shadow-sm"><BriefcaseBusiness className="text-brand" size={25} /><h3 className="mt-4 font-bold">Vagas reais</h3><p className="mt-2 text-sm leading-6 text-slate-600">Começa pelas exigências publicadas pelos empregadores.</p></article>
            <article className="rounded-2xl bg-white p-5 shadow-sm"><Target className="text-brand" size={25} /><h3 className="mt-4 font-bold">Gaps claros</h3><p className="mt-2 text-sm leading-6 text-slate-600">Distingue competências identificadas de competências sem evidência.</p></article>
            <article className="rounded-2xl bg-white p-5 shadow-sm"><GraduationCap className="text-brand" size={25} /><h3 className="mt-4 font-bold">Formação útil</h3><p className="mt-2 text-sm leading-6 text-slate-600">Descobre opções de aprendizagem alinhadas com as lacunas.</p></article>
            <article className="rounded-2xl bg-white p-5 shadow-sm"><MessageCircle className="text-emerald-600" size={25} /><h3 className="mt-4 font-bold">Web e WhatsApp</h3><p className="mt-2 text-sm leading-6 text-slate-600">A mesma plataforma, com canais de acesso diferentes.</p></article>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <a href="#" className="font-bold text-ink">gap<span className="text-brand">skill</span></a>
          <p>Inteligência de competências para o desenvolvimento profissional.</p>
          <p>© {new Date().getFullYear()} GapSkill</p>
        </div>
      </footer>
    </main>
  );
}
