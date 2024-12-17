import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  UserGroupIcon,
  TruckIcon,
  WrenchScrewdriverIcon,
  ChartBarIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';

interface MenuItem {
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  path: string;
  children?: { name: string; path: string }[];
}

const menuItems: MenuItem[] = [
  { name: 'Dashboard', icon: HomeIcon, path: '/dashboard' },
  { 
    name: 'Cadastros', 
    icon: UserGroupIcon, 
    path: '/cadastros',
    children: [
      { name: 'Veículos', path: '/cadastros/veiculos' },
      { name: 'Motoristas', path: '/cadastros/motoristas' },
      { name: 'Fornecedores', path: '/cadastros/fornecedores' },
    ]
  },
  { 
    name: 'Operações', 
    icon: TruckIcon, 
    path: '/operacoes',
    children: [
      { name: 'Viagens', path: '/operacoes/viagens' },
      { name: 'Abastecimentos', path: '/operacoes/abastecimentos' },
      { name: 'Manutenções', path: '/operacoes/manutencoes' },
    ]
  },
  { 
    name: 'Manutenção', 
    icon: WrenchScrewdriverIcon, 
    path: '/manutencao',
    children: [
      { name: 'Preventiva', path: '/manutencao/preventiva' },
      { name: 'Corretiva', path: '/manutencao/corretiva' },
      { name: 'Histórico', path: '/manutencao/historico' },
    ]
  },
  { 
    name: 'Relatórios', 
    icon: ChartBarIcon, 
    path: '/relatorios',
    children: [
      { name: 'Custos', path: '/relatorios/custos' },
      { name: 'Consumo', path: '/relatorios/consumo' },
      { name: 'Desempenho', path: '/relatorios/desempenho' },
    ]
  },
  { 
    name: 'Documentos', 
    icon: DocumentTextIcon, 
    path: '/documentos',
    children: [
      { name: 'Veículos', path: '/documentos/veiculos' },
      { name: 'Motoristas', path: '/documentos/motoristas' },
      { name: 'Seguros', path: '/documentos/seguros' },
    ]
  },
  { name: 'Configurações', icon: Cog6ToothIcon, path: '/configuracoes' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const isCurrentPath = (path: string) => {
    return location.pathname === path;
  };

  const toggleExpand = (itemName: string) => {
    setExpandedItem(expandedItem === itemName ? null : itemName);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar superior */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">SistenFrota</h1>
            </div>
            <div className="flex items-center">
              <span className="mr-4 text-gray-700">Olá, {user.name || 'Usuário'}</span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-1" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Menu lateral */}
        <div className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="mt-5 px-2">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <div key={item.name}>
                  <button
                    onClick={() => item.children ? toggleExpand(item.name) : navigate(item.path)}
                    className={`${
                      isCurrentPath(item.path)
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } group w-full flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  >
                    <item.icon
                      className={`${
                        isCurrentPath(item.path) ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'
                      } mr-3 flex-shrink-0 h-6 w-6`}
                    />
                    {item.name}
                    {item.children && (
                      <svg
                        className={`ml-auto h-5 w-5 transform ${
                          expandedItem === item.name ? 'rotate-90' : ''
                        } transition-transform duration-200`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                  {/* Submenu */}
                  {item.children && expandedItem === item.name && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className={`${
                            isCurrentPath(child.path)
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>
        </div>

        {/* Conteúdo principal */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
} 