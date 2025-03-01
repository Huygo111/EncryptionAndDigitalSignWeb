# EncryptionAndDigitalSignWeb
# RSA, ElGamal, ECC Encryption & Digital Signature Web

## 📌 Giới thiệu
Đây là một ứng dụng web hỗ trợ mã hóa và ký điện tử sử dụng các thuật toán phổ biến:
- **Mã hóa**: RSA, ElGamal, ECC (Elliptic Curve Cryptography)
- **Chữ ký điện tử**: RSA, ElGamal, ECDSA (Elliptic Curve Digital Signature Algorithm)

Ứng dụng có giao diện frontend được phát triển bằng TypeScript và backend xử lý các thuật toán mã hóa/ký điện tử bằng Python.

## 🛠 Công nghệ sử dụng
### Frontend
- **Ngôn ngữ**: TypeScript
- **Framework**: React 
- **Thư viện UI**: Tùy chọn (Material-UI, TailwindCSS, Ant Design,...)

### Backend
- **Ngôn ngữ**: Python
- **Framework**: Flask
- **Thư viện hỗ trợ mã hóa**:
  - `pycryptodome` (RSA, ElGamal)
  - `ecdsa` (ECC, ECDSA)

## 🔧 Cài đặt và chạy dự án
### 1️⃣ Cài đặt Backend
Yêu cầu: Python 3.8+
```sh
cd backend
python -m venv venv
source venv/bin/activate  # Trên macOS/Linux
venv\Scripts\activate    # Trên Windows
pip install -r requirements.txt
python app.py  # Hoặc uvicorn main:app --reload nếu dùng FastAPI
```

### 2️⃣ Cài đặt Frontend
Yêu cầu: Node.js 16+
```sh
cd frontend
npm install
npm run dev  # Hoặc yarn dev nếu dùng Yarn
```

## 🚀 Chức năng chính
- **Mã hóa và giải mã**:
  - Nhập văn bản hoặc tệp tin để mã hóa bằng RSA, ElGamal hoặc ECC
  - Giải mã văn bản hoặc tệp tin bằng khóa bí mật
- **Ký điện tử và xác minh chữ ký**:
  - Tạo chữ ký số bằng RSA, ElGamal hoặc ECDSA
  - Xác minh chữ ký số để đảm bảo tính toàn vẹn dữ liệu

## 📂 Cấu trúc thư mục
```
📦 project_root
 ┣ 📂 frontend      # Giao diện web (TypeScript + React)
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 components
 ┃ ┃ ┣ 📂 pages
 ┃ ┃ ┣ 📜 App.tsx
 ┃ ┣ 📜 package.json
 ┃ ┣ 📜 tsconfig.json
 ┣ 📂 backend       # API xử lý mã hóa/ký số (Python)
 ┃ ┣ 📂 routes
 ┃ ┣ 📜 app.py
 ┃ ┣ 📜 requirements.txt
 ┣ 📜 README.md     # Hướng dẫn sử dụng
```

## 🔗 Liên hệ & Đóng góp
Nếu bạn muốn đóng góp, hãy fork repository và gửi pull request. Mọi ý kiến đóng góp đều được hoan nghênh!

---
✍️ **Tác giả**: [Tên bạn]  
📧 **Email**: [Email của bạn]  
🌍 **GitHub**: [Link GitHub]

