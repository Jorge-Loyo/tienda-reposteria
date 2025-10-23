import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CategoryForm } from "@/components/CategoryForm"
import Link from "next/link"
import { ArrowLeft, FolderPlus } from "lucide-react"
import './new-category.css'

export default function NewCategoryPage() {
  return (
    <div className="new-category-container">
      <div className="new-category-header">
        <Button variant="outline" asChild>
          <Link href="/admin/categories" className="new-category-back-link">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
        </Button>
        <div>
          <h1 className="new-category-title">
            <FolderPlus className="new-category-title-icon" />
            Nueva Categoría
          </h1>
          <p className="new-category-subtitle">
            Crea una nueva categoría para organizar tus productos
          </p>
        </div>
      </div>

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