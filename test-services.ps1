Write-Host "Testando servicos..." -ForegroundColor Yellow

$services = @(
    @{name="Autenticacao"; url="http://localhost:3001/health"},
    @{name="Veiculos"; url="http://localhost:3002/health"},
    @{name="Manutencao"; url="http://localhost:3003/health"}
)

foreach ($service in $services) {
    Write-Host "`nTestando servico de $($service.name)..." -ForegroundColor Cyan
    try {
        $response = Invoke-WebRequest -Uri $service.url -Method GET
        if ($response.StatusCode -eq 200) {
            Write-Host "OK! Servico de $($service.name) esta rodando." -ForegroundColor Green
            Write-Host "Resposta: $($response.Content)" -ForegroundColor Gray
        }
    } catch {
        Write-Host "ERRO! Servico de $($service.name) nao esta respondendo." -ForegroundColor Red
        Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Red
    }
} 