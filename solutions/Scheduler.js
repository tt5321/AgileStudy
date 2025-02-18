import Preference from "./Preference.js";
import TimeSlot from "./TimeSlot.js";
import StudySession from "./StudySession.js";

export default class Scheduler{
    static _instance;
    _id_counter;    

    constructor() {
        if (Scheduler._instance){
            return Scheduler._instance;
        }
        Scheduler._instance = this;
        this._id_counter = 1000;
    }


    allocate_sessions(assignment, events) {
        const deadline = assignment.end_time;
        let total_time = assignment.study_plan.planned_time;
        const preference = new Preference();
        const min_duration = preference.minimum;
        const expected_duration = 2 * min_duration;

        let available_slots = this._find_availble_times_with_min_durations(events, new Date(), deadline, min_duration);
        let free_slots = this._exclude_block_times(available_slots, min_duration);

        let allocated_slots = [];
        let slots_by_day = {};
        let used_days = new Set();
        let used_slots = new Set(); // Tracks used slot indices
        let slots_per_day = 4;

        // Group free slots by day (YYYY-MM-DD as key)
        for (let slot of free_slots) {
            let startDate = new Date(slot.start);
            let endDate = new Date(slot.end);
    
            // Iterate from the start date to the end date, splitting slots
            let currentDate = new Date(startDate);
            while (currentDate <= endDate) {
                let dateKey = currentDate.toISOString().split("T")[0]; // Extract YYYY-MM-DD
                
                // Ensure the key exists
                if (!slots_by_day[dateKey]) {
                    slots_by_day[dateKey] = [];
                }
    
                // Calculate the start and end for this day's slot
                let slotStart = (currentDate.toISOString().split("T")[0] === startDate.toISOString().split("T")[0])
                    ? startDate // First day: Use original start time
                    : new Date(currentDate.setHours(0, 0, 0, 0)); // New day starts at midnight
    
                let slotEnd = (currentDate.toISOString().split("T")[0] === endDate.toISOString().split("T")[0])
                    ? endDate // Last day: Use original end time
                    : new Date(currentDate.setHours(23, 59, 59, 999)); // Full day slot ends at 23:59:59.999
    
                // Create a new TimeSlot and add it to the list
                slots_by_day[dateKey].push(new TimeSlot(slotStart, slotEnd));
    
                // Move to the next day
                currentDate.setDate(currentDate.getDate() + 1);
                currentDate.setHours(0, 0, 0, 0); // Reset to midnight
            }
        }


        // Allocate time up to 4 slots per day
        for (let date in slots_by_day) {
            if (total_time <= 0) break; // Stop if all time is allocated
    
            let slots = slots_by_day[date];
            let allocated_count = 0;
    
            for (let i = 0; i < slots.length; i++) {
                if (allocated_count >= slots_per_day || total_time <= 0) break; // Limit to 4 per day
    
                let slot = slots[i];
                let slot_duration = (slot.end - slot.start) / (1000 * 60); // Convert to minutes
                let allocation_time = Math.min(total_time, expected_duration, slot_duration); // Allocate within slot's capacity
                if (total_time - allocation_time < min_duration) {
                    continue;
                }
    
                let allocated_start = slot.start;
                let allocated_end = new Date(slot.start.getTime() + allocation_time * 60 * 1000);
    
                allocated_slots.push(new TimeSlot(allocated_start, allocated_end));
    
                total_time -= allocation_time; // Reduce remaining time
                allocated_count++; // Track allocated slots per day
                used_days.add(date);
                used_slots.add(slot.start.toISOString()); // Mark this slot as used
            }
        }

        // If all days are used and time is left, allocate freely from unused slots
        if (total_time > 0) {
            for (let slot of free_slots) {
                if (total_time <= 0) break; // Stop when done
                if (used_slots.has(slot.start.toISOString())) continue; // Skip slots already used
    
                let slot_duration = (slot.end - slot.start) / (1000 * 60); // Convert to minutes
                let allocation_time = Math.min(total_time, slot_duration);
    
                let allocated_start = slot.start;
                let allocated_end = new Date(slot.start.getTime() + allocation_time * 60 * 1000);
    
                allocated_slots.push(new TimeSlot(allocated_start, allocated_end));
    
                total_time -= allocation_time;
            }
        }
    
        // Create study sessions
        let study_sessions = [];
        for (let slot of allocated_slots) {
            const s_id = this._get_next_id();
            study_sessions.push(new StudySession({
                study_plan: assignment.study_plan,
                id: s_id,
                title: `study session ${s_id} - ${assignment.title}`,
                start_time: slot.start,
                end_time: slot.end,
            }))
        }

        // Add tp the plan
        assignment.study_plan.sessions = study_sessions;
        return study_sessions;
    }


