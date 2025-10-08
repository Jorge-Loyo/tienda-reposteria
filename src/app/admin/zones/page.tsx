import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ZoneEditForm } from '@/components/ZoneEditForm';
import { ZoneStatsClient } from '@/components/ZoneStatsClient';
import { ZoneOverview } from '@/components/ZoneOverview';
import { CreateZoneForm } from '@/components/CreateZoneForm';
import { ZoneManagementClient } from '@/components/ZoneManagementClient';
import { getZoneAnalytics } from '@/app/admin/zones/actions';
import { ArrowLeft, MapPin, Info, Globe } from 'lucide-react';

const prisma = new PrismaClient();

// Definimos las zonas que queremos que existan en nuestra base de datos.
const ZONES_TO_MANAGE = [
    { identifier: 'BARCELONA', name: 'Barcelona' },
    { identifier: 'PUERTO_LA_CRUZ', name: 'Puerto la Cruz' },
    { identifier: 'LECHERIA', name: 'Lechería' },
    { identifier: 'GUANTA', name: 'Guanta' },
    { identifier: 'NACIONAL', name: 'Envíos Nacionales' },
];

// Esta función ahora se asegura de que las zonas existan antes de devolverlas.
async function getAndEnsureShippingZones() {
    try {
        // Usamos una transacción para asegurar que todas las operaciones se completen con éxito.
        await prisma.$transaction(async (tx) => {
            for (const zone of ZONES_TO_MANAGE) {
                // 'upsert' es una operación especial que:
                // - ACTUALIZA una zona si la encuentra (en este caso, no hace nada).
                // - CREA la zona con valores por defecto si no la encuentra.
                await tx.shippingZone.upsert({
                    where: { identifier: zone.identifier },
                    update: {}, 
                    create: {
                        identifier: zone.identifier,
                        name: zone.name,
                        cost: 0, // El costo inicial será 0
                        freeShippingThreshold: null,
                    },
                });
            }
        });

        // Una vez asegurado que existen, obtenemos todas las zonas para mostrarlas.
        return await prisma.shippingZone.findMany({
            orderBy: { id: 'asc' }
        });

    } catch (error) {
        console.error("Error al asegurar/obtener las zonas de envío:", error);
        return [];
    }
}

export default async function AdminZonesPage() {
  const zones = await getAndEnsureShippingZones();
  const analytics = await getZoneAnalytics();
  
  const nationalZone = zones.find(z => z.identifier === 'NACIONAL');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <MapPin className="h-8 w-8 text-blue-600" />
            Gestión de Zonas de Envío
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Configura los costos y políticas de envío por zona geográfica
          </p>
        </div>
        <Button variant="outline" asChild className="w-fit">
          <Link href="/perfil" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver al Perfil
          </Link>
        </Button>
      </div>

      {/* National Zone */}
      {nationalZone && (
        <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-blue-900 dark:text-blue-100">{nationalZone.name}</CardTitle>
                  <CardDescription className="text-blue-700 dark:text-blue-300">
                    Cobertura nacional con cotización personalizada
                  </CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="border-blue-300 text-blue-700">
                Especial
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
              <Info className="h-4 w-4" />
              <p>Para esta zona, nos contactaremos con el cliente para cotizar el envío según destino y peso.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Zone Management with all new features */}
      <ZoneManagementClient zones={zones} analytics={analytics} />
    </div>
  );
}
