import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { BarChart3, Users, Package, TrendingUp, Activity } from 'lucide-react';

const Dashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const { t } = useTranslation();

    // Mock data - in a real app, this would come from API
    const users = Array(156).fill(null);
    const products = Array(234).fill(null);

    const stats = [
        {
            title: t('Total Users'),
            value: users?.length || 0,
            change: '+12.5%',
            trend: 'up',
            icon: Users,
            color: 'from-green-500 to-green-600',
            show: user?.role === 'admin',
        },
        {
            title: t('Products'),
            value: products?.length || 0,
            change: '+8.2%',
            trend: 'up',
            icon: Package,
            color: 'from-purple-500 to-purple-600',
            show: true,
        },
        {
            title: t('Revenue'),
            value: '$45,231',
            change: '+23.1%',
            trend: 'up',
            icon: TrendingUp,
            color: 'from-green-500 to-green-600',
            show: true,
        },
        {
            title: t('Active Orders'),
            value: '89',
            change: '+5.4%',
            trend: 'up',
            icon: Activity,
            color: 'from-orange-500 to-orange-600',
            show: true,
        },
    ];

    const recentActivity = [
        { action: 'New user registered', user: 'John Doe', time: '2 minutes ago' },
        { action: 'Product updated', user: 'Admin', time: '15 minutes ago' },
        { action: 'Order completed', user: 'Jane Smith', time: '1 hour ago' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-3 sm:p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header - Responsive text sizes */}
                <div className="mb-4 sm:mb-6 md:mb-8">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        {t('Dashboard')}
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                        {t('Welcome')}, {user?.name}! Here's what's happening today.
                    </p>
                </div>

                {/* Stats Grid - Responsive columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
                    {stats.filter(stat => stat.show).map((stat, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                                        {stat.title}
                                    </p>
                                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1">
                                        {stat.value}
                                    </p>
                                    <p className={`text-xs sm:text-sm font-medium mt-1 sm:mt-2 ${stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                        }`}>
                                        {stat.change}
                                        <span className="hidden sm:inline"> from last month</span>
                                    </p>
                                </div>
                                <div className={`p-2 sm:p-3 rounded-full bg-gradient-to-r ${stat.color} flex-shrink-0 ml-2`}>
                                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Activity - Responsive padding and spacing */}
                <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 mb-4 sm:mb-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                        {t('Recent Activity')}
                    </h3>
                    <div className="space-y-2 sm:space-y-3 md:space-y-4">
                        {recentActivity.map((activity, index) => (
                            <div
                                key={index}
                                className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg sm:rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                            >
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-1 sm:mt-2 flex-shrink-0"></div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {activity.action}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {activity.user} • {activity.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions - Responsive grid */}
                <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                        {t('Quick Actions')}
                    </h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                        {['Add Product', 'View Reports', 'Manage Users', 'Settings'].map((action, index) => (
                            <button
                                key={index}
                                className="p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300 font-medium"
                            >
                                {t(action)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;