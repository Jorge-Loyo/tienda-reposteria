// src/app/api/products/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Maneja la creación de un nuevo producto
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      name, 
      description, 
      priceUSD, 
      stock, 
      sku, 
      imageUrl, 
      categoryId // <-- La clave está aquí
    } = body;

    // Validación crítica: Un producto debe tener nombre, precio y categoría.
    if (!name || !priceUSD || !categoryId) {
      return NextResponse.json(
        { error: 'Nombre, precio y categoría son campos requeridos.' },
        { status: 400 }
      );
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        priceUSD: parseFloat(priceUSD),
        stock: parseInt(stock, 10),
        sku,
        imageUrl,
        // Conectamos el producto a una categoría existente usando su ID.
        // Esto resuelve el error "Argument 'category' is missing".
        categoryId: parseInt(categoryId, 10),
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    // Devolvemos un error genérico para no exponer detalles de la base de datos.
    return NextResponse.json(
      { error: 'No se pudo crear el producto. Error interno del servidor.' },
      { status: 500 }
    );
  }
}