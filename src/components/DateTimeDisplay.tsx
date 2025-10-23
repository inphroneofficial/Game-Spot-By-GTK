import { useState, useEffect } from "react";
import { Calendar, Clock } from "lucide-react";

export function DateTimeDisplay() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="fixed top-4 left-4 z-50 card-gaming p-3 rounded-xl border-primary/20 animate-fade-in">
      <div className="flex flex-col gap-1 text-xs">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{formatDate(currentTime)}</span>
        </div>
        <div className="flex items-center gap-2 text-primary font-mono">
          <Clock className="h-3 w-3" />
          <span>{formatTime(currentTime)}</span>
        </div>
      </div>
    </div>
  );
}