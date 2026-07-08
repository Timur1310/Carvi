@echo off
REM ============================================================
REM  Carvi — еженедельный автоцикл улучшения сайта
REM  Запускает Claude Code в headless-режиме без участия человека.
REM  Ставится в Планировщик задач Windows (см. automation\README.md).
REM ============================================================

set REPO=C:\Users\Lenovo\Projects\myapp
set LOGDIR=%REPO%\automation\logs
set PROMPT=Прочитай файл automation\improve-site.md и выполни описанный в нём еженедельный цикл улучшения сайта в точности, включая git commit и git push.

if not exist "%LOGDIR%" mkdir "%LOGDIR%"

REM Метка времени для имени лога (ГГГГ-ММ-ДД_ЧЧ-ММ)
for /f "tokens=1-3 delims=/.- " %%a in ("%date%") do set D=%%c-%%b-%%a
set T=%time: =0%
set T=%T:~0,2%-%T:~3,2%
set LOG=%LOGDIR%\run_%D%_%T%.log

cd /d "%REPO%"

echo ==== Запуск: %date% %time% ==== > "%LOG%"
claude -p "%PROMPT%" --dangerously-skip-permissions >> "%LOG%" 2>&1
echo ==== Завершено: %date% %time% ==== >> "%LOG%"
