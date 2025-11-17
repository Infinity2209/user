import { Package, X } from 'lucide-react';
import { Card, CardContent, CardTitle } from './Card';
import { Button } from './Button';

const ProductListItem = ({ product, onView, onDelete, user }) => {
    return (
        <Card
            className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow duration-300"
            onClick={() => onView(product)}
        >
            <CardContent className="p-3 sm:p-4">
                <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-700 flex items-center justify-center rounded-lg flex-shrink-0">
                        {product.image ? (
                            <img
                                src={product.image}
                                alt={product.title}
                                className="w-full h-full object-cover rounded-lg"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                        ) : null}
                        <Package className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" style={{ display: product.image ? 'none' : 'flex' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors mb-1 truncate">
                            {product.title}
                        </CardTitle>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 capitalize">
                            {product.category}
                        </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <div className="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400">
                            ${product.price}
                        </div>
                        {user?.role === 'admin' && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(product);
                                }}
                                className="text-red-600 hover:text-red-800 mt-1 p-1 sm:p-2"
                            >
                                <X className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ProductListItem;
