//src/components/OrderReceipt.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Order, OrderItem, Product } from '@prisma/client';
import { sanitizeText } from '@/lib/sanitizer';
import jsPDF from 'jspdf';

type OrderWithDetails = Order & {
    items: (OrderItem & {
        product: {
            name: string;
        };
    })[];
}

interface OrderReceiptProps {
  order: OrderWithDetails;
}

export default function OrderReceipt({ order }: OrderReceiptProps) {
  
  const generateAndDownloadReceipt = () => {
    const subtotal = order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shippingCost = order.total - subtotal;

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;
    
    // Paleta de colores moderna
    const brand = [236, 72, 153]; // Pink-500
    const accent = [251, 146, 60]; // Orange-400
    const dark = [17, 24, 39]; // Gray-900
    const medium = [75, 85, 99]; // Gray-600
    const light = [249, 250, 251]; // Gray-50
    const white = [255, 255, 255];
    
    // Header elegante con curva
    pdf.setFillColor(...brand);
    pdf.rect(0, 0, pageWidth, 50, 'F');
    
    // Decoración curva
    pdf.setFillColor(...accent);
    for (let i = 0; i < pageWidth; i += 2) {
      const wave = Math.sin(i * 0.1) * 3;
      pdf.rect(i, 45 + wave, 2, 8, 'F');
    }
    
    // Logo y título principal con tipografía moderna
    pdf.setTextColor(...white);
    pdf.setFontSize(26);
    pdf.setFont('helvetica', 'bold');
    pdf.text('CASA DULCE ORIENTE', pageWidth/2, 20, { align: 'center' });
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Comprobante de Pedido', pageWidth/2, 32, { align: 'center' });
    
    let yPos = 60;
    
    // Información del pedido compacta
    pdf.setTextColor(...dark);
    pdf.setFontSize(16);
    pdf.setFont('times', 'bold');
    pdf.text(`PEDIDO #${order.id}`, 20, yPos+8);
    
    // Información en dos columnas con menos espacio
    pdf.setFontSize(9);
    pdf.setFont('times', 'bold');
    
    // Mapeo de métodos de pago
    const paymentMethods: { [key: string]: string } = {
      EFECTIVO_USD: 'Efectivo (Dólares)',
      EFECTIVO_BS: 'Efectivo (Bolívares)',
      ZELLE: 'Transferencia Zelle',
      BANESCO: 'Transferencia Banesco',
      BDV: 'Transferencia Banco de Venezuela',
    };
    
    // Columna izquierda - etiquetas
    pdf.text('FECHA:', 20, yPos+20);
    pdf.text('CLIENTE:', 20, yPos+26);
    pdf.text('CEDULA:', 20, yPos+32);
    pdf.text('TELEFONO:', 20, yPos+38);
    pdf.text('EMAIL:', 20, yPos+44);
    pdf.text('METODO PAGO:', 20, yPos+50);
    pdf.text('DIRECCION:', 20, yPos+56);
    
    // Columna derecha - datos reales
    pdf.setFont('times', 'normal');
    pdf.text(new Date(order.createdAt).toLocaleDateString('es-ES'), 65, yPos+20);
    pdf.text(sanitizeText(order.customerName), 65, yPos+26);
    pdf.text(sanitizeText(order.identityCard || 'No especificada'), 65, yPos+32);
    pdf.text(sanitizeText(order.phone || 'No especificado'), 65, yPos+38);
    pdf.text(sanitizeText(order.customerEmail), 65, yPos+44);
    pdf.text(paymentMethods[order.paymentMethod || ''] || 'No especificado', 65, yPos+50);
    
    // Dirección con ajuste de texto
    const address = sanitizeText(order.address || 'No especificada');
    const addressLines = pdf.splitTextToSize(address, pageWidth-80);
    pdf.text(addressLines, 65, yPos+56);
    
    yPos += 71;
    
    // Título de productos con tipografía moderna
    pdf.setTextColor(...dark);
    pdf.setFontSize(12);
    pdf.setFont('times', 'bold');
    pdf.text('DETALLE DE PRODUCTOS', 20, yPos+5);
    
    yPos += 15;
    
    // Header de tabla con bordes
    pdf.setDrawColor(...dark);
    pdf.setLineWidth(0.5);
    pdf.setFillColor(...brand);
    pdf.rect(15, yPos-2, pageWidth-30, 10, 'FD');
    pdf.setTextColor(...white);
    pdf.setFontSize(9);
    pdf.setFont('times', 'bold');
    pdf.text('PRODUCTO', 20, yPos+4);
    pdf.text('CANT', 130, yPos+4, { align: 'center' });
    pdf.text('P. UNIT', 155, yPos+4, { align: 'center' });
    pdf.text('SUBTOTAL', 175, yPos+4, { align: 'center' });
    
    yPos += 12;
    
    // Items con bordes de tabla
    pdf.setFont('times', 'normal');
    pdf.setFontSize(8);
    order.items.forEach((item, index) => {
      if (index % 2 === 0) {
        pdf.setFillColor(248, 250, 252);
        pdf.rect(15, yPos-2, pageWidth-30, 10, 'F');
      }
      
      // Bordes de celda
      pdf.setDrawColor(...medium);
      pdf.setLineWidth(0.3);
      pdf.rect(15, yPos-2, pageWidth-30, 10, 'S');
      
      pdf.setTextColor(...dark);
      const productName = sanitizeText(item.product.name);
      const truncatedName = productName.length > 45 ? productName.substring(0, 45) + '...' : productName;
      
      pdf.text(truncatedName, 20, yPos+4);
      pdf.text(item.quantity.toString(), 130, yPos+4, { align: 'center' });
      pdf.text(`$${item.price.toFixed(2)}`, 155, yPos+4, { align: 'center' });
      pdf.text(`$${(item.price * item.quantity).toFixed(2)}`, 175, yPos+4, { align: 'center' });
      yPos += 10;
    });
    
    yPos += 15;
    
    // Sección de totales estilo remito
    pdf.setDrawColor(...dark);
    pdf.setLineWidth(1);
    pdf.rect(pageWidth-120, yPos-5, 105, 40, 'S');
    
    // Header de totales
    pdf.setFillColor(...brand);
    pdf.rect(pageWidth-120, yPos-5, 105, 12, 'F');
    pdf.setTextColor(...white);
    pdf.setFontSize(10);
    pdf.setFont('times', 'bold');
    pdf.text('RESUMEN DE PAGO', pageWidth-115, yPos+2);
    
    // Detalles de totales
    pdf.setTextColor(...dark);
    pdf.setFontSize(9);
    pdf.setFont('times', 'normal');
    pdf.text('Subtotal:', pageWidth-115, yPos+15);
    pdf.text(`$${subtotal.toFixed(2)}`, pageWidth-25, yPos+15, { align: 'right' });
    
    pdf.text('Costo de Envio:', pageWidth-115, yPos+22);
    pdf.text(`$${shippingCost.toFixed(2)}`, pageWidth-25, yPos+22, { align: 'right' });
    
    // Línea separadora
    pdf.setDrawColor(...dark);
    pdf.setLineWidth(0.5);
    pdf.line(pageWidth-115, yPos+25, pageWidth-25, yPos+25);
    
    // Total final
    pdf.setFontSize(11);
    pdf.setFont('times', 'bold');
    pdf.text('TOTAL A PAGAR:', pageWidth-115, yPos+32);
    pdf.text(`$${order.total.toFixed(2)}`, pageWidth-25, yPos+32, { align: 'right' });
    
    yPos += 60;
    
    // Footer elegante
    pdf.setFillColor(...light);
    pdf.rect(0, yPos, pageWidth, 35, 'F');
    
    pdf.setTextColor(...medium);
    pdf.setFontSize(8);
    pdf.setFont('times', 'italic');
    pdf.text('Este documento no constituye una factura fiscal', pageWidth/2, yPos+8, { align: 'center' });
    
    pdf.setFont('times', 'bold');
    pdf.setTextColor(...brand);
    pdf.text('Gracias por confiar en Casa Dulce Oriente!', pageWidth/2, yPos+18, { align: 'center' });
    
    pdf.setFont('times', 'normal');
    pdf.setTextColor(...medium);
    pdf.setFontSize(7);
    pdf.text('WhatsApp: +58 424-853-6954  |  Email: casadulceoriente@gmail.com', pageWidth/2, yPos+26, { align: 'center' });
    
    pdf.save(`Comprobante_Pedido_${order.id}.pdf`);
  };

  return (
    <Button variant="outline" onClick={generateAndDownloadReceipt} className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-orange-400 text-white border-none hover:from-pink-600 hover:to-orange-500">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
      </svg>
      Descargar Comprobante
    </Button>
  );
}
