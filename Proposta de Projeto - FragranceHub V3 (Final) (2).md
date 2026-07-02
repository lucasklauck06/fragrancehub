

Proposta de Projeto: FragranceHub
(Versão Final Refinada)
Este documento detalha o planejamento para o desenvolvimento do sistema FragranceHub. O
foco da plataforma é a catalogação técnica de perfumes com ênfase na autoria dos
perfumistas, dados demográficos e precificação, eliminando recursos de comparação social ou
gestão de inventário pessoal.
- Tema e Contexto
O projeto propõe uma plataforma especializada em curadoria de perfumaria, onde o diferencial
é a visibilidade do Perfumista (Nariz) e a transparência de dados de mercado como gênero e
valor. O sistema resolve o problema de usuários que desejam conhecer o portfólio completo de
um criador específico ou filtrar fragrâncias por faixas de preço reais e demografia. Diferente de
outros portais, o foco é puramente informativo e técnico, sem funcionalidades de prateleiras
virtuais ou algoritmos de similaridade baseados em opiniões.
## 3. Objetivos
Objetivo Geral: Desenvolver um catálogo web de fragrâncias que priorize a autoria profissional
(perfumistas) e métricas objetivas de gênero e valor.
## Objetivos Específicos:
● Prover uma página exclusiva para cada perfumista cadastrado, listando todas as suas
obras.
● Implementar filtros precisos por demografia (gênero) e faixas de preço.
● Garantir a integridade dos dados através de uma estrutura relacional entre Marcas,
Perfumes e Perfumistas.
● Oferecer uma área administrativa robusta para alimentação dos dados técnicos.
- Requisitos do Sistema
O sistema será composto pelos seguintes requisitos funcionais:
ID Requisito Funcional Descrição

RF01 Login e Níveis de Acesso Sistema de autenticação
com controle de permissões
(Administrador para CRUDs
e Usuário para
consulta/resenha).

ID Requisito Funcional Descrição

RF02 CRUD de Perfumes Cadastro de fragrâncias com
atributos obrigatórios de
RF03 CRUD de Perfumistas Gerenciamento completo dos
profissionais criadores para
alimentação das páginas
individuais.
RF04 CRUD de Marcas Cadastro e manutenção das
casas de perfumaria.
RF05 CRUD de Usuários Módulo para gestão dos
perfis cadastrados no
sistema.
RF06 CRUD de Resenhas Permite que usuários
publiquem avaliações
técnicas sobre os perfumes.
Gênero e Valor de Preço.
Longevidade e Rastro
Avaliação e Quando Usar
RF07 Visualização de Portfólio Páginas dinâmicas para
cada perfumista exibindo sua
biografia e catálogo de
obras.
RF08 Filtro Demográfico e de Valor Sistema de busca avançada
focado exclusivamente em
gênero, preço e autor.
RF09 Visualização do Perfume pagina onde mostra, titulo,
perfumista, Principais
Acordes, Marca, fem ou mas,
avaliacao, quando usar,
resumo, nota do perfume (0
a 5), Composicao da
fragrancia, mostrar perfumes
daquela coleçao, mostrar
perfumes da marca,

ID Requisito Funcional Descrição

longevidade e rastro, genero
e preço e Todas as reviews
do perfume
RF10 Pagina Inicial pagina inicial contendo
noticias sobre a perfumaria e
tudo que envolva os
perfumes, Enciclopédia de
Perfumes (Perfumes e
resenhas de fragrancias),
Novos perfumes

- Divisão de Tarefas
Cada integrante é responsável por um módulo CRUD completo:

Integrante RFs
## Responsáveis
Módulo e Descrição Técnica
## Artur
## Zanoello
## RF02, RF08,
## RF09
Núcleo de Catálogo e Busca: Responsável pelo CRUD
completo de perfumes (incluindo atributos de gênero e
preço), o sistema de busca avançada por filtros e a
página de visualização detalhada do perfume (acordes,
composição e notas).
Vinicius RF03, RF07,
## RF10
Portfólio de Autoria e Conteúdo: Responsável pelo
CRUD de perfumistas, o desenvolvimento das páginas
dinâmicas de portfólio (biografia e obras) e a criação da
página inicial (notícias e novos perfumes).

## Lucas Sehn
## Klauck
RF01, RF04 Governança e Infraestrutura: Responsável pelo
sistema de autenticação e controle de permissões
(Admin/Usuário) e pelo CRUD completo das marcas
(casas de perfumaria).
Mario RF05, RF06 Comunidade e Interação: Responsável pelo CRUD de
usuários (gestão de perfis) e pelo módulo completo de
resenhas técnicas (incluindo longevidade, rastro e
avaliações de uso).

## 6. Tecnologias Escolhidas
## Componente Tecnologia Justificativa

Frontend React.js & Vite: Para a
construção da interface de
forma reativa e um ambiente
de desenvolvimento rápido e
otimizado.
TypeScript: Para garantir a
tipagem estática e maior
confiabilidade no
desenvolvimento.
Tailwind CSS: Para a
estilização moderna, flexível
e responsiva das páginas e
componentes.
React Router: Para o
gerenciamento de rotas e
navegação fluida pelo lado
do cliente (SPA).
Radix UI & Lucide React:
Bibliotecas para
componentes de interface
Agilidade no
desenvolvimento e SEO
otimizado para as páginas
individuais de perfumistas.

## Componente Tecnologia Justificativa

acessíveis e ícones
consistentes.
Backend Node.js & Express: Como o
ambiente de execução e o
framework minimalista para
estruturar a API REST e os
endpoints.
TypeScript: Para manter a
consistência da linguagem
de ponta a ponta.
JWT (JSON Web Token) &
bcryptjs: Para o controle de
sessão seguro e criptografia
(hash) de senhas.
Banco de Dados:

PostgreSQL (Supabase):
Banco de dados relacional
robusto de código aberto
hospedado na nuvem.
Prisma ORM 6: Atua como
ponte de comunicação entre
a API Node.js e o banco de
dados, simplificando a
escrita de queries, leitura de
tabelas e controle de
migrations.
unificação da stack
tecnológica e maior
consistência de dados e
produtividade no
desenvolvimento.
Banco de Dados PostgreSQL SupaBase Capacidade de gerenciar
relacionamentos complexos
entre perfumes, autores e
marcas com alta integridade.
