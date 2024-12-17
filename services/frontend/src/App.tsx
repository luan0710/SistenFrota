import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';

// Páginas de Cadastros
import Veiculos from './pages/cadastros/Veiculos';
import Motoristas from './pages/cadastros/Motoristas';
import Fornecedores from './pages/cadastros/Fornecedores';

// Páginas de Operações
import Viagens from './pages/operacoes/Viagens';
import Abastecimentos from './pages/operacoes/Abastecimentos';
import Manutencoes from './pages/operacoes/Manutencoes';

// Páginas de Manutenção
import ManutencaoPreventiva from './pages/manutencao/Preventiva';
import ManutencaoCorretiva from './pages/manutencao/Corretiva';
import ManutencaoHistorico from './pages/manutencao/Historico';

// Páginas de Relatórios
import RelatorioCustos from './pages/relatorios/Custos';
import RelatorioConsumo from './pages/relatorios/Consumo';
import RelatorioDesempenho from './pages/relatorios/Desempenho';

// Páginas de Documentos
import DocumentosVeiculos from './pages/documentos/Veiculos';
import DocumentosMotoristas from './pages/documentos/Motoristas';
import DocumentosSeguros from './pages/documentos/Seguros';

// Página de Configurações
import Configuracoes from './pages/Configuracoes';

function App() {
  return (
    <Routes>
      {/* Redirecionamento da rota raiz */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Rotas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Rotas protegidas */}
      <Route path="/dashboard" element={<PrivateRoute />}>
        <Route index element={<Dashboard />} />
      </Route>

      {/* Cadastros */}
      <Route path="/cadastros" element={<PrivateRoute />}>
        <Route path="veiculos" element={<Veiculos />} />
        <Route path="motoristas" element={<Motoristas />} />
        <Route path="fornecedores" element={<Fornecedores />} />
      </Route>

      {/* Operações */}
      <Route path="/operacoes" element={<PrivateRoute />}>
        <Route path="viagens" element={<Viagens />} />
        <Route path="abastecimentos" element={<Abastecimentos />} />
        <Route path="manutencoes" element={<Manutencoes />} />
      </Route>

      {/* Manutenção */}
      <Route path="/manutencao" element={<PrivateRoute />}>
        <Route path="preventiva" element={<ManutencaoPreventiva />} />
        <Route path="corretiva" element={<ManutencaoCorretiva />} />
        <Route path="historico" element={<ManutencaoHistorico />} />
      </Route>

      {/* Relatórios */}
      <Route path="/relatorios" element={<PrivateRoute />}>
        <Route path="custos" element={<RelatorioCustos />} />
        <Route path="consumo" element={<RelatorioConsumo />} />
        <Route path="desempenho" element={<RelatorioDesempenho />} />
      </Route>

      {/* Documentos */}
      <Route path="/documentos" element={<PrivateRoute />}>
        <Route path="veiculos" element={<DocumentosVeiculos />} />
        <Route path="motoristas" element={<DocumentosMotoristas />} />
        <Route path="seguros" element={<DocumentosSeguros />} />
      </Route>

      {/* Configurações */}
      <Route path="/configuracoes" element={<PrivateRoute />}>
        <Route index element={<Configuracoes />} />
      </Route>

      {/* Rota 404 */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App; 