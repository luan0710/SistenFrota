import React, { useState, useEffect, FormEvent } from 'react';
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

interface FormData {
  numero_carro: string;
  identificacao: string;
  placa: string;
  modelo: string;
  marca: string;
  ano: number;
  tipo: string;
  status: 'ativo' | 'manutencao' | 'inativo';
  km_atual: number;
  foto?: File;
}

interface FormErrors {
  numero_carro?: string;
  identificacao?: string;
  placa?: string;
  modelo?: string;
  marca?: string;
  ano?: string;
  tipo?: string;
  status?: string;
  km_atual?: string;
  foto?: string;
}

interface SortConfig {
  key: keyof Veiculo;
  direction: 'asc' | 'desc';
}

export default function Veiculos() {
  // Estados
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedVeiculo, setSelectedVeiculo] = useState<Veiculo | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    numero_carro: '',
    identificacao: '',
    placa: '',
    modelo: '',
    marca: '',
    ano: new Date().getFullYear(),
    tipo: '',
    status: 'ativo',
    km_atual: 0
  });
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'numero_carro', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  // Efeito para carregar dados no formulário quando estiver editando
  useEffect(() => {
    if (selectedVeiculo) {
      setFormData({
        numero_carro: selectedVeiculo.numero_carro,
        identificacao: selectedVeiculo.identificacao,
        placa: selectedVeiculo.placa,
        modelo: selectedVeiculo.modelo,
        marca: selectedVeiculo.marca,
        ano: selectedVeiculo.ano,
        tipo: selectedVeiculo.tipo,
        status: selectedVeiculo.status,
        km_atual: selectedVeiculo.km_atual
      });
      if (selectedVeiculo.foto_url) {
        setPreviewUrl(selectedVeiculo.foto_url);
      }
    }
  }, [selectedVeiculo]);

  // Handler para mudanças nos campos do formul��rio
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));

    // Limpa o erro do campo quando ele é alterado
    if (formErrors[name as keyof FormData]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Handler para upload de foto
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB
        setFormErrors(prev => ({
          ...prev,
          foto: 'A foto deve ter no máximo 10MB'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        foto: file
      }));

      // Cria URL para preview
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Limpa o erro da foto se existir
      setFormErrors(prev => ({
        ...prev,
        foto: undefined
      }));
    }
  };

  // Validação do formulário
  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    let isValid = true;

    if (!formData.numero_carro.trim()) {
      errors.numero_carro = 'Número do carro é obrigatório';
      isValid = false;
    }

    if (!formData.identificacao.trim()) {
      errors.identificacao = 'Identificação é obrigatória';
      isValid = false;
    }

    if (!formData.placa.trim()) {
      errors.placa = 'Placa é obrigatória';
      isValid = false;
    } else if (!/^[A-Z]{3}-\d{4}$/.test(formData.placa)) {
      errors.placa = 'Placa inválida (formato: ABC-1234)';
      isValid = false;
    }

    if (!formData.modelo.trim()) {
      errors.modelo = 'Modelo é obrigatório';
      isValid = false;
    }

    if (!formData.marca.trim()) {
      errors.marca = 'Marca é obrigatória';
      isValid = false;
    }

    if (!formData.tipo) {
      errors.tipo = 'Tipo é obrigatório';
      isValid = false;
    }

    if (formData.km_atual < 0) {
      errors.km_atual = 'Quilometragem não pode ser negativa';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Handler para submit do formulário
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      // Aqui você implementará a chamada à API
      // Por enquanto, vamos simular um salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newVeiculo: Veiculo = {
        id: selectedVeiculo?.id || Date.now(),
        ...formData,
        foto_url: previewUrl
      };

      setVeiculos(prev => {
        if (selectedVeiculo) {
          // Atualiza veículo existente
          return prev.map(v => v.id === selectedVeiculo.id ? newVeiculo : v);
        }
        // Adiciona novo veículo
        return [...prev, newVeiculo];
      });

      setShowForm(false);
      setSelectedVeiculo(null);
      setFormData({
        numero_carro: '',
        identificacao: '',
        placa: '',
        modelo: '',
        marca: '',
        ano: new Date().getFullYear(),
        tipo: '',
        status: 'ativo',
        km_atual: 0
      });
      setPreviewUrl('');
    } catch (error) {
      console.error('Erro ao salvar veículo:', error);
      alert('Erro ao salvar veículo. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  // Função para filtrar veículos
  const veiculosFiltrados = veiculos.filter(veiculo => 
    veiculo.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    veiculo.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    veiculo.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
    veiculo.numero_carro.toLowerCase().includes(searchTerm.toLowerCase()) ||
    veiculo.identificacao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handler para excluir um veículo
  const handleDelete = (veiculo: Veiculo) => {
    if (window.confirm(`Tem certeza que deseja excluir o veículo ${veiculo.modelo} - ${veiculo.placa}?`)) {
      setVeiculos(prev => prev.filter(v => v.id !== veiculo.id));
      // Aqui você implementará a chamada à API para excluir o veículo
    }
  };

  // Função para ordenar veículos
  const sortVeiculos = (veiculos: Veiculo[]): Veiculo[] => {
    return [...veiculos].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc'
          ? aValue - bValue
          : bValue - aValue;
      }

      // Para outros tipos ou valores undefined/null
      if (aValue === bValue) return 0;
      if (!aValue) return 1;
      if (!bValue) return -1;
      
      return sortConfig.direction === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  };

  // Handler para mudança de ordenação
  const handleSort = (key: keyof Veiculo) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Função para renderizar o ícone de ordenação
  const renderSortIcon = (key: keyof Veiculo) => {
    if (sortConfig.key !== key) {
      return <ChevronUpDownIcon className="h-4 w-4 ml-1 text-gray-400" />;
    }
    return sortConfig.direction === 'asc' ? (
      <ChevronUpDownIcon className="h-4 w-4 ml-1 text-primary-500" />
    ) : (
      <ChevronUpDownIcon className="h-4 w-4 ml-1 text-primary-500 transform rotate-180" />
    );
  };

  // Aplicar ordenação e paginação aos veículos filtrados
  const veiculosProcessados = sortVeiculos(veiculosFiltrados);
  const totalPages = Math.ceil(veiculosProcessados.length / itemsPerPage);
  const veiculosPaginados = veiculosProcessados.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
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
                        <button
                          type="button"
                          onClick={() => handleSort('numero_carro')}
                          className="group inline-flex items-center"
                        >
                          Nº Carro
                          {renderSortIcon('numero_carro')}
                        </button>
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        <button
                          type="button"
                          onClick={() => handleSort('identificacao')}
                          className="group inline-flex items-center"
                        >
                          Identificação
                          {renderSortIcon('identificacao')}
                        </button>
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        <button
                          type="button"
                          onClick={() => handleSort('placa')}
                          className="group inline-flex items-center"
                        >
                          Placa
                          {renderSortIcon('placa')}
                        </button>
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        <button
                          type="button"
                          onClick={() => handleSort('modelo')}
                          className="group inline-flex items-center"
                        >
                          Modelo/Marca
                          {renderSortIcon('modelo')}
                        </button>
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        <button
                          type="button"
                          onClick={() => handleSort('ano')}
                          className="group inline-flex items-center"
                        >
                          Ano
                          {renderSortIcon('ano')}
                        </button>
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        <button
                          type="button"
                          onClick={() => handleSort('tipo')}
                          className="group inline-flex items-center"
                        >
                          Tipo
                          {renderSortIcon('tipo')}
                        </button>
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
                    ) : veiculosPaginados.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-3 py-4 text-sm text-gray-500 text-center">
                          Nenhum veículo encontrado
                        </td>
                      </tr>
                    ) : (
                      veiculosPaginados.map((veiculo) => (
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
                                onClick={() => handleDelete(veiculo)}
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

        {/* Adicionar após a tabela */}
        {!loading && veiculosProcessados.length > 0 && (
          <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próxima
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> até{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, veiculosProcessados.length)}
                  </span>{' '}
                  de <span className="font-medium">{veiculosProcessados.length}</span> resultados
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Anterior</span>
                    <ChevronUpDownIcon className="h-5 w-5 transform -rotate-90" />
                  </button>
                  {/* Números das páginas */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === currentPage
                          ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Próxima</span>
                    <ChevronUpDownIcon className="h-5 w-5 transform rotate-90" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
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
              <form className="p-6" onSubmit={handleSubmit}>
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
                      value={formData.numero_carro}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                        formErrors.numero_carro 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                      }`}
                      required
                    />
                    {formErrors.numero_carro && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.numero_carro}</p>
                    )}
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
                      value={formData.identificacao}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                        formErrors.identificacao 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                      }`}
                      required
                    />
                    {formErrors.identificacao && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.identificacao}</p>
                    )}
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
                      value={formData.placa}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                        formErrors.placa 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                      }`}
                      required
                    />
                    {formErrors.placa && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.placa}</p>
                    )}
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
                      value={formData.modelo}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                        formErrors.modelo 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                      }`}
                      required
                    />
                    {formErrors.modelo && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.modelo}</p>
                    )}
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
                      value={formData.marca}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                        formErrors.marca 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                      }`}
                      required
                    />
                    {formErrors.marca && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.marca}</p>
                    )}
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
                      value={formData.ano}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                        formErrors.ano 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                      }`}
                      required
                    />
                    {formErrors.ano && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.ano}</p>
                    )}
                  </div>

                  {/* Tipo */}
                  <div>
                    <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">
                      Tipo
                    </label>
                    <select
                      id="tipo"
                      name="tipo"
                      value={formData.tipo}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                        formErrors.tipo 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                      }`}
                      required
                    >
                      <option value="">Selecione um tipo</option>
                      <option value="Utilitário">Utilitário</option>
                      <option value="Van">Van</option>
                      <option value="Caminhão">Caminhão</option>
                      <option value="Carro">Carro</option>
                      <option value="Moto">Moto</option>
                    </select>
                    {formErrors.tipo && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.tipo}</p>
                    )}
                  </div>

                  {/* Status */}
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                        formErrors.status 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                      }`}
                      required
                    >
                      <option value="ativo">Ativo</option>
                      <option value="manutencao">Em Manutenção</option>
                      <option value="inativo">Inativo</option>
                    </select>
                    {formErrors.status && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.status}</p>
                    )}
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
                      value={formData.km_atual}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                        formErrors.km_atual 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                      }`}
                      required
                    />
                    {formErrors.km_atual && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.km_atual}</p>
                    )}
                  </div>

                  {/* Foto do Veículo */}
                  <div className="sm:col-span-2">
                    <label htmlFor="foto" className="block text-sm font-medium text-gray-700">
                      Foto do Veículo
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        {previewUrl ? (
                          <div className="relative">
                            <img
                              src={previewUrl}
                              alt="Preview"
                              className="mx-auto h-32 w-auto object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setPreviewUrl('');
                                setFormData(prev => ({ ...prev, foto: undefined }));
                              }}
                              className="absolute -top-2 -right-2 bg-red-100 rounded-full p-1 text-red-600 hover:text-red-700"
                            >
                              <XMarkIcon className="h-5 w-5" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600">
                              <label
                                htmlFor="foto"
                                className="relative cursor-pointer rounded-md bg-white font-medium text-primary-600 hover:text-primary-500"
                              >
                                <span>Fazer upload de uma foto</span>
                                <input
                                  id="foto"
                                  name="foto"
                                  type="file"
                                  className="sr-only"
                                  accept="image/*"
                                  onChange={handlePhotoChange}
                                />
                              </label>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF até 10MB</p>
                          </>
                        )}
                        {formErrors.foto && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.foto}</p>
                        )}
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
                    disabled={isSaving}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      selectedVeiculo ? 'Salvar Alterações' : 'Cadastrar Veículo'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes */}
      {showDetails && selectedVeiculo && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Overlay */}
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowDetails(false)} />

            {/* Modal */}
            <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-xl font-semibold text-gray-900">
                  Detalhes do Veículo
                </h3>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500"
                  onClick={() => setShowDetails(false)}
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Conteúdo */}
              <div className="p-6">
                {/* Foto do Veículo */}
                <div className="mb-6">
                  {selectedVeiculo.foto_url ? (
                    <img
                      src={selectedVeiculo.foto_url}
                      alt={`Veículo ${selectedVeiculo.modelo}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                      <PhotoIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Informações em Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Número do Carro</h4>
                    <p className="mt-1 text-sm text-gray-900">{selectedVeiculo.numero_carro}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Identificação</h4>
                    <p className="mt-1 text-sm text-gray-900">{selectedVeiculo.identificacao}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Placa</h4>
                    <p className="mt-1 text-sm text-gray-900">{selectedVeiculo.placa}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Modelo/Marca</h4>
                    <p className="mt-1 text-sm text-gray-900">{selectedVeiculo.modelo} - {selectedVeiculo.marca}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Ano</h4>
                    <p className="mt-1 text-sm text-gray-900">{selectedVeiculo.ano}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Tipo</h4>
                    <p className="mt-1 text-sm text-gray-900">{selectedVeiculo.tipo}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Status</h4>
                    <span className={`inline-flex mt-1 rounded-full px-2 text-xs font-semibold ${
                      selectedVeiculo.status === 'ativo' 
                        ? 'bg-green-100 text-green-800'
                        : selectedVeiculo.status === 'manutencao'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedVeiculo.status === 'ativo' ? 'Ativo' 
                        : selectedVeiculo.status === 'manutencao' ? 'Em Manutenção'
                        : 'Inativo'}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">KM Atual</h4>
                    <p className="mt-1 text-sm text-gray-900">{selectedVeiculo.km_atual.toLocaleString()} km</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Última Manutenção</h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedVeiculo.ultima_manutencao 
                        ? new Date(selectedVeiculo.ultima_manutencao).toLocaleDateString()
                        : 'Não registrada'}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Próximo Serviço</h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedVeiculo.proximo_servico
                        ? new Date(selectedVeiculo.proximo_servico).toLocaleDateString()
                        : 'Não agendado'}
                    </p>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    onClick={() => setShowDetails(false)}
                  >
                    Fechar
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    onClick={() => {
                      setShowDetails(false);
                      setShowForm(true);
                    }}
                  >
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Editar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
} 