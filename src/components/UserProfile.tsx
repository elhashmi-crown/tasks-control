import React, { useState } from 'react';
import { User, Mail, Shield, Calendar, Settings, Camera, Save, X } from 'lucide-react';
import { User as UserType } from '../types';

interface UserProfileProps {
  user: UserType;
  onUpdateUser: (user: UserType) => void;
  onClose: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdateUser, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);

  const handleSave = () => {
    onUpdateUser(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <button className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors">
                <Camera className="w-3 h-3" />
              </button>
            </div>
            <div className="text-white">
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-blue-100">{user.role === 'team_leader' ? 'Team Leader' : 'Employee'}</p>
              <p className="text-blue-200 text-sm">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Profile Information</h3>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 border-b pb-2">Personal Information</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{user.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-900">{user.role === 'team_leader' ? 'Team Leader' : 'Employee'}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 border-b pb-2">Preferences</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                {isEditing ? (
                  <select
                    value={formData.preferences.theme}
                    onChange={(e) => setFormData({
                      ...formData,
                      preferences: { ...formData.preferences, theme: e.target.value as 'light' | 'dark' }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                ) : (
                  <p className="text-gray-900 capitalize">{user.preferences.theme}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                {isEditing ? (
                  <select
                    value={formData.preferences.language}
                    onChange={(e) => setFormData({
                      ...formData,
                      preferences: { ...formData.preferences, language: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="en">English</option>
                    <option value="ar">Arabic</option>
                    <option value="fr">French</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{user.preferences.language === 'en' ? 'English' : user.preferences.language === 'ar' ? 'Arabic' : 'French'}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2">
                  {isEditing ? (
                    <input
                      type="checkbox"
                      checked={formData.preferences.notifications}
                      onChange={(e) => setFormData({
                        ...formData,
                        preferences: { ...formData.preferences, notifications: e.target.checked }
                      })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  ) : (
                    <input
                      type="checkbox"
                      checked={user.preferences.notifications}
                      disabled
                      className="rounded border-gray-300 text-blue-600"
                    />
                  )}
                  <span className="text-sm font-medium text-gray-700">Email Notifications</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Login</label>
                <p className="text-gray-900">
                  {new Date(user.lastLogin).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-4">Security</h4>
            <div className="flex gap-4">
              <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                Change Password
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                Two-Factor Authentication
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};