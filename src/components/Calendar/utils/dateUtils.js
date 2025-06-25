export const getDaysInMonth = (date, weekStartDay = 0, calendarType = 'gregorian', showFixedNumberOfWeeks = false, showNeighboringMonth = true) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  
  // Get first and last day of the month
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  // Calculate the first day of the week offset
  const firstDayOfWeek = (firstDay.getDay() - weekStartDay + 7) % 7;
  
  const days = [];
  
  // Add previous month days if showNeighboringMonth is true
  if (showNeighboringMonth && firstDayOfWeek > 0) {
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month - 1, prevMonth.getDate() - i);
      days.push({
        date: prevDate,
        isCurrentMonth: false,
        isPreviousMonth: true,
        isNextMonth: false
      });
    }
  }
  
  // Add current month days
  for (let day = 1; day <= lastDay.getDate(); day++) {
    days.push({
      date: new Date(year, month, day),
      isCurrentMonth: true,
      isPreviousMonth: false,
      isNextMonth: false
    });
  }
  
  // Add next month days to complete the grid
  if (showNeighboringMonth || showFixedNumberOfWeeks) {
    const totalCells = showFixedNumberOfWeeks ? 42 : Math.ceil(days.length / 7) * 7;
    const remainingCells = totalCells - days.length;
    
    for (let day = 1; day <= remainingCells; day++) {
      days.push({
        date: new Date(year, month + 1, day),
        isCurrentMonth: false,
        isPreviousMonth: false,
        isNextMonth: true
      });
    }
  } else if (showFixedNumberOfWeeks && days.length < 42) {
    // Fill with placeholders if fixed weeks are enabled but neighboring months are off
    const remainingCells = 42 - days.length;
    for (let i = 0; i < remainingCells; i++) {
      days.push({
        date: null,
        isCurrentMonth: false,
        isPreviousMonth: false,
        isNextMonth: false,
        isPlaceholder: true
      });
    }
  }
  
  return days;
};

export const isValidDate = (date) => {
  return date instanceof Date && !isNaN(date.getTime());
};

export const sanitizeDate = (date) => {
  if (!isValidDate(date)) {
    return new Date();
  }
  const sanitized = new Date(date);
  sanitized.setHours(0, 0, 0, 0);
  return sanitized;
};

export const formatDate = (date, format = 'mm/dd/yyyy', locale = 'en-US') => {
  if (!isValidDate(date)) return '';
  
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  
  switch (format) {
    case 'dd/mm/yyyy':
      return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
    case 'yyyy-mm-dd':
      return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    case 'mm-dd-yyyy':
      return `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}-${year}`;
    case 'dd-mm-yyyy':
      return `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;
    case 'mm/dd/yyyy':
    default:
      return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
  }
};

export const getWeekNumber = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};