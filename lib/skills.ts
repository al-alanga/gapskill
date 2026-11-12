export type SkillCategory =
  | "technical"
  | "software"
  | "soft"
  | "regulatory"
  | "qualification";

export type SkillEvidence = "declared" | "demonstrated" | "certified" | "not_found";

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  synonyms: string[];
  families: string[];
}

export interface SkillRequirement {
  skillId: string;
  requiredLevel: number;
  weight: number;
  mandatory: boolean;
}

export interface CandidateSkill {
  skillId: string;
  level?: number;
  evidence: SkillEvidence;
  evidenceText?: string;
}

export interface GapResult {
  skillId: string;
  skillName: string;
  status: "matched" | "partial" | "not_evidenced";
  requiredLevel: number;
  candidateLevel: number | null;
  weight: number;
  mandatory: boolean;
  explanation: string;
}

export const SKILLS: Skill[] = [
  { id: "excel", name: "Microsoft Excel", category: "software", synonyms: ["excel", "folhas de cálculo", "spreadsheet"], families: ["admin", "hr", "finance", "operations"] },
  { id: "payroll", name: "Processamento salarial", category: "technical", synonyms: ["payroll", "processamento de salários", "folha salarial"], families: ["hr", "finance"] },
  { id: "inss", name: "INSS e contribuições sociais", category: "regulatory", synonyms: ["inss", "segurança social", "contribuições sociais"], families: ["hr", "finance"] },
  { id: "irps", name: "IRPS e fiscalidade laboral", category: "regulatory", synonyms: ["irps", "imposto sobre rendimentos", "retenção na fonte"], families: ["hr", "finance"] },
  { id: "primavera", name: "Primavera ERP", category: "software", synonyms: ["primavera", "primavera erp"], families: ["finance", "admin"] },
  { id: "phc", name: "PHC", category: "software", synonyms: ["phc software", "phc"], families: ["finance", "admin"] },
  { id: "reconciliation", name: "Reconciliação bancária", category: "technical", synonyms: ["reconciliação bancária", "bank reconciliation"], families: ["finance"] },
  { id: "financial_reports", name: "Relatórios financeiros", category: "technical", synonyms: ["relatórios financeiros", "financial reporting"], families: ["finance"] },
  { id: "labor_law", name: "Legislação laboral", category: "regulatory", synonyms: ["lei do trabalho", "legislação laboral", "labor law"], families: ["hr", "admin"] },
  { id: "risk_assessment", name: "Avaliação de riscos ocupacionais", category: "technical", synonyms: ["avaliação de riscos", "identificação de perigos", "risk assessment"], families: ["hst", "operations"] },
  { id: "iso45001", name: "ISO 45001", category: "regulatory", synonyms: ["iso 45001", "sistema de gestão de segurança e saúde no trabalho"], families: ["hst"] },
  { id: "communication", name: "Comunicação profissional", category: "soft", synonyms: ["comunicação", "comunicação verbal", "comunicação escrita"], families: ["admin", "hr", "finance", "hst", "operations"] },
  { id: "inventory", name: "Gestão de stocks", category: "technical", synonyms: ["gestão de stocks", "controlo de inventário", "inventory management"], families: ["operations"] },
  { id: "procurement", name: "Procurement e compras", category: "technical", synonyms: ["procurement", "compras", "aquisições"], families: ["operations", "admin"] },
];

export const SKILL_FAMILIES = [
  { id: "hr", name: "Recursos Humanos" },
  { id: "finance", name: "Contabilidade e Finanças" },
  { id: "hst", name: "SSHE / HST" },
  { id: "admin", name: "Administração" },
  { id: "operations", name: "Operações e Logística" },
];

export function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9+.# ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Finds taxonomy entries mentioned in text. This is a baseline matcher, not an AI extractor. */
export function findSkillsInText(text: string): Skill[] {
  const normalized = normalizeText(text);
  return SKILLS.filter((skill) =>
    [skill.name, ...skill.synonyms].some((term) => {
      const normalizedTerm = normalizeText(term);
      return normalizedTerm.length > 1 && normalized.includes(normalizedTerm);
    }),
  );
}

export function compareSkills(
  requirements: SkillRequirement[],
  candidateSkills: CandidateSkill[],
): { score: number | null; results: GapResult[]; mandatoryGaps: number } {
  if (requirements.length === 0) return { score: null, results: [], mandatoryGaps: 0 };

  const byId = new Map(candidateSkills.map((skill) => [skill.skillId, skill]));
  const catalog = new Map(SKILLS.map((skill) => [skill.id, skill]));
  let weightedEarned = 0;
  let totalWeight = 0;
  let mandatoryGaps = 0;

  const results = requirements.map((requirement): GapResult => {
    const candidate = byId.get(requirement.skillId);
    const skillName = catalog.get(requirement.skillId)?.name ?? requirement.skillId;
    const weight = Math.max(0, requirement.weight);
    totalWeight += weight;

    if (!candidate || candidate.evidence === "not_found") {
      if (requirement.mandatory) mandatoryGaps += 1;
      return {
        skillId: requirement.skillId, skillName, status: "not_evidenced",
        requiredLevel: requirement.requiredLevel, candidateLevel: null,
        weight, mandatory: requirement.mandatory,
        explanation: "Não foi encontrada evidência suficiente no CV; isto não prova que a pessoa não possui a competência.",
      };
    }

    const evidenceFactor = candidate.evidence === "certified" ? 1 : candidate.evidence === "demonstrated" ? 0.95 : 0.75;
    const level = Math.max(0, Math.min(5, candidate.level ?? 1));
    const ratio = Math.min(1, level / Math.max(1, requirement.requiredLevel));
    weightedEarned += weight * ratio * evidenceFactor;
    const status = ratio >= 1 ? "matched" : "partial";
    if (requirement.mandatory && status !== "matched") mandatoryGaps += 1;

    return {
      skillId: requirement.skillId, skillName, status,
      requiredLevel: requirement.requiredLevel, candidateLevel: level,
      weight, mandatory: requirement.mandatory,
      explanation: status === "matched"
        ? "A evidência disponível corresponde ao nível exigido, sujeito à validação da qualidade da evidência."
        : "Existe alguma evidência, mas o nível identificado pode ser inferior ao exigido.",
    };
  });

  return {
    score: totalWeight > 0 ? Math.round((weightedEarned / totalWeight) * 100) : null,
    results,
    mandatoryGaps,
  };
}
