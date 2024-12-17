import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import {
  TruckIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

const stats = [
  {
    name: 'Total de Veículos',
    value: '12',
    icon: TruckIcon,
    change: '+2',
    changeType: 'increase',
  },
  {
    name: 'Motoristas Ativos',
    value: '8',
    icon: UserGroupIcon,
    change: '0',
    changeType: 'neutral',
  },
  {
    name: 'Manutenções Pendentes',
    value: '3',
    icon: WrenchScrewdriverIcon,
    change: '-1',
    changeType: 'decrease',
  },
  {
    name: 'Documentos a Vencer',
    value: '5',
    icon: DocumentTextIcon,
    change: '+2',
    changeType: 'increase',
  },
];

const recentActivities = [
  {
    id: 1,
    type: 'manutenção',
    description: 'Troca de óleo - Veículo XYZ-1234',
    date: '2 horas atrás',
  },
  {
    id: 2,
    type: 'abastecimento',
    description: 'Abastecimento - Veículo ABC-5678',
    date: '4 horas atrás',
  },
  {
    id: 3,
    type: 'documento',
    description: 'Renovação de seguro - Veículo DEF-9012',
    date: '1 dia atrás',
  },
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.name}
              className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
            >
              <dt>
                <div className="absolute bg-indigo-500 rounded-md p-3">
                  <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 text-sm font-medium text-gray-500 truncate">
                  {item.name}
                </p>
              </dt>
              <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
                <p
                  className={`ml-2 flex items-baseline text-sm font-semibold ${
                    item.changeType === 'increase'
                      ? 'text-green-600'
                      : item.changeType === 'decrease'
                      ? 'text-red-600'
                      : 'text-gray-500'
                  }`}
                >
                  {item.change}
                </p>
              </dd>
            </div>
          ))}
        </div>

        {/* Atividades Recentes */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Atividades Recentes
            </h3>
          </div>
          <div className="border-t border-gray-200">
            <ul role="list" className="divide-y divide-gray-200">
              {recentActivities.map((activity) => (
                <li key={activity.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      {activity.description}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {activity.date}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 