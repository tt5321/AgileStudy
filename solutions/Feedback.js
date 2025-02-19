import AssignmentEvent from "./AssignmentEvent";
import TimeSlot from "./TimeSlot";

/**
 * A Feedback for an assignment event
 * @class
 */
export default class Feedback {
    _event;
    _total_actual_time;
    _contentCompleted;
    _actual_times;
    _additional_time;
    _utilization_rate;
    _learning_speed;

    /**
     * A constructor function
     * @param {AssignmentEvent} event
     */
    constructor(event){
        this._event = event;
    }

    /**
     * A getter function for totaltime (actual study time - in minutes)
     * @returns {number} totaltime
     */
    get totaltime() {
        return this._total_actual_time;
    }

    /**
     * A getter function for actual_times (actual study time slots)
     * @returns {Array<TimeSlot>} actual_times
     */
    get actual_times(){
        return this._actual_times;
    }

    /**
     * A getter function for additional_time (the additional time comparing with the actual study time and planned study time, in minutes, value can be positive and negative)
     * @returns {number} additonal_time
     */
    get additonal_time(){
        return this._additional_time;
    }

    /**
     * A getter function for time utilization_rate for this assignment
     * @returns {number} utilization_rate
     */   
    get utilization_rate(){
        return this._utilization_rate;
    }

    /**
     * A getter function for time learning_speed for this assignment
     * @returns {number} learning_speed
     */   
    get learning_speed(){
        return this._learning_speed;
    }

    /**
     * A setter function for actual_times (actual study time slots)
     * @param {Array<TimeSlot>} actual_times
     */      
    set actual_times(times){
        this._actual_times = times;
    }

    /**
     * A function that calculates the total actual study time (in minutes) based on actual_times
     * @returns {void} Nothing
     */   
    calculate_total_time(){
       this._total_actual_time = this._actual_times.reduce((total, slot) => {
            let duration = (slot.end - slot.start) / (1000 * 60); // Convert milliseconds to minutes
            return total + duration;
        }, 0);
    }

    /**
     * A function that calculates the utilization rate
     * @returns {void} Nothing
     */   
    calculate_utilization_rate(){
        const plan = this._event.study_plan;
        const planned_time = plan.planned_time;
        this._additional_time = this._total_actual_time - planned_time;
        this._utilization_rate = this._total_actual_time / planned_time;
    }

    /**
     * A function that calculates the learning speed
     * @returns {void} Nothing
     */   
    calculate_learning_speed(complete_rate){
        this._learning_speed = complete_rate / this._utilization_rate;
    }
}