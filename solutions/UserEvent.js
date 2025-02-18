export default class UserEvent {
    _id;
    _title;
    _start_time;
    _end_time;
    _type;

    constructor({id, title, start_time, end_time, type} = {}) {
        this._id = id;
        this._title = title;
        this._start_time = start_time;
        this._end_time = end_time;
        this._type = type;
    }

    get id() {
        return this._id;
    }

    get title() {
        return this._title;
    }

    get start_time() {
        return this._start_time;
    }

    get end_time() {
        return this._end_time;
    }

    get type() {
        return this._type;
    }

    set title(value) {
        this._title = value;
    }

    set start_time(time) {
        this._start_time = time;
    }

    set end_time(time) {
        this._end_time = time;
    }
}