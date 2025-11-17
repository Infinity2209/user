import { forwardRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Sparkles } from 'lucide-react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const Modal = forwardRef(({ isOpen, onClose, title, children, className }, ref) => {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
            {/* Enhanced backdrop with gradient overlay */}
            <div
                className="absolute inset-0 bg-black/50 dark:bg-gradient-to-br dark:from-purple-900/40 dark:via-black/60 dark:to-green-900/40 backdrop-blur-md"
                onClick={onClose}
            />

            {/* Animated glow effects - only in dark mode */}
            {document.documentElement.classList.contains('dark') && (
                <>
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                </>
            )}

            {/* Modal container */}
            <div
                ref={ref}
                className={cn(
                    'relative rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden',
                    'transform transition-all duration-300 animate-scaleIn',
                    // Light mode styles
                    'bg-white border border-gray-200',
                    // Dark mode styles - improved contrast
                    'dark:bg-gray-800 dark:border-gray-600',
                    className
                )}
            >
                {/* Decorative gradient border top */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 dark:from-purple-500 dark:via-green-400 dark:to-purple-500" />

                {/* Header */}
                <div className={cn(
                    'relative flex items-center justify-between p-6 border-b backdrop-blur-sm',
                    'bg-gray-50 border-gray-200 dark:bg-gray-700 dark:border-gray-600'
                )}>
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 dark:from-purple-500 dark:to-green-500 flex items-center justify-center shadow-lg">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <h3 className={cn(
                            'text-lg font-bold',
                            'text-gray-900 dark:text-white'
                        )}>
                            {title}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className={cn(
                            'group relative p-2 rounded-xl transition-all duration-200 hover:scale-110',
                            'hover:bg-gray-100 dark:hover:bg-gray-600'
                        )}
                    >
                        <X className="w-5 h-5 text-gray-500 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-white transition-colors" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-500 scrollbar-track-transparent">
                    <div className="relative">
                        {children}
                    </div>
                </div>

                {/* Decorative gradient border bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 dark:from-green-500 dark:via-purple-400 dark:to-green-500" />
            </div>
        </div>,
        document.body
    );
});

Modal.displayName = 'Modal';

// Add animation keyframes via style tag
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    
    @keyframes scaleIn {
        from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
        }
        to {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }
    
    .animate-fadeIn {
        animation: fadeIn 0.2s ease-out;
    }
    
    .animate-scaleIn {
        animation: scaleIn 0.3s ease-out;
    }
    
    /* Custom scrollbar styles */
    .scrollbar-thin::-webkit-scrollbar {
        width: 6px;
    }
    
    .scrollbar-thin::-webkit-scrollbar-track {
        background: transparent;
    }
    
    .scrollbar-thin::-webkit-scrollbar-thumb {
        background: linear-gradient(to bottom, rgb(168, 85, 247), rgb(34, 197, 94));
        border-radius: 3px;
    }
    
    .scrollbar-thin::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(to bottom, rgb(147, 51, 234), rgb(22, 163, 74));
    }
`;
document.head.appendChild(style);

export { Modal };