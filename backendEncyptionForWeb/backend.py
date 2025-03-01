from flask import Flask, request, jsonify
from flask_cors import CORS
import math
import sympy
import random

app = Flask(__name__)
CORS(app)  # Cho phép tất cả các yêu cầu từ các nguồn khác


@app.route('/encrypt/rsa', methods=['POST'])
def encrypt_rsa():
    data = request.get_json()

    try:
        p = int(data['p'])  # Chuyển đổi p sang số nguyên
        q = int(data['q'])  # Chuyển đổi q sang số nguyên
        e = int(data['e'])  # Chuyển đổi e sang số nguyên
        m = int(data['m'])  # Chuyển đổi m sang số nguyên
    except ValueError:
        return jsonify({'result': "Invalid input. Please provide integers."}), 400

    if not sympy.isprime(p):
        return jsonify({'result': "p is not prime"}), 400
    if not sympy.isprime(q):
        return jsonify({'result': "q is not prime"}), 400

    n = p * q
    phi_n = (p - 1) * (q - 1)

    if math.gcd(e, phi_n) != 1:
        return jsonify({'result': f"Invalid e. {e} is not coprime to ϕ(n) = {phi_n}"}), 400

    try:
        d = sympy.mod_inverse(e, phi_n)
    except ValueError:
        return jsonify({'result': "No modular inverse for e exists."}), 400

    if m > n:
        return jsonify({'result': f"The value of m must be less than n = {n}"}), 400

    # Mã hóa và giải mã
    cipher_text = pow(m, e, n)
    message = pow(cipher_text, d, n)

    if m != message:
        return jsonify({'result': "Fail"}), 400

    # Chuyển mọi giá trị sang chuỗi
    return jsonify({
        'publicKey': (str(e), str(n)),
        'privateKey': (str(d), str(n)),
        'cipherText': str(cipher_text),
        'originalMessage': str(message),
        'result': "Successful"
    })


@app.route('/encrypt/elgamal', methods=['POST'])
def encrypt_elgamal():
    data = request.get_json()
    p = int(data['p'])
    g = int(data['g'])  # generator - alpha
    a = int(data['a'])  # Private key
    m = int(data['m'])  # Message to encrypt

    if not sympy.isprime(p):
        return jsonify({'result': "p is not prime"})
    if g <= 1 or g >= p:
        return jsonify({'result': "Invalid g, it must be in range 1 < g < p"})
    # if y <= 1 or y >= p:
    #     return jsonify({'result': "Invalid β, it must be in range 1 < β < p"})
    if m <= 0 or m >= p:
        return jsonify({'result': "Invalid message, it must be in range 0 < m < p"})

    beta = pow(g, a, p)  # Tìm khóa công khai beta = alpha^a mod p

    # Generate random k thuộc Zp-1* (gcd(k,p-1) = 1)
    k = random.randint(1, p - 2)
    publicKey = (p, g, beta)
    privateKey = a

    # Encryption
    c1 = pow(g, k, p)
    c2 = (m * pow(beta, k, p)) % p

    # Giải mã d_k''(y1, y2) = y2*((y1^alpha)^-1) mod p
    d_k = pow(c1, a, p)
    d_k = sympy.mod_inverse(d_k, p)
    d_k = ((c2 % p) * (d_k % p)) % p

    # Chuyển tất cả dữ liệu lớn thành chuỗi
    return jsonify({
        'cipherText': (str(c1), str(c2)),
        'decryptedCipher': str(d_k),
        'publicKey': (str(p), str(g), str(beta)),
        'privateKey': str(privateKey),
        'result': "Successful"
    })


# Hàm kiểm tra điểm có nằm trên đường cong Elliptic không
def is_on_curve(x, y, a, b, p):
    return (y**2 - x**3 - a * x - b) % p == 0

# Kiểm tra số nguyên tố
def is_prime(n):
    return sympy.isprime(n)

# Hàm lưu tất cả các điểm trên đường cong vào list
def get_all_points_on_curve(a, b, p):
    points = []
    for x in range(p):
        for y in range(p):
            if is_on_curve(x, y, a, b, p):
                points.append((x, y))
    return points

# Hàm tạo điểm gốc ngẫu nhiên từ danh sách các điểm
def generate_base_point_from_list(points):
    return random.choice(points)  # Chọn ngẫu nhiên một điểm từ danh sách

