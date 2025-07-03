import Navbar from "../components/Navbar";
import perfil from '../assets/image/Joao.jpg'
import bgPerfil from '../assets/image/Rectangle 10.png'

// src/pages/Home.tsx
export default function Profile() {
  return (
    <div>
      <Navbar />
      <div className="text-white"style={{
              backgroundImage: `url(${bgPerfil})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}>

        <div className="w-[1150px] mx-auto py-20 flex items-center justify-between">

          <div className="flex items-center gap-6">
            <div className="w-[162px] h[162px]">
              <img src={perfil} alt="perfil" className="rounded-full" />
            </div>

            <div className="flex flex-col gap-3">
              <h1 className="font-bold font-sans text-[28px]">João Tambue</h1>
              <p className="text-[14px] font-sans">
                Front-End Developer | INFJ-T <br />
                não tenho nada a oferecer
              </p>
            </div>
          </div>

          <div className="font-sans flex items-center gap-10">
            <div className="flex flex-col items-center">
              <h1 className="text-[24px] font-bold font-sans">534</h1>
              <p>Ja vi</p>
            </div>
            <div className="flex flex-col items-center">
              <h1 className="text-[24px] font-bold font-sans">27</h1>
              <p>Neste Ano</p>
            </div>
            <div className="flex flex-col items-center">
              <h1 className="text-[24px] font-bold font-sans">7</h1>
              <p>Favoritos</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
