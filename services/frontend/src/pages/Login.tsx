import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_ENDPOINTS from '../config/api';
import { 
  LockClosedIcon, 
  EnvelopeIcon, 
  ExclamationCircleIcon,
  ArrowRightIcon,
  TruckIcon
} from '@heroicons/react/24/outline';

interface LoginError {
  email?: string;
  password?: string;
  general?: string;
}

const carouselContent = [
  {
    image: 'https://images.unsplash.com/photo-1616432043562-3671ea2e5242?q=80',
    title: 'Frota Organizada',
    description: 'Mantenha sua frota alinhada e sob controle total'
  },
  {
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80',
    title: 'Gestão Corporativa',
    description: 'Soluções completas para sua frota empresarial'
  },
  {
    image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80',
    title: 'Eficiência em Movimento',
    description: 'Maximize o desempenho da sua operação logística'
  },
  {
    image: 'https://images.unsplash.com/photo-1592805144716-feeccccef5ac?q=80',
    title: 'Entregas Modernas',
    description: 'Tecnologia avançada para suas entregas'
  },
  {
    image: 'https://images.unsplash.com/photo-1485575301924-6891ef935dcd?q=80',
    title: 'Visão Estratégica',
    description: 'Tenha uma visão completa de toda sua operação'
  }
];

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginError>({});
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Efeito para trocar as imagens automaticamente
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === carouselContent.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Troca a cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  const validateForm = (): boolean => {
    const newErrors: LoginError = {};
    let isValid = true;

    if (!email) {
      newErrors.email = 'Email é obrigatório';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email inválido';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Senha �� obrigatória';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(API_ENDPOINTS.LOGIN, {
        email,
        password,
        rememberMe
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

      navigate('/dashboard');
    } catch (err: any) {
      console.error('Erro no login:', err);
      const errorMessage = err.response?.data?.error || 
                          err.message || 
                          'Erro ao fazer login. Verifique suas credenciais.';
      setErrors({ general: errorMessage });
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Lado Esquerdo - Imagem/Banner */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        {/* Imagens de fundo com transição suave */}
        {carouselContent.map((content, index) => (
          <div
            key={content.image}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${content.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}
        
        {/* Overlay simples */}
        <div className="absolute inset-0 bg-black/30" />
        
        {/* Conteúdo */}
        <div className="relative w-full h-full p-12 flex flex-col z-10">
          {/* Logo e Card no topo */}
          <div className="space-y-8">
            <div className="flex items-center space-x-3">
              <TruckIcon className="h-10 w-10 text-white" />
              <span className="text-white text-2xl font-bold">SistenFrota</span>
            </div>

            {/* Card da mensagem atual */}
            <div className="max-w-lg">
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 transform transition-all duration-500">
                <h2 className="text-white text-3xl font-bold mb-4">
                  {carouselContent[currentImageIndex].title}
                </h2>
                <p className="text-white/90 text-xl font-light leading-relaxed">
                  {carouselContent[currentImageIndex].description}
                </p>
              </div>
            </div>
          </div>

          {/* Área do rodapé com indicadores e copyright */}
          <div className="mt-auto space-y-6">
            {/* Indicadores do carrossel */}
            <div className="flex justify-center space-x-3">
              {carouselContent.map((_, index) => (
                <button
                  key={index}
                  title={`Ir para imagem ${index + 1}`}
                  aria-label={`Ir para imagem ${index + 1}`}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex 
                      ? 'bg-white' 
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>

            <div className="text-white/60 text-sm text-center">
              © 2024 SistenFrota. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          {/* Logo para mobile */}
          <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
            <TruckIcon className="h-8 w-8 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">SistenFrota</span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Bem-vindo de volta</h2>
            <p className="mt-2 text-sm text-gray-600">
              Faça login para acessar sua conta
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="p-4 rounded-lg bg-red-50 flex items-center space-x-2">
                <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
                <span className="text-sm text-red-700">{errors.general}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={`appearance-none block w-full pl-10 pr-3 py-2 border ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition duration-150 ease-in-out`}
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Senha
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className={`appearance-none block w-full pl-10 pr-3 py-2 border ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition duration-150 ease-in-out`}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                  Lembrar-me
                </label>
              </div>

              <Link
                to="/forgot-password"
                className="text-sm font-medium text-primary-600 hover:text-primary-500 transition duration-150 ease-in-out"
              >
                Esqueceu a senha?
              </Link>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    Entrar
                    <ArrowRightIcon className="ml-2 -mr-1 h-5 w-5 group-hover:translate-x-1 transition-transform duration-150 ease-in-out" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Novo por aqui?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/register"
                className="w-full flex justify-center py-2.5 px-4 border border-primary-300 rounded-lg shadow-sm text-sm font-medium text-primary-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition duration-150 ease-in-out"
              >
                Criar uma conta
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 