import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logotipo.svg';
import { api } from '../services/api';
import { toast } from 'react-toastify';
import { LogOut } from 'lucide-react';

type User = {
  name: string;
  email: string;
  image?: string;
};

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    api
      .get('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // Se houver imagem salva no localStorage, usa ela
        const localImage = localStorage.getItem('profileImage');
        if (localImage) {
          setUser({ ...res.data, image: localImage });
        } else {
          setUser(res.data);
          // Se o backend retornar imagem, salva no localStorage
          if (res.data.image) {
            localStorage.setItem('profileImage', res.data.image);
          }
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
        setUser(null);
      });
  }, []);

  function getInitials(name: string) {
    const [first, second] = name.trim().split(' ');
    if (second) return `${first[0]}${second[0]}`.toUpperCase();
    return first[0].toUpperCase();
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('profileImage'); // Remove imagem ao deslogar
    setUser(null);
    toast.info("Logout feito com sucesso!", { position: 'top-right' });
    navigate('/login');
  }

  return (
    <nav className='bg-[#171717] z-20 fixed bg-opacity-95 w-full'>
      <div className='flex justify-between p-4 w-[1180px] mx-auto'>
        <img src={logo} alt='logotipo' />
        <ul className='text-[#00DF5E] font-semibold flex gap-4 font-sans text-[18px] items-center'>
          <li><Link to={'/'}>Movies</Link></li>
          <li><Link to={'/atores'}>People</Link></li>
          <li><Link to={'/perfil'}>Profile</Link></li>
        </ul>

        {user ? (
          <div className='flex gap-4 items-center text-white'>
            {user.image ? (
              <img
                src={user.image}
                alt='avatar'
                className='h-10 w-10 rounded-full object-cover object-center border-2 border-[#00DF5E] bg-slate-700 shadow-md'
                style={{ minWidth: 40, minHeight: 40 }}
              />
            ) : (
              <h1 className='bg-slate-600 h-10 w-10 flex items-center justify-center rounded-full font-bold text-[18px]'>
                {getInitials(user.name)}
              </h1>
            )}
            <div className="flex gap-4">
                <div className='flex flex-col'>
                    <h1 className='text-[16px]'>{user.name}</h1>
                    <p className='text-[12px]'>{user.email}</p>
                </div>
              <button
                onClick={handleLogout}
                className='text-red-500 text-[13px] mt-1 hover:text-red-400'
              >
                <LogOut className='text-red-500' />
              </button>
            </div>
          </div>
        ) : (
          <div className='flex items-center gap-4 text-white'>
            <button onClick={() => navigate('/login')}>Entrar</button>
            <button className='flex px-8 py-2 rounded-md font-sans font-semibold bg-[#00DF5E] hover:bg-[#2db968d2]'>
              <Link to={'/login'}>Login</Link>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
