import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, Menu, X } from 'lucide-react';

function NavLink({ to, children }) {
  return (
    <Link to={to} className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-blue-600 hover:border-blue-300 hover:text-blue-800">
      {children}
    </Link>
  );
}

function MobileNavLink({ to, children }) {
  return (
    <Link to={to} className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-blue-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-800">
      {children}
    </Link>
  );
}




export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Wallet className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-blue-900">Truewallet</span>
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/send">Send Money</NavLink>
            <NavLink to="/signin">Sign In</NavLink>
            <NavLink to="/signup">Sign Up</NavLink>
          </div>
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-blue-600 hover:text-blue-800 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <MobileNavLink to="/dashboard">Dashboard</MobileNavLink>
            <MobileNavLink to="/send">Send Money</MobileNavLink>
            <MobileNavLink to="/signin">Sign In</MobileNavLink>
            <MobileNavLink to="/signup">Sign Up</MobileNavLink> 
          </div>
        </div>
      )}
    </nav>
  );
}