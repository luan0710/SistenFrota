import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  ChevronUpDownIcon,
  PhotoIcon,
  ArrowPathIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '../../components/DashboardLayout';

interface Veiculo {
  id: number;
  numero_carro: string;
  identificacao: string;
  placa: string;
  modelo: string;
  marca: string;
  ano: number;
  tipo: string;
  status: 'ativo' | 'manutencao' | 'inativo';
  km_atual: number;
  ultima_manutencao?: string;
  proximo_servico?: string;
  foto_url?: string;
}

export default function Veiculos() {
  // Estados
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedVeiculo, setSelectedVeiculo] = useState<Veiculo | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Mock de dados iniciais
  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setVeiculos([
        {
          id: 1,
          numero_carro: '001',
          identificacao: 'VEI-001-SP',
          placa: 'ABC-1234',
          modelo: 'Fiorino',
          marca: 'Fiat',
          ano: 2022,
          tipo: 'Utilitário',
          status: 'ativo',
          km_atual: 15000,
          ultima_manutencao: '2024-01-15',
          proximo_servico: '2024-03-15'
        },
        {
          id: 2,
          numero_carro: '002',
          identificacao: 'VEI-002-SP',
          placa: 'XYZ-5678',
          modelo: 'Master',
          marca: 'Renault',
          ano: 2023,
          tipo: 'Van',
          status: 'manutencao',
          km_atual: 8000,
          ultima_manutencao: '2024-02-01',
          proximo_servico: '2024-04-01'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Função para filtrar veículos
  const veiculosFiltrados = veiculos.filter(veiculo => 
    veiculo.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    veiculo.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    veiculo.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
    veiculo.numero_carro.toLowerCase().includes(searchTerm.toLowerCase()) ||
    veiculo.identificacao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Veículos</h1>
            <p className="mt-2 text-sm text-gray-700">
              Gerenciamento completo da frota de veículos
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              onClick={() => {
                setSelectedVeiculo(null);
                setShowForm(true);
              }}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Novo Veículo
            </button>
          </div>
        </div>

        {/* Barra de Ferramentas */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full rounded-md border-gray-300 pl-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="Buscar por placa, modelo ou marca..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setLoading(true)}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <ArrowPathIcon className="h-4 w-4 mr-2" />
              Atualizar
            </button>
          </div>
        </div>

        {/* Tabela de Veículos */}
        <div className="mt-8 flex flex-col">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        <div className="flex items-center">
                          Nº Carro
                          <ChevronUpDownIcon className="h-4 w-4 ml-1 text-gray-400" />
                        </div>
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        <div className="flex items-center">
                          Identificação
                          <ChevronUpDownIcon className="h-4 w-4 ml-1 text-gray-400" />
                        </div>
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        <div className="flex items-center">
                          Placa
                          <ChevronUpDownIcon className="h-4 w-4 ml-1 text-gray-400" />
                        </div>
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        <div className="flex items-center">
                          Modelo/Marca
                          <ChevronUpDownIcon className="h-4 w-4 ml-1 text-gray-400" />
                        </div>
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        <div className="flex items-center">
                          Ano
                          <ChevronUpDownIcon className="h-4 w-4 ml-1 text-gray-400" />
                        </div>
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        <div className="flex items-center">
                          Tipo
                          <ChevronUpDownIcon className="h-4 w-4 ml-1 text-gray-400" />
                        </div>
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        KM Atual
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Ações</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {loading ? (
                      <tr>
                        <td colSpan={9} className="px-3 py-4 text-sm text-gray-500 text-center">
                          <div className="flex items-center justify-center">
                            <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin text-primary-500" />
                            Carregando veículos...
                          </div>
                        </td>
                      </tr>
                    ) : veiculosFiltrados.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-3 py-4 text-sm text-gray-500 text-center">
                          Nenhum veículo encontrado
                        </td>
                      </tr>
                    ) : (
                      veiculosFiltrados.map((veiculo) => (
                        <tr key={veiculo.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {veiculo.numero_carro}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {veiculo.identificacao}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {veiculo.placa}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {veiculo.modelo} - {veiculo.marca}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {veiculo.ano}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {veiculo.tipo}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              veiculo.status === 'ativo' 
                                ? 'bg-green-100 text-green-800'
                                : veiculo.status === 'manutencao'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {veiculo.status === 'ativo' ? 'Ativo' 
                                : veiculo.status === 'manutencao' ? 'Em Manutenção'
                                : 'Inativo'}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {veiculo.km_atual.toLocaleString()} km
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedVeiculo(veiculo);
                                  setShowDetails(true);
                                }}
                                className="text-primary-600 hover:text-primary-900"
                              >
                                <PhotoIcon className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedVeiculo(veiculo);
                                  setShowForm(true);
                                }}
                                className="text-primary-600 hover:text-primary-900"
                              >
                                <PencilIcon className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => {
                                  // Implementar exclusão
                                  if (window.confirm('Tem certeza que deseja excluir este veículo?')) {
                                    // Lógica de exclusão
                                  }
                                }}
                                className="text-red-600 hover:text-red-900"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Formulário */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Overlay */}
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowForm(false)} />

            {/* Modal */}
            <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedVeiculo ? 'Editar Veículo' : 'Novo Veículo'}
                </h3>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500"
                  onClick={() => setShowForm(false)}
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Formulário */}
              <form className="p-6" onSubmit={(e) => {
                e.preventDefault();
                // Implementar lógica de salvamento
                setShowForm(false);
              }}>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  {/* Número do Carro */}
                  <div>
                    <label htmlFor="numero_carro" className="block text-sm font-medium text-gray-700">
                      Número do Carro
                    </label>
                    <input
                      type="text"
                      name="numero_carro"
                      id="numero_carro"
                      defaultValue={selectedVeiculo?.numero_carro}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      required
                    />
                  </div>

                  {/* Identificação */}
                  <div>
                    <label htmlFor="identificacao" className="block text-sm font-medium text-gray-700">
                      Identificação
                    </label>
                    <input
                      type="text"
                      name="identificacao"
                      id="identificacao"
                      defaultValue={selectedVeiculo?.identificacao}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      required
                    />
                  </div>

                  {/* Placa */}
                  <div>
                    <label htmlFor="placa" className="block text-sm font-medium text-gray-700">
                      Placa
                    </label>
                    <input
                      type="text"
                      name="placa"
                      id="placa"
                      defaultValue={selectedVeiculo?.placa}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm uppercase"
                      required
                    />
                  </div>

                  {/* Modelo */}
                  <div>
                    <label htmlFor="modelo" className="block text-sm font-medium text-gray-700">
                      Modelo
                    </label>
                    <input
                      type="text"
                      name="modelo"
                      id="modelo"
                      defaultValue={selectedVeiculo?.modelo}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      required
                    />
                  </div>

                  {/* Marca */}
                  <div>
                    <label htmlFor="marca" className="block text-sm font-medium text-gray-700">
                      Marca
                    </label>
                    <input
                      type="text"
                      name="marca"
                      id="marca"
                      defaultValue={selectedVeiculo?.marca}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      required
                    />
                  </div>

                  {/* Ano */}
                  <div>
                    <label htmlFor="ano" className="block text-sm font-medium text-gray-700">
                      Ano
                    </label>
                    <input
                      type="number"
                      name="ano"
                      id="ano"
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      defaultValue={selectedVeiculo?.ano}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      required
                    />
                  </div>

                  {/* Tipo */}
                  <div>
                    <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">
                      Tipo
                    </label>
                    <select
                      id="tipo"
                      name="tipo"
                      defaultValue={selectedVeiculo?.tipo}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      required
                    >
                      <option value="">Selecione um tipo</option>
                      <option value="Utilitário">Utilitário</option>
                      <option value="Van">Van</option>
                      <option value="Caminhão">Caminhão</option>
                      <option value="Carro">Carro</option>
                      <option value="Moto">Moto</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      defaultValue={selectedVeiculo?.status}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      required
                    >
                      <option value="ativo">Ativo</option>
                      <option value="manutencao">Em Manutenção</option>
                      <option value="inativo">Inativo</option>
                    </select>
                  </div>

                  {/* KM Atual */}
                  <div>
                    <label htmlFor="km_atual" className="block text-sm font-medium text-gray-700">
                      KM Atual
                    </label>
                    <input
                      type="number"
                      name="km_atual"
                      id="km_atual"
                      min="0"
                      defaultValue={selectedVeiculo?.km_atual}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      required
                    />
                  </div>

                  {/* Foto do Veículo */}
                  <div className="sm:col-span-2">
                    <label htmlFor="foto" className="block text-sm font-medium text-gray-700">
                      Foto do Veículo
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="foto"
                            className="relative cursor-pointer rounded-md bg-white font-medium text-primary-600 hover:text-primary-500"
                          >
                            <span>Fazer upload de uma foto</span>
                            <input id="foto" name="foto" type="file" className="sr-only" accept="image/*" />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF até 10MB</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    onClick={() => setShowForm(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    {selectedVeiculo ? 'Salvar Alterações' : 'Cadastrar Veículo'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes - Será implementado em seguida */}
      {showDetails && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
          {/* Implementação dos detalhes virá aqui */}
        </div>
      )}
    </DashboardLayout>
  );
} 