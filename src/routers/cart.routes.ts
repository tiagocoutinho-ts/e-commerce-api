import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const cartRoutes = Router();

// Requisito 2: Adicionar produto ao carrinho
cartRoutes.post('/items', async (req, res) => {
  // TODO: Suas tarefas aqui
});

// Requisito 2: Remover produto do carrinho
cartRoutes.delete('/items/:id', async (req, res) => {
  // TODO: Suas tarefas aqui
});

export { cartRoutes };