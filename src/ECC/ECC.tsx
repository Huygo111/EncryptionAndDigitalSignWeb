import React, { useState } from 'react';
import '../General.css';

const ECCEncryption: React.FC = () => {
    const [p, setP] = useState<string>('');
    const [a, setA] = useState<string>('');
    const [b, setB] = useState<string>('');
    const [mX, setMX] = useState<string>('');
    const [mY, setMY] = useState<string>('');
    const [privateKey, setPrivateKey] = useState<string>('');
    const [result, setResult] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleEncrypt = async () => {
        setError(null);
        setResult(null);

        // Kiểm tra các giá trị đầu vào
        if (!p || !a || !b || !mX || !mY || !privateKey) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/encrypt/ecc', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    p: parseInt(p),
                    a: parseInt(a),
                    b: parseInt(b),
                    // g_x: parseInt(gX),
                    // g_y: parseInt(gY),
                    m_x: parseInt(mX),
                    m_y: parseInt(mY),
                    private_key: parseInt(privateKey),
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
            <h1>ECC ElGamal Encryption</h1>
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
            {/*<div className="input-group">*/}
            {/*    <label>Base point G (x):</label>*/}
            {/*    <input type="number" value={gX} onChange={(e) => setGX(e.target.value)} />*/}
            {/*</div>*/}
            {/*<div className="input-group">*/}
            {/*    <label>Base point G (y):</label>*/}
            {/*    <input type="number" value={gY} onChange={(e) => setGY(e.target.value)} />*/}
            {/*</div>*/}
            <div className="input-group">
                <label>Message point M (x):</label>
                <input type="number" value={mX} onChange={(e) => setMX(e.target.value)} />
            </div>
            <div className="input-group">
                <label>Message point M (y):</label>
                <input type="number" value={mY} onChange={(e) => setMY(e.target.value)} />
            </div>
            <div className="input-group">
                <label>Private key:</label>
                <input type="number" value={privateKey} onChange={(e) => setPrivateKey(e.target.value)} />
            </div>
            <button onClick={handleEncrypt}>Encrypt</button>

            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

            {result && (
                <div className="result">
                    <h2>Encryption Results</h2>
                    <p>
                        <strong>Private Key:</strong> {privateKey}
                    </p>
                    <p>
                        <strong>Public Key:</strong> ({result.publicKey[0]}, {result.publicKey[1]})
                    </p>
                    <p>
                        <strong>Encrypted Message M1:</strong> ({result.C1[0]}, {result.C1[1]})
                    </p>
                    <p>
                        <strong>Encrypted Message M2:</strong> ({result.C2[0]}, {result.C2[1]})
                    </p>
                    <p>
                        <strong>Original Message M:</strong> ({mX}, {mY})
                    </p>
                </div>
            )}
        </div>
    );
};

export default ECCEncryption;
