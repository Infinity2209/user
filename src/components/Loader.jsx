import { cn } from '../utils/cn';

const Loader = ({ className, size = 'md', ...props }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };

    return (
        <div
            className={cn(
                'inline-block animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]',
                sizeClasses[size],
                className
            )}
            role="status"
            {...props}
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export { Loader };
