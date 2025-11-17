import { Package, X } from 'lucide-react';
import { Card, CardContent, CardTitle } from './Card';
import { Button } from './Button';

const ProductCard = ({ product, onView, onDelete, user }) => {
    return (
        <Card
            className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow duration-300"
            onClick={() => onView(product)}
        >
            <div className="aspect-square bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                    />
                ) : null}
                <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" style={{ display: product.image ? 'none' : 'flex' }} />
            </div>
            <CardContent className="p-3 sm:p-4">
                <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors mb-2 line-clamp-2">
                    {product.title}
                </CardTitle>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 capitalize mb-2">
                    {product.category}
                </p>
                <div className="flex items-center justify-between">
                    <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
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
                            className="text-red-600 hover:text-red-800 p-1 sm:p-2"
                        >
                            <X className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default ProductCard;
