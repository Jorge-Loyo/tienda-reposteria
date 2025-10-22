import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import db from "@/db/db"
import { ArrowLeft, FolderOpen, Package, Plus, Edit, Trash2, BarChart3 } from "lucide-react"
import { CategoryManagementClient } from "@/components/CategoryManagementClient"

async function getCategories() {
  return db.category.findMany({
    select: {
      id: true,
      name: true,
      imageUrl: true,
      _count: { select: { products: true } },
    },
    orderBy: { name: "asc" },
  })
}

async function getCategoryStats() {
  const [totalCategories, totalProducts, categoriesWithProducts] = await Promise.all([
    db.category.count(),
    db.product.count(),
    db.category.count({
      where: {
        products: {
          some: {}
        }
      }
    })
  ]);

  const avgProductsPerCategory = totalCategories > 0 ? (totalProducts / totalCategories).toFixed(1) : '0';

  return {
    totalCategories,
    totalProducts,
    categoriesWithProducts,
    avgProductsPerCategory,
    emptyCategoriesCount: totalCategories - categoriesWithProducts
  };
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories();
  const stats = await getCategoryStats();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="relative text-center mb-12">
        <div className="absolute top-0 right-0">
          <Button variant="outline" asChild>
            <Link href="/perfil" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver al Perfil
            </Link>
          </Button>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-3 mb-4">
          <FolderOpen className="h-10 w-10 text-blue-600" />
          Gestión de Categorías
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Organiza y administra las categorías de productos
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categorías</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCategories}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Con Productos</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.categoriesWithProducts}</div>
            <p className="text-xs text-muted-foreground">
              {stats.emptyCategoriesCount} vacías
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgProductsPerCategory}</div>
            <p className="text-xs text-muted-foreground">
              productos por categoría
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Category Management */}
      <CategoryManagementClient categories={categories} />
    </div>
  )
}