    reallocate_session(session, events){
        const deadline = session.study_plan.assignment.end_time;
        const session_duration = (session.end_time - session.start_time) / (1000 * 60);
        let available_slots = this._find_availble_times_with_min_durations(events, new Date(), deadline, session_duration);
        let free_slots = this._exclude_block_times(available_slots, session_duration);
        if(free_slots.length > 0) {
            session.start_time = free_slots[0].start;
            session.end_time = new Date(free_slots[0].start.getTime() + session_duration * 60 * 1000);
        } else {
            this._warn();
        }
    }

    _warn(){
        // not implemented
        console.log("Insufficient free time slots!");
    }

    _find_availble_times(events, searchStart, searchEnd) {
        // const events = [...this._user_events, ...this._assignments, ...this._study_sessions];
        // Convert all events to TimeSlot objects and sort them
        const busySlots = events
            .map(event => new TimeSlot(event.start_time, event.end_time))
            .sort((a, b) => a.start - b.start);
        
        // Merge overlapping time slots
        const mergedBusySlots = [];
        for (const slot of busySlots) {
            if (mergedBusySlots.length === 0) {
                mergedBusySlots.push(slot);
                continue;
            }
            
            const lastSlot = mergedBusySlots[mergedBusySlots.length - 1];
            if (slot.start <= lastSlot.end) {
                // Overlapping, update end time
                lastSlot.end = new Date(Math.max(lastSlot.end, slot.end));
            } else {
                // No overlap, add new slot
                mergedBusySlots.push(slot);
            }
        }
        
        // Find free time slots
        const freeSlots = [];
        let currentTime = searchStart;
        
        for (const busySlot of mergedBusySlots) {
            // If current time is before busy slot start, this is free time
            if (currentTime < busySlot.start) {
                freeSlots.push(new TimeSlot(currentTime, busySlot.start));
            }
            currentTime = busySlot.end;
        }
        
        // Check for free time after last busy slot until search end time
        if (currentTime < searchEnd) {
            freeSlots.push(new TimeSlot(currentTime, searchEnd));
        }

        let slots_by_day = {};

        // Group free slots by day (YYYY-MM-DD as key)
        for (let slot of freeSlots) {
            let startDate = new Date(slot.start);
            let endDate = new Date(slot.end);
    
            // Iterate from the start date to the end date, splitting slots
            let currentDate = new Date(startDate);
            while (currentDate <= endDate) {
                let dateKey = currentDate.toISOString().split("T")[0]; // Extract YYYY-MM-DD
                
                // Ensure the key exists
                if (!slots_by_day[dateKey]) {
                    slots_by_day[dateKey] = [];
                }
    
                // Calculate the start and end for this day's slot
                let slotStart = (currentDate.toISOString().split("T")[0] === startDate.toISOString().split("T")[0])
                    ? startDate // First day: Use original start time
                    : new Date(currentDate.setHours(0, 0, 0, 0)); // New day starts at midnight
    
                let slotEnd = (currentDate.toISOString().split("T")[0] === endDate.toISOString().split("T")[0])
                    ? endDate // Last day: Use original end time
                    : new Date(currentDate.setHours(23, 59, 59, 999)); // Full day slot ends at 23:59:59.999
    
                // Create a new TimeSlot and add it to the list
                slots_by_day[dateKey].push(new TimeSlot(slotStart, slotEnd));
    
                // Move to the next day
                currentDate.setDate(currentDate.getDate() + 1);
                currentDate.setHours(0, 0, 0, 0); // Reset to midnight
            }
        }

        
        return freeSlots;
    }

