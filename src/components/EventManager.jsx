import React, { useState } from 'react';
import { Plus, X, Calendar, Clock, Palette } from 'lucide-react';

const EventManager = ({ events, onEventsChange, selectedDate }) => {
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'default',
    color: '#4b6cb7',
    description: '',
    time: ''
  });

  const eventTypes = [
    { value: 'default', label: 'Default', color: '#4b6cb7' },
    { value: 'meeting', label: 'Meeting', color: '#ff6b6b' },
    { value: 'personal', label: 'Personal', color: '#4ecdc4' },
    { value: 'work', label: 'Work', color: '#45b7d1' },
    { value: 'holiday', label: 'Holiday', color: '#96ceb4' },
    { value: 'deadline', label: 'Deadline', color: '#feca57' },
    { value: 'appointment', label: 'Appointment', color: '#ff9ff3' }
  ];

  const handleAddEvent = () => {
    if (!newEvent.title.trim() || !selectedDate) return;

    const event = {
      ...newEvent,
      date: new Date(selectedDate),
      id: Date.now()
    };

    onEventsChange([...events, event]);
    setNewEvent({
      title: '',
      type: 'default',
      color: '#4b6cb7',
      description: '',
      time: ''
    });
    setIsAddingEvent(false);
  };

  const handleRemoveEvent = (eventId) => {
    onEventsChange(events.filter(event => event.id !== eventId));
  };

  const todayEvents = selectedDate ? 
    events.filter(event => event.date.toDateString() === selectedDate.toDateString()) : 
    [];

  return (
    <div className="event-manager">
      <div className="event-manager-header">
        <div className="header-title">
          <Calendar size={20} className='' />
          <h3>Event Manager</h3>
        </div>
        
        {selectedDate && (
          <button
            className="add-event-btn"
            onClick={() => setIsAddingEvent(true)}
            disabled={isAddingEvent}
          >
            <Plus size={16} />
            Add Event
          </button>
        )}
      </div>

      {selectedDate ? (
        <div className="selected-date-info">
          <h4>Events for {selectedDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</h4>
          
          {isAddingEvent && (
            <div className="add-event-form">
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Event title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="event-title-input"
                />
                <button
                  className="cancel-btn"
                  onClick={() => setIsAddingEvent(false)}
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="form-row">
                <select
                  value={newEvent.type}
                  onChange={(e) => {
                    const type = eventTypes.find(t => t.value === e.target.value);
                    setNewEvent({ 
                      ...newEvent, 
                      type: e.target.value,
                      color: type?.color || '#4b6cb7'
                    });
                  }}
                  className="event-type-select"
                >
                  {eventTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                
                <input
                  type="color"
                  value={newEvent.color}
                  onChange={(e) => setNewEvent({ ...newEvent, color: e.target.value })}
                  className="event-color-input"
                />
              </div>
              
              <input
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                className="event-time-input"
              />
              
              <textarea
                placeholder="Event description (optional)"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                className="event-description-input"
                rows={2}
              />
              
              <button
                className="save-event-btn"
                onClick={handleAddEvent}
                disabled={!newEvent.title.trim()}
              >
                Save Event
              </button>
            </div>
          )}

          <div className="events-list">
            {todayEvents.length > 0 ? (
              todayEvents.map(event => (
                <div key={event.id} className="event-item">
                  <div 
                    className="event-color-indicator"
                    style={{ backgroundColor: event.color }}
                  />
                  <div className="event-details">
                    <div className="event-title">{event.title}</div>
                    <div className="event-meta">
                      <span className="event-type">{event.type}</span>
                      {event.time && (
                        <span className="event-time">
                          <Clock size={12} className='' />
                          {event.time}
                        </span>
                      )}
                    </div>
                    {event.description && (
                      <div className="event-description">{event.description}</div>
                    )}
                  </div>
                  <button
                    className="remove-event-btn"
                    onClick={() => handleRemoveEvent(event.id)}
                    aria-label={`Remove ${event.title}`}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))
            ) : (
              <div className="no-events">
                <p>No events scheduled for this date</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="no-date-selected">
          <p>Select a date to view or add events</p>
        </div>
      )}

      <div className="event-summary">
        <h4>Total Events: {events.length}</h4>
        <div className="event-type-breakdown">
          {eventTypes.map(type => {
            const count = events.filter(event => event.type === type.value).length;
            return count > 0 ? (
              <div key={type.value} className="type-count">
                <div 
                  className="type-color" 
                  style={{ backgroundColor: type.color }}
                />
                <span>{type.label}: {count}</span>
              </div>
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
};

export default EventManager;