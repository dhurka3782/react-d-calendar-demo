import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Header from './components/Header';
import MonthView from './components/MonthView';
import YearView from './components/YearView';
import DayView from './components/DayView';
import DecadeView from './components/DecadeView';
import { getDaysInMonth, isValidDate, sanitizeDate } from './utils/dateUtils';
import './styles.css';

const lightTheme = {
  'background-color': '#f7fafc',
  'text-color': '#2d3748',
  'primary-color': '#4b6cb7',
  'accent-color': '#48bb78',
  'header-background': '#f7fafc',
  'disabled-color': '#a0aec0',
};

const darkTheme = {
  'background-color': '#1a202c',
  'text-color': '#e2e8f0',
  'primary-color': '#63b3ed',
  'accent-color': '#68d391',
  'header-background': '#2d3748',
  'disabled-color': '#718096',
};

const Calendar = ({
  date = new Date(),
  value = null,
  activeStartDate = null,
  minDate = null,
  maxDate = null,
  disableDate = null,
  disableYear = null,
  disableMonth = null,
  selectionMode = 'single',
  calendarType = 'gregorian',
  locale = 'en-US',
  showDoubleView = false,
  showFixedNumberOfWeeks = false,
  showNavigation = true,
  showNeighboringMonth = true,
  showNeighboringDecade = true,
  showWeekNumbers = false,
  view = 'month',
  maxDetail = 'month',
  minDetail = 'year',
  theme = 'light',
  events = [],
  rangeLimit = null,
  formatDay = null,
  formatMonth = null,
  formatMonthYear = null,
  formatYear = null,
  formatWeekday = null,
  formatShortWeekday = null,
  formatLongDate = null,
  weekdayFormat = 'short',
  dateFormat = 'mm/dd/yyyy',
  includeTime = false,
  navigationLabel = null,
  navigationAriaLabel = 'Select year',
  navigationAriaLive = 'polite',
  prevLabel = <ChevronLeft size={18} />,
  prevAriaLabel = 'Previous',
  nextLabel = <ChevronRight size={18} />,
  nextAriaLabel = 'Next',
  prev2Label = null,
  prev2AriaLabel = null,
  next2Label = null,
  next2AriaLabel = null,
  onChange = null,
  onClickMonth = null,
  onClickWeekNumber = null,
  onActiveStartDateChange = null,
  onViewChange = null,
  onDrillDown = null,
  onDrillUp = null,
  onRangeHover = null,
  tileClassName = null,
  tileContent = null,
  tileDisabled = null,
  className = '',
  style = {},
  inputRef = null,
  renderHeader = null,
  renderMonthView = null,
  renderYearView = null,
  renderDayView = null,
  renderDecadeView = null,
  customTileContent = null,
  customTheme = {},
  dayViewClassName = '',
  monthViewClassName = '',
  yearViewClassName = '',
  styleOverrides = {},
  holidayDates = [],
  renderCustomFooter = null,
  weekStartDay = 0,
  disabledViews = [],
  onClickEvent = null,
  renderEvent = null,
  selectOnEventClick = true,
  disableBeforeToday = false,
  customDisabledDates = [],
  customDisabledYears = [],
  customDisabledMonths = [],
  backLabel = 'Back',
  eventTooltip = false,
  customEventStyles = {},
}) => {
  // Validation
  if (!isValidDate(date)) {
    console.warn('Invalid date prop, defaulting to current date.');
    date = new Date();
  }
  if (calendarType !== 'gregorian') {
    throw new Error(`Unsupported calendar type: ${calendarType}. Only 'gregorian' is supported.`);
  }
  if (weekStartDay < 0 || weekStartDay > 6) {
    console.warn(`Invalid weekStartDay: ${weekStartDay}. Defaulting to 0 (Sunday).`);
    weekStartDay = 0;
  }
  const validDateFormats = ['mm/dd/yyyy', 'dd/mm/yyyy', 'yyyy-mm-dd', 'mm-dd-yyyy', 'dd-mm-yyyy'];
  if (!validDateFormats.includes(dateFormat)) {
    console.warn(`Invalid dateFormat: ${dateFormat}. Defaulting to 'mm/dd/yyyy'.`);
    dateFormat = 'mm/dd/yyyy';
  }
  if (!['single', 'range'].includes(selectionMode)) {
    console.warn(`Invalid selectionMode: ${selectionMode}. Defaulting to 'single'.`);
    selectionMode = 'single';
  }
  if (!['day', 'month', 'year', 'decade'].includes(view)) {
    console.warn(`Invalid view: ${view}. Defaulting to 'month'.`);
    view = 'month';
  }

  // State
  const [currentView, setCurrentView] = useState(view);
  const [activeDate, setActiveDate] = useState(sanitizeDate(activeStartDate || date));
  const [selectedValue, setSelectedValue] = useState(value);
  const [internalRangeStart, setInternalRangeStart] = useState(null);
  const controlledRangeStart = internalRangeStart;
  const hoverRef = useRef(null);
  const [viewHistory, setViewHistory] = useState([]);
  const [controlledHoveredDate, setControlledHoveredDate] = useState(null);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Ensure activeDate is valid
  useEffect(() => {
    if (!isValidDate(activeDate)) {
      setActiveDate(new Date(today.getFullYear(), today.getMonth(), 1));
    }
  }, [activeDate, today]);

  // Theme handling
  const baseTheme = theme === 'dark' ? darkTheme : lightTheme;
  const finalTheme = { ...baseTheme, ...customTheme };
  const themeStyles = useMemo(
    () =>
      Object.entries(finalTheme).reduce((styles, [key, value]) => {
        styles[`--${key}`] = value;
        return styles;
      }, {}),
    [finalTheme]
  );

  // Handlers
  const handleViewChange = useCallback(
    (newView) => {
      if (
        disabledViews.includes(newView) ||
        (newView === 'day' && maxDetail === 'month') ||
        (newView === 'year' && minDetail === 'month') ||
        (newView === 'decade' && minDetail === 'year')
      ) {
        return;
      }
      setViewHistory((prev) => [...prev, currentView]);
      setCurrentView(newView);
      onViewChange?.({ view: newView });
    },
    [maxDetail, minDetail, onViewChange, currentView, disabledViews]
  );

  const handleBackView = useCallback(() => {
    const lastView = viewHistory[viewHistory.length - 1];
    if (lastView) {
      setCurrentView(lastView);
      setViewHistory((prev) => prev.slice(0, -1));
      onViewChange?.({ view: lastView });
    }
  }, [viewHistory, onViewChange]);

  const handleActiveDateChange = useCallback(
    (newDate) => {
      if (!isValidDate(newDate)) return;
      setActiveDate(sanitizeDate(newDate));
      onActiveStartDateChange?.({ activeStartDate: newDate });
    },
    [onActiveStartDateChange]
  );

  const handleDateSelect = useCallback(
    (date) => {
      if (!isValidDate(date)) return;
      if (selectionMode === 'range') {
        if (!controlledRangeStart) {
          setInternalRangeStart(date);
          setSelectedValue([date]);
          setControlledHoveredDate(null);
          onChange?.([date]);
        } else {
          if (rangeLimit) {
            const diffTime = Math.abs(date - controlledRangeStart);
            const diffDays = diffTime / (1000 * 60 * 60 * 24);
            if (diffDays > rangeLimit) return;
          }
          const range = [controlledRangeStart, date].sort((a, b) => a - b);
          setSelectedValue(range);
          setInternalRangeStart(null);
          onChange?.(range);
          setControlledHoveredDate(null);
        }
      } else {
        setSelectedValue(date);
        setInternalRangeStart(null);
        onChange?.(date);
      }
    },
    [selectionMode, controlledRangeStart, onChange, rangeLimit]
  );

  const isDateDisabled = useCallback(
    (date) => {
      if (!isValidDate(date)) return true;
      const isBeforeToday = disableBeforeToday && date < today;
      const isCustomDisabled = customDisabledDates.some(
        (d) => isValidDate(d) && d.toDateString() === date.toDateString()
      );
      if (minDate && isValidDate(minDate) && date < minDate) return true;
      if (maxDate && isValidDate(maxDate) && date > maxDate) return true;
      if (disableDate) return disableDate(date);
      return isBeforeToday || isCustomDisabled;
    },
    [minDate, maxDate, disableDate, disableBeforeToday, customDisabledDates, today]
  );

  const isYearDisabled = useCallback(
    (year) => {
      const currentYear = today.getFullYear();
      const isBeforeCurrentYear = year < currentYear;
      const isCustomDisabled = customDisabledYears.includes(year);
      if (disableYear) return disableYear(year);
      return isBeforeCurrentYear || isCustomDisabled;
    },
    [disableYear, customDisabledYears, today]
  );

  const isMonthDisabled = useCallback(
    (monthDate) => {
      if (!isValidDate(monthDate)) return true;
      const isBeforeToday = disableBeforeToday && monthDate < new Date(today.getFullYear(), today.getMonth(), 1);
      const isCustomDisabled = customDisabledMonths.some(
        (m) => m.year === monthDate.getFullYear() && m.month === monthDate.getMonth()
      );
      if (disableYear) return disableYear(monthDate.getFullYear());
      return isBeforeToday || isCustomDisabled;
    },
    [disableYear, disableBeforeToday, customDisabledMonths, today]
  );

  const handleHover = useCallback(
    (date) => {
      if (!isValidDate(date)) return;
      if (selectionMode === 'range' && controlledRangeStart) {
        hoverRef.current = date;
        setControlledHoveredDate(date);
        if (onRangeHover && !tileDisabled?.({ date })) {
          onRangeHover({ start: controlledRangeStart, end: date });
        }
      }
    },
    [selectionMode, controlledRangeStart, onRangeHover, tileDisabled]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (currentView !== 'month') return;
      const newDate = new Date(activeDate);
      let nextButton;
      switch (e.key) {
        case 'ArrowLeft':
          newDate.setDate(newDate.getDate() - 1);
          handleActiveDateChange(newDate);
          nextButton = document.querySelector(`.calendar-day[aria-label*="Select ${newDate.toLocaleDateString(locale)}"]`);
          nextButton?.focus();
          break;
        case 'ArrowRight':
          newDate.setDate(newDate.getDate() + 1);
          handleActiveDateChange(newDate);
          nextButton = document.querySelector(`.calendar-day[aria-label*="Select ${newDate.toLocaleDateString(locale)}"]`);
          nextButton?.focus();
          break;
        case 'ArrowUp':
          newDate.setDate(newDate.getDate() - 7);
          handleActiveDateChange(newDate);
          nextButton = document.querySelector(`.calendar-day[aria-label*="Select ${newDate.toLocaleDateString(locale)}"]`);
          nextButton?.focus();
          break;
        case 'ArrowDown':
          newDate.setDate(newDate.getDate() + 7);
          handleActiveDateChange(newDate);
          nextButton = document.querySelector(`.calendar-day[aria-label*="Select ${newDate.toLocaleDateString(locale)}"]`);
          nextButton?.focus();
          break;
        case 'Enter':
          if (!isDateDisabled(activeDate)) {
            handleDateSelect(activeDate);
          }
          break;
        case 'Backspace':
          handleBackView();
          break;
        default:
          break;
      }
    },
    [currentView, activeDate, handleActiveDateChange, handleDateSelect, isDateDisabled, handleBackView, locale]
  );

  const getTileClassName = useCallback(
    ({ date }) => {
      if (!isValidDate(date)) return '';
      const baseClasses = tileClassName?.({ date }) || '';
      const event = events.find((e) => isValidDate(e.date) && e.date.toDateString() === date.toDateString());
      const eventClasses = event ? `has-event event-${event.type || 'default'}` : '';
      const holidayClasses = holidayDates.some(
        (holiday) => isValidDate(holiday) && holiday.toDateString() === date.toDateString()
      ) ? 'holiday' : '';

      if (selectionMode === 'range' && controlledRangeStart && controlledHoveredDate) {
        const [start, end] =
          controlledRangeStart < controlledHoveredDate
            ? [controlledRangeStart, controlledHoveredDate]
            : [controlledHoveredDate, controlledRangeStart];
        if (date >= start && date <= end) {
          return `${baseClasses} range-preview ${date.toDateString() === controlledHoveredDate.toDateString() ? 'hover-range-end' : ''} ${eventClasses} ${holidayClasses}`.trim();
        }
        if (date.toDateString() === controlledRangeStart.toDateString()) {
          return `${baseClasses} selected-start ${eventClasses} ${holidayClasses}`.trim();
        }
      }

      if (Array.isArray(selectedValue)) {
        const [start, end] = selectedValue;
        if (start && isValidDate(start) && date.toDateString() === start.toDateString()) {
          return `${baseClasses} selected-start ${eventClasses} ${holidayClasses}`.trim();
        }
        if (end && isValidDate(end) && date.toDateString() === end.toDateString()) {
          return `${baseClasses} selected-end ${eventClasses} ${holidayClasses}`.trim();
        }
        if (start && end && isValidDate(start) && isValidDate(end) && date > start && date < end) {
          return `${baseClasses} in-range ${eventClasses} ${holidayClasses}`.trim();
        }
      } else if (selectedValue && isValidDate(selectedValue) && date.toDateString() === selectedValue.toDateString()) {
        return `${baseClasses} selected ${eventClasses} ${holidayClasses}`.trim();
      }

      return `${baseClasses} ${eventClasses} ${holidayClasses}`.trim();
    },
    [tileClassName, selectionMode, controlledRangeStart, selectedValue, events, controlledHoveredDate, holidayDates]
  );

  const memoizedTileContent = useMemo(
    () =>
      ({ date, view }) => {
        if (!isValidDate(date)) return null;
        const event = events.find((e) => isValidDate(e.date) && e.date.toDateString() === date.toDateString());
        if (event && view === 'month') {
          return (
            <>
              <div
                className="event-indicator"
                style={{ backgroundColor: event.color || customEventStyles[event.type] || '#295d96' }}
              >
                {tileContent ? tileContent({ date, view }) : date.getDate()}
              </div>
              {eventTooltip && (
                <div className="event-tooltip">
                  {event.title || 'Event'}
                </div>
              )}
              <span id={`event-${date.toISOString()}`} className="sr-only">
                {event.title || 'Event'}
              </span>
            </>
          );
        }
        return tileContent ? tileContent({ date, view }) : null;
      },
    [events, tileContent, eventTooltip, customEventStyles]
  );

  const memoizedDays = useMemo(() => {
    const firstDays = getDaysInMonth(activeDate, weekStartDay, calendarType, showFixedNumberOfWeeks, showNeighboringMonth);
    const secondDays = showDoubleView
      ? getDaysInMonth(
          new Date(activeDate.getFullYear(), activeDate.getMonth() + 1),
          weekStartDay,
          calendarType,
          showFixedNumberOfWeeks,
          showNeighboringMonth
        )
      : [];
    return {
      first: firstDays.map((d) => ({ ...d })),
      second: secondDays.map((d) => ({ ...d })),
    };
  }, [activeDate, weekStartDay, calendarType, showFixedNumberOfWeeks, showNeighboringMonth, showDoubleView]);

  const renderView = () => {
    switch (currentView) {
      case 'day':
        return renderDayView ? (
          renderDayView({ date: activeDate, onDateSelect: handleDateSelect })
        ) : (
          <DayView
            date={activeDate}
            onDateSelect={handleDateSelect}
            tileContent={memoizedTileContent}
            tileClassName={getTileClassName}
            tileDisabled={tileDisabled || isDateDisabled}
            formatLongDate={formatLongDate}
            dateFormat={dateFormat}
            weekdayFormat={weekdayFormat}
            monthFormat={formatMonth}
            includeTime={includeTime}
            locale={locale}
            onDrillUp={() => {
              handleViewChange('month');
              onDrillUp?.();
            }}
            today={today}
            className={dayViewClassName}
            onClickEvent={onClickEvent}
            events={events}
            renderEvent={renderEvent}
            selectOnEventClick={selectOnEventClick}
          />
        );
      case 'year':
        return renderYearView ? (
          renderYearView({ date: activeDate, onMonthSelect })
        ) : (
          <YearView
            date={activeDate}
            value={selectedValue}
            onMonthSelect={(monthDate) => {
              handleActiveDateChange(monthDate);
              handleViewChange('month');
              onClickMonth?.(monthDate);
              onDrillDown?.();
            }}
            tileDisabled={isMonthDisabled}
            tileClassName={tileClassName}
            formatMonth={formatMonth}
            showNeighboringDecade={showNeighboringDecade}
            locale={locale}
            onDrillUp={() => {
              handleViewChange('decade');
              onDrillUp?.();
            }}
            className={yearViewClassName}
          />
        );
      case 'decade':
        return renderDecadeView ? (
          renderDecadeView({ date: activeDate, onYearSelect })
        ) : (
          <DecadeView
            date={activeDate}
            value={selectedValue}
            onYearSelect={(yearDate) => {
              handleActiveDateChange(yearDate);
              handleViewChange('year');
              onDrillDown?.();
            }}
            tileDisabled={isYearDisabled}
            tileClassName={tileClassName}
            formatYear={formatYear}
            showNeighboringCentury={showNeighboringDecade}
            locale={locale}
            onDrillUp={() => {
              handleViewChange('year');
              onDrillUp?.();
            }}
            className={yearViewClassName}
          />
        );
      case 'month':
        return renderMonthView ? (
          renderMonthView({ date: activeDate, onDateSelect: handleDateSelect })
        ) : (
          <MonthView
            date={activeDate}
            onDateSelect={handleDateSelect}
            onClickWeekNumber={onClickWeekNumber}
            tileContent={customTileContent}
            tileClassName={getTileClassName}
            tileDisabled={tileDisabled || isDateDisabled}
            showWeekNumbers={showWeekNumbers}
            showNeighboringMonth={showNeighboringMonth}
            showFixedNumberOfWeeks={showFixedNumberOfWeeks}
            formatDay={formatDay}
            formatWeekday={formatWeekday}
            formatShortWeekday={formatShortWeekday}
            weekdayFormat={weekdayFormat}
            locale={locale}
            calendarType={calendarType}
            onDrillDown={() => {
              handleViewChange('day');
              onDrillDown?.();
            }}
            onDrillUp={() => {
              handleViewChange('year');
              onDrillUp?.();
            }}
            showDoubleView={showDoubleView}
            value={selectedValue}
            onHover={handleHover}
            onClearHover={() => {
              hoverRef.current = null;
              setControlledHoveredDate(null);
              onRangeHover?.({ start: controlledRangeStart, end: null });
            }}
            today={today}
            weekStartDay={weekStartDay}
            className={monthViewClassName}
            onClickEvent={onClickEvent}
            events={events}
            renderEvent={renderEvent}
            selectOnEventClick={selectOnEventClick}
            days={memoizedDays}
            rangeLimit={rangeLimit}
            renderDayCell={null} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`calendar ${className} ${showDoubleView ? 'double-view' : ''} theme-${theme} ${customTheme ? 'custom-theme' : ''}`}
      style={{ ...style, ...themeStyles, ...styleOverrides.calendar }}
      ref={inputRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="Interactive Calendar"
      role="calendar"
    >
      {showNavigation &&
        (renderHeader ? (
          renderHeader({ date: activeDate, onChange: handleActiveDateChange, view: currentView })
        ) : (
          <Header
            date={activeDate}
            onChange={handleActiveDateChange}
            view={currentView}
            minDetail={minDetail}
            maxDetail={maxDetail}
            prevLabel={prevLabel}
            prevAriaLabel={prevAriaLabel}
            nextLabel={nextLabel}
            nextAriaLabel={nextAriaLabel}
            prev2Label={prev2Label}
            prev2AriaLabel={prev2AriaLabel}
            next2Label={next2Label}
            next2AriaLabel={next2AriaLabel}
            navigationLabel={navigationLabel}
            navigationAriaLabel={navigationAriaLabel}
            navigationAriaLive={navigationAriaLive}
            formatMonthYear={formatMonthYear}
            formatYear={formatYear}
            locale={locale}
            showDoubleView={showDoubleView}
            style={styleOverrides.header}
            isYearDisabled={isYearDisabled}
          />
        ))}
      <div className="calendar-container" style={styleOverrides.container}>
        {renderView()}
      </div>
      {viewHistory.length > 0 && (
        <button
          className="back-button"
          onClick={handleBackView}
          aria-label="Back to previous view"
          style={styleOverrides.backButton}
        >
          {backLabel}
        </button>
      )}
      {renderCustomFooter && (
        <div className="calendar-footer" style={styleOverrides.footer}>
          {renderCustomFooter({ selectedValue, activeDate })}
        </div>
      )}
    </div>
  );
};

// PropTypes
Calendar.propTypes = {
  date: PropTypes.instanceOf(Date),
  value: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.arrayOf(PropTypes.instanceOf(Date))]),
  activeStartDate: PropTypes.instanceOf(Date),
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
  disableDate: PropTypes.func,
  disableYear: PropTypes.func,
  disableMonth: PropTypes.func,
  selectionMode: PropTypes.oneOf(['single', 'range']),
  calendarType: PropTypes.string,
  locale: PropTypes.string,
  showDoubleView: PropTypes.bool,
  showFixedNumberOfWeeks: PropTypes.bool,
  showNavigation: PropTypes.bool,
  showNeighboringMonth: PropTypes.bool,
  showNeighboringDecade: PropTypes.bool,
  showWeekNumbers: PropTypes.bool,
  view: PropTypes.oneOf(['day', 'month', 'year', 'decade']),
  maxDetail: PropTypes.oneOf(['day', 'month', 'year', 'decade']),
  minDetail: PropTypes.oneOf(['day', 'month', 'year', 'decade']),
  theme: PropTypes.oneOf(['light', 'dark']),
  events: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.instanceOf(Date).isRequired,
      title: PropTypes.string,
      type: PropTypes.string,
      color: PropTypes.string,
    })
  ),
  rangeLimit: PropTypes.number,
  formatDay: PropTypes.func,
  formatMonth: PropTypes.func,
  formatMonthYear: PropTypes.func,
  formatYear: PropTypes.func,
  formatWeekday: PropTypes.func,
  formatShortWeekday: PropTypes.func,
  formatLongDate: PropTypes.func,
  weekdayFormat: PropTypes.oneOf(['short', 'full', 'minimal']),
  dateFormat: PropTypes.oneOf(['mm/dd/yyyy', 'dd/mm/yyyy', 'yyyy-mm-dd', 'mm-dd-yyyy', 'dd-mm-yyyy']),
  includeTime: PropTypes.bool,
  navigationLabel: PropTypes.func,
  navigationAriaLabel: PropTypes.string,
  navigationAriaLive: PropTypes.string,
  prevLabel: PropTypes.node,
  prevAriaLabel: PropTypes.string,
  nextLabel: PropTypes.node,
  nextAriaLabel: PropTypes.string,
  prev2Label: PropTypes.node,
  prev2AriaLabel: PropTypes.string,
  next2Label: PropTypes.node,
  next2AriaLabel: PropTypes.string,
  onChange: PropTypes.func,
  onClickMonth: PropTypes.func,
  onClickWeekNumber: PropTypes.func,
  onActiveStartDateChange: PropTypes.func,
  onViewChange: PropTypes.func,
  onDrillDown: PropTypes.func,
  onDrillUp: PropTypes.func,
  onRangeHover: PropTypes.func,
  tileClassName: PropTypes.func,
  tileContent: PropTypes.func,
  tileDisabled: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
  inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.any })]),
  renderHeader: PropTypes.func,
  renderMonthView: PropTypes.func,
  renderYearView: PropTypes.func,
  renderDayView: PropTypes.func,
  renderDecadeView: PropTypes.func,
  customTileContent: PropTypes.func,
  customTheme: PropTypes.object,
  dayViewClassName: PropTypes.string,
  monthViewClassName: PropTypes.string,
  yearViewClassName: PropTypes.string,
  styleOverrides: PropTypes.shape({
    calendar: PropTypes.object,
    header: PropTypes.object,
    container: PropTypes.object,
    backButton: PropTypes.object,
    footer: PropTypes.object,
  }),
  holidayDates: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
  renderCustomFooter: PropTypes.func,
  weekStartDay: PropTypes.number,
  disabledViews: PropTypes.arrayOf(PropTypes.string),
  onClickEvent: PropTypes.func,
  renderEvent: PropTypes.func,
  selectOnEventClick: PropTypes.bool,
  disableBeforeToday: PropTypes.bool,
  customDisabledDates: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
  customDisabledYears: PropTypes.arrayOf(PropTypes.number),
  customDisabledMonths: PropTypes.arrayOf(PropTypes.shape({ year: PropTypes.number, month: PropTypes.number })),
  backLabel: PropTypes.string,
  eventTooltip: PropTypes.bool,
  customEventStyles: PropTypes.object,
};

export default React.memo(Calendar);