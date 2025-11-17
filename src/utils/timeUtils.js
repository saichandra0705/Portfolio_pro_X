// src/utils/timeUtils.js

/**
 * Generates time slots within a given start and end time at a specified interval.
 *
 * @param {string} startString - The start time in "HH:MM:SS" format (e.g., "09:00:00").
 * @param {string} endString - The end time in "HH:MM:SS" format (e.g., "17:00:00").
 * @param {number} [intervalMinutes=60] - The duration of each slot in minutes (e.g., 15, 30, 60).
 * @returns {Array<Object>} An array of slot objects, each with start, end, and label properties.
 */
export function generateTimeSlots(startString, endString, intervalMinutes = 60) {
  const slots = [];

  let current = new Date(`1970-01-01T${startString}`);
  const endTime = new Date(`1970-01-01T${endString}`);

  while (current < endTime) {
    const next = new Date(current.getTime() + intervalMinutes * 60 * 1000);

    if (next > endTime) {
      break;
    }

    const format = (d) =>
      d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });

    slots.push({
      start: current.toTimeString().slice(0, 8),
      end: next.toTimeString().slice(0, 8),
      label: `${format(current)} - ${format(next)}`,
    });

    current = next;
  }

  return slots;
}
