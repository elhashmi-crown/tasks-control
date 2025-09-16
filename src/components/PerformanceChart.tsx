import React from 'react';
import { BarChart3, TrendingUp, Award, Clock } from 'lucide-react';
import { PerformanceMetric } from '../types';
import { getPerformanceLevel } from '../utils/performanceUtils';

interface PerformanceChartProps {
  metrics: PerformanceMetric[];
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ metrics }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Team Performance Overview</h2>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {metrics.map(metric => {
          const performanceLevel = getPerformanceLevel(metric.qualityScore);
          
          return (
            <div key={metric.employeeId} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{metric.employeeName}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${performanceLevel.color}`}>
                  {performanceLevel.level}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{performanceLevel.description}</p>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Award className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-600">Completed</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {metric.completedTasks}/{metric.totalTasks}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Clock className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-gray-600">Avg Time</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {metric.averageCompletionTime}m
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingUp className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium text-gray-600">Efficiency</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {metric.efficiencyScore}%
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Award className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium text-gray-600">On Time</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {metric.onTimeRate}%
                  </div>
                </div>
              </div>
              
              {/* Quality Score Bar */}
              <div className="mb-2">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Overall Performance Score</span>
                  <span>{metric.qualityScore}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      metric.qualityScore >= 90 ? 'bg-emerald-500' :
                      metric.qualityScore >= 80 ? 'bg-blue-500' :
                      metric.qualityScore >= 70 ? 'bg-green-500' :
                      metric.qualityScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.max(0, Math.min(metric.qualityScore, 100))}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {metrics.length === 0 && (
        <div className="text-center py-8">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No performance data available yet</p>
        </div>
      )}
    </div>
  );
};