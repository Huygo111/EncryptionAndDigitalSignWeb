import React, { useState } from 'react';
import '../General.css';

const ECDSASignature: React.FC = () => {
    const [p, setP] = useState<string>('');
    const [a, setA] = useState<string>('');
    const [b, setB] = useState<string>('');
    const [hX, setHX] = useState<string>(''); // Hàm băm của thông điệp
    const [result, setResult] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSign = async () => {
        setError(null);
        setResult(null);

        // Kiểm tra các giá trị đầu vào
        if (!p || !a || !b || !hX) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/sign/ecdsa', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    p: parseInt(p),
                    a: parseInt(a),
                    b: parseInt(b),
                    H_X: parseInt(hX),
                }),
            });

            const data = await response.json();

            if (data.error) {
                setError(data.error);
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
            <h1>ECDSA Digital Signature</h1>
            <div className="input-group">
                <label>Prime number (p):</label>
                <input type="number" value={p} onChange={(e) => setP(e.target.value)} />
            </div>
            <div className="input-group">
                <label>Curve coefficient (a):</label>
                <input type="number" value={a} onChange={(e) => setA(e.target.value)} />
            </div>
            <div className="input-group">
                <label>Curve coefficient (b):</label>
                <input type="number" value={b} onChange={(e) => setB(e.target.value)} />
            </div>
            <div className="input-group">
                <label>Hash of message (H_X):</label>
                <input type="number" value={hX} onChange={(e) => setHX(e.target.value)} />
            </div>
            <button onClick={handleSign}>Sign</button>

            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

            {result && (
                <div className="result">
                    <h2>Signature Results</h2>
                    <p>
                        <strong>Base Point (A):</strong> ({result.generatorPoint[0]}, {result.generatorPoint[1]})
                    </p>
                    <p>
                        <strong>Private Key:</strong> {result.privateKey}
                    </p>
                    <p>
                        <strong>Public Key (B):</strong> ({result.publicKey[0]}, {result.publicKey[1]})
                    </p>
                    <p>
                        <strong>Signature (r, s):</strong> ({result.sign[0]}, {result.sign[1]})
                    </p>
                    <p>
                        <strong>Verification Point (P):</strong> ({result.P[0]}, {result.P[1]})
                    </p>
                    <p style={{ color: 'green' }}>
                        <strong>{result.result}</strong>
                    </p>
                </div>
            )}
        </div>
    );
};

export default ECDSASignature;
