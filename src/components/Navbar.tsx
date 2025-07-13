import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logotipo.svg';
import { api } from '../services/api';
import { toast } from 'react-toastify';
import { LogOut, Menu, X } from 'lucide-react';

type User = {
  name: string;
  email: string;
  image?: string;
};

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    api.get('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      const localImage = localStorage.getItem('profileImage');
      if (localImage) {
        setUser({ ...res.data, image: localImage });
      } else {
        setUser(res.data);
        if (res.data.image) localStorage.setItem('profileImage', res.data.image);
      }
    })
    .catch(() => {
      localStorage.removeItem('token');
      setUser(null);
    });
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          if (currentScrollY > lastScrollY && currentScrollY > 40) {
            setShowNavbar(false);
          } else {
            setShowNavbar(true);
          }
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  function getInitials(name: string): string {
    const [first, second] = name.trim().split(' ');
    return second ? `${first[0]}${second[0]}`.toUpperCase() : first[0].toUpperCase();
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('profileImage');
    setUser(null);
    toast.info("Logout feito com sucesso!", { position: 'top-right' });
    navigate('/');
  }

  return (
    <nav className={`fixed top-0 z-50 w-full transition-transform duration-500 ${showNavbar ? 'translate-y-0' : '-translate-y-full'} bg-[#171717] bg-opacity-40`}>      
      <div className="flex items-center justify-between p-4 px-6 md:px-12 max-w-screen-xl mx-auto">
        <img src={logo} alt='logo' className="h-8 md:h-10" />

        <ul className="hidden md:flex text-[#00DF5E] font-semibold gap-6 text-[16px] items-center">
          <li><Link to={'/home'}>Movies</Link></li>
          <li><Link to={'/atores'}>People</Link></li>
          <li><Link to={'/perfil'}>Profile</Link></li>
        </ul>

        <div className="flex items-center gap-3 md:hidden">
          {user && (
            user.image ? (
              <img
                src={user.image}
                alt='avatar'
                className='h-10 w-10 rounded-full object-cover border-2 border-[#00DF5E] bg-slate-700 shadow-md'
              />
            ) : (
              <h1 className='bg-slate-600 h-10 w-10 flex items-center justify-center rounded-full font-bold text-[18px] text-white'>
                {getInitials(user.name)}
              </h1>
            )
          )}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <Menu className="text-[#00DF5E]" />
          </button>
        </div>

        {user === null ? (
          <div className="hidden md:flex gap-4 items-center text-white animate-pulse">
            <div className="bg-slate-700 h-10 w-10 rounded-full border-2 border-[#00DF5E]" />
            <div className="flex gap-4">
              <div className="flex flex-col gap-1">
                <div className="bg-slate-700 h-4 w-24 rounded" />
                <div className="bg-slate-700 h-3 w-32 rounded" />
              </div>
              <div className="bg-slate-700 h-6 w-6 rounded" />
            </div>
          </div>
        ) : (
          <div className='hidden md:flex items-center gap-4 text-white'>
            {user.image ? (
              <img
                src={user.image}
                alt='avatar'
                className='h-10 w-10 rounded-full object-cover border-2 border-[#00DF5E] bg-slate-700 shadow-md'
              />
            ) : (
              <h1 className='bg-slate-600 h-10 w-10 flex items-center justify-center rounded-full font-bold text-[18px]'>
                {getInitials(user.name)}
              </h1>
            )}
            <div className="flex flex-col">
              <h1 className='text-[16px]'>{user.name}</h1>
              <p className='text-[12px]'>{user.email}</p>
            </div>
            <button onClick={handleLogout} className='text-red-500 hover:text-red-400'>
              <LogOut className='h-5 w-5' />
            </button>
          </div>
        )}
      </div>

      {isMobileMenuOpen && (
      <div className="md:hidden fixed top-0 left-0 w-2/3 h-screen bg-black p-6 z-50 flex flex-col justify-between">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center mb-4">
            <img src={logo} alt="logo" className="h-10" />
            <button onClick={() => setIsMobileMenuOpen(false)}>
              <X className="text-white w-6 h-6" />
            </button>
          </div>

          <Link to="/home" className="text-[#00DF5E] text-lg">Movies</Link>
          <Link to="/atores" className="text-[#00DF5E] text-lg">People</Link>
          <Link to="/perfil" className="text-[#00DF5E] text-lg">Profile</Link>
        </div>

        {user && (
          <div className="flex items-center gap-3 text-white mt-auto pt-6 border-t border-gray-700">
            {user.image ? (
              <img src={user.image} className="w-10 h-10 rounded-full" alt='user' />
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center font-bold">
                {getInitials(user.name)}
              </div>
            )}
            <button onClick={handleLogout} className="text-red-500">Logout</button>
          </div>
        )}
      </div>
    )}
    </nav>
  );
};

export default Navbar;