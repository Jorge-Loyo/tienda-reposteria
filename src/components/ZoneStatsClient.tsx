'use client';

import { ShippingZone } from '@prisma/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useZoneStats } from '@/hooks/useZoneStats';
import { Globe, DollarSign, Truck, TrendingUp, Package, Target } from 'lucide-react';

interface ZoneStatsClientProps {
  zones: ShippingZone[];
}

export function ZoneStatsClient({ zones }: ZoneStatsClientProps) {
  const { stats } = useZoneStats(zones);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Zonas</CardTitle>
          <Globe className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalZones}</div>
          <p className="text-xs text-muted-foreground">
            {stats.localZones} locales + {stats.hasNationalZone ? '1' : '0'} nacional
          </p>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Costo Promedio</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.avgShippingCost}</div>
          <p className="text-xs text-muted-foreground">
            Min: ${stats.minShippingCost} | Max: ${stats.maxShippingCost}
          </p>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Envío Gratis</CardTitle>
          <Truck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.zonesWithFreeShipping}</div>
          <p className="text-xs text-muted-foreground">
            de {stats.localZones} zonas locales
          </p>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Umbral Promedio</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.avgFreeShippingThreshold > 0 ? `$${stats.avgFreeShippingThreshold}` : 'N/A'}
          </div>
          <p className="text-xs text-muted-foreground">
            para envío gratis
          </p>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cobertura</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.hasNationalZone ? '100%' : Math.round((stats.localZones / 5) * 100) + '%'}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.hasNationalZone ? 'Nacional + Local' : 'Solo local'}
          </p>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Estado</CardTitle>
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            <TrendingUp className="h-3 w-3 mr-1" />
            Activo
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Sistema operativo</div>
        </CardContent>
      </Card>
    </div>
  );
}