import React, { useState } from 'react';
import { Settings, User, Shield, Bell, Palette, Globe, Clock, Save, X, Eye, EyeOff, Smartphone, Mail, Phone } from 'lucide-react';
import { User as UserType } from '../types';

interface AccountSettingsProps {
  user: UserType;
  onUpdateUser: (user: UserType) => void;
  onClose: () => void;
}

export const AccountSettings: React.FC<AccountSettingsProps> = ({ user, onUpdateUser, onClose }) => {
  const [activeSection, setActiveSection] = useState<'general' | 'security' | 'notifications' | 'appearance'>('general');
  const [formData, setFormData] = useState(user);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleSave = () => {
    onUpdateUser(formData);
    alert('Settings saved successfully!');
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    
    alert('Password changed successfully!');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleEnable2FA = () => {
    const updatedUser = {
      ...formData,
      twoFactorEnabled: !formData.twoFactorEnabled
    };
    setFormData(updatedUser);
    onUpdateUser(updatedUser);
    
    if (!formData.twoFactorEnabled) {
      alert('Two-Factor Authentication enabled! You will receive a setup code via email.');
    } else {
      alert('Two-Factor Authentication disabled.');
    }
  };

  const sections = [
    { id: 'general', label: 'General', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div className="text-white">
              <h2 className="text-2xl font-bold">Account Settings</h2>
              <p className="text-indigo-100">Manage your account preferences and security</p>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 p-6 rounded-bl-2xl">
            <nav className="space-y-2">
              {sections.map(section => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {section.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            {/* General Settings */}
            {activeSection === 'general' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">General Settings</h3>
                  <p className="text-gray-600">Manage your basic account information and preferences</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <select
                      value={formData.department || ''}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select Department</option>
                      <option value="Revenue Management">Revenue Management</option>
                      <option value="Reservations">Reservations</option>
                      <option value="Payments">Payments</option>
                      <option value="Reconciliation">Reconciliation</option>
                      <option value="Occupancy Analysis">Occupancy Analysis</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select
                      value={formData.preferences.language}
                      onChange={(e) => setFormData({
                        ...formData,
                        preferences: { ...formData.preferences, language: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="en">English</option>
                      <option value="ar">Arabic</option>
                      <option value="fr">French</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                      <option value="UTC">UTC (Coordinated Universal Time)</option>
                      <option value="EST">EST (Eastern Standard Time)</option>
                      <option value="PST">PST (Pacific Standard Time)</option>
                      <option value="GMT">GMT (Greenwich Mean Time)</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            )}

            {/* Security Settings */}
            {activeSection === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Security Settings</h3>
                  <p className="text-gray-600">Manage your account security and authentication methods</p>
                </div>

                {/* Change Password */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-5 h-5 text-gray-600" />
                    <h4 className="font-medium text-gray-900">Change Password</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <div className="relative">
                        <input
                          type={showPasswords.current ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                        <div className="relative">
                          <input
                            type={showPasswords.new ? 'text' : 'password'}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Enter new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                        <div className="relative">
                          <input
                            type={showPasswords.confirm ? 'text' : 'password'}
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Confirm new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={handlePasswordChange}
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Update Password
                    </button>
                  </div>
                </div>
                
                {/* Two-Factor Authentication */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-gray-600" />
                      <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                    </div>
                    <button
                      onClick={handleEnable2FA}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        formData.twoFactorEnabled
                          ? 'text-red-600 bg-red-50 hover:bg-red-100'
                          : 'text-green-600 bg-green-50 hover:bg-green-100'
                      }`}
                    >
                      {formData.twoFactorEnabled ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    Add an extra layer of security to your account by enabling two-factor authentication.
                  </p>
                  
                  {formData.twoFactorEnabled && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">
                        ✓ Two-factor authentication is active and protecting your account.
                      </p>
                    </div>
                  )}
                </div>

                {/* Login Sessions */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Active Sessions</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded border">
                      <div>
                        <p className="font-medium text-gray-900">Current Session</p>
                        <p className="text-sm text-gray-600">Chrome on Windows • Last active now</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Notification Settings</h3>
                  <p className="text-gray-600">Choose how you want to be notified about important updates</p>
                </div>

                <div className="space-y-6">
                  {/* Email Notifications */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Mail className="w-5 h-5 text-gray-600" />
                      <h4 className="font-medium text-gray-900">Email Notifications</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <label className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Task Assignments</span>
                          <p className="text-xs text-gray-500">Get notified when new tasks are assigned to you</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.preferences.emailNotifications}
                          onChange={(e) => setFormData({
                            ...formData,
                            preferences: { ...formData.preferences, emailNotifications: e.target.checked }
                          })}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </label>
                      
                      <label className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Task Reminders</span>
                          <p className="text-xs text-gray-500">Receive reminders for pending tasks</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.preferences.notifications}
                          onChange={(e) => setFormData({
                            ...formData,
                            preferences: { ...formData.preferences, notifications: e.target.checked }
                          })}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </label>

                      <label className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Performance Reports</span>
                          <p className="text-xs text-gray-500">Weekly performance summary emails</p>
                        </div>
                        <input
                          type="checkbox"
                          defaultChecked={true}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </label>
                    </div>
                  </div>
                  
                  {/* SMS Notifications */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Phone className="w-5 h-5 text-gray-600" />
                      <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <label className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Urgent Tasks</span>
                          <p className="text-xs text-gray-500">SMS alerts for urgent task assignments</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.preferences.smsNotifications}
                          onChange={(e) => setFormData({
                            ...formData,
                            preferences: { ...formData.preferences, smsNotifications: e.target.checked }
                          })}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </label>

                      <label className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-gray-700">System Alerts</span>
                          <p className="text-xs text-gray-500">Critical system notifications</p>
                        </div>
                        <input
                          type="checkbox"
                          defaultChecked={false}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Push Notifications */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Bell className="w-5 h-5 text-gray-600" />
                      <h4 className="font-medium text-gray-900">Push Notifications</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <label className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Browser Notifications</span>
                          <p className="text-xs text-gray-500">Show notifications in your browser</p>
                        </div>
                        <input
                          type="checkbox"
                          defaultChecked={true}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </label>

                      <label className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Sound Alerts</span>
                          <p className="text-xs text-gray-500">Play sound for important notifications</p>
                        </div>
                        <input
                          type="checkbox"
                          defaultChecked={false}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save Notification Settings
                </button>
              </div>
            )}

            {/* Appearance Settings */}
            {activeSection === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Appearance Settings</h3>
                  <p className="text-gray-600">Customize the look and feel of your dashboard</p>
                </div>

                <div className="space-y-6">
                  {/* Theme Selection */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Palette className="w-5 h-5 text-gray-600" />
                      <h4 className="font-medium text-gray-900">Theme</h4>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-indigo-300 transition-colors">
                        <input
                          type="radio"
                          name="theme"
                          value="light"
                          checked={formData.preferences.theme === 'light'}
                          onChange={(e) => setFormData({
                            ...formData,
                            preferences: { ...formData.preferences, theme: e.target.value as 'light' | 'dark' }
                          })}
                          className="mr-3"
                        />
                        <div>
                          <div className="font-medium text-gray-900">Light Theme</div>
                          <div className="text-sm text-gray-500">Clean and bright interface</div>
                        </div>
                      </label>
                      
                      <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-indigo-300 transition-colors">
                        <input
                          type="radio"
                          name="theme"
                          value="dark"
                          checked={formData.preferences.theme === 'dark'}
                          onChange={(e) => setFormData({
                            ...formData,
                            preferences: { ...formData.preferences, theme: e.target.value as 'light' | 'dark' }
                          })}
                          className="mr-3"
                        />
                        <div>
                          <div className="font-medium text-gray-900">Dark Theme</div>
                          <div className="text-sm text-gray-500">Easy on the eyes</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Display Options */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Display Options</h4>
                    
                    <div className="space-y-4">
                      <label className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Compact Mode</span>
                          <p className="text-xs text-gray-500">Show more content in less space</p>
                        </div>
                        <input
                          type="checkbox"
                          defaultChecked={false}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </label>

                      <label className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Show Animations</span>
                          <p className="text-xs text-gray-500">Enable smooth transitions and effects</p>
                        </div>
                        <input
                          type="checkbox"
                          defaultChecked={true}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </label>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Dashboard Density</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                          <option value="comfortable">Comfortable</option>
                          <option value="compact">Compact</option>
                          <option value="spacious">Spacious</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save Appearance Settings
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};