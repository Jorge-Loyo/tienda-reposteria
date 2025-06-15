import { PrismaClient, Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';
const prisma = new PrismaClient();
export async function GET(request: Request) {
  try { const products = await prisma.product.findMany(); return NextResponse.json(products); }
  catch (error) { console.error("Error fetching products:", error); return NextResponse.json({ error: "No se pudieron obtener los productos." }, { status: 500 }); }
}
export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (data.sku) {
      const existingProduct = await prisma.product.findUnique({ where: { sku: data.sku } });
      if (existingProduct) { return NextResponse.json({ error: `El SKU '${data.sku}' ya existe. Por favor, use otro.` }, { status: 409 }); }
    }
    const newProduct = await prisma.product.create({ data: { name: data.name, description: data.description, priceUSD: data.priceUSD, stock: data.stock, sku: data.sku, imageUrl: data.imageUrl, published: data.published } });
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') { return NextResponse.json({ error: `Un campo único ya existe. Por favor, revise los datos.` }, { status: 409 }); }
    return NextResponse.json({ error: "No se pudo crear el producto." }, { status: 500 });
  }
}