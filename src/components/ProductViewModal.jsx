import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Star, Truck, Shield, Package, ShoppingCart, Heart } from 'lucide-react';
import { Input } from './Input';
import { Button } from './Button';

const ProductViewModal = ({
    viewingProduct,
    setViewingProduct,
    isViewingEdit,
    setIsViewingEdit,
    formData,
    setFormData,
    handleInlineSave,
    handleInlineCancel,
    toggleInlineEdit,
    user
}) => {
    const [imageError, setImageError] = useState(false);

    if (!viewingProduct) return null;

    const handleClose = () => {
        setViewingProduct(null);
        setIsViewingEdit(false);
        setImageError(false);
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-black/60 to-green-900/40 backdrop-blur-md"
                onClick={handleClose}
            />

            {/* Glow effects - Hidden on mobile for performance */}
            <div className="hidden sm:block absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
            <div className="hidden sm:block absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />

            {/* Modal - Mobile Optimized */}
            <div className="relative bg-white dark:bg-gray-900 rounded-lg sm:rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden border border-purple-200/50 dark:border-purple-700/50 transform transition-all duration-300 animate-scaleIn">
                {/* Decorative top border */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-purple-500 dark:bg-gradient-to-r dark:from-purple-500 dark:via-green-400 dark:to-purple-500" />

                {/* Close Button - Mobile Optimized */}
                <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10">
                    <button
                        onClick={handleClose}
                        className="group relative p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-purple-100 dark:hover:bg-gradient-to-br dark:hover:from-purple-900/50 dark:hover:to-green-900/50 rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-110 shadow-lg"
                    >
                        <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors" />
                    </button>
                </div>

                {/* Content - Responsive Layout */}
                <div className="flex flex-col md:flex-row overflow-y-auto max-h-[95vh] sm:max-h-[90vh]">
                    {/* Left side - Image - Mobile Optimized */}
                    <div className="md:w-1/2 bg-purple-50 dark:bg-gradient-to-br dark:from-purple-900/20 dark:to-green-900/20 p-4 sm:p-6 md:p-8 flex items-center justify-center relative min-h-[250px] sm:min-h-[300px]">
                        {/* Category Badge */}
                        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex gap-2 z-10">
                            {viewingProduct.category && (
                                <span className="px-2 py-1 sm:px-3 sm:py-1 bg-purple-500 dark:bg-gradient-to-r dark:from-purple-500 dark:to-green-500 text-white text-xs font-semibold rounded-full shadow-lg capitalize">
                                    {viewingProduct.category}
                                </span>
                            )}
                        </div>

                        {/* Product Image */}
                        <div className="relative w-full max-w-md aspect-square">
                            {viewingProduct.image && !imageError ? (
                                <img
                                    src={viewingProduct.image}
                                    alt={viewingProduct.title}
                                    className="w-full h-full object-contain rounded-lg sm:rounded-2xl"
                                    onError={() => setImageError(true)}
                                    loading="lazy"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-100 dark:bg-gray-700 rounded-lg sm:rounded-2xl flex items-center justify-center">
                                    <Package className="w-16 h-16 sm:w-24 sm:h-24 text-gray-400" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent rounded-lg sm:rounded-2xl pointer-events-none" />
                        </div>
                    </div>

                    {/* Right side - Details - Mobile Optimized */}
                    <div className="md:w-1/2 p-4 sm:p-6 md:p-8 overflow-y-auto">
                        {/* Product Title */}
                        <div className="mb-3 sm:mb-4">
                            {isViewingEdit ? (
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Title
                                    </label>
                                    <Input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="text-lg sm:text-2xl font-bold"
                                    />
                                </div>
                            ) : (
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-600 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-purple-400 dark:to-green-400 mb-2">
                                    {viewingProduct.title}
                                </h2>
                            )}
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                Product ID: {viewingProduct.id}
                            </p>
                        </div>

                        {/* Rating - Mobile Optimized */}
                        <div className="flex items-center gap-2 mb-4 sm:mb-6">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 sm:w-5 sm:h-5 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                4.0 (50 reviews)
                            </span>
                        </div>

                        {/* Price - Mobile Optimized */}
                        <div className="flex items-baseline gap-3 mb-4 sm:mb-6">
                            {isViewingEdit ? (
                                <div className="w-full">
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Price
                                    </label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="text-2xl sm:text-3xl font-bold"
                                    />
                                </div>
                            ) : (
                                <span className="text-3xl sm:text-4xl font-bold text-green-600 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-green-400 dark:to-purple-400">
                                    ${viewingProduct.price}
                                </span>
                            )}
                        </div>

                        {/* Description - Mobile Optimized */}
                        <div className="mb-4 sm:mb-6">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Description
                            </h3>
                            {isViewingEdit ? (
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm sm:text-base text-gray-900 dark:text-white leading-relaxed"
                                    rows={4}
                                />
                            ) : (
                                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {viewingProduct.description}
                                </p>
                            )}
                        </div>

                        {/* Features - Responsive Grid */}
                        <div className="mb-4 sm:mb-6 grid grid-cols-3 gap-2 sm:gap-4">
                            <div className="flex flex-col items-center p-2 sm:p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg sm:rounded-xl">
                                <Truck className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400 mb-1 sm:mb-2" />
                                <span className="text-[10px] sm:text-xs text-center text-gray-600 dark:text-gray-400">Free Shipping</span>
                            </div>
                            <div className="flex flex-col items-center p-2 sm:p-3 bg-green-50 dark:bg-green-900/20 rounded-lg sm:rounded-xl">
                                <Shield className="w-4 h-4 sm:w-6 sm:h-6 text-green-600 dark:text-green-400 mb-1 sm:mb-2" />
                                <span className="text-[10px] sm:text-xs text-center text-gray-600 dark:text-gray-400">1 Year Warranty</span>
                            </div>
                            <div className="flex flex-col items-center p-2 sm:p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg sm:rounded-xl">
                                <Package className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400 mb-1 sm:mb-2" />
                                <span className="text-[10px] sm:text-xs text-center text-gray-600 dark:text-gray-400">In Stock</span>
                            </div>
                        </div>

                        {/* Stock Status - Mobile Optimized */}
                        <div className="mb-4 sm:mb-6">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Availability:</span>
                                <span className="text-xs sm:text-sm font-semibold text-green-600 dark:text-green-400">
                                    In Stock
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                    className="bg-purple-500 dark:bg-gradient-to-r dark:from-purple-500 dark:to-green-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: '75%' }}
                                />
                            </div>
                        </div>

                        {/* Action Buttons - Mobile Stacked Layout */}
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                            {/* Add to Cart Button */}
                            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 sm:px-6 sm:py-4 bg-purple-500 dark:bg-gradient-to-r dark:from-purple-500 dark:to-green-500 hover:bg-purple-600 dark:hover:from-purple-600 dark:hover:to-green-600 text-white text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                                Add to Cart
                            </button>

                            {/* Wishlist Button */}
                            <button className="sm:w-auto w-full p-3 sm:p-4 bg-purple-100 dark:bg-gradient-to-br dark:from-purple-900/50 dark:to-green-900/50 hover:bg-purple-200 dark:hover:from-purple-900 dark:hover:to-green-900 text-purple-600 dark:text-purple-400 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 sm:gap-0">
                                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="sm:hidden text-sm font-medium">Add to Wishlist</span>
                            </button>

                            {/* Admin Edit Button - Not in edit mode */}
                            {user?.role === 'admin' && !isViewingEdit && (
                                <Button
                                    onClick={toggleInlineEdit}
                                    className="w-full sm:w-auto px-4 py-3 sm:px-6 sm:py-4 bg-green-500 hover:bg-green-600 text-white text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                                >
                                    Edit
                                </Button>
                            )}

                            {/* Admin Save/Cancel Buttons - In edit mode */}
                            {user?.role === 'admin' && isViewingEdit && (
                                <>
                                    <Button
                                        onClick={handleInlineSave}
                                        className="w-full sm:w-auto px-4 py-3 sm:px-6 sm:py-4 bg-green-500 hover:bg-green-600 text-white text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        onClick={handleInlineCancel}
                                        variant="outline"
                                        className="w-full sm:w-auto px-4 py-3 sm:px-6 sm:py-4 border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm sm:text-base rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                                    >
                                        Cancel
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Decorative bottom border */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500 dark:bg-gradient-to-r dark:from-green-500 dark:via-purple-400 dark:to-green-500" />
            </div>
        </div>,
        document.body
    );
};

export default ProductViewModal;