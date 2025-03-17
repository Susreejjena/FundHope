@echo off
echo Installing backend dependencies...
cd backend
npm install
cd ..

echo Installing frontend dependencies...
cd frontend
npm install
cd ..

echo Installation complete!
echo To start the backend server: cd backend && npm run dev
echo To start the frontend server: cd frontend && npm run dev 