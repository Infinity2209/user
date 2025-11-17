import { Search, Filter, Grid, List, X } from 'lucide-react';
import { Input } from './Input';
import { Button } from './Button';

const SearchFilters = ({
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    priceMin,
    setPriceMin,
    priceMax,
    setPriceMax,
    viewMode,
    setViewMode,
    showFilters,
    setShowFilters,
    clearFilters,
    categories,
    t
}) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                            type="text"
                            placeholder={t('Search')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
                <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="md:w-auto"
                >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                </Button>
                <div className="flex gap-2">
                    <Button
                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                    >
                        <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                        variant={viewMode === 'list' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                    >
                        <List className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Category
                            </label>
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                {categories.map((cat) => (
                                    <option key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Min Price
                            </label>
                            <Input
                                type="number"
                                value={priceMin}
                                onChange={(e) => setPriceMin(e.target.value)}
                                placeholder="0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Max Price
                            </label>
                            <Input
                                type="number"
                                value={priceMax}
                                onChange={(e) => setPriceMax(e.target.value)}
                                placeholder="1000"
                            />
                        </div>
                        <div className="flex items-end">
                            <Button variant="outline" onClick={clearFilters} className="w-full">
                                <X className="w-4 h-4 mr-2" />
                                Clear
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchFilters;
