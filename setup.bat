@echo off
echo Installing Creative Stock...

echo.
echo Setting up frontend...
cd frontend
npm install
cd ..

echo.
echo Setting up backend...
cd backend
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing Python dependencies...
pip install -r requirements.txt

echo.
echo Installation complete!
echo.
echo To start the frontend: cd frontend && npm start
echo To start the backend: cd backend && python app.py
pause