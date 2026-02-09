@echo off
TITLE PyDungeon Launcher
echo ==========================================
echo      INICIANDO ENTORNO PYDUNGEON
echo ==========================================

echo.
echo [PASO 1] Verificando Base de Datos en Docker...

:: Intenta arrancar el contenedor si ya existe
docker start pydungeon-db >nul 2>&1

:: Si falla el arranque (porque no existe), lo crea de cero
if %errorlevel% neq 0 (
    echo [INFO] No se encontro la base de datos. Creando una nueva en puerto 5433...
    docker run --name pydungeon-db -p 5433:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=1234 -e POSTGRES_DB=pydungeon -d postgres:16-alpine
) else (
    echo [OK] Base de datos encontrada y arrancada.
)

echo.
echo [PASO 2] Esperando 5 segundos para que la DB inicialice...
timeout /t 5 /nobreak >nul

echo.
echo [PASO 3] Arrancando Spring Boot Backend...
echo ------------------------------------------
"C:\Users\tiago\Desktop\PyDungeon\apache-maven-3.9.12-bin\apache-maven-3.9.12\bin\mvn" spring-boot:run -Dspring-boot.run.arguments="--spring.datasource.url=jdbc:postgresql://localhost:5433/pydungeon --spring.datasource.password=1234"

echo.
echo ==========================================
echo    EL SERVIDOR SE HA DETENIDO O FALLO
echo ==========================================
pause