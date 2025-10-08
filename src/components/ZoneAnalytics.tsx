'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Package, DollarSign, Activity, MapPin, Users } from 'lucide-react';

interface ZoneAnalytic {
  id: number;
  identifier: string;
  name: string;
  cost: number;
  freeShippingThreshold: number | null;
  isActive: boolean;
  ordersCount: number;
  totalRevenue: number;
  changesCount: number;
}

interface ZoneAnalyticsProps {
  analytics: ZoneAnalytic[];
}

export function ZoneAnalytics({ analytics }: ZoneAnalyticsProps) {
  const totalOrders = analytics.reduce((sum, zone) => sum + zone.ordersCount, 0);
  const totalRevenue = analytics.reduce((sum, zone) => sum + zone.totalRevenue, 0);
  const activeZones = analytics.filter(z => z.isActive).length;
  const avgOrdersPerZone = analytics.length > 0 ? (totalOrders / analytics.length).toFixed(1) : '0';

  const topZonesByOrders = [...analytics]
    .sort((a, b) => b.ordersCount - a.ordersCount)
    .slice(0, 3);

  const topZonesByRevenue = [...analytics]
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 3);

  return (
    <div className="space-y-6 mb-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pedidos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              Promedio: {avgOrdersPerZone} por zona
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Por envíos y productos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Zonas Activas</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeZones}</div>
            <p className="text-xs text-muted-foreground">
              de {analytics.length} totales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Conversión</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.length > 0 ? ((activeZones / analytics.length) * 100).toFixed(1) : '0'}%
            </div>
            <p className="text-xs text-muted-foreground">
              Zonas activas vs totales
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top by Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Top Zonas por Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topZonesByOrders.map((zone, index) => (
                <div key={zone.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{zone.name}</p>
                      <p className="text-sm text-muted-foreground">${zone.cost} USD</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{zone.ordersCount}</p>
                    <p className="text-sm text-muted-foreground">pedidos</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top by Revenue */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Top Zonas por Ingresos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topZonesByRevenue.map((zone, index) => (
                <div key={zone.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-green-100 text-green-800' :
                      index === 1 ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{zone.name}</p>
                      <p className="text-sm text-muted-foreground">{zone.ordersCount} pedidos</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${zone.totalRevenue.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">ingresos</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Análisis Detallado por Zona
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Zona</th>
                  <th className="text-left p-2">Estado</th>
                  <th className="text-right p-2">Costo</th>
                  <th className="text-right p-2">Pedidos</th>
                  <th className="text-right p-2">Ingresos</th>
                  <th className="text-right p-2">Cambios</th>
                  <th className="text-right p-2">Promedio/Pedido</th>
                </tr>
              </thead>
              <tbody>
                {analytics.map((zone) => (
                  <tr key={zone.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="p-2">
                      <div>
                        <p className="font-medium">{zone.name}</p>
                        <p className="text-xs text-muted-foreground">{zone.identifier}</p>
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge variant={zone.isActive ? "default" : "secondary"}>
                        {zone.isActive ? 'Activa' : 'Inactiva'}
                      </Badge>
                    </td>
                    <td className="text-right p-2">${zone.cost}</td>
                    <td className="text-right p-2">{zone.ordersCount}</td>
                    <td className="text-right p-2">${zone.totalRevenue.toFixed(2)}</td>
                    <td className="text-right p-2">{zone.changesCount}</td>
                    <td className="text-right p-2">
                      ${zone.ordersCount > 0 ? (zone.totalRevenue / zone.ordersCount).toFixed(2) : '0.00'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}