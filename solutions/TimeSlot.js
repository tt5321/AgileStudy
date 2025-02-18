export default class TimeSlot {
    _start;
    _end;
    constructor(start, end) {
        this._start = new Date(start);
        this._end = new Date(end);
    }

    get start(){
        return this._start;
    }

    get end() {
        return this._end;
    }

    set start(value) {
        this._start = value;
    }
    
    set end(value) {
        this._end = value;
    }
}