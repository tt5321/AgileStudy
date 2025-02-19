import AssignmentEvent from "./AssignmentEvent.js";
import Feedback from "./Feedback.js";

/**
 * The algorithm for determining total study hours and adapting based on feedback.
 * @class Algorithm
 */
export default class Algorithm {
    static _instance;
    _overall_utilization_rate;
    _overall_learning_speed;

    /**
     * A constructor in singular pattern
     */
    constructor() {
        if (Algorithm._instance){
            return Algorithm._instance;
        }
        Algorithm._instance = this;
        this._overall_utilization_rate = 0;
        this._overall_learning_speed = 0;
    }

    /**
     * A function to generate and configure study time (in minutes)
     * @param {AssignmentEvent} assignment 
     * @returns {void} Nothing
     */
    generate_plan(assignment){
        let total_time;
        // Calculate study time by analyzing assignment description (fake analysis now)
        if (assignment.description.length <= 20) {
            total_time = 60;
        } else if (assignment.description.length > 20 && assignment.description.length < 200) {
            total_time = 150;
        } else {
            total_time = 300;
        }
        // Combine with analysis of user desired quality (fake analysis now)
        if (assignment.quality === 0) {
            total_time = 0;
        } else if (assignment.quality === 1) {
            total_time /= 2;
        } else if (assignment.quality === 3) {
            total_time *= 1.5;
        }

        // Combine with analysis of overall utilization rate
        total_time = Math.round(total_time * (1 + this._overall_utilization_rate));
        // Combine with analysis of overall learning rate
        total_time = Math.round(total_time * (1 + this._overall_learning_speed));
        
        // Configure study plan
        assignment.study_plan.planned_time = total_time;
    }
    
    /**
     * A function to integrate user statistics from a feedback
     * @param {Feedback} feedback 
     * @returns {void} Nothing
     */
    learn(feedback){
        this._overall_utilization_rate = this._overall_utilization_rate * 0.6 + feedback.utilization_rate * 0.4;
        this._overall_learning_speed = this._overall_learning_speed * 0.6 + feedback.learning_speed * 0.4;
    }

    /**
     * A getter function for ovreall utilization_rate
     * @returns {number} overall utilization rate
     */
    get utilization_rate(){
        return this._overall_utilization_rate;
    }

    /**
     * A getter function for overall learning_speed
     * @returns {number} overall learning speed
     */
    get learning_speed(){
        return this._overall_learning_speed;
    }
}