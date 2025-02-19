import AssignmentEvent from "./AssignmentEvent.js";
import StudySession from "./StudySession.js";

/**
 * An StudyPlan for an assignment event
 * @class StudyPlan
 */
export default class StudyPlan{
    _assignment;
    _total_plan_time;
    _sessions;

    /**
     * A constructor function
     * @param {AssignmentEvent} assignment 
     */
    constructor(assignment) {
        this._assignment = assignment;
    }

    /**
     * A getter function for assignment
     * @returns {AssignmentEvent} assignment
     */
    get assignment() {
        return this._assignment;
    }

    /**
     * A getter function for total planned_time
     * @returns {number} planned_time
     */
    get planned_time() {
        return this._total_plan_time;
    }

    /**
     * A getter function for study sessions allocated based on this plan
     * @returns {Array<StudySession>} sessions
     */
    get sessions() {
        return this._sessions;
    }

    /**
     * A setter function for total planned_time
     * @param {number} minute
     */
    set planned_time(minute) {
        this._total_plan_time = minute;
    }

    /**
     * A setter function for study sessions
     * @param {Array<StudySession>} sessions
     */
    set sessions(sessions){
        this._sessions = sessions;
    }
}