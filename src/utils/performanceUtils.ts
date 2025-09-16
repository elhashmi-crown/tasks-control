import { TaskAssignment, Task, PerformanceMetric } from '../types';

export const calculatePerformanceMetrics = (
  assignments: TaskAssignment[],
  tasks: Task[],
  employeeId: string,
  employeeName: string
): PerformanceMetric => {
  const employeeAssignments = assignments.filter(a => a.employeeId === employeeId);
  const completedAssignments = employeeAssignments.filter(a => a.status === 'completed');
  
  // Calculate average completion time
  const totalMinutes = completedAssignments.reduce((sum, assignment) => {
    return sum + (assignment.actualMinutes || 0);
  }, 0);
  const averageCompletionTime = completedAssignments.length > 0 
    ? totalMinutes / completedAssignments.length 
    : 0;

  // Calculate efficiency score (actual time vs estimated time)
  let efficiencyScore = 100;
  if (completedAssignments.length > 0) {
    const efficiencyRatios = completedAssignments.map(assignment => {
      const task = tasks.find(t => t.id === assignment.taskId);
      if (!task || !assignment.actualMinutes) return 1;
      
      // Lower ratio is better (completed faster than estimated)
      return assignment.actualMinutes / task.estimatedMinutes;
    });
    
    const avgRatio = efficiencyRatios.reduce((sum, ratio) => sum + ratio, 0) / efficiencyRatios.length;
    // Convert to score where 100 = exactly on time, >100 = faster, <100 = slower
    efficiencyScore = Math.max(0, Math.round(200 - (avgRatio * 100)));
  }

  // Calculate on-time rate
  const onTimeAssignments = completedAssignments.filter(assignment => {
    if (!assignment.actualMinutes || !assignment.completedAt || !assignment.assignedAt) return false;
    
    const task = tasks.find(t => t.id === assignment.taskId);
    if (!task) return false;
    
    const assignedTime = new Date(assignment.assignedAt).getTime();
    const completedTime = new Date(assignment.completedAt).getTime();
    const actualHours = (completedTime - assignedTime) / (1000 * 60 * 60);
    
    // Consider on-time if completed within reasonable timeframe
    const maxHours = task.priority === 'urgent' ? 4 : 
                    task.priority === 'high' ? 6 : 
                    task.priority === 'medium' ? 8 : 12;
    
    return actualHours <= maxHours;
  });
  
  const onTimeRate = completedAssignments.length > 0 
    ? (onTimeAssignments.length / completedAssignments.length) * 100 
    : 0;

  // Quality score (simplified - based on notes and completion rate)
  const qualityScore = Math.round((onTimeRate + efficiencyScore) / 2);

  return {
    employeeId,
    employeeName,
    totalTasks: employeeAssignments.length,
    completedTasks: completedAssignments.length,
    averageCompletionTime: Math.round(averageCompletionTime),
    efficiencyScore: Math.round(efficiencyScore),
    onTimeRate: Math.round(onTimeRate),
    qualityScore: Math.round(qualityScore)
  };
};

export const getPerformanceLevel = (score: number): { level: string; color: string; description: string } => {
  if (score >= 90) {
    return {
      level: 'Excellent',
      color: 'text-emerald-600 bg-emerald-50',
      description: 'Consistently exceeds expectations with fast, accurate work'
    };
  } else if (score >= 80) {
    return {
      level: 'Very Good',
      color: 'text-blue-600 bg-blue-50',
      description: 'Regularly meets expectations with good efficiency'
    };
  } else if (score >= 70) {
    return {
      level: 'Good',
      color: 'text-green-600 bg-green-50',
      description: 'Generally meets expectations with room for improvement'
    };
  } else if (score >= 60) {
    return {
      level: 'Fair',
      color: 'text-yellow-600 bg-yellow-50',
      description: 'Sometimes meets expectations, needs support'
    };
  } else {
    return {
      level: 'Needs Improvement',
      color: 'text-red-600 bg-red-50',
      description: 'Requires additional training and close monitoring'
    };
  }
};