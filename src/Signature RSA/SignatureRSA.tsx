import React, { useState } from 'react';
import '../General.css';

const RSASignature: React.FC = () => {
    const [p, setP] = useState<string>(''); // Sử dụng string để nhận số lớn
    const [q, setQ] = useState<string>(''); // Sử dụng string để nhận số lớn
    const [e, setE] = useState<string>(''); // Sử dụng string để nhận số lớn
    const [hM, setHM] = useState<string>(''); // Hàm băm thông điệp
    const [result, setResult] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSign = async () => {
        setError(null);
        setResult(null);

        // Kiểm tra các giá trị đầu vào
        if (!p || !q || !e || !hM) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            // Chuyển các giá trị đầu vào từ string sang BigInt
            const response = await fetch('http://localhost:5000/signature/rsa', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    p: p, // Truyền dưới dạng string, server sẽ xử lý
                    q: q, // Truyền dưới dạng string, server sẽ xử lý
                    e: e, // Truyền dưới dạng string, server sẽ xử lý
                    H_M: hM, // Truyền dưới dạng string, server sẽ xử lý
                }),
            });

            const data = await response.json();

            if (data.result !== "Successful") {
                setError(data.result);
            } else {
                setResult(data);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to connect to server.');
        }
    };

    return (
        <div className="container">
            <h1>RSA Digital Signature</h1>
            <div className="input-group">
                <label>Prime number p:</label>
                <input
                    type="text" // Chuyển từ number thành text để có thể nhập số lớn
                    value={p}
                    onChange={(e) => setP(e.target.value)}
                    placeholder="Enter large prime number"
                />
            </div>
            <div className="input-group">
                <label>Prime number q:</label>
                <input
                    type="text" // Chuyển từ number thành text để có thể nhập số lớn
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Enter large prime number"
                />
            </div>
            <div className="input-group">
                <label>Exponent e:</label>
                <input
                    type="text" // Chuyển từ number thành text để có thể nhập số lớn
                    value={e}
                    onChange={(e) => setE(e.target.value)}
                    placeholder="Enter exponent"
                />
            </div>
            <div className="input-group">
                <label>Hash of Message (H(M)):</label>
                <input
                    type="text" // Chuyển từ number thành text để có thể nhập số lớn
                    value={hM}
                    onChange={(e) => setHM(e.target.value)}
                    placeholder="Enter hash of the message"
                />
            </div>
            <button onClick={handleSign}>Sign</button>

            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

            {result && (
                <div className="result">
                    <h2>Signature Results</h2>
                    <p>
                        <strong>Modulus (n):</strong> {result.n}
                    </p>
                    <p>
                        <strong>Phi (ϕ(n)):</strong> {result.phi_n}
                    </p>
                    <p>
                        <strong>Public Key:</strong> (e={result.publicKey[0]}, n={result.publicKey[1]})
                    </p>
                    <p>
                        <strong>Private Key:</strong> (d={result.privateKey[0]}, n={result.privateKey[1]})
                    </p>
                    <p>
                        <strong>Signature (S):</strong> {result.sign}
                    </p>
                    <p style={{ color: 'green' }}>
                        <strong>{result.result}</strong>
                    </p>
                </div>
            )}
        </div>
    );
};

export default RSASignature;
