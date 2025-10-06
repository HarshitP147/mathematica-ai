# Clear remote Docker host for local development
$env:DOCKER_HOST = $null

Write-Host "✅ Environment configured for local Supabase development" -ForegroundColor Green
Write-Host "DOCKER_HOST cleared - using local Docker" -ForegroundColor Cyan

# Optional: Start Supabase if not running
$status = supabase status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Supabase not running. Start with: supabase start" -ForegroundColor Yellow
} else {
    Write-Host "✅ Supabase is running" -ForegroundColor Green
}
