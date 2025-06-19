import React, { useState, useCallback, useMemo } from 'react';
import Calendar from './components/Calendar/Calendar';
import DemoSection from './components/DemoSection';
import ConfigPanel from './components/ConfigPanel';
import EventManager from './components/EventManager';
import { Settings, CalendarDays } from 'lucide-react';

function App() {
  // Main calendar state
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedRange, setSelectedRange] = useState(null);
  
  // Configuration state
  const [config, setConfig] = useState({
    theme: 'light',
    selectionMode: 'single',
    showDoubleView: false,
    showWeekNumbers: false,
    showNeighboringMonth: true,
    view: 'month',
    weekStartDay: 0,
    dateFormat: 'mm/dd/yyyy',
    locale: 'en-US',
    weekdayFormat: 'short',
    disableBeforeToday: false,
    rangeLimit: null
  });

  // Events state
  const [events, setEvents] = useState([
    {
      id: 1,
      date: new Date(2025, 0, 15),
      title: 'Team Meeting',
      type: 'meeting',
      color: '#ff6b6b',
      description: 'Weekly team sync meeting',
      time: '10:00'
    },
    {
      id: 2,
      date: new Date(2025, 0, 18),
      title: 'Project Deadline',
      type: 'deadline',
      color: '#feca57',
      description: 'Submit final proposal',
      time: '17:00'
    },
    {
      id: 3,
      date: new Date(2025, 0, 20),
      title: 'Doctor Appointment',
      type: 'appointment',
      color: '#ff9ff3',
      description: 'Annual checkup',
      time: '14:30'
    },
    {
      id: 4,
      date: new Date(2025, 0, 25),
      title: 'Weekend Getaway',
      type: 'personal',
      color: '#4ecdc4',
      description: 'Mountain retreat',
      time: ''
    }
  ]);

  // Holiday dates
  const holidayDates = useMemo(() => [
    new Date(2025, 0, 1), 
    new Date(2025, 1, 14), 
    new Date(2025, 2, 4), 
    new Date(2025, 11, 25), 
  ], []);

  // UI state
  const [configPanelOpen, setConfigPanelOpen] = useState(false);
  const [currentDemo, setCurrentDemo] = useState('comprehensive');

  // Custom theme
  const customTheme = useMemo(() => {
    if (config.theme === 'custom') {
      return {
        'background-color': '#f8fafc',
        'text-color': '#1e293b',
        'primary-color': '#8b5cf6',
        'accent-color': '#10b981',
        'header-background': '#f1f5f9',
        'disabled-color': '#94a3b8',
        'selected-color': '#8b5cf6',
        'today-color': '#10b981'
      };
    }
    return {};
  }, [config.theme]);

  // Handlers
  const handleDateChange = useCallback((value) => {
    if (config.selectionMode === 'single') {
      setSelectedDate(value);
      setSelectedRange(null);
    } else {
      setSelectedRange(value);
      setSelectedDate(Array.isArray(value) ? value[0] : null);
    }
  }, [config.selectionMode]);

  const handleEventClick = useCallback((event, date) => {
    console.log('Event clicked:', event, 'on date:', date);
  }, []);

  const handleRangeHover = useCallback((range) => {
    console.log('Range hover:', range);
  }, []);

  // Demo configurations
  const demoConfigs = {
    basic: {
      title: 'Basic Calendar',
      description: 'Simple calendar with default settings',
      props: {
        theme: 'light',
        selectionMode: 'single'
      }
    },
    range: {
      title: 'Range Selection',
      description: 'Calendar with date range selection',
      props: {
        selectionMode: 'range',
        rangeLimit: 30
      }
    },
    events: {
      title: 'Calendar with Events',
      description: 'Calendar displaying events and holidays',
      props: {
        events: events,
        holidayDates: holidayDates,
        eventTooltip: true
      }
    },
    double: {
      title: 'Double View',
      description: 'Side-by-side calendar months',
      props: {
        showDoubleView: true,
        showWeekNumbers: false,
        weekdayFormat: 'minimal',
      }
    },
    dark: {
      title: 'Dark Theme',
      description: 'Calendar with dark theme',
      props: {
        theme: 'dark',
        showNeighboringMonth: true
      }
    },
    custom: {
      title: 'Custom Theme',
      description: 'Calendar with custom styling',
      props: {
        theme: 'custom',
        customTheme: customTheme,
        showWeekNumbers: true
      }
    }
  };

  const renderDemo = (demoKey) => {
    const demo = demoConfigs[demoKey];
    const props = {
      ...demo.props,
      onChange: handleDateChange,
      onClickEvent: handleEventClick,
      onRangeHover: handleRangeHover,
      value: demo.props.selectionMode === 'range' ? selectedRange : selectedDate
    };

    return (
      <DemoSection
        key={demoKey}
        title={demo.title}
        description={demo.description}
        className={`demo-${demoKey}`}
      >
        <Calendar {...props} />
      </DemoSection>
    );
  };

  const renderComprehensiveDemo = () => (
    <DemoSection
      title="Interactive Calendar Demo"
      description="Full-featured calendar with all customization options"
      className="comprehensive-demo"
    >
      <div className="demo-layout">
        <div className="calendar-section">
          <Calendar
            {...config}
            customTheme={customTheme}
            events={events}
            holidayDates={holidayDates}
            eventTooltip={true}
            value={config.selectionMode === 'range' ? selectedRange : selectedDate}
            onChange={handleDateChange}
            onClickEvent={handleEventClick}
            onRangeHover={handleRangeHover}
            selectOnEventClick={true}
          />
        </div>
        
        <div className="controls-section">
          <EventManager
            events={events}
            onEventsChange={setEvents}
            selectedDate={selectedDate}
          />
          
          <ConfigPanel
            config={config}
            onConfigChange={setConfig}
            isOpen={configPanelOpen}
            onToggle={() => setConfigPanelOpen(!configPanelOpen)}
          />
        </div>
      </div>
    </DemoSection>
  );

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-title">
            <CalendarDays size={32} className='text-teal-100/70' />
            <div>
              <h1>React D-Calendar Demo</h1>
              <p>Comprehensive calendar component showcase</p>
            </div>
          </div>
          
          <div className="header-controls">
            <nav className="demo-nav">
              <button
                className={currentDemo === 'comprehensive' ? 'active' : ''}
                onClick={() => setCurrentDemo('comprehensive')}
              >
                Interactive Demo
              </button>
              <button
                className={currentDemo === 'showcase' ? 'active' : ''}
                onClick={() => setCurrentDemo('showcase')}
              >
                Feature Showcase
              </button>
            </nav>
            
            {/* <button
              className="theme-toggle"
              onClick={() => setConfig(prev => ({ 
                ...prev, 
                theme: prev.theme === 'light' ? 'dark' : 'light' 
              }))}
              aria-label="Toggle theme"
            >
              {config.theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button> */}
          </div>
        </div>
      </header>

      <main className="app-main">
        {currentDemo === 'comprehensive' ? (
          renderComprehensiveDemo()
        ) : (
          <div className="showcase-grid">
            {Object.keys(demoConfigs).map(renderDemo)}
          </div>
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p>
            Selected: {
              config.selectionMode === 'range' && selectedRange ? 
                `${selectedRange[0]?.toLocaleDateString()} - ${selectedRange[1]?.toLocaleDateString() || 'Selecting...'}` :
                selectedDate?.toLocaleDateString() || 'None'
            }
          </p>
          <p>Total Events: {events.length}</p>
        </div>
      </footer>
    </div>
  );
}

export default App;