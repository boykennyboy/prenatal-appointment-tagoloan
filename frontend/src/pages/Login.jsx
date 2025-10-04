import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router';
import InputGroup from '../components/ui/InputGroup.jsx';
import Logo from '../assets/st-paul-logo.webp';
import { useAuthStore } from '../store/authStore.js';
import useErrorStore from '../store/errorStore.js';
import Title from '../components/Title';

export default function LoginPage() {
  const { login } = useAuthStore();
  const { error, setError } = useErrorStore();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      await login(formData, navigate, setError);
    } catch (error) {
      console.log('Something went wrong: ', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen flex'>
      <Title title={'Login'} />
      {/* Left Side - Welcome Section */}
      <div className='hidden sm:block flex-2 relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500'>
        {/* Animated Background Elements */}
        <div className='absolute inset-0'>
          {/* Floating Geometric Shapes */}
          <div className='absolute top-20 left-16 w-30 h-30 bg-white rounded-full flex justify-center items-center'>
            <img
              src={Logo}
              alt='St. Paul Logo'
              className='w-28 h-28 object-cover object-center bg-white rounded-full z-10'
            />
          </div>
          <div className='absolute top-32 right-20 w-16 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-70 transform rotate-45'></div>
          <div className='absolute bottom-30 left-28 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg opacity-50 transform rotate-12'></div>
          <div className='absolute bottom-32 right-16 w-12 h-24 bg-gradient-to-r from-pink-400 to-red-400 rounded-full opacity-60 transform -rotate-12'></div>
          <div className='absolute top-1/2 left-1/4 w-8 h-16 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-80 transform rotate-45'></div>
          <div className='absolute top-1/3 right-1/3 w-14 h-14 bg-gradient-to-r from-green-400 to-cyan-400 rounded-lg opacity-70 transform -rotate-45'></div>
        </div>

        {/* Welcome Content */}
        <div className='relative z-10 flex flex-col justify-center h-full px-16'>
          <h1 className='text-5xl max-w-2xl font-bold text-white mb-6 leading-tight'>
            Welcome to St. Paul Prenatal 
          </h1>
          <p className='text-white/90 text-lg leading-relaxed max-w-xl'>
            Here, you can book and keep track of prenatal records without the
            stress. We’re here to make the journey smoother for you and your
            family wishing you a safe, healthy, and happy experience ahead. Good
            luck, you’ve got this!
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className='flex-1 bg-white flex items-center justify-center px-8'>
        <div className='w-full max-w-md'>
          {/* Header */}
          <div className='text-center mb-8'>
            <div className='w-20 h-20 mx-auto mb-5'>
              {/* <img
                src={Logo}
                alt='St. Paul Logo'
                className='w-full h-full object-cover object-center'
              /> */}
              <UserRound className='h-full w-full text-gray-600' />
            </div>
            <h2 className='text-2xl font-semibold text-gray-700 mb-2'>
              USER LOGIN
            </h2>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <div className='space-y-6 sm:w-auto'>
              {/* Email Input */}
              <InputGroup
                type='email'
                name='email'
                value={formData.email}
                onChange={handleInputChange}
                placeholder='Email'
                icon={<Mail className='h-5 w-5 text-gray-400' />}
                id={'email'}
              />
              {error.email && <p className='error -mt-4'>{error.email[0]}</p>}
              {/* Password Input */}
              <InputGroup
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                name='password'
                onChange={handleInputChange}
                placeholder='Password'
                icon={<Lock className='h-5 w-5 text-gray-400' />}
                id={'password'}
              >
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute inset-y-0 right-0 pr-3 flex items-center'
                >
                  {showPassword ? (
                    <EyeOff className='h-5 w-5 text-gray-400 hover:text-gray-600' />
                  ) : (
                    <Eye className='h-5 w-5 text-gray-400 hover:text-gray-600' />
                  )}
                </button>
              </InputGroup>
              {error.password && (
                <p className='error -mt-4'>{error.password[0]}</p>
              )}

              {/* Remember Me */}
              {/* <div className='flex items-center justify-between text-sm'>
                <label className='flex items-center'>
                  <input
                    type='checkbox'
                    className='w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500'
                  />
                  <span className='ml-2 text-gray-600'>Remember me</span>
                </label>
              </div> */}

              {/* Login Button */}
              <button
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r text-white py-3 rounded-lg font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg 
                ${
                  isSubmitting
                    ? 'from-purple-300 to-pink-300 cursor-not-allowed'
                    : 'from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                }`}
              >
                {isSubmitting ? 'Signing In ...' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
