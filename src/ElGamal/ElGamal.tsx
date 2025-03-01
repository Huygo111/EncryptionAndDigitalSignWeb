import React, { useState } from "react";
import "../General.css";

const ElGamalEncryption: React.FC = () => {
    const [p, setP] = useState<string>("");
    const [g, setG] = useState<string>("");
    const [a, setA] = useState<string>("");
    const [m, setM] = useState<string>(""); // Message to encrypt
    const [result, setResult] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleEncrypt = async () => {
        setError(null);
        setResult(null);

        if (!p || !g || !a || !m) {
            setError("Please fill in all fields.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/encrypt/elgamal", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    p: p, // Dữ liệu là string
                    g: g,
                    a: a,
                    m: m,
                }),
            });

            const data = await response.json();

            if (data.result === "Successful") {
                setResult(data);
            } else {
                setError(data.result || "Encryption failed.");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to connect to the server.");
        }
    };

    return (
        <div className="container">
            <h1>ElGamal Encryption</h1>
            <div className="input-group">
                <label>Prime number (p):</label>
                <input type="text" value={p} onChange={(e) => setP(e.target.value)} />
            </div>
            <div className="input-group">
                <label>Generator (g):</label>
                <input type="text" value={g} onChange={(e) => setG(e.target.value)} />
            </div>
            <div className="input-group">
                <label>Private Key (a):</label>
                <input type="text" value={a} onChange={(e) => setA(e.target.value)} />
            </div>
            <div className="input-group">
                <label>Message to encrypt (m):</label>
                <input type="text" value={m} onChange={(e) => setM(e.target.value)} />
            </div>
            <button onClick={handleEncrypt}>Encrypt</button>

            {error && <p style={{ color: "red" }}>Error: {error}</p>}

            {result && (
                <div className="result">
                    <h2>Encryption Results</h2>
                    <p>
                        <strong>Public Key (p, g, β):</strong> ({result.publicKey[0]}, {result.publicKey[1]}, {result.publicKey[2]})
                    </p>
                    <p>
                        <strong>Private Key (a):</strong> {result.privateKey}
                    </p>
                    <p>
                        <strong>Cipher Text (c1, c2):</strong> ({result.cipherText[0]}, {result.cipherText[1]})
                    </p>
                    <p>
                        <strong>Decrypted Message:</strong> {result.decryptedCipher}
                    </p>
                    <p>
                        <strong>Result:</strong> {result.result}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ElGamalEncryption;
