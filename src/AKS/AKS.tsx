import React, { useState } from "react";
import "../General.css";

const AKS: React.FC = () => {
    const [number, setNumber] = useState<string>(""); // Số cần kiểm tra
    const [result, setResult] = useState<string | null>(null); // Kết quả trả về
    const [error, setError] = useState<string | null>(null); // Thông báo lỗi
    const [loading, setLoading] = useState<boolean>(false); // Trạng thái loading

    const handleCheckPrime = async () => {
        setError(null);
        setResult(null);
        setLoading(true);

        if (!number) {
            setError("Please enter a number.");
            setLoading(false);
            return;
        }

        // Kiểm tra đầu vào là số nguyên dương
        if (!/^\d+$/.test(number)) {
            setError("Please enter a valid positive integer.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:5000/aks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ number: number }), // Truyền số dưới dạng chuỗi
            });

            const data = await response.json();

            if (data.isPrime) {
                setResult(`${number} is a prime number.`);
            } else {
                setResult(`${number} is not a prime number.`);
            }
        } catch (err) {
            setError("Failed to connect to the server or invalid response.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h1>AKS Prime Number Checker</h1>
            <div className="input-group">
                <label>Number to check:</label>
                <input
                    type="text" // Đầu vào là chuỗi để hỗ trợ số lớn
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="Enter a large positive integer"
                />
            </div>
            <button onClick={handleCheckPrime} disabled={loading || !number}>
                {loading ? "Checking..." : "Check"}
            </button>

            {error && <p style={{ color: "red", marginTop: "10px" }}>Error: {error}</p>}

            {result && (
                <div className="result">
                    <h2>Result</h2>
                    <p>{result}</p>
                </div>
            )}
        </div>
    );
};

export default AKS;
