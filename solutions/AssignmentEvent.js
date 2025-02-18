import UserEvent from "./UserEvent.js";
import StudyPlan from "./StudyPlan.js";
import Feedback from "./Feedback.js";
import Algorithm from "./Algorithm.js"
import TimeSlot from "./TimeSlot.js";

export default class AssignmentEvent extends UserEvent {
    _desired_study_quality;
    _assignement_description;
    _study_plan;
    _feedback;

    constructor({quality=3, description="", ...param} = {}){
        super({type: "assignment", ...param});
        this._desired_study_quality = quality;
        this._assignement_description = description;
        this._study_plan = new StudyPlan(this);
        this._feedback = new Feedback(this);
    }

    get quality(){
        return this._desired_study_quality;
    }

    get description() {
        return this._assignement_description;
    }

    get study_plan() {
        return this._study_plan;
    }

    get feedback() {
        return this._feedback;
    }

    set quality(value) {
        this._desired_study_quality = value;
    }

    set description(des) {
        this._assignement_description = des;
    }

    create_studyplan(){
        const algo = new Algorithm();
        algo.generate_plan(this);
    }

    create_feedback(actual_times, complete_rate) {
        if (actual_times.every(item => item instanceof TimeSlot) == true && typeof(complete_rate) === "number") {
            const feedback = this._feedback;
            feedback.actual_times = actual_times;
            feedback.calculate_total_time();
            feedback.calculate_utilization_rate();
            feedback.calculate_learning_speed(complete_rate);

            const algo = new Algorithm();
            algo.learn(feedback);
        } else {
            console.log("Invalid Arguments. Block times should be TimeSlot objects; complete_rate should be a number");
        }
    }
}