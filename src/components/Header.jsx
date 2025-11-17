import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Moon, Sun, LogOut, User, Menu } from 'lucide-react';
import { logout } from '../store/slices/authSlice';

const Header = ({ onMenuClick }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { t, i18n } = useTranslation();

    const handleLogout = () => {
        dispatch(logout());
    };

    const toggleLanguage = () => {
        i18n.changeLanguage(i18n.language === 'en' ? 'es' : 'en');
    };

    const toggleTheme = () => {
        document.documentElement.classList.toggle('dark');
    };

    return (
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={onMenuClick}
                            className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <h1 className="text-xl font-semibold text-gray-900 dark:text-white hidden lg:block">
                            {t('Welcome')}, {user?.name || user?.email}
                        </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={toggleLanguage}
                            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            {i18n.language === 'en' ? 'ES' : 'EN'}
                        </button>
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <Sun className="w-5 h-5 hidden dark:block" />
                            <Moon className="w-5 h-5 dark:hidden" />
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm font-medium">{t('Logout')}</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
