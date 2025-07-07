import React from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import googleIcon from "../assets/icon/google.png";
import logo from "../assets/logotipo.svg";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

// Esquema de validação com Zod
const registerSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

type RegisterData = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterData) {
    setLoading(true);
    try {
      await api.post("/api/auth/register", data);
      toast.success("Usuário registrado com sucesso haha!");
      navigate('/login');
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error && (error as { response?: { status?: number } }).response?.status === 400) {
        toast.error("Usuário já existe ou dados inválidos");
      } else {
        toast.error("Erro no servidor. Tente novamente mais tarde.");
      }
      console.error("Erro ao registrar:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-h-screen flex justify-center items-center">
        <div className="bg-[#131316] rounded-lg flex flex-col w-[540px] mx-auto px-[72px] py-[48px] gap-4 font-sans font-semibold text-white text-[18px] shadow-lg">
          <div className="flex justify-center">
            <img src={logo} alt="logotipo" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="name">Nome</label>
              <input
                type="text"
                id="name"
                {...register("name")}
                className="rounded-lg py-2 px-2 flex items-center border bg-transparent transition-colors duration-300 focus:border-[#00DF5E] placeholder-white placeholder:text-[14px] placeholder:font-normal focus:ring-2 focus:ring-[#00DF5E]"
                placeholder="Digite o seu nome"
              />
              {errors.name && (
                <span className="text-red-500 text-sm">{errors.name.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                {...register("email")}
                className="rounded-lg py-2 px-2 flex items-center border bg-transparent transition-colors duration-300 focus:border-[#00DF5E] placeholder-white placeholder:text-[14px] placeholder:font-normal focus:ring-2 focus:ring-[#00DF5E]"
                placeholder="example@gmail.com"
              />
              {errors.email && (
                <span className="text-red-500 text-sm">{errors.email.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                {...register("password")}
                className="rounded-lg py-2 px-2 flex items-center border bg-transparent transition-colors duration-300 focus:border-[#00DF5E] placeholder-white placeholder:text-[14px] placeholder:font-normal focus:ring-2 focus:ring-[#00DF5E]"
                placeholder="Digite o seu password"
              />
              {errors.password && (
                <span className="text-red-500 text-sm">{errors.password.message}</span>
              )}
            </div>

            <button
              type="submit"
              className="bg-[#00DF5E] py-3 rounded-lg mt-2 hover:brightness-110 transition flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  Registrando...
                </span>
              ) : (
                'Create account'
              )}
            </button>

            <button
              type="button"
              className="bg-[#707077] py-3 rounded-lg mt-2 flex items-center justify-center gap-2 hover:brightness-110 transition"
            >
              <img src={googleIcon} alt="" className="h-[20px] w-[20px]" />
              Continue with Google
            </button>

            <p className="font-thin text-center">
              Already have an account?{" "}
              <Link to={'/login'} className="font-semibold text-[#00DF5E] hover:underline">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
