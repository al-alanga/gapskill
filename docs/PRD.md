# GapSkill — Product Requirements Document (PRD)

**Versão:** 0.1 · **Estado:** Draft para implementação do MVP

## Visão
Ajudar profissionais a comparar o seu CV com oportunidades públicas, compreender competências sem evidência suficiente e descobrir caminhos de aprendizagem relevantes. A experiência está disponível na Web e, numa fase seguinte, no WhatsApp, através do mesmo backend.

## Problema
- Os requisitos das vagas estão em texto livre e são difíceis de comparar.
- Os CVs não apresentam competências de forma normalizada.
- Candidatos precisam de orientação concreta sobre o que desenvolver.
- Formadores precisam de sinais de procura antes de criarem novos cursos.

## Personas
1. Candidato à procura de emprego.
2. Profissional que quer mudar de função.
3. Administrador/analista de produto.
4. Gestor de formação.

## Fluxo principal
1. Utilizador fornece URL de vaga.
2. Se a extração não funcionar, cola a descrição ou envia um documento.
3. Envia CV PDF/DOCX.
4. Confirma a finalidade de tratamento dos dados.
5. O sistema extrai requisitos e evidências do CV.
6. O motor normaliza competências e compara os requisitos.
7. O utilizador recebe um diagnóstico explicável.
8. São sugeridas formações disponíveis ou o utilizador pode manifestar interesse numa formação futura.

## Requisitos funcionais
- RF-01: aceitar URL HTTP/HTTPS e validar o formato.
- RF-02: aceitar CV PDF/DOCX com limite configurável.
- RF-03: oferecer entrada manual do texto da vaga.
- RF-04: extrair requisitos com evidência de origem.
- RF-05: interpretar o CV sem inferir competências apenas por título de cargo.
- RF-06: normalizar termos através de uma taxonomia versionada.
- RF-07: distinguir competência declarada, demonstrada, certificada e não identificada.
- RF-08: calcular uma pontuação explicável, separada da confiança da análise.
- RF-09: mostrar requisitos obrigatórios em separado.
- RF-10: recomendar formações ligadas às competências.
- RF-11: registar manifestações de interesse.
- RF-12: permitir consulta do histórico mediante autenticação.
- RF-13: disponibilizar canal WhatsApp oficial como fase subsequente.
- RF-14: oferecer administração de taxonomia, cursos, processamento e indicadores.
- RF-15: manter consentimentos e pedidos de eliminação auditáveis.

## Requisitos não funcionais
- Interface mobile-first e em português.
- Processamento assíncrono para documentos e chamadas de IA.
- Não guardar ficheiros em buckets públicos.
- Proteção contra SSRF ao obter URLs de terceiros.
- Validação de MIME e conteúdo real dos ficheiros.
- Limites de tamanho, rate limiting e logs sem conteúdo pessoal desnecessário.
- Separação de dados identificáveis e indicadores agregados.
- Capacidade de trocar fornecedor de IA sem reescrever regras de negócio.

## Fora do âmbito inicial
- Portal de publicação de vagas.
- Cadastro empresarial obrigatório.
- Decisões automáticas de contratação.
- Garantia de emprego.
- LMS completo.
- Recolha indiscriminada de anúncios sem respeitar condições dos sites.

## Critérios de aceitação
- A submissão não é apresentada como analisada enquanto extração e comparação reais não estiverem concluídas.
- A ausência de menção no CV é rotulada como “não identificada”, nunca como prova de incapacidade.
- Cada requisito analisado inclui a origem/evidência e nível de confiança.
- Uma falha na extração permite entrada manual.
- Resultados indicam que compatibilidade não equivale a probabilidade de contratação.
- Os utilizadores podem solicitar acesso, correção e eliminação dos dados conforme política aplicável.

## Métricas do piloto
- Taxa de extração bem-sucedida.
- Percentagem de diagnósticos concluídos.
- Concordância entre resultados e revisão humana.
- Percentagem de recomendações consideradas relevantes.
- Conversão de diagnóstico em interesse por formação.
- Taxa de utilizadores recorrentes.
