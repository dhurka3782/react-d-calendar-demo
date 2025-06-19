import React from 'react';

const DayView = ({
  date,
  onDateSelect,
  tileContent,
  tileClassName,
  tileDisabled,
  formatLongDate,
  dateFormat,
  weekdayFormat,
  monthFormat,
  includeTime,
  locale,
  onDrillUp,
  today,
  className,
  onClickEvent,
  events,
  renderEvent,
  selectOnEventClick
}) => {
  const isDisabled = tileDisabled?.(date);
  const isToday = date.toDateString() === today.toDateString();
  
  const dayEvents = events?.filter(event => 
    event.date.toDateString() === date.toDateString()
  ) || [];

  const formatDate = () => {
    if (formatLongDate) {
      return formatLongDate(date, locale);
    }
    
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    
    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }
    
    return date.toLocaleDateString(locale, options);
  };

  return (
    <div className={`day-view ${className}`}>
      <div className="day-header">
        <button 
          className="day-title"
          onClick={onDrillUp}
          aria-label={`Back to month view for ${date.toLocaleDateString(locale, { month: 'long', year: 'numeric' })}`}
        >
          ← Back to Month
        </button>
      </div>
      
      <div className={[
        'day-content',
        isToday ? 'today' : '',
        isDisabled ? 'disabled' : '',
        tileClassName?.({ date, view: 'day' }) || ''
      ].filter(Boolean).join(' ')}>
        
        <div className="day-date">
          <h2>{formatDate()}</h2>
          {isToday && <span className="today-badge">Today</span>}
        </div>
        
        {dayEvents.length > 0 && (
          <div className="day-events-list">
            <h3>Events</h3>
            {dayEvents.map((event, index) => (
              <div
                key={index}
                className={`day-event event-${event.type || 'default'}`}
                style={{ borderColor: event.color }}
                onClick={() => {
                  if (selectOnEventClick) {
                    onDateSelect(date);
                  }
                  onClickEvent?.(event, date);
                }}
              >
                {renderEvent ? renderEvent(event, date) : (
                  <>
                    <div 
                      className="event-color-indicator"
                      style={{ backgroundColor: event.color }}
                    />
                    <div className="event-details">
                      <div className="event-title">{event.title || 'Event'}</div>
                      {event.description && (
                        <div className="event-description">{event.description}</div>
                      )}
                      {event.time && (
                        <div className="event-time">{event.time}</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
        
        {dayEvents.length === 0 && (
          <div className="no-events">
            <p>No events scheduled for this day</p>
          </div>
        )}
        
        {tileContent?.({ date, view: 'day' }) && (
          <div className="custom-content">
            {tileContent({ date, view: 'day' })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DayView;