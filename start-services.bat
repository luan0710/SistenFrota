@echo off
echo Iniciando servicos...

cd services/auth
start cmd /k "npm run dev"

cd ../vehicles
start cmd /k "npm run dev"

cd ../maintenance
start cmd /k "npm run dev"

echo Servicos iniciados! 