import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logotipo.svg';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginForm) {
    setLoading(true);
    try {
      const response = await api.post('/api/auth/login', data);
      const { token } = response.data;

      localStorage.setItem('token', token);

      toast.success('Login com sucesso haha !', {
        position: 'top-right',
        autoClose: 3000,
      });

      // Aqui pode redirecionar para dashboard ou algo assim
      navigate('/');
    } catch (error) {
      type ErrorResponse = { response: { status: number } };
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as ErrorResponse).response === 'object' &&
        (error as ErrorResponse).response !== null &&
        'status' in (error as ErrorResponse).response &&
        (((error as ErrorResponse).response.status === 401 || (error as ErrorResponse).response.status === 404))
      ) {
        toast.error('Email ou senha inválidos', {
          position: 'top-right',
        });
      } else {
        toast.error('Erro ao fazer login. Tente novamente.', {
          position: 'top-right',
        });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#181818] to-[#23272f]">
      <ToastContainer />
      <div className="bg-gradient-to-br from-[#181818] to-[#23272f] border border-[#23272f] rounded-2xl flex flex-col w-[380px] sm:w-[420px] md:w-[480px] mx-auto px-8 py-10 gap-4 font-sans font-semibold text-white text-[18px] shadow-2xl animate-fade-in">
        <div className="flex justify-center mb-2">
          <img src={logo} alt="logotipo" className="w-24 h-24 drop-shadow-lg" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-[#00DF5E] font-bold">Email</label>
            <input
              id="email"
              type="text"
              {...register('email')}
              className="rounded-xl py-3 px-3 flex items-center border-2 border-[#23272f] bg-[#131316] transition-all duration-300 focus:border-[#00DF5E] placeholder-white placeholder:text-[15px] placeholder:font-normal focus:ring-2 focus:ring-[#00DF5E] shadow-sm"
              placeholder="example@gmail.com"
            />
            {errors.email && (
              <span className="text-red-500 text-[14px] font-normal mt-1">{errors.email.message}</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-[#00DF5E] font-bold">Password</label>
            <input
              id="password"
              type="password"
              {...register('password')}
              className="rounded-xl py-3 px-3 flex items-center border-2 border-[#23272f] bg-[#131316] transition-all duration-300 focus:border-[#00DF5E] placeholder-white placeholder:text-[15px] placeholder:font-normal focus:ring-2 focus:ring-[#00DF5E] shadow-sm"
              placeholder="Digite a sua senha"
            />
            {errors.password && (
              <span className="text-red-500 text-[14px] font-normal mt-1">{errors.password.message}</span>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#00DF5E] text-black py-3 rounded-xl mt-2 font-bold hover:bg-[#2db968d2] transition-all duration-200 shadow-lg border border-[#23272f] disabled:opacity-60"
          >
            {loading ? 'Entrando...' : 'Login now'}
          </button>

          <p className="font-thin text-center text-gray-300 mt-2">
            Don't have an account?{' '}
            <Link to={'/cadastro'} className="font-semibold text-[#00DF5E] hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
