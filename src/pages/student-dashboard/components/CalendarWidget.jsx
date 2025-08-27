import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CalendarWidget = ({ 
  events = [], 
  onViewEvent = () => {},
  onViewCalendar = () => {},
  className = '' 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  const getDaysInMonth = (date) => {
    const year = date?.getFullYear();
    const month = date?.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay?.getDate();
    const startingDayOfWeek = (firstDay?.getDay() + 6) % 7; // Adjust for Monday start

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days?.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days?.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date) => {
    if (!date) return [];
    return events?.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate?.toDateString() === date?.toDateString();
    });
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'deadline': return 'bg-error';
      case 'lesson': return 'bg-primary';
      case 'session': return 'bg-accent';
      default: return 'bg-muted';
    }
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate?.setMonth(prev?.getMonth() + direction);
      return newDate;
    });
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date?.toDateString() === today?.toDateString();
  };

  const isSelected = (date) => {
    if (!date) return false;
    return date?.toDateString() === selectedDate?.toDateString();
  };

  const days = getDaysInMonth(currentDate);
  const todayEvents = getEventsForDate(selectedDate);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className={`card-glass p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Calendar</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onViewCalendar}
          iconName="Calendar"
          iconPosition="right"
          iconSize={16}
        >
          View Full
        </Button>
      </div>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateMonth(-1)}
          className="h-8 w-8"
        >
          <Icon name="ChevronLeft" size={16} />
        </Button>
        
        <h3 className="font-semibold">
          {monthNames?.[currentDate?.getMonth()]} {currentDate?.getFullYear()}
        </h3>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateMonth(1)}
          className="h-8 w-8"
        >
          <Icon name="ChevronRight" size={16} />
        </Button>
      </div>
      {/* Week Days */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays?.map(day => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground p-2">
            {day}
          </div>
        ))}
      </div>
      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {days?.map((date, index) => {
          const dayEvents = getEventsForDate(date);
          return (
            <motion.button
              key={index}
              onClick={() => date && setSelectedDate(date)}
              disabled={!date}
              className={`
                relative p-2 text-sm rounded-lg transition-smooth h-10
                ${!date ? 'invisible' : ''}
                ${isToday(date) ? 'bg-primary text-primary-foreground font-bold' : ''}
                ${isSelected(date) && !isToday(date) ? 'bg-white/10 text-foreground' : ''}
                ${!isToday(date) && !isSelected(date) ? 'hover:bg-white/5 text-muted-foreground' : ''}
              `}
              whileHover={date ? { scale: 1.05 } : {}}
              whileTap={date ? { scale: 0.95 } : {}}
            >
              {date && date?.getDate()}
              {/* Event Indicators */}
              {dayEvents?.length > 0 && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
                  {dayEvents?.slice(0, 3)?.map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className={`w-1 h-1 rounded-full ${getEventTypeColor(event?.type)}`}
                    />
                  ))}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
      {/* Today's Events */}
      <div className="space-y-2">
        <h4 className="font-medium text-sm">
          {selectedDate?.toDateString() === new Date()?.toDateString() ? 
            'Today\'s Events' : 
            `Events for ${selectedDate?.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' })}`
          }
        </h4>
        
        {todayEvents?.length === 0 ? (
          <p className="text-sm text-muted-foreground">No events scheduled</p>
        ) : (
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {todayEvents?.map((event, index) => (
              <motion.div
                key={event?.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={() => onViewEvent(event)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-smooth cursor-pointer group"
              >
                <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event?.type)}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate group-hover:text-primary transition-smooth">
                    {event?.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {event?.time}
                  </p>
                </div>
                <Icon 
                  name="ChevronRight" 
                  size={12} 
                  className="text-muted-foreground group-hover:text-primary transition-smooth"
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CalendarWidget;