import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/PageHeader"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import db from "@/db/db"
import { CheckCircle2, MoreVertical, XCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DeleteDropDownItem } from "@/components/DeleteDropDownItem"
import { deleteCategory } from "./_actions/categories"

async function getCategories() {
  return db.category.findMany({
    select: {
      id: true,
      name: true,
      _count: { select: { products: true } },
    },
    orderBy: { name: "asc" },
  })
}

export default function AdminCategoriesPage() {
  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <PageHeader>Categorías</PageHeader>
        <Button asChild>
          <Link href="/admin/categories/new">Añadir Categoría</Link>
        </Button>
      </div>
      <CategoriesTable />
    </>
  )
}

async function CategoriesTable() {
  const categories = await getCategories()

  if (categories.length === 0) return <p>No se encontraron categorías.</p>

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Productos</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Acciones</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map(category => (
          <TableRow key={category.id}>
            <TableCell>{category.name}</TableCell>
            <TableCell>{category._count.products}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical />
                  <span className="sr-only">Acciones</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/categories/${category.id}/edit`}>
                      Editar
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DeleteDropDownItem
                    id={category.id}
                    deleteAction={deleteCategory}
                    disabled={category._count.products > 0}
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
