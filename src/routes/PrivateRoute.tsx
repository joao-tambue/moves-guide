// src/routes/PrivateRoute.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token");
  const [showModal] = useState(!token);
  const navigate = useNavigate();

  if (!token && showModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <div className="bg-[#171717] rounded-xl shadow-lg w-full max-w-md p-8 flex flex-col items-center animate-fade-in text-white">
          <h2 className="text-2xl font-bold mb-2 text-[#00DF5E]">Acesso restrito</h2>
          <p className="mb-4 text-center">Você não está logado na plataforma.<br/>Faça login para acessar esta página.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-[#00DF5E] text-black px-6 py-2 rounded-md font-semibold hover:bg-[#2db968d2] transition mb-2"
          >
            Fazer Login
          </button>
        </div>
      </div>
    );
  }

  return children;
}