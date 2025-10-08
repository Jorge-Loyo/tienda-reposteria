'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, CheckSquare, Square } from 'lucide-react';
import { ShippingZone } from '@prisma/client';

interface ZoneFiltersProps {
  zones: ShippingZone[];
  onFilteredZones: (zones: ShippingZone[]) => void;
  selectedZones: number[];
  onSelectionChange: (zoneIds: number[]) => void;
}

export function ZoneFilters({ zones, onFilteredZones, selectedZones, onSelectionChange }: ZoneFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const filterOptions = [
    { key: 'active', label: 'Activas', count: zones.filter(z => z.isActive).length },
    { key: 'inactive', label: 'Inactivas', count: zones.filter(z => !z.isActive).length },
    { key: 'freeShipping', label: 'Con envío gratis', count: zones.filter(z => z.freeShippingThreshold).length },
    { key: 'noFreeShipping', label: 'Sin envío gratis', count: zones.filter(z => !z.freeShippingThreshold).length },
  ];

  const applyFilters = () => {
    let filtered = zones;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(zone => 
        zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        zone.identifier.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filters
    if (activeFilters.includes('active')) {
      filtered = filtered.filter(zone => zone.isActive);
    }
    if (activeFilters.includes('inactive')) {
      filtered = filtered.filter(zone => !zone.isActive);
    }
    if (activeFilters.includes('freeShipping')) {
      filtered = filtered.filter(zone => zone.freeShippingThreshold);
    }
    if (activeFilters.includes('noFreeShipping')) {
      filtered = filtered.filter(zone => !zone.freeShippingThreshold);
    }

    onFilteredZones(filtered);
  };

  const toggleFilter = (filterKey: string) => {
    const newFilters = activeFilters.includes(filterKey)
      ? activeFilters.filter(f => f !== filterKey)
      : [...activeFilters, filterKey];
    setActiveFilters(newFilters);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setActiveFilters([]);
    onFilteredZones(zones);
  };

  const toggleSelectAll = () => {
    if (selectedZones.length === zones.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(zones.map(z => z.id));
    }
  };

  // Apply filters whenever dependencies change
  useEffect(() => {
    applyFilters();
  }, [searchTerm, activeFilters, zones]);

  return (
    <div className="space-y-4 mb-6">
      {/* Search and Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nombre o identificador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filtros
            {activeFilters.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {activeFilters.length}
              </Badge>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={toggleSelectAll}
            className="flex items-center gap-2"
          >
            {selectedZones.length === zones.length ? (
              <CheckSquare className="h-4 w-4" />
            ) : (
              <Square className="h-4 w-4" />
            )}
            Seleccionar todo
          </Button>
        </div>
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
          <div className="flex flex-wrap gap-2 mb-4">
            {filterOptions.map((option) => (
              <Button
                key={option.key}
                variant={activeFilters.includes(option.key) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleFilter(option.key)}
                className="flex items-center gap-2"
              >
                {option.label}
                <Badge variant="secondary" className="text-xs">
                  {option.count}
                </Badge>
              </Button>
            ))}
          </div>
          
          {(searchTerm || activeFilters.length > 0) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="flex items-center gap-2 text-gray-600"
            >
              <X className="h-4 w-4" />
              Limpiar filtros
            </Button>
          )}
        </div>
      )}

      {/* Active Filters Display */}
      {(searchTerm || activeFilters.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="outline" className="flex items-center gap-1">
              Búsqueda: "{searchTerm}"
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setSearchTerm('')}
              />
            </Badge>
          )}
          {activeFilters.map((filter) => {
            const option = filterOptions.find(o => o.key === filter);
            return (
              <Badge key={filter} variant="outline" className="flex items-center gap-1">
                {option?.label}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => toggleFilter(filter)}
                />
              </Badge>
            );
          })}
        </div>
      )}

      {/* Selection Info */}
      {selectedZones.length > 0 && (
        <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
          <span className="text-sm text-blue-700 dark:text-blue-300">
            {selectedZones.length} zona(s) seleccionada(s)
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelectionChange([])}
            className="text-blue-700 dark:text-blue-300"
          >
            Deseleccionar todo
          </Button>
        </div>
      )}
    </div>
  );
}