@app.route('/encrypt/ecc', methods=['POST'])
def ecc_encrypt():
    data = request.get_json()

    # Nhận tham số đầu vào
    p = data['p']
    a = data['a']
    b = data['b']

    # Kiểm tra xem p có phải số nguyên tố không
    if not is_prime(p):
        return jsonify({'error': 'p is not a prime number'}), 400

    # Lưu tất cả các điểm trên đường cong vào list
    points = get_all_points_on_curve(a, b, p)

    # Kiểm tra số lượng điểm trên đường cong có phải là số nguyên tố không
    num_points = len(points) + 1
    if not is_prime(num_points):
        return jsonify({'error': 'The number of points on the curve is not prime'}), 400

    # Tạo điểm gốc (Base Point) ngẫu nhiên từ danh sách các điểm
    G = generate_base_point_from_list(points)

    # Tạo khóa công khai từ khóa riêng
    private_key = data['private_key']
    PublicKey = elliptic_multiply(private_key, G, a, p)

    # Sinh khóa tạm thời k (có thể chọn ngẫu nhiên)
    k = 3  # Trong thực tế, k nên được chọn ngẫu nhiên
    C1 = elliptic_multiply(k, G, a, p)
    k_PubKey = elliptic_multiply(k, PublicKey, a, p)

    # Mã hóa thông điệp M
    m_x = data['m_x']
    m_y = data['m_y']
    M = (m_x, m_y)

    if not is_on_curve(m_x, m_y, a, b, p):
        return jsonify({'error': 'Message point M is not on the curve'}), 400

    C2 = elliptic_add(M, k_PubKey, a, p)

    # Trả về kết quả mã hóa
    return jsonify({
        'publicKey': PublicKey,
        'C1': C1,
        'C2': C2,
        'message': M,
        'num_points': num_points  # Trả về số lượng điểm của đường cong
    })

# Hàm cộng điểm trên đường cong Elliptic
def elliptic_add(P, Q, a, p):
    if P is None:
        return Q
    if Q is None:
        return P

    x1, y1 = P
    x2, y2 = Q

    if x1 == x2 and y1 != y2:
        return None  # Điểm vô cực

    if P == Q:
        s = (3 * x1**2 + a) * pow(2 * y1, -1, p) % p
    else:
        s = (y2 - y1) * pow(x2 - x1, -1, p) % p

    x3 = (s**2 - x1 - x2) % p
    y3 = (s * (x1 - x3) - y1) % p

    return (x3, y3)

# Hàm nhân vô hướng trên đường cong Elliptic
def elliptic_multiply(k, P, a, p):
    result = None
    temp = P

    while k:
        if k & 1:
            result = elliptic_add(result, temp, a, p)
        temp = elliptic_add(temp, temp, a, p)
        k >>= 1

    return result


@app.route('/sign/ecdsa', methods=['POST'])
def ecdsa_signature():
    data = request.get_json()

    # Nhận tham số đầu vào
    p = data['p']
    a = data['a']
    b = data['b']

    # Kiểm tra xem p có phải số nguyên tố không
    if not is_prime(p):
        return jsonify({'error': 'p is not a prime number'}), 400

    # Lưu tất cả các điểm trên đường cong vào list
    points = get_all_points_on_curve(a, b, p)

    # Kiểm tra số lượng điểm trên đường cong có phải là số nguyên tố không
    num_points = q = len(points) + 1
    if not is_prime(num_points):
        return jsonify({'error': 'The number of points on the curve is not prime'}), 400

    # Tạo điểm gốc (Base Point) ngẫu nhiên từ danh sách các điểm
    A = generate_base_point_from_list(points)

    private_key = k = random.randint(1, num_points - 1) # Chọn một số ngẫu nhiên k trong khoảng 1 <= k <= q - 1 (khóa riêng tư)

    PublicKey = B = elliptic_multiply(k, A, a, p)  # Khóa công khai

    print(A, B)

    # Sign
    H_X = data['H_X'] # Nhập giá trị hàm băm của thông điệp
    k_E = random.randint(1, num_points - 1)  # # chọn một khóa tạm thời 1 <= k_E <= q - 1
    R = elliptic_multiply(k_E, A, a, p) # R = k_E*A
    r = R[0]  # r là tạo độ xR của điểm R
    k_E_inverse = sympy.mod_inverse(k_E, q)
    s = ((H_X + k * r) * k_E_inverse) % q
    print(f"(r, s) = ({r}, {s})")
    if s == 0:
        return jsonify({'error': 'The value of s = 0. Please resign!'}), 400

    # 3. Verify
    w = sympy.mod_inverse(s, q)
    u1 = (H_X * w) % q
    u2 = (r * w) % q
    P = elliptic_add(elliptic_multiply(u1, A, a, p), elliptic_multiply(u2, B, a, p), a, p)
    print(P)
    if P[0] == r:
        print("True")
    else:
        return jsonify({'error': 'The verified signature is not true'}), 400

    # Trả về kết quả mã hóa
    return jsonify({
        'generatorPoint': A,
        'publicKey': PublicKey,
        'privateKey': private_key,
        'sign': (r, s),
        'P': P,
        'result': "Successful"
    })


