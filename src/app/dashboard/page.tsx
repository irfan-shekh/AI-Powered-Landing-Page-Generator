"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { LandingPageData } from '@/components/landing-page/Renderer';
import { Loader2, Plus, LayoutTemplate, ExternalLink } from 'lucide-react';

interface SavedPage {
  id: string;
  name: string;
  content: LandingPageData;
  createdAt: string;
}

export default function DashboardPage() {
  const [pages, setPages] = useState<SavedPage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await fetch('/api/pages');
        if (res.ok) {
          const data = await res.json();
          setPages(data);
        }
      } catch (error) {
        console.error('Failed to fetch pages', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPages();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Landing Pages</h1>
            <p className="mt-1 text-sm text-gray-500">Manage and view your generated pages.</p>
          </div>
          <Link
            href="/generate"
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Page
          </Link>
        </div>

        {pages.length === 0 ? (
          <div className="text-center bg-white rounded-lg border border-dashed border-gray-300 p-12">
            <LayoutTemplate className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No pages</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new landing page.</p>
            <div className="mt-6">
              <Link
                href="/generate"
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <Plus className="mr-1.5 h-4 w-4" aria-hidden="true" />
                New Page
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pages.map((page) => (
              <div key={page.id} className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900 truncate">{page.name}</h3>
                    <LayoutTemplate className="h-5 w-5 text-indigo-500" />
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    Created on {new Date(page.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex justify-between items-center mt-6">
                    <Link 
                      href={`/preview/${page.id}`} 
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center gap-1"
                    >
                      View Page <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
