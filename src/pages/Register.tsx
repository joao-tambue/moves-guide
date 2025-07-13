import React from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import logo from "../assets/logotipo.svg";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

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
      navigate('/');
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
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#181818] to-[#23272f]">
        <div className="bg-gradient-to-br from-[#181818] to-[#23272f] border border-[#23272f] rounded-2xl flex flex-col w-[540px] mx-auto px-[72px] py-[48px] gap-4 font-medium text-white text-[18px] shadow-2xl animate-fade-in">
          <div className="flex justify-center mb-2">
            <img src={logo} alt="logotipo" className="w-24 h-24 drop-shadow-lg" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-[#00DF5E] font-semibold tracking-wide">Name</label>
              <input
                type="text"
                id="name"
                {...register("name")}
                className="rounded-lg py-2 px-4 w-full border-2 border-[#23272f] bg-[#181818] text-white placeholder-white placeholder:text-[14px] placeholder:font-normal focus:border-[#00DF5E] focus:ring-2 focus:ring-[#00DF5E] transition-all duration-300 outline-none"
                placeholder="Enter your name"
              />
              {errors.name && (
                <span className="text-red-500 text-[14px] font-normal">{errors.name.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-[#00DF5E] font-semibold tracking-wide">Email</label>
              <input
                type="text"
                id="email"
                {...register("email")}
                className="rounded-lg py-2 px-4 w-full border-2 border-[#23272f] bg-[#181818] text-white placeholder-white placeholder:text-[14px] placeholder:font-normal focus:border-[#00DF5E] focus:ring-2 focus:ring-[#00DF5E] transition-all duration-300 outline-none"
                placeholder="example@gmail.com"
              />
              {errors.email && (
                <span className="text-red-500 text-[14px] font-normal">{errors.email.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-[#00DF5E] font-semibold tracking-wide">Password</label>
              <input
                type="password"
                id="password"
                {...register("password")}
                className="rounded-lg py-2 px-4 w-full border-2 border-[#23272f] bg-[#181818] text-white placeholder-white placeholder:text-[14px] placeholder:font-normal focus:border-[#00DF5E] focus:ring-2 focus:ring-[#00DF5E] transition-all duration-300 outline-none"
                placeholder="Enter your password"
              />
              {errors.password && (
                <span className="text-red-500 text-[14px] font-normal">{errors.password.message}</span>
              )}
            </div>

            <button
              type="submit"
              className="bg-[#00DF5E] py-3 rounded-lg mt-2 hover:brightness-110 transition flex items-center justify-center shadow-lg border border-[#23272f] text-black font-bold text-lg"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  Loading...
                </span>
              ) : (
                'Create account'
              )}
            </button>

            <p className="font-thin text-center text-gray-300 mt-2">
              Already have an account?{' '}
              <Link to={'/'} className="font-semibold text-[#00DF5E] hover:underline">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
