import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useGetProductsQuery, useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation } from '../store/apis/productsApi';
import { Plus, Package, Star, Truck, Shield, ShoppingCart, Heart, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Loader } from '../components/Loader';
import { Alert, AlertTitle, AlertDescription } from '../components/Alert';
import { Modal } from '../components/Modal';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import SearchFilters from '../components/SearchFilters';
import ProductCard from '../components/ProductCard';
import ProductListItem from '../components/ProductListItem';

const Products = () => {
    const { user } = useSelector((state) => state.auth);
    const { t } = useTranslation();
    const { data: products, isLoading, error } = useGetProductsQuery();
    const [createProduct] = useCreateProductMutation();
    const [updateProduct] = useUpdateProductMutation();
    const [deleteProduct] = useDeleteProductMutation();

    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [priceMin, setPriceMin] = useState('');
    const [priceMax, setPriceMax] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [showFilters, setShowFilters] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null);
    const [viewingProduct, setViewingProduct] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isViewingEdit, setIsViewingEdit] = useState(false);
    const [formData, setFormData] = useState({ title: '', price: '', description: '', category: '', image: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [imageError, setImageError] = useState(false);
    const itemsPerPage = 10;

    // Filter products
    const filteredProducts = (products || []).filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = !categoryFilter || product.category === categoryFilter;
        const matchesPriceMin = !priceMin || product.price >= parseFloat(priceMin);
        const matchesPriceMax = !priceMax || product.price <= parseFloat(priceMax);
        return matchesSearch && matchesCategory && matchesPriceMin && matchesPriceMax;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const clearFilters = () => {
        setSearch('');
        setCategoryFilter('');
        setPriceMin('');
        setPriceMax('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
            };
            if (editingProduct) {
                await updateProduct({ id: editingProduct.id, ...productData });
            } else {
                await createProduct(productData);
            }
            setIsModalOpen(false);
            setEditingProduct(null);
            setFormData({ title: '', price: '', description: '', category: '', image: '' });
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    const handleView = (product) => {
        setViewingProduct(product);
        setIsEditing(false);
        setIsViewingEdit(false);
        setImageError(false);
        setFormData({
            title: product.title,
            price: product.price.toString(),
            description: product.description,
            category: product.category,
            image: product.image,
        });
        setIsModalOpen(true);
    };

    const handleDelete = (product) => {
        if (user?.role !== 'admin') return;
        setProductToDelete(product);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (productToDelete) {
            try {
                await deleteProduct(productToDelete.id);
                setIsDeleteModalOpen(false);
                setProductToDelete(null);
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    const handleAdd = () => {
        if (user?.role !== 'admin') return;
        setEditingProduct(null);
        setViewingProduct(null);
        setFormData({ title: '', price: '', description: '', category: '', image: '' });
        setIsModalOpen(true);
    };

    const toggleInlineEdit = () => {
        if (user?.role !== 'admin') return;
        setIsViewingEdit(!isViewingEdit);
        if (!isViewingEdit) {
            // Entering edit mode - populate formData with current product data
            setFormData({
                title: viewingProduct.title,
                price: viewingProduct.price.toString(),
                description: viewingProduct.description,
                category: viewingProduct.category,
                image: viewingProduct.image,
            });
        }
    };

    const handleInlineSave = async () => {
        try {
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
            };
            await updateProduct({ id: viewingProduct.id, ...productData });
            setIsViewingEdit(false);
            // Update the viewingProduct with new data
            setViewingProduct({ ...viewingProduct, ...productData });
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    const handleInlineCancel = () => {
        setIsViewingEdit(false);
        setFormData({
            title: viewingProduct.title,
            price: viewingProduct.price.toString(),
            description: viewingProduct.description,
            category: viewingProduct.category,
            image: viewingProduct.image,
        });
    };

    const categories = [
        { value: '', label: t('All Categories') },
        { value: 'electronics', label: t('Electronics') },
        { value: 'jewelery', label: t('Jewelery') },
        { value: "men's clothing", label: t("Men's Clothing") },
        { value: "women's clothing", label: t("Women's Clothing") },
    ];

    if (isLoading) return (
        <div className="p-4 sm:p-6 flex justify-center items-center min-h-screen">
            <Loader size="lg" />
        </div>
    );
    if (error) return (
        <div className="p-4 sm:p-6">
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Error loading products. Please try again later.</AlertDescription>
            </Alert>
        </div>
    );

    return (
        <div className="p-3 sm:p-4 md:p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header - Responsive */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {t('Products')}
                </h1>
                {user?.role === 'admin' && (
                    <Button
                        onClick={handleAdd}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold w-full sm:w-auto text-sm sm:text-base"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Product
                    </Button>
                )}
            </div>

            {/* Search and Filters */}
            <SearchFilters
                search={search}
                setSearch={setSearch}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                priceMin={priceMin}
                setPriceMin={setPriceMin}
                priceMax={priceMax}
                setPriceMax={setPriceMax}
                viewMode={viewMode}
                setViewMode={setViewMode}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                clearFilters={clearFilters}
                categories={categories}
                t={t}
            />

            {/* Products Grid/List - Responsive */}
            <div className={viewMode === 'grid'
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                : "space-y-3 sm:space-y-4"
            }>
                {paginatedProducts.map((product) => (
                    viewMode === 'grid' ? (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onView={handleView}
                            onDelete={handleDelete}
                            user={user}
                        />
                    ) : (
                        <ProductListItem
                            key={product.id}
                            product={product}
                            onView={handleView}
                            onDelete={handleDelete}
                            user={user}
                        />
                    )
                ))}
            </div>

            {/* Pagination - Mobile Responsive */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-2 mt-6 sm:mt-8">
                    <Button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        variant="outline"
                        className="flex items-center gap-2 w-full sm:w-auto text-sm"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                    </Button>

                    {/* Page numbers - scrollable on mobile */}
                    <div className="flex gap-1 overflow-x-auto max-w-full px-2 sm:px-0">
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                            // Show current page and 2 pages on each side
                            let page;
                            if (totalPages <= 5) {
                                page = i + 1;
                            } else if (currentPage <= 3) {
                                page = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                page = totalPages - 4 + i;
                            } else {
                                page = currentPage - 2 + i;
                            }
                            return (
                                <Button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    variant={currentPage === page ? "default" : "outline"}
                                    className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 text-sm"
                                >
                                    {page}
                                </Button>
                            );
                        })}
                    </div>

                    <Button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        variant="outline"
                        className="flex items-center gap-2 w-full sm:w-auto text-sm"
                    >
                        Next
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            )}

            {/* No Results */}
            {filteredProducts.length === 0 && (
                <div className="text-center py-12 sm:py-16">
                    <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        {t('No products found')}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-4 sm:mb-6">
                        {t('Try adjusting your filters or search terms')}
                    </p>
                    <Button onClick={clearFilters} className="bg-green-500 hover:bg-green-600 text-sm sm:text-base">
                        {t('Clear All Filters')}
                    </Button>
                </div>
            )}

            {/* View Modal - Mobile Responsive */}
            {viewingProduct && (
                createPortal(
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-black/60 to-green-900/40 backdrop-blur-md"
                            onClick={() => {
                                setIsModalOpen(false);
                                setViewingProduct(null);
                                setIsViewingEdit(false);
                            }}
                        />
                        {/* Glow effects - hidden on mobile */}
                        <div className="hidden sm:block absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
                        <div className="hidden sm:block absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

                        {/* Modal - Mobile Optimized */}
                        <div className="relative bg-white dark:bg-gray-900 rounded-lg sm:rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden border border-purple-200/50 dark:border-purple-700/50 transform transition-all duration-300 animate-scaleIn">
                            {/* Decorative top border */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-purple-500 dark:bg-gradient-to-r dark:from-purple-500 dark:via-green-400 dark:to-purple-500" />

                            {/* Header with Close Button */}
                            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10">
                                <button
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setViewingProduct(null);
                                        setIsViewingEdit(false);
                                    }}
                                    className="group relative p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-purple-100 dark:hover:bg-gradient-to-br dark:hover:from-purple-900/50 dark:hover:to-green-900/50 rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-110 shadow-lg"
                                >
                                    <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex flex-col md:flex-row overflow-y-auto max-h-[95vh] sm:max-h-[90vh]">
                                {/* Left side - Image - Mobile Optimized */}
                                <div className="md:w-1/2 bg-purple-50 dark:bg-gradient-to-br dark:from-purple-900/20 dark:to-green-900/20 p-4 sm:p-6 md:p-8 flex items-center justify-center relative min-h-[250px] sm:min-h-[300px]">
                                    <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex gap-2 z-10">
                                        {viewingProduct.category && (
                                            <span className="px-2 py-1 sm:px-3 sm:py-1 bg-purple-500 dark:bg-gradient-to-r dark:from-purple-500 dark:to-green-500 text-white text-xs font-semibold rounded-full shadow-lg capitalize">
                                                {viewingProduct.category}
                                            </span>
                                        )}
                                    </div>
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

                                    {/* Rating */}
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

                                    {/* Price */}
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

                                    {/* Description */}
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

                                    {/* Stock Status */}
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

                                    {/* Action Buttons - Mobile Stacked */}
                                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 sm:px-6 sm:py-4 bg-purple-500 dark:bg-gradient-to-r dark:from-purple-500 dark:to-green-500 hover:bg-purple-600 dark:hover:from-purple-600 dark:hover:to-green-600 text-white text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                                            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                                            Add to Cart
                                        </button>
                                        <button className="p-3 sm:p-4 bg-purple-100 dark:bg-gradient-to-br dark:from-purple-900/50 dark:to-green-900/50 hover:bg-purple-200 dark:hover:from-purple-900 dark:hover:to-green-900 text-purple-600 dark:text-purple-400 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 w-full sm:w-auto">
                                            <Heart className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" />
                                        </button>
                                        {user?.role === 'admin' && !isViewingEdit && (
                                            <Button
                                                onClick={toggleInlineEdit}
                                                className="px-4 py-3 sm:px-6 sm:py-4 bg-green-500 hover:bg-green-600 text-white text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 w-full sm:w-auto"
                                            >
                                                Edit
                                            </Button>
                                        )}
                                        {user?.role === 'admin' && isViewingEdit && (
                                            <>
                                                <Button
                                                    onClick={handleInlineSave}
                                                    className="px-4 py-3 sm:px-6 sm:py-4 bg-green-500 hover:bg-green-600 text-white text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                                                >
                                                    Save
                                                </Button>
                                                <Button
                                                    onClick={handleInlineCancel}
                                                    variant="outline"
                                                    className="px-4 py-3 sm:px-6 sm:py-4 border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm sm:text-base rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
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
                )
            )}

            {/* Add/Edit Modal - Mobile Optimized */}
            {user?.role === 'admin' && (
                <Modal
                    isOpen={isModalOpen && !viewingProduct}
                    onClose={() => setIsModalOpen(false)}
                    title={editingProduct ? 'Edit Product' : 'Add Product'}
                >
                    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Title
                            </label>
                            <Input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                                className="text-sm sm:text-base"
                            />
                        </div>
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Price
                            </label>
                            <Input
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                                className="text-sm sm:text-base"
                            />
                        </div>
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm sm:text-base text-gray-900 dark:text-white"
                                rows={3}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Category
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm sm:text-base text-gray-900 dark:text-white"
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.slice(1).map((cat) => (
                                    <option key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Image URL
                            </label>
                            <Input
                                type="url"
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                className="text-sm sm:text-base"
                            />
                        </div>
                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsModalOpen(false)}
                                className="w-full sm:w-auto text-sm"
                            >
                                {t('Cancel')}
                            </Button>
                            <Button
                                type="submit"
                                className="w-full sm:w-auto text-sm"
                            >
                                {t('Save')}
                            </Button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Confirm Delete Modal */}
            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Product"
                description={`Are you sure you want to delete "${productToDelete?.title}"? This action cannot be undone.`}
            />
        </div>
    );
};

export default Products;
