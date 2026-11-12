# GapSkill — Arquitectura técnica inicial

## Princípio
Web e WhatsApp são canais; processamento, regras, dados e recomendações pertencem ao backend comum.

## Componentes
- **Web:** Next.js App Router.
- **API:** Route Handlers versionados.
- **Processamento:** tarefas assíncronas para extração documental, leitura de URL e análise.
- **Taxonomia:** catálogo versionado de competências e sinónimos.
- **Persistência:** PostgreSQL (proposta: Supabase) com Row Level Security quando aplicável.
- **Documentos:** armazenamento privado, URLs temporários e retenção configurável.
- **IA:** camada de fornecedor substituível, respostas estruturadas validadas por schema.
- **WhatsApp:** Meta WhatsApp Cloud API, webhooks verificados e estado conversacional.
- **Observabilidade:** logs estruturados, métricas de falha e identificadores de correlação.

## Pipeline de análise
1. Receber pedido e validar consentimento.
2. Validar URL sem fazer fetch direto no processo HTTP principal.
3. Obter conteúdo através de um serviço isolado e protegido contra SSRF.
4. Extrair texto do anúncio ou pedir ao utilizador para colar o texto.
5. Validar e extrair texto do CV.
6. Extrair requisitos e evidências em JSON estruturado.
7. Normalizar competências para IDs da taxonomia.
8. Calcular compatibilidade com regras determinísticas.
9. Produzir explicação e recomendações ligadas ao catálogo.
10. Guardar resultado, versão da taxonomia e versão do modelo.
11. Apresentar resumo e ligação segura para o relatório.

## Segurança para URL fetching
A implementação de extração de URL deverá:
- bloquear localhost, endereços privados, link-local e metadados cloud;
- resolver DNS e validar o IP antes de cada ligação;
- revalidar redirecionamentos e limitar o número de redirects;
- aceitar apenas HTTP/HTTPS;
- limitar timeout, tamanho de resposta e tipos MIME;
- não enviar cookies nem credenciais do utilizador;
- evitar executar JavaScript arbitrário da página;
- usar isolamento de rede quando possível.

Validar apenas a sintaxe do URL não é suficiente para prevenir SSRF.

## API proposta
- `POST /api/v1/analyses`: cria análise; futuramente aceita URL + CV ou texto.
- `GET /api/v1/analyses/:id`: consulta estado e resultado autorizado.
- `POST /api/v1/analyses/:id/retry`: reprocessamento controlado.
- `GET /api/v1/skills`: catálogo público selecionado.
- `GET /api/v1/trainings/recommendations?analysisId=...`: recomendações autorizadas.
- `POST /api/v1/training-interests`: regista interesse.
- `GET /api/health`: estado básico do serviço.
- `POST /api/webhooks/whatsapp`: webhook WhatsApp (fase posterior).

## Estados da análise
`queued` → `extracting_job` → `parsing_cv` → `matching` → `completed`
Estados alternativos: `needs_job_text`, `failed`, `cancelled`.

## Nota de implementação
O endpoint inicial em `app/api/analyze/route.ts` valida submissões, mas ainda não descarrega nem analisa URLs e CVs. Não deve ser anunciado como motor funcional até serem integrados extração documental, persistência, comparação real e revisão de segurança.
