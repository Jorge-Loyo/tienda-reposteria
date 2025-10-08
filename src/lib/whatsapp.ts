import { ORDER_STATUS } from './constants';

const WHATSAPP_API_URL = 'https://api.whatsapp.com/send';

interface OrderStatusMessage {
  [key: string]: string;
}

const STATUS_MESSAGES: OrderStatusMessage = {
  [ORDER_STATUS.PAID]: '¡Tu pedido ha sido confirmado! 🎉 Comenzaremos a prepararlo pronto.',
  [ORDER_STATUS.PREPARING]: '¡Estamos preparando tu pedido! 👩‍🍳 Te notificaremos cuando esté listo.',
  [ORDER_STATUS.READY]: '¡Tu pedido está listo para entregar! 📦 Vamos en camino a la dirección.',
  [ORDER_STATUS.DELIVERED]: '¡Pedido entregado! 🚚 Gracias por tu compra. ¡Esperamos verte pronto!',
  [ORDER_STATUS.CANCELLED]: 'Tu pedido ha sido cancelado. 😔 Si tienes dudas, contáctanos.'
};

export function generateWhatsAppMessage(
  customerName: string,
  orderId: number,
  newStatus: string,
  orderTotal?: number
): string {
  const statusMessage = STATUS_MESSAGES[newStatus] || 'Tu pedido ha sido actualizado.';
  
  let message = `Hola ${customerName}! 👋\n\n`;
  message += `Pedido #${orderId}\n`;
  message += `${statusMessage}\n\n`;
  
  if (orderTotal) {
    message += `Total: $${orderTotal.toFixed(2)} USD\n\n`;
  }
  
  message += `Casa Dulce Oriente 🧁\n`;
  message += `¿Tienes alguna pregunta? ¡Escríbenos!`;
  
  return message;
}

export function getWhatsAppURL(phoneNumber: string, message: string): string {
  // Limpiar número de teléfono (remover espacios, guiones, etc.)
  let cleanPhone = phoneNumber.replace(/\D/g, '');
  
  // Si empieza con +, removerlo
  if (phoneNumber.startsWith('+')) {
    cleanPhone = phoneNumber.substring(1).replace(/\D/g, '');
  }
  
  // Agregar código de país si no lo tiene (Venezuela +58)
  const formattedPhone = cleanPhone.startsWith('58') ? cleanPhone : `58${cleanPhone}`;
  
  const encodedMessage = encodeURIComponent(message);
  
  return `${WHATSAPP_API_URL}?phone=${formattedPhone}&text=${encodedMessage}`;
}

export function sendWhatsAppNotification(
  customerName: string,
  phoneNumber: string,
  orderId: number,
  newStatus: string,
  orderTotal?: number
): string {
  const message = generateWhatsAppMessage(customerName, orderId, newStatus, orderTotal);
  return getWhatsAppURL(phoneNumber, message);
}

export function generateNewOrderMessage(
  orderId: number,
  customerName: string,
  customerEmail: string,
  customerPhone: string,
  total: number,
  items: Array<{ name: string; quantity: number; price: number }>
): string {
  let message = `🆕 NUEVO PEDIDO #${orderId}\n\n`;
  message += `👤 Cliente: ${customerName}\n`;
  message += `📧 Email: ${customerEmail}\n`;
  message += `📱 Teléfono: ${customerPhone}\n\n`;
  message += `📦 PRODUCTOS:\n`;
  
  items.forEach(item => {
    message += `• ${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}\n`;
  });
  
  message += `\n💰 TOTAL: $${total.toFixed(2)} USD\n\n`;
  message += `⚠️ Valida el pago`;
  
  return message;
}

export function sendNewOrderNotification(
  orderId: number,
  customerName: string,
  customerEmail: string,
  customerPhone: string,
  total: number,
  items: Array<{ name: string; quantity: number; price: number }>
): string {
  const adminPhone = '+584248536954';
  const message = generateNewOrderMessage(orderId, customerName, customerEmail, customerPhone, total, items);
  return getWhatsAppURL(adminPhone, message);
}