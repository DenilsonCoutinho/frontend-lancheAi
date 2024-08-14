// src/app/api/rateLimit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import rateLimit from '@/lib/rateLimiting/rateLimiting';

// Configuração do rate limiter: 10 requisições em 15 minutos
const limiter = rateLimit(15 * 60 * 1000, 10);

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
  const rateLimitResponse = limiter(ip);

  if (rateLimitResponse) {
    return rateLimitResponse; // Retorna a resposta de erro se o limite de requisições for excedido
  }

  // Se não houver erro de rate limit, continue com a lógica da API
  return new NextResponse('Request successful', { status: 200 });
}
