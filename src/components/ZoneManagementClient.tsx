'use client';

import { useState, useEffect } from 'react';
import { ShippingZone } from '@prisma/client';
import { ZoneStatsClient } from './ZoneStatsClient';
import { ZoneOverview } from './ZoneOverview';
import { ZoneFilters } from './ZoneFilters';
import { ZoneBulkActions } from './ZoneBulkActions';
import { ZoneAnalytics } from './ZoneAnalytics';
import { ZoneEditForm } from './ZoneEditForm';
import { CreateZoneForm } from './CreateZoneForm';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, BarChart3, Settings } from 'lucide-react';

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

interface ZoneManagementClientProps {
  zones: ShippingZone[];
  analytics: ZoneAnalytic[];
}

export function ZoneManagementClient({ zones: initialZones, analytics }: ZoneManagementClientProps) {
  const [zones, setZones] = useState(initialZones);
  const [filteredZones, setFilteredZones] = useState(initialZones);
  const [selectedZones, setSelectedZones] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState('management');

  const localZones = zones.filter(z => z.identifier !== 'NACIONAL');

  useEffect(() => {
    setZones(initialZones);
    setFilteredZones(initialZones);
  }, [initialZones]);

  const handleSelectionChange = (zoneId: number, selected: boolean) => {
    setSelectedZones(prev => 
      selected 
        ? [...prev, zoneId]
        : prev.filter(id => id !== zoneId)
    );
  };

  const handleBulkSelectionChange = (zoneIds: number[]) => {
    setSelectedZones(zoneIds);
  };

  const handleBulkUpdate = async (action: string, value?: any) => {
    try {
      switch (action) {
        case 'activate':
          // TODO: Implement bulk activate
          console.log('Bulk activate zones:', selectedZones);
          break;
        case 'deactivate':
          // TODO: Implement bulk deactivate
          console.log('Bulk deactivate zones:', selectedZones);
          break;
        case 'updatePrices':
          // TODO: Implement bulk price update
          console.log('Bulk update prices:', value);
          break;
      }
      // Refresh page after bulk operations
      window.location.reload();
    } catch (error) {
      console.error('Error in bulk operation:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('management')}
            className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'management'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Settings className="h-4 w-4" />
            Gestión
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'analytics'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            Análisis
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <MapPin className="h-4 w-4" />
            Vista General
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'management' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <ZoneStatsClient zones={zones} />
          
          {/* Filters and Search */}
          <ZoneFilters
            zones={localZones}
            onFilteredZones={setFilteredZones}
            selectedZones={selectedZones}
            onSelectionChange={handleBulkSelectionChange}
          />

          {/* Bulk Actions */}
          <ZoneBulkActions
            selectedZones={selectedZones}
            onBulkUpdate={handleBulkUpdate}
          />

          {/* Local Zones Management */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Zonas Locales ({filteredZones.filter(z => z.identifier !== 'NACIONAL').length})
              </h2>
              <CreateZoneForm />
            </div>
            
            <div className="grid gap-6">
              {filteredZones.filter(z => z.identifier !== 'NACIONAL').length > 0 ? (
                filteredZones
                  .filter(z => z.identifier !== 'NACIONAL')
                  .map(zone => (
                    <ZoneEditForm 
                      key={zone.id} 
                      zone={zone}
                      isSelected={selectedZones.includes(zone.id)}
                      onSelectionChange={handleSelectionChange}
                    />
                  ))
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      No se encontraron zonas con los filtros aplicados.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <ZoneAnalytics analytics={analytics} />
        </div>
      )}

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <ZoneOverview zones={zones} />
        </div>
      )}
    </div>
  );
}