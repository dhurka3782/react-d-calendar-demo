import React from 'react';

const YearView = ({
  date,
  value,
  onMonthSelect,
  tileDisabled,
  tileClassName,
  formatMonth,
  showNeighboringDecade,
  locale,
  onDrillUp,
  className
}) => {
  const year = date.getFullYear();
  const months = [];

  // Generate months for the year
  for (let month = 0; month < 12; month++) {
    const monthDate = new Date(year, month, 1);
    const isDisabled = tileDisabled?.(monthDate);
    const isSelected = Array.isArray(value) ?
      value.some(v => v?.getFullYear() === year && v?.getMonth() === month) :
      value?.getFullYear() === year && value?.getMonth() === month;

    months.push({
      date: monthDate,
      month,
      isDisabled,
      isSelected,
      label: formatMonth ? formatMonth(monthDate, locale) : monthDate.toLocaleDateString(locale, { month: 'short' })
    });
  }

  return (
    <div className={`year-view ${className}`}>
      <div className="year-header">
        <button 
          className="year-title"
          onClick={onDrillUp}
          aria-label={`View decade containing ${year}`}
        >
          {year}
        </button>
      </div>
      
      <div className="months-grid">
        {months.map(({ date: monthDate, month, isDisabled, isSelected, label }) => (
          <button
            key={month}
            className={[
              'month-button',
              isSelected ? 'selected' : '',
              isDisabled ? 'disabled' : '',
              tileClassName?.({ date: monthDate, view: 'year' }) || ''
            ].filter(Boolean).join(' ')}
            onClick={() => !isDisabled && onMonthSelect(monthDate)}
            disabled={isDisabled}
            aria-label={`Select ${label} ${year}`}
            aria-pressed={isSelected}
          >
            <span className="month-label">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default YearView;