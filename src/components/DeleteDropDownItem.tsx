"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useTransition } from "react"
import { useRouter } from "next/navigation"

export function DeleteDropDownItem({
  id,
  deleteAction,
  disabled,
}: {
  id: number
  deleteAction: (id: number) => Promise<{ error?: string }>
  disabled?: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  return (
    <DropdownMenuItem
      disabled={disabled || isPending}
      className="text-red-600 focus:text-red-600"
      onClick={() => {
        startTransition(async () => {
          const result = await deleteAction(id)
          if (result.error) {
            alert(result.error)
          }
          router.refresh()
        })
      }}
    >
      Eliminar
    </DropdownMenuItem>
  )
}