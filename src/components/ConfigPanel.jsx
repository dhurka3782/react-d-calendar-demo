import React from 'react';
import { Settings, Palette, Calendar as CalendarIcon, Clock, Globe } from 'lucide-react';

const ConfigPanel = ({
  config,
  onConfigChange,
  isOpen,
  onToggle
}) => {
  const handleChange = (key, value) => {
    onConfigChange({ ...config, [key]: value });
  };

  const handleNestedChange = (section, key, value) => {
    onConfigChange({
      ...config,
      [section]: {
        ...config[section],
        [key]: value
      }
    });
  };

  return (
    <div className={`config-panel ${isOpen ? 'open' : 'closed'}`}>
      <button 
        className="config-toggle"
        onClick={onToggle}
        aria-label={isOpen ? 'Close configuration panel' : 'Open configuration panel'}
      >
        <Settings size={20} />
        {isOpen ? 'Close Config' : 'Configure'}
      </button>

      {isOpen && (
        <div className="config-content">
          <div className="config-section">
            <div className="config-section-header">
              <Palette size={16} />
              <h3>Appearance</h3>
            </div>
            
            <div className="config-field">
              <label>Theme</label>
              <select 
                value={config.theme} 
                onChange={(e) => handleChange('theme', e.target.value)}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div className="config-field">
              <label>
                <input
                  type="checkbox"
                  checked={config.showDoubleView}
                  onChange={(e) => handleChange('showDoubleView', e.target.checked)}
                />
                Show Double View
              </label>
            </div>

            <div className="config-field">
              <label>
                <input
                  type="checkbox"
                  checked={config.showWeekNumbers}
                  onChange={(e) => handleChange('showWeekNumbers', e.target.checked)}
                />
                Show Week Numbers
              </label>
            </div>

            <div className="config-field">
              <label>
                <input
                  type="checkbox"
                  checked={config.showNeighboringMonth}
                  onChange={(e) => handleChange('showNeighboringMonth', e.target.checked)}
                />
                Show Neighboring Months
              </label>
            </div>
          </div>

          <div className="config-section">
            <div className="config-section-header">
              <CalendarIcon size={16} />
              <h3>Selection</h3>
            </div>
            
            <div className="config-field">
              <label>Selection Mode</label>
              <select 
                value={config.selectionMode} 
                onChange={(e) => handleChange('selectionMode', e.target.value)}
              >
                <option value="single">Single Date</option>
                <option value="range">Date Range</option>
              </select>
            </div>

            {config.selectionMode === 'range' && (
              <div className="config-field">
                <label>Range Limit (days)</label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={config.rangeLimit || ''}
                  onChange={(e) => handleChange('rangeLimit', e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="No limit"
                />
              </div>
            )}

            <div className="config-field">
              <label>Default View</label>
              <select 
                value={config.view} 
                onChange={(e) => handleChange('view', e.target.value)}
              >
                <option value="month">Month</option>
                <option value="year">Year</option>
                <option value="decade">Decade</option>
              </select>
            </div>
          </div>

          <div className="config-section">
            <div className="config-section-header">
              <Clock size={16} />
              <h3>Date Options</h3>
            </div>
            
            <div className="config-field">
              <label>Week Start Day</label>
              <select 
                value={config.weekStartDay} 
                onChange={(e) => handleChange('weekStartDay', parseInt(e.target.value))}
              >
                <option value={0}>Sunday</option>
                <option value={1}>Monday</option>
                <option value={2}>Tuesday</option>
                <option value={3}>Wednesday</option>
                <option value={4}>Thursday</option>
                <option value={5}>Friday</option>
                <option value={6}>Saturday</option>
              </select>
            </div>

            <div className="config-field">
              <label>Date Format</label>
              <select 
                value={config.dateFormat} 
                onChange={(e) => handleChange('dateFormat', e.target.value)}
              >
                <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                <option value="mm-dd-yyyy">MM-DD-YYYY</option>
                <option value="dd-mm-yyyy">DD-MM-YYYY</option>
              </select>
            </div>

            <div className="config-field">
              <label>
                <input
                  type="checkbox"
                  checked={config.disableBeforeToday}
                  onChange={(e) => handleChange('disableBeforeToday', e.target.checked)}
                />
                Disable Past Dates
              </label>
            </div>
          </div>

          <div className="config-section">
            <div className="config-section-header">
              <Globe size={16} />
              <h3>Localization</h3>
            </div>
            
            <div className="config-field">
              <label>Locale</label>
              <select 
                value={config.locale} 
                onChange={(e) => handleChange('locale', e.target.value)}
              >
                <option value="en-US">English (US)</option>
                <option value="en-GB">English (UK)</option>
                <option value="es-ES">Spanish</option>
                <option value="fr-FR">French</option>
                <option value="de-DE">German</option>
                <option value="ja-JP">Japanese</option>
                <option value="zh-CN">Chinese (Simplified)</option>
                <option value="ar-SA">Arabic</option>
              </select>
            </div>

            <div className="config-field">
              <label>Weekday Format</label>
              <select 
                value={config.weekdayFormat} 
                onChange={(e) => handleChange('weekdayFormat', e.target.value)}
              >
                <option value="short">Short (Mon)</option>
                <option value="full">Full (Monday)</option>
                <option value="minimal">Minimal (M)</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigPanel;