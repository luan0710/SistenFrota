@echo off
echo Iniciando os servicos...

start cmd /k "cd services/auth && npm run dev"
timeout /t 5
start cmd /k "cd services/vehicles && npm run dev"
timeout /t 5
start cmd /k "cd services/maintenance && npm run dev"
timeout /t 5
start cmd /k "cd services/frontend && npm start"

echo Todos os servicos foram iniciados!
echo.
echo Servico de Autenticacao: http://localhost:3001
echo Servico de Veiculos: http://localhost:3002
echo Servico de Manutencao: http://localhost:3003
echo Frontend: http://localhost:3000 