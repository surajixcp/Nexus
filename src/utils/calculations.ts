import { Severity, Priority } from '../types';

/**
 * Parses date string (YYYY-MM-DD) and time string (HH:mm:ss or HH:mm) into a valid Date object.
 * Returns null if invalid.
 */
export function parseDateTime(dateStr: string, timeStr: string): Date | null {
  if (!dateStr) return null;
  const cleanDate = dateStr.trim();
  const cleanTime = (timeStr && timeStr.trim()) || '00:00:00';
  const combined = `${cleanDate}T${cleanTime}`;
  const parsed = new Date(combined);
  if (isNaN(parsed.getTime())) {
    // Attempt fallback parsing
    const fallback = new Date(`${cleanDate} ${cleanTime}`);
    return isNaN(fallback.getTime()) ? null : fallback;
  }
  return parsed;
}

/**
 * Calculates duration in minutes between start and end.
 * If endDate/endTime are missing, uses fallback reference date (simulated now).
 */
export function calculateDurationMinutes(
  startDateStr: string,
  startTimeStr: string,
  endDateStr?: string,
  endTimeStr?: string,
  referenceNow: Date = new Date()
): number {
  const start = parseDateTime(startDateStr, startTimeStr);
  if (!start) return 0;

  let end: Date | null = null;
  if (endDateStr && endDateStr.trim()) {
    end = parseDateTime(endDateStr, endTimeStr || '00:00:00');
  }

  if (!end) {
    end = referenceNow;
  }

  const diffMs = end.getTime() - start.getTime();
  if (diffMs <= 0) return 0;
  return Math.round(diffMs / (1000 * 60));
}

/**
 * Formats duration minutes into human-readable string:
 * e.g., "2d 4h 15m", "3h 45m", "22m"
 */
export function formatDuration(minutes: number): string {
  if (isNaN(minutes) || minutes < 0) return '0m';
  if (minutes === 0) return '0m';

  const days = Math.floor(minutes / (24 * 60));
  const remainingMinutesAfterDays = minutes % (24 * 60);
  const hours = Math.floor(remainingMinutesAfterDays / 60);
  const mins = remainingMinutesAfterDays % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (mins > 0 || parts.length === 0) parts.push(`${mins}m`);

  return parts.join(' ');
}

/**
 * SLA thresholds in minutes by severity
 */
export const SLA_THRESHOLDS: Record<Severity, number> = {
  Critical: 60, // 1 hour
  High: 240, // 4 hours
  Medium: 720, // 12 hours
  Low: 1440, // 24 hours
};

/**
 * Checks if duration exceeds the SLA threshold for a given severity.
 */
export function isSlaBreached(durationMinutes: number, severity: Severity): boolean {
  const threshold = SLA_THRESHOLDS[severity] || 1440;
  return durationMinutes > threshold;
}

/**
 * Calculates remaining SLA minutes. Negative indicates breach.
 */
export function getRemainingSlaMinutes(elapsedMinutes: number, severity: Severity): number {
  const threshold = SLA_THRESHOLDS[severity] || 1440;
  return threshold - elapsedMinutes;
}

/**
 * Formats SLA countdown string (e.g., "38m left" or "Breached by 15m")
 */
export function formatSlaCountdown(elapsedMinutes: number, severity: Severity): {
  text: string;
  breached: boolean;
  remainingMinutes: number;
} {
  const remaining = getRemainingSlaMinutes(elapsedMinutes, severity);
  if (remaining <= 0) {
    return {
      text: `Breached by ${formatDuration(Math.abs(remaining))}`,
      breached: true,
      remainingMinutes: remaining,
    };
  }
  return {
    text: `${formatDuration(remaining)} remaining`,
    breached: false,
    remainingMinutes: remaining,
  };
}

/**
 * Maps severity to appropriate priority
 */
export function getPriorityFromSeverity(severity: Severity): Priority {
  switch (severity) {
    case 'Critical':
      return 'P1';
    case 'High':
      return 'P2';
    case 'Medium':
      return 'P3';
    case 'Low':
    default:
      return 'P4';
  }
}

/**
 * Generates formatted Ticket ID with zero padding
 */
export function formatTicketId(index: number): string {
  const padded = String(index).padStart(4, '0');
  return `DEMO-INC-${padded}`;
}

/**
 * Generates formatted Problem ID with zero padding
 */
export function formatProblemId(index: number): string {
  const padded = String(index).padStart(4, '0');
  return `DEMO-P-261${padded}`;
}
