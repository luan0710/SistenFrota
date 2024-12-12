@echo off
echo Executando migrations...

cd services/auth
npx sequelize-cli db:migrate

cd ../vehicles
npx sequelize-cli db:migrate

cd ../maintenance
npx sequelize-cli db:migrate

echo Migrations concluidas! 