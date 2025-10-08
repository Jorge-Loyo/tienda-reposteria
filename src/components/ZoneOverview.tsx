'use client';

import { ShippingZone } from '@prisma/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, DollarSign, Gift } from 'lucide-react';

interface ZoneOverviewProps {
  zones: ShippingZone[];
}

export function ZoneOverview({ zones }: ZoneOverviewProps) {
  const localZones = zones.filter(z => z.identifier !== 'NACIONAL');
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Vista General de Zonas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {localZones.map((zone) => (
            <div
              key={zone.id}
              className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">{zone.name}</h4>
                <Badge variant="outline" className="text-xs">
                  {zone.identifier}
                </Badge>
              </div>
              
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <DollarSign className="h-3 w-3" />
                  <span>Costo: ${zone.cost} USD</span>
                </div>
                
                {zone.freeShippingThreshold && zone.freeShippingThreshold > 0 && (
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <Gift className="h-3 w-3" />
                    <span>Gratis desde: ${zone.freeShippingThreshold}</span>
                  </div>
                )}
                
                {(!zone.freeShippingThreshold || zone.freeShippingThreshold === 0) && (
                  <div className="text-gray-500 text-xs">
                    Sin envío gratis configurado
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}