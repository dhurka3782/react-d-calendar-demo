import React from 'react';
import { getWeekNumber } from '../utils/dateUtils';

const MonthView = ({
  date,
  onDateSelect,
  onClickWeekNumber,
  tileContent,
  tileClassName,
  tileDisabled,
  showWeekNumbers,
  showNeighboringMonth,
  showFixedNumberOfWeeks,
  formatDay,
  formatWeekday,
  formatShortWeekday,
  weekdayFormat,
  locale,
  calendarType,
  onDrillDown,
  onDrillUp,
  showDoubleView,
  value,
  onHover,
  onClearHover,
  today,
  weekStartDay,
  className,
  onClickEvent,
  events,
  renderEvent,
  selectOnEventClick,
  days,
  rangeLimit
}) => {
  const weekdays = [];
  const startDate = new Date(date);
  startDate.setDate(1); // Start from the 1st of the month
  startDate.setDate(1 - (startDate.getDay() - weekStartDay + 7) % 7); // Align to weekStartDay

  for (let i = 0; i < 7; i++) {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + i);
    
    let weekdayText;
    if (formatWeekday) {
      weekdayText = formatWeekday(day, locale);
    } else if (formatShortWeekday) {
      weekdayText = formatShortWeekday(day, locale);
    } else {
      const options = weekdayFormat === 'full' ? { weekday: 'long' } : 
                    weekdayFormat === 'minimal' ? { weekday: 'narrow' } : 
                    { weekday: 'short' };
      weekdayText = day.toLocaleDateString(locale, options);
    }
    
    weekdays.push(weekdayText);
  }

  const renderWeekNumbers = (weekDays) => {
    if (!showWeekNumbers) return null;
    
    const weekNumber = getWeekNumber(weekDays[0]?.date || new Date(date));
    return (
      <div 
        className="week-number"
        onClick={() => onClickWeekNumber?.(weekNumber)}
        role="button"
        tabIndex={0}
      >
        {weekNumber}
      </div>
    );
  };

  const renderDay = (dayObj, index) => {
    const { date: dayDate, isCurrentMonth, isPreviousMonth, isNextMonth, isPlaceholder } = dayObj;
    if (!dayDate && isPlaceholder) return <div key={index} className="calendar-day placeholder" />;

    const isDisabled = tileDisabled?.(dayDate) || (!showNeighboringMonth && !isCurrentMonth);
    const isToday = dayDate?.toDateString() === today.toDateString();
    
    const classNames = [
      'calendar-day',
      isCurrentMonth ? 'current-month' : '',
      isPreviousMonth ? 'previous-month' : '',
      isNextMonth ? 'next-month' : '',
      isDisabled ? 'disabled' : '',
      isToday ? 'today' : '',
      tileClassName?.({ date: dayDate, view: 'month' }) || ''
    ].filter(Boolean).join(' ');

    const dayEvents = dayDate ? events?.filter(event => 
      event.date.toDateString() === dayDate.toDateString()
    ) : [];

    return (
      <div
        key={`${dayDate?.getFullYear()}-${dayDate?.getMonth()}-${dayDate?.getDate()}`}
        className={classNames}
        onClick={() => {
          if (!isDisabled && dayDate) {
            onDateSelect(dayDate);
            if (selectOnEventClick && dayEvents.length > 0) {
              dayEvents.forEach(event => onClickEvent?.(event, dayDate));
            }
          }
        }}
        onMouseEnter={() => !isDisabled && dayDate && onHover?.(dayDate)}
        onMouseLeave={() => onClearHover?.()}
        role="button"
        tabIndex={isDisabled || !dayDate ? -1 : 0}
        aria-label={dayDate ? `Select ${dayDate.toLocaleDateString(locale)}` : ''}
        aria-disabled={isDisabled}
        aria-pressed={Array.isArray(value) ? 
          value.some(v => v?.toDateString() === dayDate?.toDateString()) :
          value?.toDateString() === dayDate?.toDateString()
        }
      >
        <span className="day-number">
          {dayDate ? (formatDay ? formatDay(dayDate, locale) : dayDate.getDate()) : ''}
        </span>
        
        {dayEvents.length > 0 && dayDate && (
          <div className="day-events">
            {dayEvents.slice(0, 3).map((event, eventIndex) => (
              <div
                key={eventIndex}
                className={`event-dot event-${event.type || 'default'}`}
                style={{ backgroundColor: event.color }}
                title={event.title}
                onClick={(e) => {
                  e.stopPropagation();
                  onClickEvent?.(event, dayDate);
                }}
              />
            ))}
            {dayEvents.length > 3 && (
              <div className="event-more">+{dayEvents.length - 3}</div>
            )}
          </div>
        )}
        
        {tileContent?.({ date: dayDate, view: 'month' })}
      </div>
    );
  };

  const renderCalendar = (calendarDays, isSecondary = false) => {
    const weeks = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      weeks.push(calendarDays.slice(i, i + 7));
    }

    return (
      <div className={`month-grid ${isSecondary ? 'secondary' : 'primary'} ${className}`}>
        <div className="weekday-header">
          {showWeekNumbers && <div className="week-header">Wk</div>}
          {weekdays.map((weekday, index) => (
            <div key={index} className="weekday">
              {weekday}
            </div>
          ))}
        </div>
        
        <div className="days-grid">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="week-row">
              {renderWeekNumbers(week)}
              {week.map((day, dayIndex) => renderDay(day, weekIndex * 7 + dayIndex))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`month-view ${showDoubleView ? 'double-view' : 'single-view'}`}>
      {renderCalendar(days.first)}
      {showDoubleView && days.second.length > 0 && renderCalendar(days.second, true)}
    </div>
  );
};

export default MonthView;