# GapSkill

Plataforma de inteligência de competências e desenvolvimento profissional para Moçambique. O MVP permite ao candidato submeter o URL de uma oportunidade e o seu CV, analisar a compatibilidade e identificar competências a desenvolver. O produto terá canais Web e WhatsApp com um backend partilhado.

## Stack inicial
- Next.js App Router + TypeScript
- Tailwind CSS
- API routes para submissões e análise
- Motor de competências determinístico, extensível a extração documental e IA
- Integração WhatsApp Cloud API numa fase posterior

## Desenvolvimento
```bash
npm install
npm run dev
```

## Estado
Esta é a fundação inicial. A extração real de PDF/DOCX, integração com fornecedor de IA, persistência em PostgreSQL, autenticação e WhatsApp ainda precisam de ser configuradas. O sistema não deve apresentar resultados simulados como análises reais.

## Variáveis de ambiente
Copiar `.env.example` para `.env.local` e preencher apenas os serviços efetivamente configurados.
