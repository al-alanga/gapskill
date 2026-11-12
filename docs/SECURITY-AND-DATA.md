# GapSkill — Segurança e governação de dados

## Dados tratados
CVs, dados de contacto opcionais, textos de anúncios públicos, requisitos extraídos, perfis de competências, resultados de análise e interesses em formação.

## Princípios
- Minimização de dados.
- Finalidades claras e consentimentos separados quando necessário.
- Acesso mínimo necessário.
- Documentos privados por defeito.
- Retenção limitada e eliminação verificável.
- Indicadores de mercado agregados, sem identificadores diretos.
- Revisão de fornecedores e subcontratantes.
- Registos de acesso administrativo.

## Controles mínimos antes do piloto
- Política de privacidade e termos revistos juridicamente para Moçambique.
- Consentimento específico para análise individual e, separadamente, utilização analítica.
- Procedimento de acesso, correção e eliminação.
- Política de retenção para CVs, resultados e logs.
- Encriptação em trânsito e em repouso.
- Controlo de acesso por função.
- Rate limiting e proteção contra abuso.
- Verificação de ficheiros e limites de tamanho.
- Proteção SSRF para extração de URLs.
- Segredos exclusivamente em variáveis de ambiente/secret manager.
- Logs sem CV integral, tokens ou dados pessoais desnecessários.
- Testes de autorização entre utilizadores.

## Inteligência de mercado
Não vender nem expor CVs individuais como parte de relatórios. Definir limiares mínimos de agregação para reduzir o risco de reidentificação, especialmente em profissões ou localidades com poucos registos.

## Transparência
O índice de compatibilidade não é probabilidade de contratação. A ausência de uma menção no CV não prova que o candidato não possui a competência. As recomendações devem ser explicáveis e sujeitas a correção.
