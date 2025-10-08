import db from "@/db/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CategoryForm } from "@/components/CategoryForm"
import Link from "next/link"
import { ArrowLeft, FolderEdit, Package } from "lucide-react"
import { notFound } from "next/navigation"

export default async function EditCategoryPage({
  params: { id },
}: {
  params: { id: string }
}) {
  const category = await db.category.findUnique({ 
    where: { id: Number(id) },
    include: { _count: { select: { products: true } } }
  })
  
  if (!category) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" asChild>
          <Link href="/admin/categories" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FolderEdit className="h-8 w-8 text-blue-600" />
            Editar Categoría
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-gray-600 dark:text-gray-400">{category.name}</p>
            <Badge variant="outline" className="text-xs">
              <Package className="h-3 w-3 mr-1" />
              {category._count.products} productos
            </Badge>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Información de la Categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryForm category={category} />
        </CardContent>
      </Card>
    </div>
  )
}
