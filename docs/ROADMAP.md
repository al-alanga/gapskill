# GapSkill — Roadmap do MVP

## P0 — Fundação
- [x] Criar aplicação Next.js e layout inicial.
- [x] Criar página inicial e formulário de submissão.
- [x] Criar endpoint de saúde.
- [x] Criar validação inicial de submissão.
- [x] Criar taxonomia inicial e comparador determinístico.
- [x] Documentar requisitos, arquitectura, WhatsApp e segurança.
- [ ] Instalar dependências e executar build/lint.
- [ ] Adicionar testes automatizados.

## P1 — Análise real
- [ ] Persistência PostgreSQL e migrações.
- [ ] Armazenamento privado de documentos.
- [ ] Extração segura de texto PDF/DOCX.
- [ ] Extração segura de anúncios com fallback manual.
- [ ] Esquemas validados para extração estruturada.
- [ ] Serviço de normalização com taxonomia versionada.
- [ ] Pipeline assíncrono e estados de análise.
- [ ] Relatório de análise com evidências e confiança.
- [ ] Validação humana com conjunto de exemplos.

## P2 — Produto
- [ ] Autenticação e perfil profissional.
- [ ] Histórico e acesso seguro aos relatórios.
- [ ] Catálogo de formação e competências associadas.
- [ ] Manifestação de interesse e métricas de conversão.
- [ ] Painel administrativo.
- [ ] Pedidos de exportação e eliminação de dados.

## P3 — WhatsApp
- [ ] Configurar Meta WhatsApp Cloud API.
- [ ] Webhooks e validação de assinatura.
- [ ] Fluxo de URL + CV + consentimento.
- [ ] Processamento assíncrono e mensagens de estado.
- [ ] Ligação segura ao relatório Web.
- [ ] Opt-out, help e tratamento de erros.

## P4 — Inteligência de mercado
- [ ] Deduplicação de anúncios.
- [ ] Indicadores por período, sector e profissão.
- [ ] Limiares de agregação e proteção contra reidentificação.
- [ ] Relatórios comerciais e validação do modelo de receita.
