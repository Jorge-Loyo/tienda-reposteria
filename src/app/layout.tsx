// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CartIcon from "@/components/CartIcon";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Casa Dulce Oriente - Repostería",
  description: "Los mejores insumos para tus creaciones.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex">
                <Link href="/" className="text-xl font-bold text-gray-800 hover:text-indigo-600 transition-colors">
                  Casa Dulce Oriente
                </Link>
              </div>
              <nav className="hidden md:flex gap-8">
                <Link href="/tienda" className="text-sm font-medium text-gray-600 hover:text-indigo-600">Tienda</Link>
                <Link href="/admin" className="text-sm font-medium text-gray-600 hover:text-indigo-600">Admin</Link>
              </nav>
              <div className="flex items-center">
                <CartIcon />
              </div>
            </div>
          </div>
        </header>

        <main className="bg-gray-50 min-h-screen">
          {children}
        </main>
        
        <footer className="bg-white border-t">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} Casa Dulce Oriente. Todos los derechos reservados.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}