    _find_availble_times_with_min_durations(events, searchStart, searchEnd, minDurationMinutes) {
        const allFreeSlots = this._find_availble_times(events, searchStart, searchEnd);
        
        return allFreeSlots.filter(slot => {
            const durationMinutes = (slot.end - slot.start) / (1000 * 60);
            return durationMinutes >= minDurationMinutes;
        });
    }

    // _find_unhappen_study_sessions(plan) {
    //     const sessions = plan.sessions;
    //     let unhanppen_sessions = [];
    //     const now = new Date();
    //     for (let session of sessions) {
    //         if (session.start_time < now) {
    //             continue;
    //         } else {
    //             unhanppen_sessions.push(session);
    //         }
    //     }
    //     return unhanppen_sessions;

    // }

    /* from ChatGPT 4o */
    _exclude_block_times(free_slots, minimum) {
        const preference = new Preference();
        const block_times = preference.block_times; // Example: ["00:00-08:00", "13:00-14:00"]
        const min = minimum * 60 * 1000;
    
        const result = [];
  
        // Parse block times
        const parsedBlockTimes = block_times.map(timeRange => {
          const [start, end] = timeRange.split('-');
          const [startHour, startMinute] = start.split(':').map(Number);
          const [endHour, endMinute] = end.split(':').map(Number);
          
          return {
            startHour, startMinute,
            endHour, endMinute
          };
        });
        
        // Process each free slot
        for (const slot of free_slots) {
          // Get start and end dates, ensuring they are Date objects
          const startDate = slot.start instanceof Date ? slot.start : new Date(slot.start);
          const endDate = slot.end instanceof Date ? slot.end : new Date(slot.end);
          
          // Iterate through each day
          let currentDate = new Date(startDate);
          currentDate.setHours(0, 0, 0, 0); // Start at beginning of the day
          
          while (currentDate < endDate) {
            const nextDate = new Date(currentDate);
            nextDate.setDate(nextDate.getDate() + 1);
            
            // Calculate the available times for this day after excluding block times
            for (const blockTime of parsedBlockTimes) {
              // Set up block start and end times for this day
              const blockStart = new Date(currentDate);
              blockStart.setHours(blockTime.startHour, blockTime.startMinute, 0, 0);
              
              const blockEnd = new Date(currentDate);
              blockEnd.setHours(blockTime.endHour, blockTime.endMinute, 0, 0);
              
              // Get the available slots for this day
              const dayStart = startDate > currentDate ? startDate : currentDate;
              const dayEnd = endDate < nextDate ? endDate : new Date(nextDate.getTime() - 1);
              
              // If block ends before day starts or block starts after day ends, the whole day is available
              if (blockEnd <= dayStart || blockStart >= dayEnd) {
                // The whole period is available
                if (dayEnd.getTime() - dayStart.getTime() >= min) {
                  result.push(new TimeSlot(dayStart, dayEnd));
                }
              } else {

                // We need to split the day into before-block and after-block periods
                if (dayStart < blockStart && blockStart.getTime() - dayStart.getTime() >= min) {
                    result.push(new TimeSlot(dayStart, blockStart));
                }
                
                if (blockEnd < dayEnd && dayEnd.getTime() - blockEnd.getTime() >= min) {
                  result.push(new TimeSlot(blockEnd, dayEnd));
                }
              }
            }
            
            // Move to next day
            currentDate = nextDate;
          }
        }
        
        return result;
      }

    _get_next_id(){
        this._id_counter += 1;
        return this._id_counter;
    }
}