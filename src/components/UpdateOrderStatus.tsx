'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { sendWhatsAppNotification } from '@/lib/whatsapp';
import { showToast } from '@/components/ui/toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UpdateOrderStatusProps {
  orderId: number;
  currentStatus: string;
  customerName?: string;
  customerPhone?: string;
  orderTotal?: number;
  paymentMethod?: string;
}

export default function UpdateOrderStatus({ 
  orderId, 
  currentStatus, 
  customerName, 
  customerPhone, 
  orderTotal,
  paymentMethod
}: UpdateOrderStatusProps) {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState('');
  const [showReceiptInput, setShowReceiptInput] = useState(false);

  // Lógica de estados permitidos
  const getAvailableStatuses = (current: string) => {
    const statuses = [];
    
    switch (current) {
      case 'PENDIENTE_DE_PAGO':
        statuses.push({ value: 'PAGADO', label: 'PAGADO' });
        break;
      case 'PAGADO':
        statuses.push({ value: 'ARMADO', label: 'ARMADO' });
        break;
      case 'ARMADO':
        statuses.push({ value: 'ENVIADO', label: 'ENVIADO' });
        break;
    }
    
    // Cancelado siempre disponible
    statuses.push({ value: 'CANCELADO', label: 'CANCELADO' });
    
    return statuses;
  };

  const handleStatusChange = (newStatus: string) => {
    setSelectedStatus(newStatus);
    // Mostrar campo de comprobante solo para métodos de pago específicos
    const requiresReceipt = ['ZELLE', 'BANESCO', 'BDV'].includes(paymentMethod || '');
    setShowReceiptInput(currentStatus === 'PENDIENTE_DE_PAGO' && newStatus === 'PAGADO' && requiresReceipt);
  };

  const handleUpdateStatus = async () => {
    // Validar comprobante si es necesario
    if (showReceiptInput && !receiptNumber.trim()) {
      showToast('El número de comprobante es obligatorio para marcar como pagado', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const updateData: any = { status: selectedStatus };
      
      // Incluir número de comprobante si se proporciona
      if (showReceiptInput && receiptNumber.trim()) {
        updateData.receiptNumber = receiptNumber.trim();
      }
      
      // Incluir quién confirmó el pago si se cambia a PAGADO
      if (selectedStatus === 'PAGADO') {
        updateData.includeConfirmedBy = true;
      }

      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'No se pudo actualizar el estado del pedido.');
      }
      
      // Generar enlace de WhatsApp si hay datos del cliente
      if (customerName && customerPhone && selectedStatus !== 'PENDIENTE_DE_PAGO') {
        const whatsappURL = sendWhatsAppNotification(
          customerName,
          customerPhone,
          orderId,
          selectedStatus,
          orderTotal
        );
        
        window.open(whatsappURL, '_blank');
      }
      
      showToast('Estado del pedido actualizado con éxito', 'success');
      router.refresh();

    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'Hubo un problema al actualizar el estado.';
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const availableStatuses = getAvailableStatuses(currentStatus);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Select value={selectedStatus} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Cambiar estado" />
          </SelectTrigger>
          <SelectContent>
            {availableStatuses.map(status => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {showReceiptInput && (
        <div className="space-y-2">
          <Label htmlFor="receiptNumber">Número de Comprobante *</Label>
          <Input
            id="receiptNumber"
            type="text"
            value={receiptNumber}
            onChange={(e) => setReceiptNumber(e.target.value)}
            placeholder="Ingrese número de comprobante"
            className="w-full"
          />
        </div>
      )}

      <Button 
        onClick={handleUpdateStatus} 
        disabled={isLoading || selectedStatus === currentStatus}
        className="w-full"
      >
        {isLoading ? 'Guardando...' : 'Actualizar Estado'}
      </Button>
    </div>
  );
}