Set-Location -Path $PSScriptRoot
$venvActivate = ".\.venv\Scripts\Activate.ps1"

if (-Not (Test-Path $venvActivate)) {
    Write-Host "Virtual environment not found. Creating one..."
    python -m venv venv
}

& $venvActivate
python .\main.py