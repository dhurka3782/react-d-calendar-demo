import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const Header = ({
  date,
  onChange,
  view,
  minDetail,
  maxDetail,
  prevLabel,
  prevAriaLabel,
  nextLabel,
  nextAriaLabel,
  prev2Label,
  prev2AriaLabel,
  next2Label,
  next2AriaLabel,
  navigationLabel,
  formatMonthYear,
  formatYear,
  locale,
  showDoubleView,
  style,
  isYearDisabled
}) => {
  const handlePrevious = () => {
    const newDate = new Date(date);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (view === 'year') {
      newDate.setFullYear(newDate.getFullYear() - 1);
    } else if (view === 'decade') {
      newDate.setFullYear(newDate.getFullYear() - 10);
    }
    onChange(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(date);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (view === 'year') {
      newDate.setFullYear(newDate.getFullYear() + 1);
    } else if (view === 'decade') {
      newDate.setFullYear(newDate.getFullYear() + 10);
    }
    onChange(newDate);
  };

  const handlePrevious2 = () => {
    const newDate = new Date(date);
    if (view === 'month') {
      newDate.setFullYear(newDate.getFullYear() - 1);
    } else if (view === 'year') {
      newDate.setFullYear(newDate.getFullYear() - 10);
    } else if (view === 'decade') {
      newDate.setFullYear(newDate.getFullYear() - 100);
    }
    onChange(newDate);
  };

  const handleNext2 = () => {
    const newDate = new Date(date);
    if (view === 'month') {
      newDate.setFullYear(newDate.getFullYear() + 1);
    } else if (view === 'year') {
      newDate.setFullYear(newDate.getFullYear() + 10);
    } else if (view === 'decade') {
      newDate.setFullYear(newDate.getFullYear() + 100);
    }
    onChange(newDate);
  };

  const getHeaderLabel = () => {
    if (navigationLabel) {
      return navigationLabel({ date, view, locale });
    }
    
    if (view === 'month') {
      return formatMonthYear ? 
        formatMonthYear(date, locale) : 
        date.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
    } else if (view === 'year') {
      return formatYear ? formatYear(date, locale) : date.getFullYear().toString();
    } else if (view === 'decade') {
      const startYear = Math.floor(date.getFullYear() / 10) * 10;
      return `${startYear} - ${startYear + 9}`;
    }
    return '';
  };

  return (
    <div className="calendar-header" style={style}>
      <div className="navigation-buttons">
        {(prev2Label || view !== 'month') && (
          <button
            className="nav-button prev2"
            onClick={handlePrevious2}
            aria-label={prev2AriaLabel || `Previous ${view === 'month' ? 'year' : view === 'year' ? 'decade' : 'century'}`}
          >
            {prev2Label || <ChevronsLeft size={16} />}
          </button>
        )}
        <button
          className="nav-button prev"
          onClick={handlePrevious}
          aria-label={prevAriaLabel || `Previous ${view}`}
        >
          {prevLabel || <ChevronLeft size={16} />}
        </button>
      </div>

      <div className="header-label">
        <button className="header-button" aria-label={`Current ${view}: ${getHeaderLabel()}`}>
          {getHeaderLabel()}
        </button>
        {showDoubleView && view === 'month' && (
          <button className="header-button secondary" aria-label={`Next month: ${new Date(date.getFullYear(), date.getMonth() + 1).toLocaleDateString(locale, { month: 'long', year: 'numeric' })}`}>
            {new Date(date.getFullYear(), date.getMonth() + 1).toLocaleDateString(locale, { month: 'long', year: 'numeric' })}
          </button>
        )}
      </div>

      <div className="navigation-buttons">
        <button
          className="nav-button next"
          onClick={handleNext}
          aria-label={nextAriaLabel || `Next ${view}`}
        >
          {nextLabel || <ChevronRight size={16} />}
        </button>
        {(next2Label || view !== 'month') && (
          <button
            className="nav-button next2"
            onClick={handleNext2}
            aria-label={next2AriaLabel || `Next ${view === 'month' ? 'year' : view === 'year' ? 'decade' : 'century'}`}
          >
            {next2Label || <ChevronsRight size={16} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;