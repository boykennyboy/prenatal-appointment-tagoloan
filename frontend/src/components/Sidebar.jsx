import { ChevronLeft, ChevronRight, LogOut, UserRound } from 'lucide-react';
import { NavLink } from 'react-router';
import Logo from '../assets/st-paul-logo.webp';
import Tooltip from './Tooltip';
import { useAuthStore } from '../store/authStore.js';

const Sidebar = ({ toggle, setToggle, mainLinks, user }) => {
  const { logout } = useAuthStore();

  return (
    <aside
      className={`${
        toggle ? 'w-32' : 'w-[280px]'
      } sticky left-0 top-0 h-screen bg-white shadow-lg p-4 hidden sm:flex sm:flex-col transition-all duration-300 ease-in-out z-30`}
    >
      <header className='relative h-20 w-full flex justify-baseline items-center flex-shrink-0'>
        <NavLink to='dashboard' className='flex items-center'>
          <div className='flex-shrink-0'>
            <div className='flex items-center gap-4'>
              <div className='h-20 w-20'>
                <img
                  src={Logo}
                  alt='St. Paul Logo'
                  className='w-full h-full object-cover object-center rounded-full'
                />
              </div>
              <div
                className={`flex flex-col gap-1 text-wrap transition-opacity duration-300 ${
                  toggle ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <span className='text-2xl font-semibold whitespace-nowrap'>
                  St. Paul
                </span>
              </div>
            </div>
          </div>
        </NavLink>
        <button
          className='absolute -right-8 h-10 w-10 bg-white shadow-md shadow-black/25 rounded-full transition-transform duration-300 hover:scale-110 cursor-pointer'
          onClick={() => setToggle((prev) => !prev)}
        >
          <ChevronLeft
            className={`h-8 w-8 mx-auto transition-all 
              ${toggle ? 'hidden' : 'block'}`}
          />
          <ChevronRight
            className={`h-8 w-8 mx-auto transition-all 
              ${toggle ? 'block' : 'hidden'}`}
          />
        </button>
      </header>

      <div className='flex-1 flex flex-col min-h-0 mt-4'>
        {/* Scrollable Navigation Section */}
        <div className='flex-1 overflow-x-hidden overflow-y-hidden hover:overflow-y-auto'>
          <ul className='flex flex-col gap-4 mt-6 pb-4'>
            <li>
              <p className='text-sm font-semibold text-gray-500'>Navigation</p>
            </li>
            {mainLinks
              .filter((link) => link.show)
              .map((link, index) => (
                <li key={index} className='flex items-center'>
                  <Tooltip title={link.name} toggle={toggle}>
                    <NavLink
                      to={link.link}
                      className={({ isActive }) =>
                        `inline-flex items-center gap-3 py-3 px-4 rounded-md transition-all group ${
                          isActive
                            ? 'bg-purple-100 text-purple-950 shadow-md'
                            : 'bg-white hover:bg-purple-100 hover:text-purple-950 hover:shadow'
                        } ${toggle ? 'w-14 justify-center' : 'w-full'}`
                      }
                    >
                      <span className='group-hover:text-purple-950 flex-shrink-0'>
                        {link.icon}
                      </span>

                      <span
                        className={`
                    font-semibold tracking-wide group-hover:text-purple-950
                    transition-all duration-300 text-nowrap ${
                      toggle
                        ? 'opacity-0 w-0 overflow-hidden'
                        : 'opacity-100 whitespace-nowrap'
                    }
                  `}
                      >
                        {link.name}
                      </span>
                    </NavLink>
                  </Tooltip>
                </li>
              ))}
          </ul>
        </div>

        {/* Fixed Bottom Section - User Management and Logout */}
        <div className='flex-shrink-0 mt-4 flex flex-col gap-4 border-t border-gray-400 pt-4'>
          {user.role_id === 1 && (
            <NavLink
              to={'users'}
              className={({ isActive }) =>
                `inline-flex items-center gap-3 py-3 px-4 rounded-md transition-all group relative ${
                  isActive
                    ? 'bg-purple-100 text-purple-950 shadow-md'
                    : 'bg-white hover:bg-purple-100 hover:text-purple-950 hover:shadow'
                } ${toggle ? 'w-14 justify-center' : 'w-full'}`
              }
            >
              <span className='group-hover:text-purple-950 flex-shrink-0'>
                <UserRound />
              </span>

              <span
                className={`
              font-semibold tracking-wide group-hover:text-purple-950
              transition-all duration-300 text-nowrap ${
                toggle
                  ? 'opacity-0 w-0 overflow-hidden'
                  : 'opacity-100 whitespace-nowrap'
              }
            `}
              >
                User Management
              </span>

              {/* Inline tooltip */}
              {toggle && (
                <div className='absolute left-[calc(100%+16px)] top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 z-[60]'>
                  <div className='bg-purple-500 text-white text-sm px-3 py-2 rounded-md whitespace-nowrap shadow-lg'>
                    User Management
                    <div className='absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-purple-500' />
                  </div>
                </div>
              )}
            </NavLink>
          )}

          <button
            onClick={logout}
            className={`group inline-flex gap-3 text-white cursor-pointer bg-red-500 shadow py-3 px-4 rounded-md hover:bg-red-600 transition-all relative ${
              toggle ? 'w-14 justify-center' : 'w-full'
            }`}
          >
            <span className='flex-shrink-0'>
              <LogOut />
            </span>
            <span
              className={`
                transition-all duration-300 ${
                  toggle
                    ? 'opacity-0 w-0 overflow-hidden'
                    : 'opacity-100 whitespace-nowrap'
                }
              `}
            >
              Logout
            </span>

            {/* Inline tooltip */}
            {toggle && (
              <div className='absolute left-[calc(100%+16px)] top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 z-[60]'>
                <div className='bg-red-500 text-white text-sm px-3 py-2 rounded-md whitespace-nowrap shadow-lg'>
                  Logout
                  <div className='absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-red-500' />
                </div>
              </div>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
