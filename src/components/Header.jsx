import React, { useState, useRef, useEffect } from 'react';
import { History, Menu ,Plus} from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = ({ title, subtitle }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <header className="fixed top-0 left-0 z-20 w-full flex flex-col bg-white  shadow-sm border-2 border-blue-200  border-b-gray-300 rounded-t-3xl   ">
      <div className="  lg:-ml-20 flex items-center justify-start sm:justify-center  sm:px-4 lg:px-8  flex space-x-2   lg:space-x-12 ml-6 ">
        <div className="  rounded-xl p-0 w-24 h-16 sm:w-20 sm:h-20  -mt-2 sm:-mt-4 -ml-2 ">
          <img
            src="/SehaLogo.png"
            alt="Logo"
            className="w-14 sm:w-20 sm:h-20 object-contain "
          />
        </div>

        <div className=" flex items-center justify-center flex-col text-center mt-9 mb-3 sm:mt-12 sm:mb-0">
          <h1 className="text-xl text-dark-blue md:text-2xl lg:text-4xl font-philosopher  ">
            {title || "SHEKH TAHNOON BIN MOHAMMED MEDICAL CITY"}
          </h1>
          <p className="text-sm md:text-lg font-din font-bold text-turquoise mt-2">
            {subtitle || "Room Tracker System"}
          </p>
        </div>
        {/* Mobile hamburger button */}

        <button
          ref={buttonRef}
          className="sm:hidden p-0 rounded-lg text-dark-gray-70 hover:bg-gray-100 -mt-5 ml-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu className="w-8 h-9" />
        </button>

      </div>

      <div className="flex items-center justify-start sm:justify-end ">

        {/* Desktop History link */}
        <div className="hidden sm:flex items-center justify-end space-x-5 mr-8 mb-1 mt-3">
          <Link
            to="/history"
            className="flex items-center space-x-2 px-4 py-1 text-blue border-2  rounded-lg hover:bg-gray-200 transition-colors"
          >
            <History className="w-5 h-5" />
            <span className="font-din font-light">History</span>
          </Link>
          <Link
            to="/add-ward-room"
            className="flex items-center space-x-2 px-4 py-1 text-blue border-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="font-din font-light">Add New</span>
          </Link>
        </div>



      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div ref={menuRef} className="sm:hidden flex flex-col items-start px-1 pb-1 bg-blue-50 border-b-2  border-t-2 border-blue-200">
          <Link
            to="/history"
            onClick={() => setMenuOpen(false)}
            className="flex items-center w-full py-1 px-3 space-x-3 text-dark-gray-70 border-2 border-yellow-50 rounded-2xl  hover:bg-pink-200 transition-colors"
          >
            <History className="w-3 h-3" />
            <span className="font-din font-light">History</span>
          </Link>
          <Link
            to="/add-ward-room"
            onClick={() => setMenuOpen(false)}
            className="flex items-center w-full py-1 px-3 space-x-3 text-dark-gray-70 border-2 border-yellow-50  rounded-2xl  hover:bg-pink-200 transition-colors"
          >
            <Plus className="w-3 h-3" />
            <span className="font-din font-light">Add New</span>
          </Link>

        </div>
      )}



    </header>
  );
};
export default Header;