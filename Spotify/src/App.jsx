import { useState } from 'react'
import React from 'react'

function App() {

  return (
    <div className="bg-black w-full h-[65px] flex items-center justify-end gap-8 pr-2">
      <div className='flex items center justify-center gap-3 pr-15'>
        <button className='font-bold text-gray-400 hover:text-white'>Premium</button>
        <button className='font-bold text-gray-400 hover:text-white'>Support</button>
        <button className='font-bold text-gray-400 hover:text-white'>Download</button>
      </div>
      <h1 className='text-gray-400 pr-6'>|</h1>
      <button className="text-gray-400 hover:text-white font-bold text-[10px] pr-4">Install App</button>
      <div className='flex items center justify-center gap-4'>
        <button className="text-gray-400 hover:text-white font-bold text-[10px]">Sign up</button>
        <div className="bg-white rounded-full h-[50px] w-[100px] flex justify-center">
          <button className="text-[10px] font-bold">Log in</button>
        </div>
      </div>
      

    </div>
  )
}

export default App
