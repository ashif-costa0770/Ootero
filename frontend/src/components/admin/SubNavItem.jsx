import React from 'react'

const SubNavItem = ({ icon, label, active, onClick }) => {
  return (
    <button onClick={onClick}
    className={`my-2 cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg mx-2
                text-sm transition-all
      ${active
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/7'}`}
    style={{ width: 'calc(100% - 16px)' }}
  >
    {icon}
    {label}
  </button>
  )
}

export default SubNavItem