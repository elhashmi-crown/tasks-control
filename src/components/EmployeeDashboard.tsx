import React, { useState } from 'react';
import { User, Clock, CheckCircle, PlayCircle, PauseCircle, Calendar, BarChart3 } from 'lucide-react';
import { TaskCard } from './TaskCard';
import { TaskAssignment, Task, Employee, PerformanceMetric } from '../types';
import { formatDate, formatDuration } from '../utils/dateUtils';

interface EmployeeDashboardProps {
  employee: Employee;
  assignments: TaskAssignment[];
  tasks: Task[];
  performanceMetric: PerformanceMetric;
  onStartTask: (assignmentId: string) => void;
  onCompleteTask: (assignmentId: string, notes: string) => void;
  onPauseTask: (assignmentId: string) => void;
  onUpdateNotes: (assignmentId: string, notes: string) => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({
  employee,
  assignments,
  tasks,
  performanceMetric,
  onStartTask,
  onCompleteTask,
  onPauseTask,
  onUpdateNotes
}) => {
  const today = formatDate(new Date());
  const todaysAssignments = assignments.filter(a => a.date === today && a.employeeId === employee.id);
  
  const notStartedTasks = todaysAssignments.filter(a => a.status === 'not_started');
  const inProgressTasks = todaysAssignments.filter(a => a.status === 'in_progress');
  const completedTasks = todaysAssignments.filter(a => a.status === 'completed');
  const pausedTasks = todaysAssignments.filter(a => a.status === 'paused');

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600 bg-emerald-50';
    if (score >= 80) return 'text-blue-600 bg-blue-50';
    if (score >= 70) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-8">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Not Started</p>
                <p className="text-2xl font-bold text-gray-900">{notStartedTasks.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <PlayCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{inProgressTasks.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{completedTasks.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <PauseCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Paused</p>
                <p className="text-2xl font-bold text-yellow-600">{pausedTasks.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-900">Your Performance</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {performanceMetric.completedTasks}/{performanceMetric.totalTasks}
              </div>
              <div className="text-sm text-gray-600">Tasks Completed</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {performanceMetric.averageCompletionTime}m
              </div>
              <div className="text-sm text-gray-600">Avg Completion Time</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {performanceMetric.efficiencyScore}%
              </div>
              <div className="text-sm text-gray-600">Efficiency Score</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {performanceMetric.onTimeRate}%
              </div>
              <div className="text-sm text-gray-600">On-Time Rate</div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Overall Performance Score</span>
              <span>{performanceMetric.qualityScore}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-3 rounded-full transition-all ${
                  performanceMetric.qualityScore >= 90 ? 'bg-emerald-500' :
                  performanceMetric.qualityScore >= 80 ? 'bg-blue-500' :
                  performanceMetric.qualityScore >= 70 ? 'bg-green-500' :
                  performanceMetric.qualityScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(performanceMetric.qualityScore, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Today's Tasks */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Today's Tasks</h2>
              <p className="text-gray-600">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          {todaysAssignments.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Tasks Assigned</h3>
              <p className="text-gray-600">
                You don't have any tasks assigned for today. Check back later or contact your team leader.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {todaysAssignments.map(assignment => {
                const task = tasks.find(t => t.id === assignment.taskId);
                
                if (!task) return null;
                
                return (
                  <TaskCard
                    key={assignment.id}
                    assignment={assignment}
                    task={task}
                    employee={employee}
                    isLeaderView={false}
                    onStartTask={onStartTask}
                    onCompleteTask={onCompleteTask}
                    onPauseTask={onPauseTask}
                    onUpdateNotes={onUpdateNotes}
                  />
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};