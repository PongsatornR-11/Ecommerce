@echo off

start wt new-tab -p "Command Prompt" -d "C:\Learn coding\web coding\Projects\Ecommerce" cmd.exe /c "code ."^
; new-tab -p "Command Prompt" -d "C:\Learn coding\web coding\Projects\Ecommerce\client" cmd.exe /k "npm run dev"^
; new-tab -p "Command Prompt" -d "C:\Learn coding\web coding\Projects\Ecommerce\server" cmd.exe /k "npm start"

:: Wait a bit to ensure Windows Terminal finishes opening all tabs before launching the next program
timeout /t 3 >nul
:: Open Postman
start "" "C:\Users\basni\AppData\Local\Postman\Postman.exe"



:: Open Web project
start "C:\Program Files\Google\Chrome\Application\chrome.exe" "http://localhost:5173"
:: Open Lofi girl
start "C:\Program Files\Google\Chrome\Application\chrome.exe" "https://www.youtube.com/watch?v=jfKfPfyJRdk"
:: Open roithai  ep 30 // 00.00
start "C:\Program Files\Google\Chrome\Application\chrome.exe" "https://www.youtube.com/watch?v=2BvSXEQYQpw&list=PL3CRqF9WxjEZHFnZSSdC4wNDgvkKhpMtS&index=38"