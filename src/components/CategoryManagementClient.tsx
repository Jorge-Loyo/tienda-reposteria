'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Link from 'next/link';
import { FolderOpen, Package, Plus, Edit, Trash2, Search, AlertTriangle } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  imageUrl?: string | null;
  _count: {
    products: number;
  };
}

interface CategoryManagementClientProps {
  categories: Category[];
}

export function CategoryManagementClient({ categories }: CategoryManagementClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    
    try {
      const response = await fetch(`/api/categories/${categoryToDelete.id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        window.location.reload();
      } else {
        alert('Error al eliminar la categoría');
      }
    } catch (error) {
      alert('Error al eliminar la categoría');
    }
    
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Search and Add */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar categorías..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button asChild className="flex items-center gap-2">
          <Link href="/admin/categories/new">
            <Plus className="h-4 w-4" />
            Agregar Categoría
          </Link>
        </Button>
      </div>

      {/* Categories Grid */}
      {filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <Card key={category.id} className="transition-all duration-200 hover:shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 flex-shrink-0 flex items-center justify-center">
                      {category.imageUrl ? (
                        <span className="text-2xl">{category.imageUrl}</span>
                      ) : (
                        <FolderOpen className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          <Package className="h-3 w-3 mr-1" />
                          {category._count.products} productos
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/categories/${category.id}/edit`} className="flex items-center gap-2">
                      <Edit className="h-4 w-4" />
                      Editar
                    </Link>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteClick(category)}
                    disabled={category._count.products > 0}
                    className={`flex items-center gap-2 ${
                      category._count.products > 0 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'text-red-600 hover:text-red-700 hover:border-red-300'
                    }`}
                  >
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                  </Button>
                </div>
                
                {category._count.products > 0 && (
                  <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                    <div className="flex items-center gap-2 text-xs text-yellow-700 dark:text-yellow-300">
                      <AlertTriangle className="h-3 w-3" />
                      No se puede eliminar: tiene productos asociados
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              {searchTerm ? 'No se encontraron categorías' : 'No hay categorías'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchTerm 
                ? `No hay categorías que coincidan con "${searchTerm}"`
                : 'Comienza creando tu primera categoría de productos'
              }
            </p>
            {!searchTerm && (
              <Button asChild>
                <Link href="/admin/categories/new" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Crear Primera Categoría
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Categoría</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar la categoría "{categoryToDelete?.name}"? 
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}