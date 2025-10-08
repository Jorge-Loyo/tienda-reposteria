'use client';

import { Button } from '@/components/ui/button';
import { sendWhatsAppNotification } from '@/lib/whatsapp';

interface WhatsAppButtonProps {
  customerName: string;
  customerPhone: string;
  orderId: number;
  orderStatus: string;
  orderTotal?: number;
  className?: string;
}

export default function WhatsAppButton({
  customerName,
  customerPhone,
  orderId,
  orderStatus,
  orderTotal,
  className
}: WhatsAppButtonProps) {
  const handleSendWhatsApp = () => {
    const whatsappURL = sendWhatsAppNotification(
      customerName,
      customerPhone,
      orderId,
      orderStatus,
      orderTotal
    );
    
    window.open(whatsappURL, '_blank');
  };

  if (!customerPhone) return null;

  return (
    <Button
      onClick={handleSendWhatsApp}
      variant="gradient"
      size="sm"
      className={className}
    >
      📱 Enviar WhatsApp
    </Button>
  );
}