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

### Backend
- **Ngôn ngữ**: Python
- **Framework**: Flask
- **Thư viện hỗ trợ mã hóa**: Flask, sympy

## 🔧 Cài đặt và chạy dự án
### 1️⃣ Chạy Backend
python backend.py

### 2️⃣ Chạy Frontend
cd src
npm start

## 🚀 Chức năng chính
- **Mã hóa và giải mã**:
  - Nhập bản tin để mã hóa bằng RSA, ElGamal hoặc ECC
  - Giải mã bản tin bằng khóa bí mật
- **Ký điện tử và xác minh chữ ký**:
  - Tạo chữ ký số bằng RSA, ElGamal hoặc ECDSA
  - Xác minh chữ ký số để đảm bảo tính toàn vẹn dữ liệu
