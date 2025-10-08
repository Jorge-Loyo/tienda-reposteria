import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CategoryForm } from "@/components/CategoryForm"
import Link from "next/link"
import { ArrowLeft, FolderPlus } from "lucide-react"

export default function NewCategoryPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <FolderPlus className="h-8 w-8 text-blue-600" />
            Nueva Categoría
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Crea una nueva categoría para organizar tus productos
          </p>
        </div>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Información de la Categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryForm />
        </CardContent>
      </Card>
    </div>
  )
}