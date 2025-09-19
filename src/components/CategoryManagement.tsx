import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Tag } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  isActive: boolean;
}

const defaultCategories: Category[] = [
  { id: 'cat-1', name: 'Reservations', description: 'Hotel booking and reservation management', color: 'blue', isActive: true },
  { id: 'cat-2', name: 'Payments', description: 'Payment processing and financial transactions', color: 'green', isActive: true },
  { id: 'cat-3', name: 'Reconciliation', description: 'Financial reconciliation and auditing', color: 'purple', isActive: true },
  { id: 'cat-4', name: 'Tracking', description: 'Occupancy and performance tracking', color: 'yellow', isActive: true },
  { id: 'cat-5', name: 'Administration', description: 'Administrative and general tasks', color: 'gray', isActive: true },
  { id: 'cat-6', name: 'Guest Services', description: 'Guest satisfaction and service tasks', color: 'pink', isActive: true },
  { id: 'cat-7', name: 'Maintenance', description: 'Property maintenance and repairs', color: 'orange', isActive: true },
  { id: 'cat-8', name: 'Marketing', description: 'Marketing and promotional activities', color: 'indigo', isActive: true }
];

const colorOptions = [
  { value: 'blue', label: 'Blue', class: 'bg-blue-100 text-blue-800' },
  { value: 'green', label: 'Green', class: 'bg-green-100 text-green-800' },
  { value: 'purple', label: 'Purple', class: 'bg-purple-100 text-purple-800' },
  { value: 'yellow', label: 'Yellow', class: 'bg-yellow-100 text-yellow-800' },
  { value: 'gray', label: 'Gray', class: 'bg-gray-100 text-gray-800' },
  { value: 'pink', label: 'Pink', class: 'bg-pink-100 text-pink-800' },
  { value: 'orange', label: 'Orange', class: 'bg-orange-100 text-orange-800' },
  { value: 'indigo', label: 'Indigo', class: 'bg-indigo-100 text-indigo-800' }
];

export const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useLocalStorage<Category[]>('hospitality_categories', defaultCategories);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    description: '',
    color: 'blue',
    isActive: true
  });

  const handleSaveCategory = () => {
    if (!formData.name?.trim()) {
      alert('Please enter a category name');
      return;
    }

    const categoryData: Category = {
      id: editingCategory || `cat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: formData.name.trim(),
      description: formData.description?.trim() || '',
      color: formData.color || 'blue',
      isActive: formData.isActive ?? true
    };

    if (editingCategory) {
      setCategories(prev => prev.map(cat => cat.id === editingCategory ? categoryData : cat));
    } else {
      setCategories(prev => [...prev, categoryData]);
    }

    resetForm();
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category.id);
    setFormData(category);
    setIsAddingCategory(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    if (confirm(`Are you sure you want to delete "${category.name}"? This action cannot be undone.`)) {
      setCategories(prev => prev.filter(c => c.id !== categoryId));
    }
  };

  const handleToggleActive = (categoryId: string) => {
    setCategories(prev => prev.map(cat =>
      cat.id === categoryId ? { ...cat, isActive: !cat.isActive } : cat
    ));
  };

  const resetForm = () => {
    setIsAddingCategory(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      color: 'blue',
      isActive: true
    });
  };

  const getCategoryColorClass = (color: string) => {
    const colorOption = colorOptions.find(opt => opt.value === color);
    return colorOption?.class || 'bg-gray-100 text-gray-800';
  };

  const activeCategories = categories.filter(cat => cat.isActive);
  const inactiveCategories = categories.filter(cat => !cat.isActive);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Task Categories</h2>
          <p className="text-gray-600">
            Add, edit, and manage task categories for better organization. Total categories: {categories.length} ({activeCategories.length} active)
          </p>
        </div>
        <button
          onClick={() => setIsAddingCategory(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Category
        </button>
      </div>

      {/* Add/Edit Category Form */}
      {isAddingCategory && (
        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name *
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter category name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color Theme
              </label>
              <select
                value={formData.color || 'blue'}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {colorOptions.map(color => (
                  <option key={color.value} value={color.value}>{color.label}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter category description"
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.isActive ?? true}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Active Category
              </label>
            </div>

            {/* Preview */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Preview:</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColorClass(formData.color || 'blue')}`}>
                {formData.name || 'Category Name'}
              </span>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={resetForm}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveCategory}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {editingCategory ? 'Update Category' : 'Add Category'}
            </button>
          </div>
        </div>
      )}

      {/* Active Categories */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-green-50">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-green-900">Active Categories ({activeCategories.length})</h3>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Color
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activeCategories.map(category => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Tag className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="text-sm font-medium text-gray-900">{category.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                    {category.description || 'No description'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColorClass(category.color)}`}>
                      {category.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Edit category"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleActive(category.id)}
                        className="text-yellow-600 hover:text-yellow-800 transition-colors"
                        title="Deactivate category"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Delete category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {activeCategories.length === 0 && (
          <div className="px-6 py-12 text-center">
            <div className="text-gray-400 mb-4">
              <Tag className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Categories</h3>
            <p className="text-gray-600 mb-4">Add your first category to get started.</p>
            <button
              onClick={() => setIsAddingCategory(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add First Category
            </button>
          </div>
        )}
      </div>

      {/* Inactive Categories */}
      {inactiveCategories.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2">
              <X className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Inactive Categories ({inactiveCategories.length})</h3>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Color
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inactiveCategories.map(category => (
                  <tr key={category.id} className="hover:bg-gray-50 opacity-75">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <Tag className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="text-sm font-medium text-gray-700">{category.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                      {category.description || 'No description'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        {category.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Inactive
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Edit category"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleActive(category.id)}
                          className="text-green-600 hover:text-green-800 transition-colors"
                          title="Reactivate category"
                        >
                          <Tag className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Delete category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};