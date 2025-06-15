// src/app/page.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[calc(100vh-128px)] px-4">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
        El Arte de la Repostería Comienza Aquí
      </h1>
      <p className="max-w-2xl mx-auto text-lg text-gray-600 mb-8">
        Encuentra todos los insumos de la más alta calidad para que tus creaciones sean inolvidables.
      </p>
      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link href="/tienda">Ir a la Tienda</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/admin">Panel de Admin</Link>
        </Button>
      </div>
    </div>
  );
}