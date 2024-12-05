@echo off
start wt new-tab -p "Command Prompt" -d "C:\Learn coding\web coding\Projects\Ecommerce\client" cmd.exe /k "npm run dev"^
    ; new-tab -p "Command Prompt" -d "C:\Learn coding\web coding\Projects\Ecommerce\server" cmd.exe /k "npm start"^
    ; new-tab -p "Command Prompt" -d "C:\Learn coding\web coding\Projects\Ecommerce" cmd.exe /c "cursor . && exit"

:: Wait a bit to ensure Windows Terminal finishes opening all tabs before launching the next program
timeout /t 3 >nul
:: Open Postman
start "" "C:\Users\basni\AppData\Local\Postman\Postman.exe"



:: Open Web project
start "C:\Program Files\Google\Chrome\Application\chrome.exe" "http://localhost:5173"
:: Open Lofi girl
start "C:\Program Files\Google\Chrome\Application\chrome.exe" "https://www.youtube.com/watch?v=jfKfPfyJRdk"
:: Open roithai
start "C:\Program Files\Google\Chrome\Application\chrome.exe" "https://www.youtube.com/watch?v=zoEgIhrY4cU&list=PL3CRqF9WxjEZHFnZSSdC4wNDgvkKhpMtS&index=21"