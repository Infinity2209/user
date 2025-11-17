import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button';

const NotFound = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
            <div className="text-center">
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-gray-300 dark:text-gray-600">404</h1>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Page Not Found
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                        Sorry, the page you are looking for doesn't exist or has been moved.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild className="bg-green-600 hover:bg-green-700">
                        <Link to="/dashboard">
                            <Home className="w-4 h-4 mr-2" />
                            Go to Dashboard
                        </Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link to="#" onClick={() => window.history.back()}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Go Back
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
