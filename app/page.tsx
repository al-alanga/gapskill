"use client";

import { FormEvent, useState } from "react";
import {
  ArrowDown, ArrowRight, BrainCircuit, BriefcaseBusiness, CheckCircle2,
  FileText, GraduationCap, Link2, LockKeyhole, ShieldCheck, Target,
  UploadCloud, ChartNoAxesCombined, Building2, ChevronRight,
} from "lucide-react";

type SubmitState = { kind: "idle" } | { kind: "loading" } | { kind: "success"; message: string } | { kind: "error"; message: string };

const steps = [
  { number: "01", title: "Escolha uma oportunidade", text: "Utilize uma vaga publicada e forneça os requisitos para análise." },
  { number: "02", title: "Submeta o seu CV", text: "O sistema identifica competências e evidências no documento enviado." },
  { number: "03", title: "Receba um diagnóstico", text: "Consulte correspondências, lacunas e áreas prioritárias de desenvolvimento." },
];

const principles = [
  { icon: BriefcaseBusiness, title: "Orientada pelo mercado", text: "Parte dos requisitos divulgados em oportunidades reais de trabalho." },
  { icon: Target, title: "Focada em competências", text: "Organiza os requisitos e as evidências do CV para facilitar a comparação." },
  { icon: GraduationCap, title: "Ligada ao desenvolvimento", text: "Ajuda a identificar temas de aprendizagem relevantes para os próximos passos." },
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
      setState({ kind: "error", message: "Confirme que compreende como os seus dados serão utilizados nesta análise." });
      return;
    }
    if (!jobUrl.trim() && !jobText.trim()) {
      setState({ kind: "error", message: "Insira a descrição da oportunidade ou indique o URL. A leitura automática de links ainda não está disponível." });
      return;
    }
    if (!cv) {
      setState({ kind: "error", message: "Carregue o seu CV em PDF ou DOCX." });
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
      if (!response.ok) throw new Error(data.error ?? "Não foi possível concluir a análise.");
      if (data.status === "completed" && data.report) {
        sessionStorage.setItem("gapskill:last-report", JSON.stringify(data.report));
        window.location.assign("/resultado");
        return;
      }
      setState({ kind: "success", message: data.message ?? "Submissão recebida." });
    } catch (error) {
      setState({ kind: "error", message: error instanceof Error ? error.message : "Ocorreu um erro inesperado." });
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f7fa] text-[#172b45]">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <a href="#" className="flex items-center gap-3" aria-label="GapSkill — página inicial">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#173e78] text-white"><BrainCircuit size={24} strokeWidth={1.8}/></span>
            <span><span className="block text-xl font-bold tracking-tight text-[#173e78]">GapSkill</span><span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[.19em] text-slate-500">Inteligência de competências</span></span>
          </a>
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="/metodologia" className="transition hover:text-[#173e78]">Metodologia</a>
            <a href="#aplicacoes" className="transition hover:text-[#173e78]">Aplicações</a>
            <a href="#analise" className="inline-flex items-center gap-2 rounded-md bg-[#173e78] px-5 py-3 font-semibold text-white transition hover:bg-[#2458a6]">Iniciar diagnóstico <ArrowRight size={16}/></a>
          </nav>
          <a href="#analise" className="rounded-md bg-[#173e78] px-4 py-2.5 text-sm font-semibold text-white md:hidden">Começar</a>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="absolute inset-0 opacity-40" aria-hidden="true" style={{backgroundImage:"linear-gradient(to right, #e7edf5 1px, transparent 1px), linear-gradient(to bottom, #e7edf5 1px, transparent 1px)",backgroundSize:"48px 48px",maskImage:"linear-gradient(to right, black, transparent 90%)"}}/>
        <div className="relative mx-auto grid max-w-7xl gap-14 px-5 py-16 sm:py-20 lg:grid-cols-[1.08fr_.92fr] lg:items-center lg:px-8 lg:py-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 border-l-[3px] border-[#2458a6] bg-[#edf3fb] px-3 py-2 text-xs font-bold uppercase tracking-[.12em] text-[#173e78]"><span className="h-1.5 w-1.5 rounded-full bg-[#2458a6]"/> Desenvolvimento profissional baseado em evidências</div>
            <h1 className="max-w-3xl text-[2.65rem] font-semibold leading-[1.08] tracking-[-.045em] text-[#142b49] sm:text-5xl lg:text-[3.65rem]">Transforme requisitos do mercado em <span className="text-[#2458a6]">competências para o futuro.</span></h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">A GapSkill compara os requisitos de uma oportunidade profissional com as competências evidenciadas no seu CV, ajudando a identificar lacunas e prioridades de desenvolvimento.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#analise" className="inline-flex items-center justify-center gap-2 rounded-md bg-[#173e78] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2458a6]">Iniciar diagnóstico <ArrowRight size={17}/></a>
              <a href="/metodologia" className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-[#173e78] transition hover:border-[#2458a6]">Conhecer a metodologia <ArrowRight size={16}/></a>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-slate-200 pt-5 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2"><ShieldCheck size={17} className="text-[#2458a6]"/> Utilização responsável de dados</span>
              <span className="inline-flex items-center gap-2"><CheckCircle2 size={17} className="text-[#2458a6]"/> Resultados explicáveis</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[520px] lg:ml-auto">
            <div className="absolute -right-5 -top-5 h-28 w-28 border-r-2 border-t-2 border-[#b9cce7]" aria-hidden="true"/>
            <div className="absolute -bottom-5 -left-5 h-28 w-28 border-b-2 border-l-2 border-[#b9cce7]" aria-hidden="true"/>
            <div className="relative border border-slate-200 bg-white p-5 shadow-[0_24px_70px_rgba(20,43,73,.12)] sm:p-7">
              <div className="flex items-start justify-between border-b border-slate-200 pb-5">
                <div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#2458a6]">Visão do diagnóstico</p><h2 className="mt-2 text-lg font-semibold text-[#142b49]">Competências em contexto</h2><p className="mt-1 text-xs text-slate-500">Exemplo ilustrativo de como a análise é organizada</p></div>
                <span className="flex h-10 w-10 items-center justify-center bg-[#edf3fb] text-[#2458a6]"><ChartNoAxesCombined size={21}/></span>
              </div>
              <div className="space-y-5 py-6">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm"><span className="font-semibold text-[#142b49]">Requisitos identificados</span><span className="text-xs text-slate-500">Anúncio profissional</span></div>
                  <div className="flex flex-wrap gap-2"><span className="border border-[#c9d9ee] bg-[#f3f7fc] px-2.5 py-1.5 text-xs text-[#244b7b]">Análise de dados</span><span className="border border-[#c9d9ee] bg-[#f3f7fc] px-2.5 py-1.5 text-xs text-[#244b7b]">Relatórios</span><span className="border border-[#c9d9ee] bg-[#f3f7fc] px-2.5 py-1.5 text-xs text-[#244b7b]">Excel</span></div>
                </div>
                <div className="flex justify-center"><span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-[#2458a6]"><ArrowDown size={17}/></span></div>
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm"><span className="font-semibold text-[#142b49]">Evidências no CV</span><span className="text-xs text-slate-500">Documento submetido</span></div>
                  <div className="space-y-2.5">
                    <div><div className="mb-1.5 flex justify-between text-xs"><span className="text-slate-600">Relatórios</span><span className="font-semibold text-emerald-700">Identificada</span></div><div className="h-1.5 bg-slate-100"><div className="h-1.5 w-[82%] bg-emerald-600"/></div></div>
                    <div><div className="mb-1.5 flex justify-between text-xs"><span className="text-slate-600">Excel</span><span className="font-semibold text-amber-700">Parcial</span></div><div className="h-1.5 bg-slate-100"><div className="h-1.5 w-[54%] bg-amber-500"/></div></div>
                    <div><div className="mb-1.5 flex justify-between text-xs"><span className="text-slate-600">Análise de dados</span><span className="font-semibold text-slate-500">Sem evidência</span></div><div className="h-1.5 bg-slate-100"><div className="h-1.5 w-[18%] bg-slate-400"/></div></div>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 border-t border-slate-200 bg-[#f7f9fc] p-4"><Target className="mt-0.5 shrink-0 text-[#2458a6]" size={19}/><p className="text-xs leading-5 text-slate-600">A ausência de uma competência no CV significa falta de evidência documental — não prova que a pessoa não a possua.</p></div>
            </div>
            <p className="mt-4 text-center text-[10px] uppercase tracking-[.15em] text-slate-400">Modelo visual demonstrativo · Não representa resultados de um candidato real</p>
          </div>
        </div>
      </section>

      <section id="metodologia" className="border-b border-slate-200 bg-[#f5f7fa] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#2458a6]">Metodologia</p><h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#142b49] sm:text-4xl">Uma abordagem clara, em três etapas.</h2><p className="mt-4 leading-7 text-slate-600">Um processo estruturado para relacionar a procura do mercado com as evidências do perfil profissional.</p></div>
          <div className="mt-10 grid gap-0 border border-slate-200 bg-white md:grid-cols-3">
            {steps.map((step,index)=><article key={step.number} className={`p-6 sm:p-8 ${index<2?"border-b md:border-b-0 md:border-r border-slate-200":""}`}><p className="text-sm font-bold tracking-[.15em] text-[#2458a6]">{step.number}</p><h3 className="mt-5 text-lg font-semibold text-[#142b49]">{step.title}</h3><p className="mt-3 text-sm leading-7 text-slate-600">{step.text}</p></article>)}
          </div>
        </div>
      </section>

      <section id="aplicacoes" className="border-b border-slate-200 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
            <div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#2458a6]">Aplicações</p><h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#142b49] sm:text-4xl">Informação para orientar o próximo passo.</h2><p className="mt-4 leading-7 text-slate-600">A plataforma foi concebida para apoiar profissionais, candidatos e iniciativas de formação com uma leitura mais estruturada dos requisitos de competências.</p></div>
            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {principles.map(({icon:Icon,title,text})=><article key={title} className="flex gap-4 py-5"><span className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#edf3fb] text-[#2458a6]"><Icon size={21}/></span><div><h3 className="font-semibold text-[#142b49]">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{text}</p></div><ChevronRight size={18} className="ml-auto mt-1 shrink-0 text-slate-300"/></article>)}
            </div>
          </div>
        </div>
      </section>

      <section id="analise" className="scroll-mt-24 bg-[#142b49] py-16 text-white sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[.78fr_1.22fr] lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#a9c9f5]">Iniciar análise</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Comece com uma oportunidade e o seu CV.</h2>
            <p className="mt-5 leading-7 text-slate-300">Não é necessário que a empresa se registe. Utilize o anúncio publicado e o seu documento profissional para obter um diagnóstico preliminar.</p>
            <div className="mt-8 space-y-4 text-sm text-slate-300"><p className="flex items-center gap-3"><FileText size={18} className="text-[#a9c9f5]"/> CV em PDF ou DOCX, até 8 MB</p><p className="flex items-center gap-3"><LockKeyhole size={18} className="text-[#a9c9f5]"/> Submissão com consentimento explícito</p><p className="flex items-center gap-3"><Building2 size={18} className="text-[#a9c9f5]"/> Sem registo empresarial</p></div>
          </div>
          <div className="bg-white p-5 text-[#172b45] shadow-[0_20px_60px_rgba(0,0,0,.18)] sm:p-8">
            <div className="mb-6 border-b border-slate-200 pb-5"><h3 className="text-xl font-semibold text-[#142b49]">Dados para o diagnóstico</h3><p className="mt-2 text-sm leading-6 text-slate-500">Preencha os campos abaixo. A descrição da vaga é necessária enquanto a leitura automática de links está em desenvolvimento.</p></div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div><label htmlFor="jobUrl" className="mb-2 block text-sm font-semibold text-[#142b49]">Link da oportunidade <span className="font-normal text-slate-400">(opcional)</span></label><div className="flex items-center gap-3 border border-slate-300 px-3 focus-within:border-[#2458a6] focus-within:ring-2 focus-within:ring-blue-100"><Link2 size={18} className="shrink-0 text-slate-400"/><input id="jobUrl" type="url" value={jobUrl} onChange={e=>setJobUrl(e.target.value)} placeholder="https://..." className="min-w-0 flex-1 py-3.5 text-sm outline-none placeholder:text-slate-400"/></div></div>
              <div><label htmlFor="jobText" className="mb-2 block text-sm font-semibold text-[#142b49]">Descrição da oportunidade <span className="text-red-600">*</span></label><textarea id="jobText" value={jobText} onChange={e=>setJobText(e.target.value)} rows={5} maxLength={30000} placeholder="Insira responsabilidades, requisitos e qualificações indicados no anúncio..." className="w-full resize-y border border-slate-300 px-3.5 py-3 text-sm leading-6 outline-none transition focus:border-[#2458a6] focus:ring-2 focus:ring-blue-100"/><p className="mt-1.5 text-right text-xs text-slate-400">{jobText.length.toLocaleString("pt-PT")} / 30.000 caracteres</p></div>
              <div><label htmlFor="cv" className="mb-2 block text-sm font-semibold text-[#142b49]">Curriculum Vitae <span className="text-red-600">*</span></label><label htmlFor="cv" className="flex cursor-pointer items-center gap-3 border border-dashed border-slate-300 bg-slate-50 p-4 transition hover:border-[#2458a6] hover:bg-blue-50"><span className="flex h-10 w-10 items-center justify-center bg-white text-[#2458a6]"><UploadCloud size={21}/></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{cv?cv.name:"Seleccione um ficheiro"}</span><span className="mt-1 block text-xs text-slate-500">PDF ou DOCX · Máximo 8 MB</span></span><input id="cv" type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="sr-only" onChange={e=>setCv(e.target.files?.[0]??null)}/></label></div>
              <label className="flex items-start gap-3 text-xs leading-5 text-slate-600"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} className="mt-1 h-4 w-4 accent-[#2458a6]"/><span>Autorizo o tratamento do URL e do CV para realizar esta análise. Qualquer utilização para inteligência agregada requer consentimento separado.</span></label>
              <button type="submit" disabled={state.kind==="loading"} className="flex w-full items-center justify-center gap-2 bg-[#173e78] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#2458a6] disabled:cursor-wait disabled:opacity-60">{state.kind==="loading"?"A processar submissão...":"Solicitar diagnóstico"} <ArrowRight size={17}/></button>
              {state.kind==="success"&&<div role="status" className="border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">{state.message}</div>}
              {state.kind==="error"&&<div role="alert" className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">{state.message}</div>}
              <p className="text-xs leading-5 text-slate-400">A análise é preliminar. Competências não mencionadas no CV podem existir. Os resultados desta versão não são guardados numa conta.</p>
            </form>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <a href="#" className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center bg-[#173e78] text-white"><BrainCircuit size={19}/></span><span><span className="block font-bold text-[#173e78]">GapSkill</span><span className="block text-[10px] uppercase tracking-[.16em] text-slate-500">Inteligência de competências</span></span></a>
          <div className="flex flex-wrap gap-4 text-sm text-slate-500"><a className="hover:text-[#173e78]" href="/metodologia">Metodologia</a><a className="hover:text-[#173e78]" href="/privacidade">Privacidade</a></div>
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} GapSkill</p>
        </div>
      </footer>
    </main>
  );
}
