import logo from '../assets/logotipo.svg'


const Navbar = () => {

    return (
        <nav className='bg-[#171717]'>
            <div className='flex justify-between p-4 w-[1180px] mx-auto'>
                <img src={logo} alt="logotipo" />
                <div className='flex items-center gap-4'>
                    <ul className='text-[#00DF5E] font-semibold flex gap-4 font-sans text-[18px]'>
                        <li><a href="">Movies</a></li>
                        <li><a href="">People</a></li>
                        <li><a href="">Profile</a></li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar