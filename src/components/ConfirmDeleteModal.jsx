import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle, Trash2 } from 'lucide-react';

const ConfirmDeleteModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Deletion",
    message = "Are you sure you want to delete this item?",
    itemName = "this item",
    isLoading = false
}) => {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            className="max-w-sm"
        >
            <div className="text-center">
                {/* Warning Icon */}
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                    <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>

                {/* Message */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Delete {itemName}?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                    {message}
                </p>

                {/* Warning Text */}
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-6">
                    <div className="flex items-center">
                        <Trash2 className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                        <p className="text-xs text-red-700 dark:text-red-300">
                            This action cannot be undone. This will permanently delete the {itemName.toLowerCase()}.
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                    <Button
                        onClick={onClose}
                        variant="secondary"
                        className="flex-1"
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        variant="danger"
                        className="flex-1"
                        disabled={isLoading}
                        isLoading={isLoading}
                    >
                        {isLoading ? 'Deleting...' : 'Delete'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export { ConfirmDeleteModal };
