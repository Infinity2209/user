import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles } from 'lucide-react';
import { login } from '../store/slices/authSlice';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        setTimeout(() => {
            if (
                (credentials.email === 'admin@company.com' && credentials.password === 'admin123') ||
                (credentials.email === 'user@company.com' && credentials.password === 'user123')
            ) {
                const user = credentials.email === 'admin@company.com'
                    ? { email: credentials.email, role: 'admin', name: 'Admin User' }
                    : { email: credentials.email, role: 'user', name: 'Regular User' };
                dispatch(login({ user, token: 'fake-token' }));
                navigate('/dashboard');
            } else {
                setError('Invalid credentials. Please try again.');
            }
            setIsLoading(false);
        }, 1000);
    };

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
        setError('');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-purple-50 to-emerald-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Animated background elements - Responsive sizes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-green-300 dark:bg-green-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute top-20 sm:top-40 left-20 sm:left-40 w-40 h-40 sm:w-80 sm:h-80 bg-emerald-300 dark:bg-emerald-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            {/* Main Container - Responsive width and spacing */}
            <div className="max-w-md w-full space-y-6 sm:space-y-8 relative z-10">
                {/* Header - Responsive text sizes */}
                <div className="text-center">
                    <div className="flex justify-center mb-3 sm:mb-4">
                        <div className="flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-2xl shadow-lg">
                            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 dark:text-green-400" />
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                                {t('Login')}
                            </h2>
                        </div>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Sign in to your account
                    </p>
                </div>

                {/* Form Card - Responsive padding */}
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50">
                    <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4 sm:space-y-5">
                            {/* Email Input */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2"
                                >
                                    {t('Email')}
                                </label>
                                <div className="relative">
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="pl-9 sm:pl-10 text-sm sm:text-base h-10 sm:h-11 bg-white dark:bg-gray-700"
                                        placeholder="admin@company.com"
                                        value={credentials.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                {/* Credentials hint - Collapsible on mobile */}
                                <p className="mt-1 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                                    <span className="hidden sm:inline">Try: admin@company.com or user@company.com</span>
                                    <span className="sm:hidden">Try: admin@company.com</span>
                                </p>
                            </div>

                            {/* Password Input */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2"
                                >
                                    {t('Password')}
                                </label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        required
                                        className="pl-9 sm:pl-10 pr-9 sm:pr-10 text-sm sm:text-base h-10 sm:h-11 bg-white dark:bg-gray-700"
                                        placeholder="••••••••"
                                        value={credentials.password}
                                        onChange={handleChange}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ?
                                            <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> :
                                            <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                                        }
                                    </button>
                                </div>
                                {/* Password hint */}
                                <p className="mt-1 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                                    <span className="hidden sm:inline">Password: admin123 or user123</span>
                                    <span className="sm:hidden">Password: admin123</span>
                                </p>
                            </div>
                        </div>

                        {/* Error Message - Responsive text */}
                        {error && (
                            <div className="text-red-600 text-xs sm:text-sm text-center bg-red-50 dark:bg-red-900/20 p-2 sm:p-3 rounded-lg border border-red-200 dark:border-red-800">
                                {error}
                            </div>
                        )}

                        {/* Submit Button - Responsive sizing */}
                        <div>
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-green-500 to-purple-600 hover:from-green-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-white font-bold h-10 sm:h-12 text-sm sm:text-base"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span className="text-sm sm:text-base">Signing in...</span>
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center">
                                        <LogIn className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-white font-bold" />
                                        <span>{t('Sign In')}</span>
                                    </span>
                                )}
                            </Button>
                        </div>

                        {/* Footer Links - Responsive layout */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 text-xs sm:text-sm pt-2">
                            <button
                                type="button"
                                className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium transition-colors"
                            >
                                {t('Forgot password?')}
                            </button>
                            <button
                                type="button"
                                className="text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                            >
                                {t('Need help?')}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Bottom Sign Up Link - Responsive text */}
                <p className="text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400 px-4">
                    {t("Don't have an account?")}{' '}
                    <button
                        type="button"
                        className="font-semibold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
                    >
                        {t('Sign up now')}
                    </button>
                </p>
            </div>

            {/* Add custom animation styles */}
            <style jsx>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
};

export default Login;