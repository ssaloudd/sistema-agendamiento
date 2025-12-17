@echo off
TITLE Sistema de Agendamiento - Launcher
echo ====================================================
echo    INICIANDO ECOSISTEMA DE MICROSERVICIOS MEDICO
echo ====================================================
echo.

echo 1. Iniciando Infraestructura (Bus & Gateway)...
start "Event Bus (Port 4005)" cmd /k "cd event-bus && npm start"
timeout /t 2 /nobreak >nul
start "API Gateway (Port 4000)" cmd /k "cd api-gateway && npm start"

echo 2. Iniciando Microservicios de Negocio...
timeout /t 2 /nobreak >nul
start "MS Pacientes (Port 4002)" cmd /k "cd ms-pacientes && npm start"
start "MS Medicos (Port 4001)" cmd /k "cd ms-medicos && npm start"
start "MS Agendamiento (Port 4003)" cmd /k "cd ms-agendamiento && npm start"
start "MS Notificaciones (Port 4004)" cmd /k "cd ms-notificaciones && npm start"

echo 3. Iniciando Frontend (React)...
timeout /t 3 /nobreak >nul
start "Frontend Client (Vite)" cmd /k "cd client && npm run dev"

echo.
echo ====================================================
echo    TODO LISTO!
echo    El frontend se abrira en breve.
echo    Puedes cerrar esta ventana si lo deseas.
echo ====================================================
pause