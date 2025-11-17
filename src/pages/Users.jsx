import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useGetUsersQuery, useCreateUserMutation, useUpdateUserMutation, useDeleteUserMutation } from '../store/apis/usersApi';
import { Table } from '../components/Table';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { Loader } from '../components/Loader';
import { Alert, AlertTitle, AlertDescription } from '../components/Alert';
import { Edit, Trash2, Plus, Search, X, Filter } from 'lucide-react';

const Users = () => {
    const { t } = useTranslation();
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setCurrentPage(1); // Reset to first page on search
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const { data: rawUsers, isLoading, error } = useGetUsersQuery();

    // Client-side search and role filtering
    const users = useMemo(() => {
        if (!rawUsers) return [];
        let filtered = rawUsers.filter(user =>
            user.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );
        if (roleFilter !== 'all') {
            filtered = filtered.filter(user => user.role === roleFilter);
        }
        return filtered;
    }, [rawUsers, debouncedSearchTerm, roleFilter]);

    const [createUser] = useCreateUserMutation();
    const [updateUser] = useUpdateUserMutation();
    const [deleteUser] = useDeleteUserMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', role: 'user' });

    const clearFilters = () => {
        setSearchTerm('');
        setRoleFilter('all');
        setCurrentPage(1);
        setShowFilters(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                await updateUser({ id: editingUser.id, ...formData });
            } else {
                await createUser(formData);
            }
            setIsModalOpen(false);
            setEditingUser(null);
            setFormData({ name: '', email: '', phone: '' });
        } catch (error) {
            console.error('Error saving user:', error);
        }
    };

    const handleEdit = (tableUser) => {
        setEditingUser(tableUser);
        setFormData({ name: tableUser.name, email: tableUser.email, phone: tableUser.phone, role: tableUser.role || 'user' });
        setIsModalOpen(true);
    };

    const handleDelete = (tableUser) => {
        setUserToDelete(tableUser);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (userToDelete) {
            try {
                await deleteUser(userToDelete.id);
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const handleAdd = () => {
        setEditingUser(null);
        setFormData({ name: '', email: '', phone: '', role: 'user' });
        setIsModalOpen(true);
    };

    const headers = [t('Name'), t('Email'), 'Phone', 'Role'];

    const actions = (tableUser) => (
        <>
            {user?.role === 'admin' && (
                <div className="flex items-center gap-1 sm:gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(tableUser)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1 sm:p-2"
                    >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(tableUser)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1 sm:p-2"
                    >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                </div>
            )}
        </>
    );

    if (isLoading) return (
        <div className="p-4 sm:p-6 flex justify-center items-center min-h-screen">
            <Loader size="lg" />
        </div>
    );

    if (error) return (
        <div className="p-4 sm:p-6">
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Error loading users. Please try again later.</AlertDescription>
            </Alert>
        </div>
    );

    return (
        <div className="p-3 sm:p-4 md:p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header - Responsive */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {t('Users')}
                </h1>
                {user?.role === 'admin' && (
                    <Button
                        onClick={handleAdd}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold w-full sm:w-auto text-sm sm:text-base"
                    >
                        <Plus className="w-4 h-4 mr-2 text-white font-bold" />
                        {t('Add User')}
                    </Button>
                )}
            </div>

            {/* Search and Filters - Mobile Optimized */}
            <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
                <div className="flex gap-2 sm:gap-3">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            type="text"
                            placeholder={t('Search users...')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8 sm:pl-10 text-sm sm:text-base h-9 sm:h-10"
                        />
                    </div>

                    {/* Mobile Filter Toggle Button */}
                    {user?.role === 'admin' && (
                        <Button
                            onClick={() => setShowFilters(!showFilters)}
                            variant="outline"
                            className="sm:hidden p-2"
                        >
                            <Filter className="w-4 h-4" />
                        </Button>
                    )}

                    {/* Desktop Role Filter */}
                    {user?.role === 'admin' && (
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="hidden sm:block px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                        >
                            <option value="all">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                        </select>
                    )}

                    {/* Clear Button - Desktop */}
                    <Button
                        onClick={clearFilters}
                        variant="outline"
                        className="hidden sm:flex items-center gap-2 text-sm"
                    >
                        <X className="w-4 h-4" />
                        Clear
                    </Button>
                </div>

                {/* Mobile Filter Dropdown */}
                {user?.role === 'admin' && showFilters && (
                    <div className="sm:hidden space-y-2 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                            Filter by Role
                        </label>
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                        >
                            <option value="all">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                        </select>
                        <Button
                            onClick={clearFilters}
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2 text-sm"
                        >
                            <X className="w-4 h-4" />
                            Clear Filters
                        </Button>
                    </div>
                )}
            </div>

            {/* Table Container with Responsive Scrolling */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                {users && users.length === 0 ? (
                    <div className="p-6 sm:p-8 text-center text-gray-500 dark:text-gray-400">
                        <p className="text-sm sm:text-base">No users found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table
                            headers={headers}
                            data={users || []}
                            actions={actions}
                            enablePagination={true}
                            itemsPerPage={10}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}
            </div>

            {/* Modals */}
            {user?.role === 'admin' && (
                <>
                    <Modal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        title={editingUser ? t('Edit') : t('Add User')}
                    >
                        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {t('Name')}
                                </label>
                                <Input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="text-sm sm:text-base"
                                />
                            </div>
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Email
                                </label>
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="text-sm sm:text-base"
                                />
                            </div>
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Phone
                                </label>
                                <Input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    pattern="[0-9]{10}"
                                    title="Phone number must be 10 digits"
                                    className="text-sm sm:text-base"
                                />
                            </div>
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Role
                                </label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="flex h-9 sm:h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
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

                    <ConfirmDeleteModal
                        isOpen={isDeleteModalOpen}
                        onClose={() => setIsDeleteModalOpen(false)}
                        onConfirm={confirmDelete}
                        title="Delete User"
                        message={`Are you sure you want to delete "${userToDelete?.name}"? This action cannot be undone.`}
                        itemName={userToDelete?.name || 'user'}
                    />
                </>
            )}
        </div>
    );
};

export default Users;