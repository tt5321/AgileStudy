import UserEvent from "./UserEvent.js";
import StudyPlan from "./StudyPlan.js";
import Feedback from "./Feedback.js";
import Algorithm from "./Algorithm.js"
import TimeSlot from "./TimeSlot.js";

/**
 * An Assignemnt event from calendar
 * @class
 */
export default class AssignmentEvent extends UserEvent {
    _desired_study_quality;
    _assignement_description;
    _study_plan;
    _feedback;


    /**
     * A constructor function
     * Note: type would be automatically configured as "assignment"
     * @param {number} quality
     * @param {string} description
     * @param {number} id
     * @param {string} title
     * @param {Date} start_time
     * @param {Date} end_time
     */
    constructor({quality=3, description="", ...param} = {}){
        super({type: "assignment", ...param});
        this._desired_study_quality = quality;
        this._assignement_description = description;
        this._study_plan = new StudyPlan(this);
        this._feedback = new Feedback(this);
    }

    /**
     * A getter function for desired_study_quality
     * @returns {number} quality
     */
    get quality(){
        return this._desired_study_quality;
    }

    /**
     * A getter function for assignment_description
     * @returns {string} description
     */
    get description() {
        return this._assignement_description;
    }

    /**
     * A getter function for study_plan
     * @returns {StudyPlan} study_plan
     */
    get study_plan() {
        return this._study_plan;
    }

     /**
     * A getter function for feedback
     * @returns {Feedback} feedback
     */
    get feedback() {
        return this._feedback;
    }

    /**
     * A setter function for quality
     * @param {number} value
     */
    set quality(value) {
        this._desired_study_quality = value;
    }

    /**
     * A setter function for description
     * @param {string} des
     */
    set description(des) {
        this._assignement_description = des;
    }

    /**
     * A function that calls the algorithm to generate a study plan for this assignment
     * @returns {void} Nothing
     */ 
    create_studyplan(){
        const algo = new Algorithm();
        algo.generate_plan(this);
    }

    /**
     * A function that configures the assignment's Feedback object and invokes the algorithm to learn from it
     * @param {Array<TimeSlot>} actua_times
     * @param {number} complete_rate (usually <=1)
     * @returns {void} Nothing
     */ 
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