export default class StudyPlan{
    _assignment;
    _total_plan_time;
    _sessions;

    constructor(assignment) {
        this._assignment = assignment;
    }

    get assignment() {
        return this._assignment;
    }

    get planned_time() {
        return this._total_plan_time;
    }
    get sessions() {
        return this._sessions;
    }

    set planned_time(minute) {
        this._total_plan_time = minute;
    }

    set sessions(sessions){
        this._sessions = sessions;
    }
}