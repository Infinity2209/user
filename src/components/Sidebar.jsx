import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Package, Settings, Sparkles, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen, isMobile, setIsMobile }) => {
    const { user } = useSelector((state) => state.auth);
    const { t } = useTranslation();

    const navigation = [
        { name: t('Dashboard'), href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'user'] },
        { name: t('Users'), href: '/users', icon: Users, roles: ['admin'] },
        { name: t('Products'), href: '/products', icon: Package, roles: ['admin', 'user'] },
        { name: t('Settings'), href: '/settings', icon: Settings, roles: ['admin'] },
    ];

    const filteredNavigation = navigation.filter(item =>
        item.roles.includes(user?.role)
    );

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const toggleMobileMenu = () => {
        setIsMobile(!isMobile);
    };

    return (
        <>
            {/* Mobile Overlay - CRITICAL: Only show when isMobile is TRUE */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300 ${isMobile ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsMobile(false)}
            />

            {/* Sidebar */}
            <aside
                className={`
                    fixed left-0 top-0 h-full shadow-2xl z-50 bg-gray-50 dark:bg-gradient-to-b dark:from-purple-900 dark:via-purple-800 dark:to-green-900 transition-all duration-300 overflow-hidden
                    ${isMobile ? 'translate-x-0 w-64' : '-translate-x-full w-0'}
                    lg:translate-x-0 
                    ${isOpen ? 'lg:w-64' : 'lg:w-16'}
                `}
            >
                {/* Decorative overlay */}
                <div className="absolute inset-0 bg-black opacity-20 pointer-events-none"></div>

                {/* Content */}
                <div className="relative flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between h-20 px-4 border-b border-gray-200 dark:border-purple-600/30 backdrop-blur-sm">
                        {/* Show title on mobile OR when desktop sidebar is open */}
                        {(isMobile || isOpen) && (
                            <div className="flex items-center space-x-2">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-purple-500 flex items-center justify-center shadow-lg">
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-wide">
                                    Admin Panel
                                </h2>
                            </div>
                        )}

                        {/* Desktop Toggle - Hidden on mobile */}
                        <button
                            onClick={toggleSidebar}
                            className="hidden lg:block p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                        </button>

                        {/* Mobile Close Button */}
                        <button
                            onClick={() => setIsMobile(false)}
                            className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* User Badge - Show on mobile OR when desktop sidebar is open */}
                    {(isMobile || isOpen) && (
                        <div className="px-4 py-4">
                            <div className="bg-gray-50 dark:bg-white/10 backdrop-blur-md rounded-xl p-3 border border-gray-200 dark:border-white/20">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-green-400 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                        {user?.name?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                            {user?.name || 'User'}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-purple-200 capitalize">
                                            {user?.role || 'Member'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
                    <nav className={`flex-1 py-4 space-y-2 ${(isMobile || isOpen) ? 'px-4' : 'px-2'}`}>
                        {filteredNavigation.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.href}
                                onClick={() => isMobile && setIsMobile(false)}
                                className={({ isActive }) =>
                                    `group relative flex items-center ${(isMobile || isOpen) ? 'px-4' : 'px-2 justify-center'} py-3.5 text-sm font-medium rounded-xl transition-all duration-200 ${isActive
                                        ? 'bg-green-600 text-white shadow-lg shadow-green-500/30 scale-105 dark:bg-purple-700 dark:shadow-purple-500/30'
                                        : 'text-gray-700 dark:text-purple-100 hover:bg-gray-200 hover:shadow-lg hover:scale-105 dark:hover:bg-purple-600 dark:hover:shadow-purple-500/30 hover:translate-x-1'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <div className={`p-2 rounded-lg ${(isMobile || isOpen) ? 'mr-3' : ''} transition-all duration-200 ${isActive
                                            ? 'bg-white/20'
                                            : 'bg-gray-200 dark:bg-white/5 group-hover:bg-gray-300 dark:group-hover:bg-white/10'
                                            }`}>
                                            <item.icon className="w-5 h-5" />
                                        </div>

                                        {/* Show text on mobile OR when desktop sidebar is open */}
                                        {(isMobile || isOpen) ? (
                                            <>
                                                <span className="flex-1">{item.name}</span>
                                                {isActive && (
                                                    <div className="w-2 h-2 rounded-full bg-white shadow-lg animate-pulse"></div>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                {/* Tooltip for collapsed desktop view - Hidden on mobile with lg:block */}
                                                <span className="hidden lg:block absolute left-full ml-4 px-3 py-2 bg-gray-800 dark:bg-gray-700 text-white text-sm rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap pointer-events-none z-[60]">
                                                    {item.name}
                                                </span>
                                                {isActive && (
                                                    <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-lg animate-pulse"></div>
                                                )}
                                            </>
                                        )}
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* Glow effects */}
                <div className="absolute top-1/4 -right-20 w-40 h-40 bg-green-500/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-1/4 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
            </aside>
        </>
    );
};

export default Sidebar; 