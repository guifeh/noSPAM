# Política de Privacidade da Extensão "noSPAM"

**Última atualização:** 25 de Março de 2026

A sua privacidade é importante para nós. Esta Política de Privacidade explica como a extensão para Chrome **noSPAM** coleta, utiliza, protege e compartilha as suas informações e os seus dados de usuário, em total conformidade com as políticas da Chrome Web Store e as leis de proteção de dados aplicáveis.

## 1. Coleta de Dados do Usuário

A extensão **noSPAM** requer acesso a determinadas informações e permissões da sua conta do Google (especificamente do Gmail) para realizar o seu propósito principal: identificar e limpar emails indesejados (spam) usando Inteligência Artificial.

Os dados coletados e processados incluem:
- **Endereço de E-mail do Usuário:** Para identificar a conta que está utilizando o serviço e manter um registro das ações realizadas na sua conta.
- **Metadados de E-mails (Remetente e Assunto):** A extensão lê apenas os metadados (remetente e assunto) dos seus e-mails não lidos para fins de análise.
- **Conteúdo de E-mails:** O corpo do e-mail *não* é armazenado permanentemente por nós.

## 2. Uso dos Dados

Os dados coletados são utilizados **exclusivamente** para o funcionamento da extensão, especificamente para:
- **Análise e Classificação com IA:** Analisar o remetente e o assunto dos seus e-mails não lidos, baseando-se no contexto de limpeza fornecido por você, para identificar quais e-mails devem ser categorizados como SPAM e/ou deletados.
- **Ações na sua Conta (gmail.modify):** Mover automaticamente os e-mails classificados como SPAM para a Lixeira do seu Gmail.
- **Histórico de Execução:** Manter um histórico/log das análises realizadas (apenas salvando quantos e quais e-mails foram deletados por varredura), para que você possua um relatório do que foi limpado.

**Nenhum dado é utilizado para publicidade, rastreamento offline, ou vendido a corretores de dados (data brokers).**

## 3. Compartilhamento de Dados do Usuário

Para o correto processamento e armazenamento, os dados do usuário são compartilhados **estritamente com as partes envolvidas ("todas as partes envolvidas") na infraestrutura da extensão**:

- **Google Gemini API (Google LLC):** Os metadados dos seus e-mails (remetente e assunto) e o contexto fornecido são enviados temporariamente à API do Gemini, que atua como a Inteligência Artificial para classificar se o e-mail deve ser mantido ou deletado. 
- **Supabase:** O seu endereço de e-mail e os metadados dos e-mails que foram deletados durante a varredura são armazenados no nosso banco de dados (Supabase) para mantermos um log histórico de segurança e relatórios da sua conta.
- **Google Gmail API:** Utilizada para fazer a leitura dos e-mails e aplicar as labels (ações como mover para a lixeira).

Seus dados não são transferidos ou compartilhados com nenhum outro serviço terceiro que não esteja diretamente ligado ao funcionamento da extensão descrito acima.

## 4. Retenção e Exclusão de Dados

- **Dados Temporários:** Os metadados (remetentes e assuntos) que não resultam em exclusão são descartados imediatamente após a análise do modelo de Inteligência Artificial e não são armazenados em nossos servidores.
- **Logs de Varredura:** Armazenamos no banco de dados apenas os registros de exclusão (seu e-mail e informações estatísticas dos e-mails deletados) para fins de relatórios do serviço.
- Você pode revogar o acesso da extensão à sua Conta do Google a qualquer momento nas [Configurações de Segurança da sua Conta Google](https://myaccount.google.com/permissions). Ao fazer isso, não teremos mais nenhum acesso à sua caixa de entrada.
- Para solicitar a exclusão de qualquer dado histórico gerado pela sua conta no nosso banco de dados, você pode entrar em contato conosco (adicione seu email de suporte aqui).

## 5. Proteção de Dados e Segurança

As credenciais temporárias (tokens de acesso Oauth2) são enviadas por conexões seguras (HTTPS) para o nosso backend autenticado. As chaves nunca são expostas publicamente. Nosso servidor atua apenas como uma ponte de comunicação em tempo real, respeitando os protocolos de arquitetura segura em Nuvem.

## 6. Alterações em nossa Política de Privacidade

Podemos atualizar esta política de tempos em tempos para refletir quaisquer mudanças na maneira como operamos. Recomendamos que você revise esta página periodicamente. O uso contínuo da extensão após quaisquer alterações indica que você concorda e aceita as políticas atualizadas.

## 7. Contato

Se você tiver dúvidas, ou desejar exercer seus direitos com relação aos seus dados relacionados à política, sinta-se à vontade para nos contatar através de:
**[guigasparinofernandes@gmail.com]** ou através da página de suporte na Chrome Web Store.
