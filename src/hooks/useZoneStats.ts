import { ShippingZone } from '@prisma/client';

export function useZoneStats(zones: ShippingZone[]) {
  const localZones = zones.filter(z => z.identifier !== 'NACIONAL');
  const nationalZone = zones.find(z => z.identifier === 'NACIONAL');
  
  const stats = {
    totalZones: zones.length,
    localZones: localZones.length,
    hasNationalZone: !!nationalZone,
    avgShippingCost: localZones.length > 0 
      ? Number((localZones.reduce((sum, zone) => sum + zone.cost, 0) / localZones.length).toFixed(2))
      : 0,
    zonesWithFreeShipping: localZones.filter(z => z.freeShippingThreshold && z.freeShippingThreshold > 0).length,
    minShippingCost: localZones.length > 0 ? Math.min(...localZones.map(z => z.cost)) : 0,
    maxShippingCost: localZones.length > 0 ? Math.max(...localZones.map(z => z.cost)) : 0,
    avgFreeShippingThreshold: (() => {
      const zonesWithThreshold = localZones.filter(z => z.freeShippingThreshold && z.freeShippingThreshold > 0);
      return zonesWithThreshold.length > 0
        ? Number((zonesWithThreshold.reduce((sum, zone) => sum + (zone.freeShippingThreshold || 0), 0) / zonesWithThreshold.length).toFixed(2))
        : 0;
    })(),
  };

  return { stats, localZones, nationalZone };
}