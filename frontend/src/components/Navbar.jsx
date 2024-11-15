import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Wallet, Menu, X, User, ChevronDown, LogOut } from "lucide-react";
import AuthContext from "../context/AuthContext";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-blue-600 hover:border-blue-300 hover:text-blue-800"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ to, children }) {
  return (
    <Link
      to={to}
      className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-blue-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-800"
    >
      {children}
    </Link>
  );
}

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Wallet className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-blue-900">
                Truewallet
              </span>
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <NavLink to="/">Home</NavLink>
            {user ? (
              <>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/analytics">Analytics</NavLink>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2 hover:bg-blue-50"
                    >
                      <User className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium">
                        Hello, {user.firstname}!
                      </span>
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 mt-2 p-2 bg-white rounded-lg shadow-lg border border-gray-200">
                    <DropdownMenuLabel className="px-2 py-1.5 text-sm font-semibold text-gray-500">
                      My Account
                    </DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-2 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md cursor-pointer"
                      >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <button
                        onClick={() => {
                          logout();
                          navigate("/signin");
                        }}
                        className="flex items-center space-x-2 w-full px-2 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md cursor-pointer"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <NavLink to="/signin">Sign In</NavLink>
                <NavLink to="/signup">Sign Up</NavLink>
              </>
            )}
          </div>
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-blue-600 hover:text-blue-800 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <MobileNavLink to="/dashboard">Dashboard</MobileNavLink>
            <MobileNavLink to="/analytics">Analytics</MobileNavLink>
            {user ? (
              <>
                <span className="block pl-3 pr-4 py-2 text-base font-medium text-blue-600">
                  Hello, {user.firstname}
                </span>
                <button
                  onClick={() => {
                    logout();
                    navigate("/signin");
                  }}
                  className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-blue-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <MobileNavLink to="/signin">Sign In</MobileNavLink>
                <MobileNavLink to="/signup">Sign Up</MobileNavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
