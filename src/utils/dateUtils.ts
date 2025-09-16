export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}m`;
  }
  return `${hours}h ${mins}m`;
};

export const getMinutesBetween = (start: Date, end: Date): number => {
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
};

export const isToday = (dateString: string): boolean => {
  return dateString === formatDate(new Date());
};

export const isOverdue = (assignment: any): boolean => {
  if (assignment.status === 'completed' || assignment.status === 'paused') return false;
  
  const now = new Date();
  const assignedAt = new Date(assignment.assignedAt);
  const hoursElapsed = (now.getTime() - assignedAt.getTime()) / (1000 * 60 * 60);
  
  // Consider overdue if more than 8 hours for urgent, 12 hours for others
  const overdueHours = assignment.priority === 'urgent' ? 8 : 12;
  return hoursElapsed > overdueHours;
};