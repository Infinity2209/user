import { useTranslation } from 'react-i18next';
import { Button } from '../components/Button';

const Settings = () => {
    const { t } = useTranslation();

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                {t('Settings')}
            </h1>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Application Settings
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    This is a placeholder for the settings page. In a real application, you would have various configuration options here.
                </p>
                <Button className="bg-green-600 hover:bg-green-700 text-white font-bold">
                    Save Settings
                </Button>
            </div>
        </div>
    );
};

export default Settings;
