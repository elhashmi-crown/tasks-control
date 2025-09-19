import React, { useState, useEffect } from 'react';
import { Plus, Users, BarChart3, Archive, Calendar, Wrench, Activity } from 'lucide-react';
import { LoginForm } from './components/LoginForm';
import { Header } from './components/Header';
import { UserProfile } from './components/UserProfile';
import { AccountSettings } from './components/AccountSettings';
import { TaskCard } from './components/TaskCard';
import { PerformanceChart } from './components/PerformanceChart';
import { TaskAssignmentModal } from './components/TaskAssignmentModal';
import { TaskNotificationModal } from './components/TaskNotificationModal';
import { HistoryView } from './components/HistoryView';
import { EmployeeDashboard } from './components/EmployeeDashboard';
import { TaskManagement } from './components/TaskManagement';
import { EmployeeManagement } from './components/EmployeeManagement';
import { RoleManagement } from './components/RoleManagement';
import { CategoryManagement } from './components/CategoryManagement';
import { TeamStatusOverview } from './components/TeamStatusOverview';
import { RecentActivities } from './components/RecentActivities';
import { ActiveTasks } from './components/ActiveTasks';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Task, Employee, TaskAssignment, DailyReport, PerformanceMetric, User } from './types';
import { defaultTasks } from './data/defaultTasks';
import { defaultEmployees } from './data/defaultEmployees';
import { defaultUsers } from './data/defaultUsers';
import { formatDate, getMinutesBetween } from './utils/dateUtils';
import { calculatePerformanceMetrics } from './utils/performanceUtils';

