import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileSearch, GitCompare, GraduationCap, ShieldCheck, CircleAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "Metodologia",
  description: "Como a GapSkill compara requisitos profissionais e evidências de competências.",
};

const stages = [
  { icon: FileSearch, number: "01", title: "Identificação dos requisitos", text: "A oportunidade profissional é analisada para identificar competências, qualificações e responsabilidades descritas no anúncio. A qualidade do resultado depende da clareza e completude do texto fornecido." },
  { icon: GitCompare, number: "02", title: "Comparação com o CV", text: "O sistema procura evidências relacionadas com os requisitos identificados. Distingue correspondências, evidências parciais e competências não encontradas no documento." },
  { icon: GraduationCap, number: "03", title: "Orientação para desenvolvimento", text: "As diferenças identificadas podem ajudar a priorizar aprendizagem, experiência prática ou melhoria do CV. A ligação a cursos concretos depende da disponibilidade de um catálogo de formação." },
];

export default function MethodologyPage() {
  return <main className="min-h-screen bg-[#f5f7fa] text-[#172b45]">
    <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5"><Link href="/" className="font-bold text-[#173e78]">GapSkill</Link><Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#173e78]"><ArrowLeft size={16}/> Página inicial</Link></div></header>
    <section className="border-b border-slate-200 bg-white"><div className="mx-auto max-w-5xl px-5 py-14 sm:py-20"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#2458a6]">Transparência e rigor</p><h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-[#142b49] sm:text-5xl">Como funciona o diagnóstico GapSkill</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">A metodologia procura tornar mais clara a relação entre os requisitos publicados no mercado de trabalho e as evidências de competências apresentadas num CV.</p></div></section>
    <section className="mx-auto max-w-5xl px-5 py-12 sm:py-16"><div className="grid gap-4 md:grid-cols-3">{stages.map(({icon:Icon,number,title,text})=><article key={number} className="border border-slate-200 bg-white p-6"><span className="flex h-11 w-11 items-center justify-center bg-[#edf3fb] text-[#2458a6]"><Icon size={22}/></span><p className="mt-6 text-xs font-bold tracking-[.16em] text-[#2458a6]">{number}</p><h2 className="mt-2 text-lg font-semibold text-[#142b49]">{title}</h2><p className="mt-3 text-sm leading-7 text-slate-600">{text}</p></article>)}</div>
      <div className="mt-8 border border-blue-100 bg-blue-50 p-5 sm:p-6"><div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 shrink-0 text-[#2458a6]" size={22}/><div><h2 className="font-semibold text-[#142b49]">Princípios de interpretação</h2><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700"><li>A ausência de uma competência no CV significa ausência de evidência documental, não prova de que a pessoa não possui essa competência.</li><li>O índice de compatibilidade é uma estimativa orientativa, não uma probabilidade de contratação.</li><li>O resultado depende da qualidade do anúncio, do CV e da cobertura da taxonomia de competências.</li><li>O diagnóstico não substitui a avaliação de um recrutador, certificação profissional ou aconselhamento especializado.</li></ul></div></div></div>
      <div className="mt-6 border border-amber-200 bg-amber-50 p-5"><div className="flex items-start gap-3"><CircleAlert className="mt-0.5 shrink-0 text-amber-800" size={22}/><div><h2 className="font-semibold text-amber-950">Estado da versão actual</h2><p className="mt-2 text-sm leading-6 text-amber-900">A versão inicial utiliza uma taxonomia limitada e regras automáticas preliminares. A extração automática de anúncios por URL, o catálogo de cursos e o histórico persistente ainda podem não estar disponíveis. Os resultados devem ser revistos com sentido crítico.</p></div></div></div>
      <div className="mt-10"><Link href="/#analise" className="inline-flex items-center justify-center bg-[#173e78] px-5 py-3 text-sm font-semibold text-white hover:bg-[#2458a6]">Iniciar um diagnóstico</Link></div>
    </section>
    <footer className="border-t border-slate-200 bg-white px-5 py-6 text-center text-xs text-slate-500">GapSkill · Inteligência de competências</footer>
  </main>;
}
