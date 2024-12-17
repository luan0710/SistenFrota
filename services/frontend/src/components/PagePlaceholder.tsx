import React from 'react';
import DashboardLayout from './DashboardLayout';
import { WrenchIcon } from '@heroicons/react/24/outline';

interface PagePlaceholderProps {
  title: string;
}

export default function PagePlaceholder({ title }: PagePlaceholderProps) {
  return (
    <DashboardLayout>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center">
          <WrenchIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Em desenvolvimento</h3>
          <p className="mt-1 text-sm text-gray-500">
            A página {title} está em desenvolvimento.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 