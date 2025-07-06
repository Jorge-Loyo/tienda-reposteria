import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ZoneEditForm } from '@/components/ZoneEditForm';
import { Info } from 'lucide-react'; // Importamos un icono para el mensaje

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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Zonas de Envío</h1>
        <Button variant="outline" asChild>
          <Link href="/admin">Volver al Dashboard</Link>
        </Button>
      </div>

      <div className="space-y-6">
        {zones.length > 0 ? (
            zones.map(zone => {
                // --- MODIFICACIÓN: Se añade una condición para la zona de Envíos Nacionales ---
                if (zone.identifier === 'NACIONAL') {
                    return (
                        <div key={zone.id} className="p-4 bg-blue-50 rounded-lg shadow-sm border border-blue-200">
                            <h3 className="font-semibold text-lg text-blue-800">{zone.name}</h3>
                            <div className="flex items-center gap-2 mt-2 text-sm text-blue-700">
                                <Info className="h-4 w-4" />
                                <p>Para esta zona, nos contactaremos con el cliente para cotizar el envío.</p>
                            </div>
                        </div>
                    );
                }
                // Para el resto de las zonas, se muestra el formulario de edición normal.
                return <ZoneEditForm key={zone.id} zone={zone} />;
            })
        ) : (
            <p className="text-center text-gray-500 py-8">Error al cargar las zonas de envío.</p>
        )}
      </div>
    </div>
  );
}
