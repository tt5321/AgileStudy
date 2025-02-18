import UserEvent from "./UserEvent.js";

export default class StudySession extends UserEvent {
    _study_plan;
    _change;

    constructor({study_plan, ...param} = {}) {
        super(param);
        this._type = "studysession";
        this._study_plan = study_plan;
    }

    get study_plan(){
        return this._study_plan;
    }
    
    get chagne(){
        return this._change;
    }

    /**
     * @param String op
     */
    set change(op) {
        if (typeof(op) !== "string") {
            console.error("Error: op must be a string");
        }
        this._change = op;
    }
}