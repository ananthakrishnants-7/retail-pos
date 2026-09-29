# RetailPOS - Point of Sale Billing System

A simple full-stack Point of Sale (POS) billing application developed as an internship take-home project.

## Features

- Admin login
- Product listing
- Shopping cart
- Quantity management
- Discount calculation
- Tax calculation
- Cash, Card and UPI payment methods
- Sales processing
- Automatic inventory reduction
- Receipt generation
- Sales history
- Logout and basic route protection

## Tech Stack

### Backend
- Python
- FastAPI
- SQLAlchemy
- MySQL
- Alembic
- Pydantic

### Frontend
- React
- Vite
- React Router
- Axios

## Project Structure

```text
retail-pos/
│
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   └── main.py
│   │
│   ├── alembic/
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   │
│   └── package.json
│
└── README.md