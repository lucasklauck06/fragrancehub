
### 1. Estrutura do Board (Colunas)

* *A Fazer (To Do)*
* *Em Andamento (Doing)*
* *Em Revisão (Review/QA)*
* *Concluído (Done)*

---

### 2. Épicos e Tarefas (O que cadastrar em cada Cartão)

#### ÉPICO 1: Configuração Base e Infraestrutura

* *Tarefa 1: Configuração do Ambiente de Desenvolvimento*
* *Descrição:* Inicializar repositórios do Frontend e Backend, gerar a estrutura base com IA e configurar o Tailwind.
* *Critérios de Aceitação:* Repositório no GitHub criado e todos os integrantes conseguem rodar a aplicação base localmente.


* *Tarefa 2: Modelagem do Banco de Dados PostgreSQL*
*Descrição:* Gerar via IA o arquivo schema.prisma baseado nos requisitos e rodar as migrations no Supabase.
* *Critérios de Aceitação:* Tabelas geradas no Supabase com todos os relacionamentos corretos (Marcas, Perfumes, Perfumistas, Usuários, Resenhas).



#### ÉPICO 2: Governança, Autenticação e Marcas

* *Tarefa 3: Implementar Sistema de Login e Autenticação (RF01)*
*Descrição:* Gerar rotas de registro e login com JWT e a interface de autenticação do React.
* *Critérios de Aceitação:* Usuário consegue criar conta, fazer login e receber token JWT válido.


* *Tarefa 4: Implementação do Controle de Permissões (RF01)*
*Descrição:* Configurar middlewares no Node.js e proteção de rotas no React para separar Administrador de Usuário.
* *Critérios de Aceitação:* Usuário comum recebe erro de acesso ao tentar acessar CRUDs exclusivos de administrador.

*Responsável:* Lucas Sehn Klauck.
* *Tempo Estimado:* 1 hora.
* *Critérios de Aceitação:* Usuário comum recebe erro de acesso ao tentar acessar CRUDs exclusivos de administrador.


* *Tarefa 5: CRUD de Marcas (RF04)* 
*Descrição:* Gerar API REST e interface administrativa para cadastro e manutenção das casas de perfumaria.
* *Critérios de Aceitação:* Admin consegue adicionar, listar, editar e deletar uma marca com sucesso.



#### ÉPICO 3: Núcleo de Catálogo e Busca

* *Tarefa 6: CRUD de Perfumes (RF02)*
*Descrição:* Desenvolver o cadastro de fragrâncias com atributos obrigatórios (gênero e preço).
* *Critérios de Aceitação:* Perfume é salvo no banco corretamente atrelado à Marca e ao Perfumista através de chaves estrangeiras.


* *Tarefa 7: Visualização Detalhada do Perfume (RF09)* 
*Descrição:* Criar a página que exibe título, acordes, marca, notas de composição e reviews.
* *Critérios de Aceitação:* Tela renderiza todos os dados técnicos corretamente puxando do backend.


* *Tarefa 8: Filtro Demográfico e de Valor (RF08)*
*Descrição:* Implementar sistema de busca avançada focado em gênero, preço e autor.
*Responsável:* Artur Zanoello.
* *Critérios de Aceitação:* Listagem de perfumes atualiza dinamicamente refletindo os filtros aplicados.



#### ÉPICO 4: Portfólio de Autoria e Conteúdo

* *Tarefa 9: CRUD de Perfumistas (RF03)*
*Descrição:* Gerar rotas e interface para gerenciamento dos profissionais criadores.
* *Critérios de Aceitação:* Admin consegue inserir e editar os dados e a biografia do perfumista no banco.


* *Tarefa 10: Visualização de Portfólio (RF07)*
*Descrição:* Desenvolver as páginas dinâmicas para cada perfumista exibindo biografia e catálogo de obras.
* *Critérios de Aceitação:* Página do perfumista lista corretamente todos os perfumes criados por ele.


* *Tarefa 11: Construção da Página Inicial (RF10)* 
*Descrição:* Criar a home contendo notícias sobre perfumaria e a listagem de novos perfumes.
* *Critérios de Aceitação:* Home exibe os últimos perfumes cadastrados consultando o banco de dados.



#### ÉPICO 5: Comunidade e Interação

* *Tarefa 12: CRUD de Usuários (RF05)* 
*Descrição:* Criar módulo para gestão dos perfis cadastrados no sistema.
* *Critérios de Aceitação:* Usuário autenticado consegue editar seus próprios dados cadastrais.


* *Tarefa 13: CRUD de Resenhas Técnicas (RF06)*
*Descrição:* Desenvolver funcionalidade para publicação de avaliações com dados de longevidade e rastro.
* *Critérios de Aceitação:* Usuário logado consegue postar uma resenha que passa a ser exibida na página do perfume avaliado.