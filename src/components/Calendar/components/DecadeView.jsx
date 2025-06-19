import React from 'react';

const DecadeView = ({
  date,
  value,
  onYearSelect,
  tileDisabled,
  tileClassName,
  formatYear,
  showNeighboringCentury,
  locale,
  onDrillUp,
  className
}) => {
  const currentYear = date.getFullYear();
  const decadeStart = Math.floor(currentYear / 10) * 10;
  const years = [];

  // Generate years for the decade (with neighboring years if enabled)
  const startYear = showNeighboringCentury ? decadeStart - 1 : decadeStart;
  const endYear = showNeighboringCentury ? decadeStart + 11 : decadeStart + 9;

  for (let year = startYear; year <= endYear; year++) {
    const yearDate = new Date(year, 0, 1);
    const isDisabled = tileDisabled?.(year);
    const isCurrentDecade = year >= decadeStart && year <= decadeStart + 9;
    const isSelected = Array.isArray(value) ?
      value.some(v => v?.getFullYear() === year) :
      value?.getFullYear() === year;

    years.push({
      year,
      date: yearDate,
      isDisabled,
      isSelected,
      isCurrentDecade,
      label: formatYear ? formatYear(yearDate, locale) : year.toString()
    });
  }

  return (
    <div className={`decade-view ${className}`}>
      <div className="decade-header">
        <button 
          className="decade-title"
          onClick={onDrillUp}
          aria-label={`View century containing ${decadeStart}s`}
        >
          {decadeStart}s
        </button>
      </div>
      
      <div className="years-grid">
        {years.map(({ year, date: yearDate, isDisabled, isSelected, isCurrentDecade, label }) => (
          <button
            key={year}
            className={[
              'year-button',
              isSelected ? 'selected' : '',
              isDisabled ? 'disabled' : '',
              !isCurrentDecade ? 'neighboring' : '',
              tileClassName?.({ date: yearDate, view: 'decade' }) || ''
            ].filter(Boolean).join(' ')}
            onClick={() => !isDisabled && onYearSelect(yearDate)}
            disabled={isDisabled}
            aria-label={`Select year ${year}`}
            aria-pressed={isSelected}
          >
            <span className="year-label">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DecadeView;