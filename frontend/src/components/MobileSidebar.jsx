import { LogOut, UserRound, X } from 'lucide-react';
import { NavLink } from 'react-router';
import Logo from '../assets/st-paul-logo.webp';
import { useAuthStore } from '../store/AuthStore.js';

const MobileSidebar = ({ isOpen, setIsOpen, mainLinks, user }) => {
  const { logout } = useAuthStore();

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 sm:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className='flex flex-col h-full p-4'>
          {/* Header */}
          <header className='flex items-center justify-between mb-6'>
            <NavLink
              to='dashboard'
              className='flex items-center'
              onClick={handleLinkClick}
            >
              <div className='flex items-center gap-3'>
                <div className='h-12 w-12'>
                  <img
                    src={Logo}
                    alt='St. Paul Logo'
                    className='w-full h-full object-cover object-center rounded-full'
                  />
                </div>
                <span className='text-xl font-semibold'>St. Paul</span>
              </div>
            </NavLink>
            <button
              onClick={() => setIsOpen(false)}
              className='p-2 rounded-lg hover:bg-gray-100 transition-colors'
            >
              <X className='h-6 w-6' />
            </button>
          </header>

          {/* Navigation */}
          <div className='flex-1 flex flex-col min-h-0'>
            <div className='flex-1 overflow-y-auto'>
              <div className='space-y-2'>
                <p className='text-sm font-semibold text-gray-500 px-2 mb-4'>
                  Navigation
                </p>
                {mainLinks
                  .filter((link) => link.show)
                  .map((link, index) => (
                    <NavLink
                      key={index}
                      to={link.link}
                      onClick={handleLinkClick}
                      className={({ isActive }) =>
                        `flex items-center gap-3 py-3 px-4 rounded-lg transition-all ${
                          isActive
                            ? 'bg-purple-100 text-purple-950 font-semibold'
                            : 'text-gray-700 hover:bg-purple-50 hover:text-purple-950'
                        }`
                      }
                    >
                      <span>{link.icon}</span>
                      <span className='font-medium'>{link.name}</span>
                    </NavLink>
                  ))}
              </div>
            </div>

            {/* Fixed Bottom Section */}
            <div className='border-t border-gray-400 pt-4 mt-4 space-y-2'>
              {user && user.role_did !== 2 && (
                <NavLink
                  to='users'
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    `flex items-center gap-3 py-3 px-4 rounded-lg transition-all ${
                      isActive
                        ? 'bg-purple-100 text-purple-950 font-semibold'
                        : 'text-gray-700 hover:bg-purple-50 hover:text-purple-950'
                    }`
                  }
                >
                  <UserRound className='h-5 w-5' />
                  <span className='font-medium'>User Management</span>
                </NavLink>
              )}

              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className='w-full flex items-center gap-3 py-3 px-4 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors'
              >
                <LogOut className='h-5 w-5' />
                <span className='font-medium'>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default MobileSidebar;
