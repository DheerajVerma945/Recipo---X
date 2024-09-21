import React from 'react'
import image from "../../../public/files/RecipoX(Logo).png"
import { useNavigate } from 'react-router-dom'

function Logo() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/");
    window.scrollTo({top:0});
  }
  return (
    <div className="flex flex-row justify-center items-center ml-5 m-3">

      <img src={image} alt="RecipoX Logo" className='h-10 md:h-14 lg:h-18 dp object-cover cursor-pointer' onClick={handleClick} />
      <h1 onClick={handleClick} className='inline whitespace-nowrap m-3 text-xl font-bold md:text-2xl lg:text-4xl cursor-pointer'>Recipo X</h1>
    </div>
  )
}

export default Logo
