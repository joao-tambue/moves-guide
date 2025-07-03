import {useState} from 'react'
import Navbar from '../components/Navbar'
import bgImage from '../assets/image/Rectangle 9.png'
import coverImage from '../assets/image/image 19.png'
import eye from '../assets/icon/eye.svg'
import iconcoracao from '../assets/icon/iconcoracao.svg'


export default function Home() {

  function MovieCard() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [hovered, setHovered] = useState(false)
    const [rating, setRating] = useState(0)

    return (
      <div
        className="relative mt-4 w-[176px] rounded-lg"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setMenuOpen(false) }}
      >
        <img
          src={coverImage}
          alt="image"
          className="w-full h-72 object-cover hover:border-2 hover:rounded border-white border-2 rounded hover:border-[#00DF5E] transition-all"
        />
        {hovered && (
          <button
            className="absolute top-2 right-2 bg-black bg-opacity-60 rounded-full px-2"
            onClick={e => { e.stopPropagation(); setMenuOpen(!menuOpen) }}
          >
            <span className="text-white text-2xl -mt-2">...</span>
          </button>
        )}
        {menuOpen && (
          <div className="absolute top-10 right-2 bg-[#000000] text-[12px] text-white rounded shadow-lg z-10 p-3 flex flex-col gap-2">
            <button className="text-left px-2 py-1 flex items-center gap-2">
              <img src={iconcoracao} alt="icon" />
              Favorito
            </button>
            <button className="text-left px-2 py-1 flex items-center gap-2">
              <img src={eye} alt="icon" />
                Watched
              </button>
            <div className="flex items-center gap-1 justify-center">
              {[1, 2, 3, 4, 5].map(star => (
                <span
                  key={star}
                  className={`cursor-pointer text-[16px] ${star <= rating ? 'text-yellow-400' : 'text-gray-400'}`}
                  onClick={() => setRating(star)}
                  role="button"
                  aria-label={`Marcar ${star} estrela${star > 1 ? 's' : ''}`}
                >
                  ★
                </span>
              ))}
            </div>
             </div>
        )}
        <div className="py-4 text-white">
          <h1 className="font-semibold text-[16px]">Clifford</h1>
          <p className="text-[14px]">12 NOV 2021</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <div style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}>
        <div className='py-10'>
          <h1 className='text-[46px] text-white font-sans font-semibold text-center'>
            Track films you've watched. <br /> Discover millions of movies. <br />
            Explore now.
          </h1>
          <p className='text-center text-white'>FILTER BY:</p>

          <div className='flex flex-col items-center gap-3 justify-center py-3 font-sans font-semibold'>
            <div className='flex items-center gap-3 justify-center font-sans'>
              <button className='px-3 py-2 bg-white rounded hover:bg-[#00DF5E]'>
                Açao
              </button>
              <button className='px-3 py-2 bg-white rounded hover:bg-[#00DF5E]'>
                Aventura
              </button>
              <button className='px-3 py-2 bg-white rounded hover:bg-[#00DF5E]'>
                Animação
              </button>
              <button className='px-3 py-2 bg-white rounded hover:bg-[#00DF5E]'>
                Comédia
              </button>
              <button className='px-3 py-2 bg-white rounded hover:bg-[#00DF5E]'>
                Crime
              </button>
              <button className='px-3 py-2 bg-white rounded hover:bg-[#00DF5E]'>
                Documentário
              </button>
              <button className='px-3 py-2 bg-white rounded hover:bg-[#00DF5E]'>
                Drama
              </button>
              <button className='px-3 py-2 bg-white rounded hover:bg-[#00DF5E]'>
                Família
              </button>
              <button className='px-3 py-2 bg-white rounded hover:bg-[#00DF5E]'>
                Fantasia
              </button>
              <button className='px-3 py-2 bg-white rounded hover:bg-[#00DF5E]'>
                História
              </button>
            </div>
            <div className='flex items-center gap-3 justify-center font-sans'>
              <button className='px-3 py-2 bg-white rounded hover:bg-[#00DF5E]'>
                Terror
              </button>
              <button className='px-3 py-2 bg-white rounded hover:bg-[#00DF5E]'>
                Música
              </button>
              <button className='px-3 py-2 bg-white rounded hover:bg-[#00DF5E]'>
                Mistério
              </button>
              <button className='px-3 py-2 bg-white rounded hover:bg-[#00DF5E]'>
                Romance
              </button>
              <button className='px-3 py-2 bg-white rounded hover:bg-[#00DF5E]'>
                Ficção científica
              </button>
              <button className='px-3 py-2 bg-white rounded hover:bg-[#00DF5E]'>
                Cinema TV
              </button>
              <button className='px-3 py-2 bg-white rounded hover:bg-[#00DF5E]'>
                Thriller
              </button>
              <button className='px-3 py-2 bg-white rounded hover:bg-[#00DF5E]'>
                Guerra
              </button>
              <button className='px-3 py-2 bg-white rounded hover:bg-[#00DF5E]'>
                Faroeste
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className='w-[1150px] mx-auto mt-10'>
        <h1 className='text-[25px] font-sans font-semibold text-[#00DF5E]'>Popular Films This Weeks</h1>
        <MovieCard />
      </div>
    </div>
  )
}