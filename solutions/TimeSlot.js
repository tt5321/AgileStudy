/**
 * A TimeSlot with a start time and an end time
 * @class
 */
export default class TimeSlot {
    _start;
    _end;

    /**
     * A constructor function
     * @param {string} start - start timee.g. "2025-02-18T17:00:00Z"
     * @param {string} end - end time
     */
    constructor(start, end) {
        this._start = new Date(start);
        this._end = new Date(end);
    }
    
    /**
     * A getter function for start time
     * @returns {Date} start
     */
    get start(){
        return this._start;
    }

    /**
     * A getter function for end time
     * @returns {Date} end
     */
    get end() {
        return this._end;
    }

    /**
     * A setter function for start time
     * @param {Date} start
     */
    set start(value) {
        if (value instanceof Date) {
            this._start = value;
        } else {
            console.log("Invalid parameter. Should be a Date object");
        }
    }
    
    /**
     * A setter function for end time
     * @param {Date} end
     */
    set end(value) {
        if (value instanceof Date) {
            this._end = value;
        } else {
            console.log("Invalid parameter. Should be a Date object");
        }
    }
}