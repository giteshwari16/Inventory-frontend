# Inventory Management System

## Project Overview
A full-stack inventory management system with:
- Product CRUD (add, view, edit, delete)
- PDF and CSV export
- Low stock alert (AI logic)
- Search/filter
- User authentication (JWT, role-based)
- Charts (bar/line)
- Responsive UI (TailwindCSS)

## Tech Stack
- **Backend:** Django, Django REST Framework, PostgreSQL/SQLite
- **Frontend:** React, Axios, TailwindCSS, Chart.js, react-toastify

## Features
- Add, view, edit, delete products
- PDF report download
- CSV export
- Low stock alert
- Search/filter
- User authentication (JWT)
- Role-based access (Admin/Staff)
- Charts for product quantities
- AI demand forecast (placeholder)

## Screenshots
![screenshot](screenshots/inventory.png)

## Setup Instructions

### Backend (Django)
1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   pip install whitenoise gunicorn xhtml2pdf djangorestframework-simplejwt django-cors-headers
   ```
2. Run migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```
3. Create superuser (for admin):
   ```bash
   python manage.py createsuperuser
   ```
4. Run server (dev):
   ```bash
   python manage.py runserver
   ```
5. For production:
   - Collect static files:
     ```bash
     python manage.py collectstatic
     ```
   - Run with gunicorn:
     ```bash
     gunicorn inventory_api.wsgi
     ```

### Frontend (React)
1. Install dependencies:
   ```bash
   npm install
   npm install axios jwt-decode react-toastify react-chartjs-2 chart.js react-csv tailwindcss
   npx tailwindcss init -p
   ```
2. Start dev server:
   ```bash
   npm start
   ```
3. Build for production:
   ```bash
   npm run build
   ```

## Deployment
- **Backend:** Deploy to Render, Railway, or PythonAnywhere
- **Frontend:** Deploy to Netlify or Vercel

## Deployment Links
- Backend: [Your Render/Heroku link]
- Frontend: [Your Netlify/Vercel link]

---

**Enjoy your production-ready Inventory Management System!**
