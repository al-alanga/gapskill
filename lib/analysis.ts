import { compareSkills, findSkillsInText, SKILLS, type CandidateSkill, type GapResult, type SkillRequirement } from "@/lib/skills";

export interface ExtractedRequirement { skillId: string; evidenceText: string; mandatory: boolean; weight: number; requiredLevel: number; }
export interface AnalysisReport {
 title:string; jobSummary:string; cvSummary:string; compatibilityScore:number|null;
 analysisConfidence:"low"|"medium"|"high"; confidenceExplanation:string;
 requirements:ExtractedRequirement[]; gaps:GapResult[]; matchedSkills:string[];
 notEvidencedSkills:string[]; mandatoryGaps:number; disclaimer:string;
}
const REQUIRED=["obrigatório","obrigatoria","requisito essencial","must have","required","indispensável","indispensavel"];
const PREFERRED=["preferencial","valorizado","desejável","desejavel","nice to have","plus"];
function levelFromEvidence(text:string):number {
 const t=text.toLowerCase();
 if(/especialista|expert|liderar|arquitet(ar|ura)|mais de 8 anos|8\+ anos/.test(t)) return 5;
 if(/avançad[oa]|avancad[oa]|sénior|senior|mais de 5 anos|5\+ anos/.test(t)) return 4;
 if(/intermédio|intermedio|autónom[oa]|autonom[oa]|3 anos|4 anos/.test(t)) return 3;
 if(/básic[oa]|basico|noções|nocoes|1 ano|2 anos/.test(t)) return 2;
 return 1;
}
function makeRequirements(jobText:string):ExtractedRequirement[] {
 const lines=jobText.split(/[\n.!;•]+/).map(s=>s.trim()).filter(s=>s.length>2);
 const found=new Map<string,ExtractedRequirement>();
 for(const skill of findSkillsInText(jobText)) {
  const line=lines.find(l=>findSkillsInText(l).some(s=>s.id===skill.id))??skill.name;
  const lower=line.toLowerCase(), mandatory=REQUIRED.some(m=>lower.includes(m)), preferred=PREFERRED.some(m=>lower.includes(m));
  const item={skillId:skill.id,evidenceText:line.slice(0,500),mandatory,weight:mandatory?3:preferred?1:2,requiredLevel:levelFromEvidence(line)};
  const old=found.get(skill.id); if(!old||item.weight>old.weight) found.set(skill.id,item);
 }
 return [...found.values()];
}
function candidateEvidence(cvText:string):CandidateSkill[] {
 const lines=cvText.split("\n").map(s=>s.trim()).filter(Boolean);
 return findSkillsInText(cvText).map(skill=>{
  const evidenceText=lines.find(line=>findSkillsInText(line).some(s=>s.id===skill.id))??skill.name;
  const demonstrated=/responsável por|responsavel por|executei|implementei|preparei|elaborei|geria|gerenciei|experiência em|experiencia em|worked with|managed|implemented|prepared/i.test(evidenceText);
  return {skillId:skill.id,level:levelFromEvidence(evidenceText),evidence:demonstrated?"demonstrated":"declared",evidenceText:evidenceText.slice(0,500)};
 });
}
function estimateConfidence(job:string,cv:string,count:number) {
 if(job.length>=500&&cv.length>=300&&count>=4) return {confidence:"high" as const,explanation:"Há texto suficiente nos documentos e vários requisitos identificados; a qualidade depende da clareza dos documentos."};
 if(job.length>=180&&cv.length>=120&&count>=2) return {confidence:"medium" as const,explanation:"Foram identificados alguns requisitos e evidências, mas a cobertura pode ser incompleta."};
 return {confidence:"low" as const,explanation:"O texto ou o número de competências identificadas é limitado. Revê os resultados manualmente."};
}
export function analyzeTexts(jobText:string,cvText:string):AnalysisReport {
 const requirements=makeRequirements(jobText), candidates=candidateEvidence(cvText);
 const comparison=compareSkills(requirements.map(({skillId,requiredLevel,weight,mandatory}):SkillRequirement=>({skillId,requiredLevel,weight,mandatory})),candidates);
 const names=new Map(SKILLS.map(s=>[s.id,s.name]));
 const confidence=estimateConfidence(jobText,cvText,requirements.length);
 return {
  title:jobText.split("\n").map(s=>s.trim()).find(s=>s.length>=5&&s.length<=120)??"Oportunidade profissional",
  jobSummary:jobText.slice(0,700),cvSummary:cvText.slice(0,500),compatibilityScore:comparison.score,
  analysisConfidence:confidence.confidence,confidenceExplanation:confidence.explanation,requirements,
  gaps:comparison.results.map(g=>({...g,skillName:names.get(g.skillId)??g.skillName})),
  matchedSkills:comparison.results.filter(g=>g.status==="matched").map(g=>g.skillName),
  notEvidencedSkills:comparison.results.filter(g=>g.status==="not_evidenced").map(g=>g.skillName),
  mandatoryGaps:comparison.mandatoryGaps,
  disclaimer:"Este índice compara requisitos identificados com evidências no texto fornecido. Não é uma probabilidade de contratação. Uma competência não mencionada no CV pode existir; confirma os resultados antes de tomar decisões."
 };
}
