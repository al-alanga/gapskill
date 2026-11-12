# GapSkill — Plano de integração WhatsApp

## Objetivo
Permitir iniciar e acompanhar a mesma análise disponível na Web através da WhatsApp Business Platform, mantendo um backend e uma base de dados únicos.

## Fluxo conversacional
1. Utilizador envia “Olá” ou escolhe “Analisar uma vaga”.
2. Bot solicita URL da oportunidade.
3. Bot valida e confirma o URL recebido.
4. Bot solicita CV PDF/DOCX.
5. Bot informa a finalidade de tratamento e solicita consentimento apropriado antes de processar.
6. Bot confirma recepção e cria tarefa assíncrona.
7. Bot comunica o estado quando necessário.
8. Bot entrega um resumo, limitações e ligação segura ao relatório.
9. Utilizador pode consultar formação e manifestar interesse.

## Requisitos técnicos
- Cloud API oficial ou fornecedor autorizado.
- Verificar assinatura/autenticidade de webhooks conforme documentação Meta.
- Validar origem e tipo de cada mensagem.
- Obter media com token de curta duração e guardar em armazenamento privado.
- Não confiar no nome do ficheiro nem no MIME informado pelo cliente.
- Controlar tamanho, duplicação de eventos e reentregas.
- Associar número telefónico a um perfil com fluxo de verificação e consentimento.
- Implementar opt-out e comandos de ajuda.
- Respeitar a janela de atendimento e templates aplicáveis.
- Não enviar dados pessoais completos em notificações desnecessárias.
- Oferecer encaminhamento para a Web para relatórios longos.

## Máquina de estados conversacional
`idle` → `awaiting_job_url` → `awaiting_cv` → `awaiting_consent` → `processing` → `completed`
Estados adicionais: `awaiting_job_text`, `error`, `cancelled`.

## Mensagens de recuperação
- URL inacessível: pedir que cole a descrição completa ou envie PDF/imagem.
- Documento não suportado: pedir PDF/DOCX.
- Documento ilegível: pedir novo ficheiro.
- Análise falhada: explicar que não foi concluída e oferecer nova tentativa.
- Pedido de eliminação: encaminhar para procedimento autenticado e registado.

## Configuração
Variáveis de ambiente previstas em `.env.example`. Nunca colocar tokens, secrets ou credenciais no repositório.

## Custos e conformidade
Confirmar preços, templates, janela de atendimento, permissões e políticas vigentes da Meta antes do lançamento.
