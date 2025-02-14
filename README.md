Kwanyumba 🏡

An Airbnb-like rental platform for Kenya, with M-Pesa integration and host automation.

🌟 Features
✅ M-Pesa Payments – Users pay via a single Paybill, auto-confirming bookings.
✅ Automated Host Payouts – Earnings are sent to hosts' M-Pesa automatically.
✅ Flexible Bookings – Full-day & Half-day (7 AM - 12 Noon) options available.
✅ Fraud Prevention – Secure authentication & verification.
✅ Localized Search – Optimized for Kenya's rental market.
✅ Analytics Dashboard – High-traffic location insights for business strategy.

🚀 Tech Stack
Backend: FastAPI, PostgreSQL, SQLAlchemy
Frontend: React.js, Next.js, TailwindCSS
Payments: M-Pesa API (Daraja)
Hosting: AWS / DigitalOcean
Security: JWT Authentication, Encryption

⚡ Getting Started
1️⃣ Clone the Repository

git clone https://github.com/yourusername/kwanyumba.git
cd kwanyumba

2️⃣ Setup Backend

cd backend
python -m venv venv
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate      # Windows
pip install -r requirements.txt
Configure .env file with DB & M-Pesa API keys.
Run the backend server:
uvicorn app.main:app --reload

3️⃣ Setup Frontend

cd frontend
npm install
npm run dev

📡 API Endpoints
POST /api/auth/signup – Register users
POST /api/auth/login – Login users
GET /api/properties – List rental properties
POST /api/bookings – Book a house
POST /api/payments/mpesa – Initiate M-Pesa payment
GET /api/analytics – Admin-only traffic & business insights

📜 License

Kwanyumba is open-source under the MIT License.