function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'daily' | 'performance' | 'history' | 'manage' | 'employees' | 'roles' | 'categories'>('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [users, setUsers] = useLocalStorage<User[]>('hospitality_users', defaultUsers);
  const [tasks, setTasks] = useLocalStorage<Task[]>('hospitality_tasks', defaultTasks);
  const [employees, setEmployees] = useLocalStorage<Employee[]>('hospitality_employees', defaultEmployees);
  const [assignments, setAssignments] = useLocalStorage<TaskAssignment[]>('hospitality_assignments', []);
  const [dailyReports, setDailyReports] = useLocalStorage<DailyReport[]>('hospitality_reports', []);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [selectedTaskForNotification, setSelectedTaskForNotification] = useState<{ task: Task; employee: Employee } | null>(null);

  // Handle sign up
  const handleSignUp = async (userData: any) => {
    setIsLoading(true);
    setLoginError('');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) {
      setLoginError('An account with this email already exists');
      setIsLoading(false);
      return;
    }
    
    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      phone: userData.phone,
      department: userData.department,
      twoFactorEnabled: false,
      preferences: {
        theme: 'light',
        notifications: true,
        emailNotifications: true,
        smsNotifications: false,
        language: 'en'
      },
      lastLogin: new Date(),
      createdAt: new Date()
    };
    
    // If employee role, create employee record
    if (userData.role === 'employee') {
      const newEmployee: Employee = {
        id: `emp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: userData.name,
        role: userData.department || 'General Staff',
        isActive: true
      };
      
      newUser.employeeId = newEmployee.id;
      setEmployees(prev => [...prev, newEmployee]);
    }
    
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    setIsLoading(false);
  };
  // Handle login
  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setLoginError('');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user by email
    const user = users.find(u => u.email === email);
    
    // Simple password validation (in real app, this would be hashed)
    const validPasswords: { [key: string]: string } = {
      'tamer@hospitality.com': 'leader123',
      'sarah@hospitality.com': 'emp123',
      'michael@hospitality.com': 'emp123',
      'emma@hospitality.com': 'emp123',
      'david@hospitality.com': 'emp123',
      'lisa@hospitality.com': 'emp123'
    };
    
    if (user && validPasswords[email] === password) {
      // Update last login
      const updatedUser = { ...user, lastLogin: new Date() };
      setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
      
      setCurrentUser(updatedUser);
      setIsAuthenticated(true);
    } else {
      setLoginError('Invalid email or password');
    }
    
    setIsLoading(false);
  };

  // Handle logout
  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setCurrentView('dashboard');
  };

  // Handle profile update
  const handleUpdateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
  };

  // Handle task notification
  const handleSendTaskNotification = (taskId: string, employeeId: string, message: string, priority: 'normal' | 'urgent', method: 'email' | 'whatsapp' = 'email') => {
    const employee = employees.find(e => e.id === employeeId);
    const task = tasks.find(t => t.id === taskId);
    
    if (employee && task) {
      // In a real app, this would send an actual notification
      const methodText = method === 'whatsapp' ? 'WhatsApp message' : 'Email notification';
      alert(`${priority === 'urgent' ? 'Urgent' : 'Normal'} ${methodText} sent to ${employee.name} about "${task.name}"`);
      
      // You could also add this to a notifications system
      console.log('Notification sent:', {
        to: employee.name,
        task: task.name,
        message,
        priority,
        method,
        timestamp: new Date()
      });
    }
  };

  // Handle WhatsApp notification
  const handleSendWhatsAppNotification = (taskId: string, employeeId: string, message: string, priority: 'normal' | 'urgent') => {
    handleSendTaskNotification(taskId, employeeId, message, priority, 'whatsapp');
  };

  // Show login form if not authenticated
  if (!isAuthenticated || !currentUser) {
    return (
      <LoginForm 
        onLogin={handleLogin}
        onSignUp={handleSignUp}
        isLoading={isLoading}
        error={loginError}
      />
    );
  }

  const today = formatDate(new Date());
  const todaysAssignments = assignments.filter(a => a.date === today);

  // Generate performance metrics
  const performanceMetrics: PerformanceMetric[] = employees.map(employee =>
    calculatePerformanceMetrics(assignments, tasks, employee.id, employee.name)
  );

  const assignTask = (taskId: string, employeeId: string) => {
    const newAssignment: TaskAssignment = {
      id: `assignment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      taskId,
      employeeId,
      assignedBy: 'Tamer', // Team Leader
      assignedAt: new Date(),
      startedAt: null,
      completedAt: null,
      status: 'not_started',
      notes: '',
      date: today
    };

    setAssignments(prev => [...prev, newAssignment]);
  };

  const unassignTask = (taskId: string) => {
    setAssignments(prev => prev.filter(a => a.taskId !== taskId || a.date !== today));
  };

  const reassignTask = (taskId: string, newEmployeeId: string) => {
    setAssignments(prev =>
      prev.map(assignment =>
        assignment.taskId === taskId && assignment.date === today
          ? { ...assignment, employeeId: newEmployeeId, assignedAt: new Date() }
          : assignment
      )
    );
  };

  const startTask = (assignmentId: string) => {
    setAssignments(prev =>
      prev.map(assignment =>
        assignment.id === assignmentId
          ? { ...assignment, status: 'in_progress', startedAt: new Date() }
          : assignment
      )
    );
  };

  const completeTask = (assignmentId: string, notes: string) => {
    const now = new Date();
    setAssignments(prev =>
      prev.map(assignment => {
        if (assignment.id === assignmentId) {
          const actualMinutes = assignment.startedAt 
            ? getMinutesBetween(new Date(assignment.startedAt), now)
            : 0;
          
          return {
            ...assignment,
            status: 'completed',
            completedAt: now,
            actualMinutes,
            notes
          };
        }
        return assignment;
      })
    );
  };

  const pauseTask = (assignmentId: string) => {
    setAssignments(prev =>
      prev.map(assignment =>
        assignment.id === assignmentId
          ? { ...assignment, status: 'paused' }
          : assignment
      )
    );
  };

  const updateNotes = (assignmentId: string, notes: string) => {
    setAssignments(prev =>
      prev.map(assignment =>
        assignment.id === assignmentId
          ? { ...assignment, notes }
          : assignment
      )
    );
  };

  const archiveDay = () => {
    if (todaysAssignments.length === 0) {
      alert('No tasks assigned for today to archive.');
      return;
    }

    const completedTasks = todaysAssignments.filter(a => a.status === 'completed').length;
    const overdueTasks = todaysAssignments.filter(a => a.status === 'overdue').length;
    const totalMinutes = todaysAssignments
      .filter(a => a.actualMinutes)
      .reduce((sum, a) => sum + (a.actualMinutes || 0), 0);
    const averageTime = todaysAssignments.filter(a => a.actualMinutes).length > 0
      ? totalMinutes / todaysAssignments.filter(a => a.actualMinutes).length
      : 0;

    const dailyReport: DailyReport = {
      date: today,
      assignments: [...todaysAssignments],
      summary: {
        totalTasks: todaysAssignments.length,
        completedTasks,
        overdueTasks,
        averageCompletionTime: Math.round(averageTime)
      },
      employeeMetrics: performanceMetrics
    };

    setDailyReports(prev => {
      const existing = prev.findIndex(r => r.date === today);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = dailyReport;
        return updated;
      }
      return [...prev, dailyReport].sort((a, b) => b.date.localeCompare(a.date));
    });

    alert('Day successfully archived!');
  };

  const getAvailableTasks = () => {
    const assignedTaskIds = new Set(todaysAssignments.map(a => a.taskId));
    return tasks.filter(task => !assignedTaskIds.has(task.id));
  };

  const getCurrentAssignment = (taskId: string) => {
    const assignment = todaysAssignments.find(a => a.taskId === taskId);
    if (assignment) {
      const employee = employees.find(e => e.id === assignment.employeeId);
      return employee ? { employeeId: employee.id, employeeName: employee.name } : null;
    }
    return null;
  };

  const getAssignedEmployeeIds = () => {
    return todaysAssignments.map(a => a.employeeId);
  };

  // If current user is an employee, show employee dashboard  
  if (currentUser.role === 'employee') {
    const employee = employees.find(e => e.id === currentUser.employeeId);
    if (!employee) {
      handleLogout();
      return null;
    }
    
    const employeeMetric = performanceMetrics.find(m => m.employeeId === currentUser.employeeId) || {
      employeeId: currentUser.employeeId!,
      employeeName: employee.name,
      totalTasks: 0,
      completedTasks: 0,
      averageCompletionTime: 0,
      efficiencyScore: 0,
      onTimeRate: 0,
      qualityScore: 0
    };
    
    return (
      <div>
        <Header 
          user={currentUser}
          onShowProfile={() => setShowProfile(true)}
          onShowAccountSettings={() => setShowAccountSettings(true)}
          onLogout={handleLogout}
        />
        <EmployeeDashboard
          employee={employee}
          assignments={assignments}
          tasks={tasks}
          performanceMetric={employeeMetric}
          onStartTask={startTask}
          onCompleteTask={completeTask}
          onPauseTask={pauseTask}
          onUpdateNotes={updateNotes}
        />
        {showProfile && (
          <UserProfile
            user={currentUser}
            onUpdateUser={handleUpdateUser}
            onClose={() => setShowProfile(false)}
          />
        )}
        {showAccountSettings && (
          <AccountSettings
            user={currentUser}
            onUpdateUser={handleUpdateUser}
            onClose={() => setShowAccountSettings(false)}
          />
        )}
      </div>
    );
  }

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'daily', label: 'Daily Tasks', icon: Calendar },
    { id: 'performance', label: 'Performance', icon: BarChart3 },
    { id: 'history', label: 'History', icon: Archive },
    { id: 'manage', label: 'Manage Tasks', icon: Wrench },
    { id: 'employees', label: 'Manage Employees', icon: Users },
    { id: 'roles', label: 'Manage Roles', icon: Users },
    { id: 'categories', label: 'Manage Categories', icon: Wrench }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header 
        user={currentUser}
        onShowProfile={() => setShowProfile(true)}
        onShowAccountSettings={() => setShowAccountSettings(true)}
        onLogout={handleLogout}
      />

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {navigation.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as any)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    currentView === item.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Team Leader Dashboard</h2>
              <p className="text-gray-600">
                Complete overview of your team's performance and current activities
              </p>
            </div>

            {/* Team Status Overview */}
            <TeamStatusOverview assignments={assignments} employees={employees} />

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Team Performance */}
              <PerformanceChart metrics={performanceMetrics} />
              
              {/* Recent Activities */}
              <RecentActivities assignments={assignments} tasks={tasks} employees={employees} />
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Task History Summary */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Archive className="w-6 h-6 text-purple-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Task History Summary</h2>
                  </div>
                  <button
                    onClick={() => setCurrentView('history')}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View All →
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{dailyReports.length}</div>
                    <div className="text-sm text-blue-600">Archived Days</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {dailyReports.reduce((sum, report) => sum + report.summary.completedTasks, 0)}
                    </div>
                    <div className="text-sm text-green-600">Total Completed</div>
                  </div>
                </div>
              </div>

              {/* Active Tasks */}
              <ActiveTasks assignments={assignments} tasks={tasks} employees={employees} />
            </div>
          </div>
        )}

        {currentView === 'daily' && (
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Today's Tasks</h2>
                <p className="text-gray-600">
                  {todaysAssignments.length} tasks assigned, {todaysAssignments.filter(a => a.status === 'completed').length} completed
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const availableTasks = getAvailableTasks();
                    if (availableTasks.length === 0 && todaysAssignments.length === tasks.length) {
                      alert('All tasks have been assigned for today. You can reassign existing tasks if needed.');
                      return;
                    }
                    setSelectedTask(availableTasks.length > 0 ? availableTasks[0] : tasks[0]);
                    setIsAssignmentModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Assign Task
                </button>
                <button
                  onClick={archiveDay}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <Archive className="w-4 h-4" />
                  Archive Day
                </button>
              </div>
            </div>

            {/* Task Grid */}
            {todaysAssignments.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Tasks Assigned</h3>
                <p className="text-gray-600 mb-6">
                  Start by assigning tasks to your team members for today.
                </p>
                <button
                  onClick={() => {
                    const availableTasks = getAvailableTasks();
                    setSelectedTask(availableTasks.length > 0 ? availableTasks[0] : tasks[0]);
                    setIsAssignmentModalOpen(true);
                  }}
                  className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Assign First Task
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {todaysAssignments.map(assignment => {
                  const task = tasks.find(t => t.id === assignment.taskId);
                  const employee = employees.find(e => e.id === assignment.employeeId);
                  
                  if (!task) return null;
                  
                  return (
                    <TaskCard
                      key={assignment.id}
                      assignment={assignment}
                      task={task}
                      employee={employee || null}
                      isLeaderView={true}
                      onSendNotification={(taskId, employeeId) => {
                        const taskObj = tasks.find(t => t.id === taskId);
                        const empObj = employees.find(e => e.id === employeeId);
                        if (taskObj && empObj) {
                          setSelectedTaskForNotification({ task: taskObj, employee: empObj });
                          setIsNotificationModalOpen(true);
                        }
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {currentView === 'performance' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Team Performance Analytics</h2>
              <p className="text-gray-600">
                Performance evaluation based on task completion speed, efficiency, and consistency
              </p>
            </div>
            <PerformanceChart metrics={performanceMetrics} />
          </div>
        )}

        {currentView === 'history' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Historical Data</h2>
              <p className="text-gray-600">
                Archived task data and performance history for analysis
              </p>
            </div>
            <HistoryView dailyReports={dailyReports} tasks={tasks} employees={employees} />
          </div>
        )}

        {currentView === 'manage' && (
          <TaskManagement 
            tasks={tasks} 
            onUpdateTasks={setTasks}
          />
        )}

        {currentView === 'employees' && (
          <EmployeeManagement 
            employees={employees} 
            onUpdateEmployees={setEmployees}
          />
        )}

        {currentView === 'roles' && <RoleManagement />}

        {currentView === 'categories' && <CategoryManagement />}
      </main>

      {/* User Profile Modal */}
      {showProfile && (
        <UserProfile
          user={currentUser}
          onUpdateUser={handleUpdateUser}
          onClose={() => setShowProfile(false)}
        />
      )}
      
      {showAccountSettings && (
        <AccountSettings
          user={currentUser}
          onUpdateUser={handleUpdateUser}
          onClose={() => setShowAccountSettings(false)}
        />
      )}

      {/* Task Assignment Modal */}
      <TaskAssignmentModal
        isOpen={isAssignmentModalOpen}
        onClose={() => {
          setIsAssignmentModalOpen(false);
          setSelectedTask(null);
        }}
        tasks={tasks}
        employees={employees}
        assignments={assignments}
        onAssign={assignTask}
      />
      
      {/* Task Notification Modal */}
      <TaskNotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => {
          setIsNotificationModalOpen(false);
          setSelectedTaskForNotification(null);
        }}
        task={selectedTaskForNotification?.task || null}
        employee={selectedTaskForNotification?.employee || null}
        onSendNotification={handleSendTaskNotification}
        onSendWhatsApp={handleSendWhatsAppNotification}
      />
    </div>
  );
}

export default App;