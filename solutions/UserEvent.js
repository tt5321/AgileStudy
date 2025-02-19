/**
 * A UserEvent from calendar
 * @class
 */
export default class UserEvent {
    _id;
    _title;
    _start_time;
    _end_time;
    _type;

    /**
     * A constructor function
     * @param {number} id
     * @param {string} title
     * @param {Date} start_time
     * @param {Date} end_time
     * @param {string} type
     */
    constructor({id, title, start_time, end_time, type} = {}) {
        this._id = id;
        this._title = title;
        this._start_time = start_time;
        this._end_time = end_time;
        this._type = type;
    }

    /**
     * A getter function for event id
     * @returns {number} id
     */
    get id() {
        return this._id;
    }

    /**
     * A getter function for event title
     * @returns {string} title
     */
    get title() {
        return this._title;
    }

    /**
     * A getter function for event start_time
     * @returns {Date} start_time
     */
    get start_time() {
        return this._start_time;
    }

    /**
     * A getter function for event end_time
     * @returns {Date} end_time
     */
    get end_time() {
        return this._end_time;
    }

    /**
     * A getter function for event type
     * @returns {string} type
     */
    get type() {
        return this._type;
    }

    /**
     * A setter function for event title
     * @param {string} title
     */
    set title(value) {
        this._title = value;
    }

    /**
     * A setter function for event start time
     * @param {Date} start_time
     */
    set start_time(time) {
        this._start_time = time;
    }

    /**
     * A setter function for event end time
     * @param {Date} end_time
     */
    set end_time(time) {
        this._end_time = time;
    }
}