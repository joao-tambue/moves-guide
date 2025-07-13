// src/routes/PrivateRoute.tsx
import { useState } from "react";
import AccessDeniedIcon from '../assets/icon/access-denied.svg';
import { useNavigate } from "react-router-dom";

export function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token");
  const [showModal] = useState(!token);
  const navigate = useNavigate();

  if (!token && showModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <div className="relative w-[320px] sm:w-[380px] md:w-[420px] mx-auto rounded-2xl shadow-lg bg-gradient-to-br from-[#181818] to-[#23272f] border border-[#23272f] p-8 flex flex-col items-center animate-fade-in text-white">
          <img src={AccessDeniedIcon} alt="Acesso negado" className="w-16 h-16 mb-4 animate-bounce-slow" />
          <h2 className="text-2xl text-center font-bold mb-2 text-[#00DF5E] drop-shadow-lg">Ops ! <br /> Acesso restrito</h2>
          <p className="mb-4 text-center text-gray-300 drop-shadow">Isso pode ter acontecido por 2 motivos: </p>
          <p className="mb-4 text-center text-gray-300 drop-shadow">1º Você não está logado na plataforma.<br/>Faça login para acessar esta página.</p>
          <p className="mb-4 text-center text-gray-300 drop-shadow">2º A internet esta lenta e a plataforma esta a demorar para fazer a verificação do usuario, volte na plataforma e espere a plataforma carregar completamente.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-[#00DF5E] text-black px-6 py-2 rounded-md font-semibold hover:bg-[#2db968d2] transition mb-2 shadow-lg border border-[#23272f]"
          >
            Fazer Login
          </button>
        </div>
      </div>
    );
  }

  return children;
}