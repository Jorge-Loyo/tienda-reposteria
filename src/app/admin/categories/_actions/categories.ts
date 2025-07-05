"use server"

import { z } from "zod"
import db from "@/db/db"
import { notFound, redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

const addSchema = z.object({
  name: z.string().min(1),
})

export async function addCategory(prevState: unknown, formData: FormData) {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()))
  if (result.success === false) {
    return result.error.formErrors.fieldErrors
  }

  const data = result.data

  await db.category.create({
    data: {
      name: data.name,
    },
  })

  revalidatePath("/admin/categories")
  redirect("/admin/categories")
}

export async function updateCategory(
  id: number,
  prevState: unknown,
  formData: FormData
) {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()))
  if (result.success === false) {
    return result.error.formErrors.fieldErrors
  }

  const data = result.data
  const category = await db.category.findUnique({ where: { id } })

  if (category == null) return notFound()

  await db.category.update({
    where: { id },
    data: {
      name: data.name,
    },
  })

  revalidatePath("/admin/categories")
  revalidatePath(`/admin/categories/${id}/edit`)
  redirect("/admin/categories")
}

export async function deleteCategory(id: number) {
  const category = await db.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  })

  if (category == null) return notFound()

  if (category._count.products > 0) {
    return {
      error:
        "Esta categoría no puede ser eliminada porque tiene productos asociados.",
    }
  }

  await db.category.delete({ where: { id } })

  revalidatePath("/admin/categories")
  return { success: true }
}