@app.route('/signature/rsa', methods=['POST'])
def rsa_signature():
    data = request.get_json()
    p = int(data['p'])  # Chuyển đổi p thành kiểu int
    q = int(data['q'])  # Chuyển đổi q thành kiểu int
    e = int(data['e'])  # Chuyển đổi e thành kiểu int

    if not sympy.isprime(p):
        return jsonify({'result': "p is not prime"})
    if not sympy.isprime(q):
        return jsonify({'result': "q is not prime"})

    n = p * q
    phi_n = (p - 1) * (q - 1)

    if math.gcd(e, phi_n) != 1:
        return jsonify({'result': f"Invalid e. {e} is not coprime to ϕ(n) = {phi_n}"})

    d = sympy.mod_inverse(e, phi_n)

    publicKey = (e, n)
    privateKey = (d, n)

    H_M = int(data['H_M'])  # Chuyển đổi H(M) thành kiểu int
    if H_M >= n:
        return jsonify({'result': f"The value of H(M) must be less than n = {n}"})

    # Tạo chữ ký S = H(M)^d mod n
    S = pow(H_M, d, n)

    # Xác minh chữ ký H'(M) = S^e mod n
    verifiedSign = pow(S, e, n)

    if verifiedSign != H_M:
        return jsonify({'result': "Incorrect signature verification"})

    # Chuyển tất cả các giá trị lớn thành chuỗi
    return jsonify({
        'n': str(n),  # Chuyển n thành chuỗi
        'phi_n': str(phi_n),  # Chuyển phi_n thành chuỗi
        'publicKey': (str(publicKey[0]), str(publicKey[1])),  # Chuyển các phần trong publicKey thành chuỗi
        'privateKey': (str(privateKey[0]), str(privateKey[1])),  # Chuyển các phần trong privateKey thành chuỗi
        'sign': str(S),  # Chuyển chữ ký S thành chuỗi
        'result': "Successful"
    })


@app.route('/signature/elgamal', methods=['POST'])
def elgamal_signature():
    data = request.get_json()

    # Chuyển dữ liệu nhận vào thành kiểu int
    p = int(data['p'])
    g = int(data['g'])  # generator - alpha
    a = int(data['a'])  # Private key
    x = int(data['x'])  # Message to sign

    # Kiểm tra tính hợp lệ của p và g
    print(p)
    print(sympy.isprime(p))
    if not sympy.isprime(p):
        print("abc")
        return jsonify({'result': "p is not prime"})
    if g <= 1 or g >= p:
        return jsonify({'result': "Invalid g, it must be in range 1 < g < p"})
    if x <= 0 or x >= p:
        return jsonify({'result': "Invalid message, it must be in range 0 < m < p"})

    # Tính khóa công khai beta = g^a mod p
    beta = pow(g, a, p)
    publicKey = (p, g, beta)  # Không cần chuyển đổi vì đã là int
    privateKey = a

    # Kiểm tra tính hợp lệ của k
    k = int(data['k'])  # Random k
    if math.gcd(k, p - 1) != 1:
        return jsonify({'result': "gcd(k, p-1) is not equal to 1"})

    # Tính nghịch đảo của k mod (p-1)
    k_inverse = sympy.mod_inverse(k, p - 1)

    # Tạo chữ ký (gamma, sigma)
    gamma = pow(g, k, p)
    sigma = ((x - a * gamma) * k_inverse) % (p - 1)
    sign = (gamma, sigma)

    # Kiểm tra chữ ký
    v11 = pow(beta, gamma, p)
    v12 = pow(gamma, sigma, p)
    v1 = (v11 * v12) % p
    v2 = pow(g, x, p)

    if v1 != v2:
        return jsonify({'result': "Incorrect signature verification"})

    # Trả về kết quả dưới dạng chuỗi (hoặc int nếu muốn)
    return jsonify({
        'publicKey': (str(p), str(g), str(beta)),
        'privateKey': str(privateKey),
        'sign': (str(gamma), str(sigma)),
        'result': "Successful"
    })



def is_prime_aks(n):
    """
    Thuật toán AKS để kiểm tra số nguyên tố.
    """
    if n < 2:
        return False
    if n == 2:
        return True
    if n % 2 == 0:
        return False

    # Tìm giá trị lớn nhất của r sao cho o_r(n) > log2(n)^2
    r = 1
    max_k = int((n ** 0.5).bit_length() ** 2)
    while True:
        r += 1
        if all(pow(n, k, r) != 0 for k in range(1, max_k)):
            break

    # Nếu 1 < gcd(a, n) < n với a ≤ r, thì n không nguyên tố
    for a in range(2, min(r, n)):
        if n % a == 0:
            return False

    # Kiểm tra điều kiện (x + a)^n ≡ x^n + a (mod x^r - 1, n)
    limit = int(r ** 0.5)
    for a in range(1, limit + 1):
        lhs = pow(a, n, n)  # a^n mod n
        rhs = (pow(a, n % r, n) * a) % n  # (a^(n % r) * a) mod n
        if lhs != rhs:
            return False

    return True

@app.route('/aks', methods=['POST'])
def aks():
    """
    API kiểm tra số nguyên tố sử dụng thuật toán AKS.
    """
    try:
        data = request.get_json()
        number = data.get('number')
        number = int(number)

        if number is None or not isinstance(number, int) or number < 1:
            return jsonify({'error': "Invalid input. Please provide a positive integer."}), 400

        result = sympy.isprime(number)
        return jsonify({'number': number, 'isPrime': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
