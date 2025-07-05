import db from "@/db/db"
import { PageHeader } from "@/components/PageHeader"
import { CategoryForm } from "@/components/CategoryForm"

export default async function EditCategoryPage({
  params: { id },
}: {
  params: { id: string }
}) {
  const category = await db.category.findUnique({ where: { id: Number(id) } })
  return (
    <>
      <PageHeader>Editar Categoría</PageHeader>
      <CategoryForm category={category} />
    </>
  )
}
