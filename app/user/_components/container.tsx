import React from 'react'

interface ContainerProps{
  children:React.ReactNode;
  className?:string
}

export default function Container ({children,className=""}:ContainerProps){
return (
  <div className={` bg-gray-200 mx-auto w-screen box-content  mt-16
    flex justify-center items-center xl:w-[1280px] ${className}`}>{children}</div>
)
}