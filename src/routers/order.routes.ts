import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const orderRoutes = Router();

// Criar Pedido / Checkout (Recebe os itens do carrinho ou direto e gera o checkout)
orderRoutes.post('/checkout', async (req, res) => {
  // TODO: Sua lógica aqui:
  // 1. Pegar o userId do usuário autenticado (ou req.body)
  // 2. Buscar o carrinho ativo do usuário com seus itens
  // 3. Calcular o valor total dos produtos
  // 4. Criar a sessão de pagamento na API do Stripe (ou simulador)
  // 5. Salvar a Order com status "PENDING" e criar os OrderItems no Prisma
  // 6. Limpar o carrinho do usuário
  // 7. Retornar a URL de pagamento ou confirmação
});

// Listar histórico de pedidos do usuário
orderRoutes.get('/', async (req, res) => {
  // TODO: Sua lógica aqui:
  // 1. Buscar os pedidos salvos do usuário (prisma.order.findMany)
  // 2. Incluir os itens do pedido e imagens dos produtos (include: { items: { include: { product: true } } })
});

// Webhook: Receber confirmação de pagamento (Stripe Webhook)
orderRoutes.post('/webhook', async (req, res) => {
  // TODO: Sua lógica aqui:
  // 1. Confirmar que o pagamento foi aprovado pelo gateway
  // 2. Atualizar o status do Order para "PAID"
  // 3. Baixar o estoque dos produtos no banco (Product.stock)
});

export { orderRoutes };