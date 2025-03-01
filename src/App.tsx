import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import RSAEncryption from './RSA/RSA';
import ElGamalEncryption from './ElGamal/ElGamal';
import ECCEncryption from './ECC/ECC';
import ECDSASignature from './SignatureECDSA/SignatureECDSA';
import RSASignature from './Signature RSA/SignatureRSA';
import ElGamalSignature from './Signature ElGamal/SignatureElGamal';
import AKS from './AKS/AKS';
import './App.css'; // Tạo hoặc thêm file CSS

function App() {
    return (
        <Router>
            <nav className="navbar">
                <ul className="nav-links">
                    <li>
                        <Link to="/rsa" className="nav-item">RSA Encryption</Link>
                    </li>
                    <li>
                        <Link to="/elgamal" className="nav-item">ElGamal Encryption</Link>
                    </li>
                    <li>
                        <Link to="/ecc" className="nav-item">ECC Encryption</Link>
                    </li>
                    <li>
                        <Link to="/signature_rsa" className="nav-item">RSA Signature</Link>
                    </li>
                    <li>
                        <Link to="/signature_elgamal" className="nav-item">ElGamal Signature</Link>
                    </li>
                    <li>
                        <Link to="/ecdsa" className="nav-item">ECDSA Signature</Link>
                    </li>
                    <li>
                        <Link to="/aks" className="nav-item">AKS</Link>
                    </li>
                </ul>
            </nav>
            <Routes>
                <Route path="/" element={<Navigate to="/rsa" replace/>}/>
                <Route path="/rsa" element={<RSAEncryption />} />
                <Route path="/elgamal" element={<ElGamalEncryption />} />
                <Route path="/ecc" element={<ECCEncryption />} />
                <Route path="/signature_rsa" element={<RSASignature />} />
                <Route path="/signature_elgamal" element={<ElGamalSignature />} />
                <Route path="/ecdsa" element={<ECDSASignature />} />
                <Route path="/aks" element={<AKS />} />
            </Routes>
        </Router>
    );
}

export default App;
