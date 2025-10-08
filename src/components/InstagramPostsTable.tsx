'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { deleteInstagramPost, toggleInstagramPostStatus } from '@/app/admin/instagram/actions';

interface InstagramPost {
  id: number;
  url: string;
  imageUrl: string;
  caption: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

interface InstagramPostsTableProps {
  posts: InstagramPost[];
}

export function InstagramPostsTable({ posts }: InstagramPostsTableProps) {
  const handleDeleteClick = async (post: InstagramPost) => {
    if (confirm(`¿Estás seguro de que quieres eliminar esta publicación?`)) {
      await deleteInstagramPost(post.id);
      window.location.reload();
    }
  };

  const handleToggleStatus = async (postId: number) => {
    await toggleInstagramPostStatus(postId);
    window.location.reload();
  };

  return (
    <>
      <div className="p-6 border-b border-white/20">
        <h2 className="text-2xl font-bold gradient-text">Publicaciones de Instagram</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gradient-to-r from-pink-500/10 to-orange-500/10">
            <tr>
              <th className="text-left py-4 px-6 font-semibold text-gray-800">Imagen</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-800">Caption</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-800">URL</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-800">Estado</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-800">Orden</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-800">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-white/10 hover:bg-white/20 transition-colors">
                <td className="py-4 px-6">
                  <img 
                    src={post.imageUrl} 
                    alt="Instagram post" 
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                </td>
                <td className="py-4 px-6 max-w-xs">
                  <p className="text-gray-700 truncate">{post.caption}</p>
                </td>
                <td className="py-4 px-6">
                  <a 
                    href={post.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-pink-600 hover:text-pink-700 text-sm"
                  >
                    Ver en Instagram
                  </a>
                </td>
                <td className="py-4 px-6">
                  <button
                    onClick={() => handleToggleStatus(post.id)}
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      post.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {post.isActive ? 'Activo' : 'Inactivo'}
                  </button>
                </td>
                <td className="py-4 px-6 text-gray-700">{post.order}</td>
                <td className="py-4 px-6">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/instagram/edit/${post.id}`}>
                        Editar
                      </Link>
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteClick(post)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay publicaciones de Instagram configuradas</p>
          </div>
        )}
      </div>


    </>
  );
}