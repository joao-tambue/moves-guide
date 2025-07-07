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
    <div className="min-h-screen flex justify-center items-center">
      <ToastContainer />
      <div className="bg-[#131316] rounded-lg flex flex-col w-[540px] mx-auto px-[72px] py-[48px] gap-4 font-sans font-semibold text-white text-[18px] shadow-lg">
        <div className="flex justify-center">
          <img src={logo} alt="logotipo" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="text"
              {...register('email')}
              className="rounded-lg py-2 px-2 flex items-center border bg-transparent transition-colors duration-300 focus:border-[#00DF5E] placeholder-white placeholder:text-[14px] placeholder:font-normal focus:ring-2 focus:ring-[#00DF5E]"
              placeholder="example@gmail.com"
            />
            {errors.email && (
              <span className="text-red-500 text-[14px] font-normal">{errors.email.message}</span>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              {...register('password')}
              className="rounded-lg py-2 px-2 flex items-center border bg-transparent transition-colors duration-300 focus:border-[#00DF5E] placeholder-white placeholder:text-[14px] placeholder:font-normal focus:ring-2 focus:ring-[#00DF5E]"
              placeholder="Digite a sua senha"
            />
            {errors.password && (
              <span className="text-red-500 text-[14px] font-normal">{errors.password.message}</span>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#00DF5E] py-3 rounded-lg mt-2 hover:brightness-110 transition disabled:opacity-60"
          >
            {loading ? 'Entrando...' : 'Login now'}
          </button>

          <p className="font-thin text-center">
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
