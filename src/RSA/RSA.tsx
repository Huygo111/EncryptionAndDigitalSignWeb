
import React, { useState } from "react";
import "../General.css";

const RSAEncryption: React.FC = () => {
    const [p, setP] = useState<string>("");
    const [q, setQ] = useState<string>("");
    const [e, setE] = useState<string>("");
    const [m, setM] = useState<string>(""); // Message to encrypt
    const [result, setResult] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleEncrypt = async () => {
        setError(null);
        setResult(null);

        if (!p || !q || !e || !m) {
            setError("Please fill in all fields.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/encrypt/rsa", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    p: p, // Gửi số lớn dưới dạng chuỗi
                    q: q,
                    e: e,
                    m: m,
                }),
            });

            const data = await response.json();

            if (data.result === "Fail") {
                setError("Decryption failed; the original message doesn't match.");
            } else if (data.result && data.result.includes("must be less than n")) {
                setError(data.result);
            } else if (data.result === "p is not prime" || data.result === "q is not prime") {
                setError(data.result);
            } else if (data.result && data.result.includes("Invalid e")) {
                setError(data.result);
            } else {
                setResult(data);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to connect to the server.");
        }
    };

    return (
        <div className="container">
            <h1>RSA Encryption</h1>
            <div className="input-group">
                <label>Prime number (p):</label>
                <input
                    type="text"
                    value={p}
                    onChange={(e) => setP(e.target.value)}
                />
            </div>
            <div className="input-group">
                <label>Prime number (q):</label>
                <input
                    type="text"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                />
            </div>
            <div className="input-group">
                <label>Public exponent (e):</label>
                <input
                    type="text"
                    value={e}
                    onChange={(e) => setE(e.target.value)}
                />
            </div>
            <div className="input-group">
                <label>Message to encrypt (m):</label>
                <input
                    type="text"
                    value={m}
                    onChange={(e) => setM(e.target.value)}
                />
            </div>
            <button onClick={handleEncrypt}>Encrypt</button>

            {error && <p style={{ color: "red" }}>Error: {error}</p>}

            {result && (
                <div className="result">
                    <h2>Encryption Results</h2>
                    <p>
                        <strong>Public Key (e, n):</strong> ({result.publicKey[0]}, {result.publicKey[1]})
                    </p>
                    <p>
                        <strong>Private Key (d, n):</strong> ({result.privateKey[0]}, {result.privateKey[1]})
                    </p>
                    <p>
                        <strong>Cipher Text:</strong> {result.cipherText}
                    </p>
                    <p>
                        <strong>Original Message:</strong> {result.originalMessage}
                    </p>
                    <p>
                        <strong>Result:</strong> {result.result}
                    </p>
                </div>
            )}
        </div>
    );
};

export default RSAEncryption;
