import StudyPlan from "./StudyPlan.js";
import UserEvent from "./UserEvent.js";

/**
 * A StudySession event
 * @class
 */
export default class StudySession extends UserEvent {
    _study_plan;
    _change;

    /**
     * A constructor
     * Note: type would be automatically configured as "studysession"
     * @param {StudyPlan} study_plan
     * @param {number} id
     * @param {string} title
     * @param {Date} start_time
     * @param {Date} end_time
     */
    constructor({study_plan, ...param} = {}) {
        super(param);
        this._type = "studysession";
        this._study_plan = study_plan;
    }

    /**
     * A getter function for study_plan
     * @returns {StudyPlan} study_plan
     */
    get study_plan(){
        return this._study_plan;
    }

    /**
     * A getter function for chagne
     * @returns {string|undefined} change - a note that tells if this session is manually modified by user
     */    
    get chagne(){
        return this._change;
    }

    /**
     * A setter function for chagne
     * @param {string} change - a note that tells if this session is manually modified by user
     */   
    set change(op) {
        if (typeof(op) !== "string") {
            console.error("Error: op must be a string");
        }
        this._change = op;
    }
}