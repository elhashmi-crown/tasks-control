import React, { useState } from 'react';
import { Calendar, Filter, Download, Search, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { DailyReport, TaskAssignment } from '../types';
import { formatDate, formatDuration } from '../utils/dateUtils';

interface HistoryViewProps {
  dailyReports: DailyReport[];
  tasks: Task[];
  employees: Employee[];
}

export const HistoryView: React.FC<HistoryViewProps> = ({ dailyReports, tasks, employees }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredReports = dailyReports.filter(report => {
    if (selectedDate && report.date !== selectedDate) return false;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return report.assignments.some(assignment => 
        assignment.notes.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const exportToCSV = () => {
    const csvData = [];
    csvData.push(['Date', 'Employee Name', 'Task Name', 'Status', 'Start Time', 'End Time', 'Duration', 'Notes']);
    
    filteredReports.forEach(report => {
      report.assignments.forEach(assignment => {
        const task = tasks.find(t => t.id === assignment.taskId);
        const employee = employees.find(e => e.id === assignment.employeeId);
        
        csvData.push([
          report.date,
          employee?.name || 'Unknown Employee',
          task?.name || 'Unknown Task',
          assignment.status,
          assignment.startedAt ? new Date(assignment.startedAt).toLocaleString() : '',
          assignment.completedAt ? new Date(assignment.completedAt).toLocaleString() : '',
          assignment.actualMinutes ? formatDuration(assignment.actualMinutes) : '',
          assignment.notes
        ]);
      });
    });

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `task_history_${formatDate(new Date())}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Task History & Archive</h2>
          </div>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-48">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
            <option value="in_progress">In Progress</option>
          </select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {filteredReports.length > 0 && (
            <>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <h3 className="font-medium text-blue-900">Total Days</h3>
                </div>
                <p className="text-2xl font-bold text-blue-600">{filteredReports.length}</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="font-medium text-green-900">Completed Tasks</h3>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {filteredReports.reduce((sum, report) => sum + report.summary.completedTasks, 0)}
                </p>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <h3 className="font-medium text-red-900">Overdue Tasks</h3>
                </div>
                <p className="text-2xl font-bold text-red-600">
                  {filteredReports.reduce((sum, report) => sum + report.summary.overdueTasks, 0)}
                </p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <h3 className="font-medium text-purple-900">Avg Completion</h3>
                </div>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(filteredReports.reduce((sum, report) => sum + report.summary.averageCompletionTime, 0) / filteredReports.length)}m
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Historical Data */}
      <div className="space-y-4">
        {filteredReports.map(report => (
          <div key={report.date} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {new Date(report.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h3>
              <div className="flex gap-4 text-sm text-gray-600">
                <span>Total: {report.summary.totalTasks}</span>
                <span className="text-green-600">Completed: {report.summary.completedTasks}</span>
                <span className="text-red-600">Overdue: {report.summary.overdueTasks}</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-900">Task Name</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-900">Employee Name</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-900">Status</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-900">Duration</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-900">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {report.assignments.map(assignment => {
                    const task = tasks.find(t => t.id === assignment.taskId);
                    const employee = employees.find(e => e.id === assignment.employeeId);
                    
                    return (
                      <tr key={assignment.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium text-gray-900">{task?.name || 'Unknown Task'}</td>
                        <td className="px-4 py-2 text-gray-700">{employee?.name || 'Unknown Employee'}</td>
                        <td className="px-4 py-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            assignment.status === 'completed' ? 'bg-green-100 text-green-800' :
                            assignment.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            assignment.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {assignment.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-gray-700">
                          {assignment.actualMinutes ? formatDuration(assignment.actualMinutes) : '-'}
                        </td>
                        <td className="px-4 py-2 text-gray-700 max-w-xs truncate">
                          {assignment.notes || '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {filteredReports.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Historical Data Found</h3>
            <p className="text-gray-600">
              No task history matches your current filters. Try adjusting your search criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};