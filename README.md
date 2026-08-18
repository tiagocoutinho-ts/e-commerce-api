# E-Commerce API

## Descrição do Projeto

API para e-commerce desenvolvida em Node.js e Express, projetada para gerenciar as operações fundamentais de uma loja online. A aplicação adota uma estrutura modular dividida por domínios de negócio, organizando de forma clara as responsabilidades do sistema.

A plataforma abrange o fluxo completo de vendas, incluindo cadastro de usuários, exibição de produtos, gerenciamento de carrinho, geração de pedidos e processamento de pagamentos. O projeto utiliza Prisma ORM com SQLite para persistência de dados local isolada por módulo e Cloudinary para armazenamento e entrega de mídias na nuvem.

## Domínios da Aplicação

* **Usuários:** Autenticação, controle de acesso e gestão de perfis.
* **Catálogo de Produtos:** Cadastro de itens, controle de estoque e upload de mídias via CDN.
* **Carrinho de Compras:** Retenção e manipulação de itens selecionados antes do checkout.
* **Pedidos:** Criação de vendas, histórico e controle dos estados do pedido.
* **Pagamentos:** Registro e validação das transações financeiras.

---