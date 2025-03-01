import React, { useState } from "react";
import "../General.css";

const ElGamalSignature: React.FC = () => {
    const [p, setP] = useState<string>(""); // Prime number
    const [g, setG] = useState<string>(""); // Generator
    const [a, setA] = useState<string>(""); // Private key
    const [x, setX] = useState<string>(""); // Message to sign
    const [k, setK] = useState<string>(""); // Random k
    const [result, setResult] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSign = async () => {
        setError(null);
        setResult(null);

        if (!p || !g || !a || !x || !k) {
            setError("Please fill in all fields.");
            return;
        }

        if (![p, g, a, x, k].every((val) => /^\d+$/.test(val))) {
            setError("All inputs must be valid integers.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/signature/elgamal", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ p, g, a, x, k }), // Truyền các giá trị là chuỗi
            });

            const data = await response.json();

            if (data.result && data.result !== "Successful") {
                setError(data.result); // Hiển thị lỗi từ backend
            } else {
                setResult(data); // Hiển thị kết quả thành công
            }
        } catch (err) {
            console.error(err);
            setError("Failed to connect to the server.");
        }
    };

    return (
        <div className="container">
            <h1>ElGamal Digital Signature</h1>
            <div className="input-group">
                <label>Prime number (p):</label>
                <input
                    type="text"
                    value={p}
                    onChange={(e) => setP(e.target.value)}
                    placeholder="Enter a large prime number"
                />
            </div>
            <div className="input-group">
                <label>Generator (g):</label>
                <input
                    type="text"
                    value={g}
                    onChange={(e) => setG(e.target.value)}
                    placeholder="Enter a generator"
                />
            </div>
            <div className="input-group">
                <label>Private key (a):</label>
                <input
                    type="text"
                    value={a}
                    onChange={(e) => setA(e.target.value)}
                    placeholder="Enter private key"
                />
            </div>
            <div className="input-group">
                <label>Random k:</label>
                <input
                    type="text"
                    value={k}
                    onChange={(e) => setK(e.target.value)}
                    placeholder="Enter a random k"
                />
            </div>
            <div className="input-group">
                <label>Message to sign (x):</label>
                <input
                    type="text"
                    value={x}
                    onChange={(e) => setX(e.target.value)}
                    placeholder="Enter the message to sign"
                />
            </div>
            <button onClick={handleSign}>Sign</button>

            {error && (
                <p style={{ color: "red", marginTop: "10px" }}>
                    {error}
                </p>
            )}

            {result && (
                <div className="result">
                    <h2>Signature Results</h2>
                    <p>
                        <strong>Public Key (p, g, β):</strong> ({result.publicKey[0]}, {result.publicKey[1]}, {result.publicKey[2]})
                    </p>
                    <p>
                        <strong>Private Key (a):</strong> {result.privateKey}
                    </p>
                    <p>
                        <strong>Signature (γ, σ):</strong> ({result.sign[0]}, {result.sign[1]})
                    </p>
                    <p>
                        <strong>Result:</strong> {result.result}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ElGamalSignature;
