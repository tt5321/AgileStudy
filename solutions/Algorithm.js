

export default class Algorithm {
    static _instance;
    _overall_utilization_rate;
    _overall_learning_speed;

    constructor() {
        if (Algorithm._instance){
            return Algorithm._instance;
        }
        Algorithm._instance = this;
        this._overall_utilization_rate = 0;
        this._overall_learning_speed = 0;
    }

    generate_plan(assignment){
        let total_time;
        // analyze description - fake analysis
        if (assignment.description.length <= 20) {
            total_time = 60;
        } else if (assignment.description.length > 20 && assignment.description.length < 200) {
            total_time = 150;
        } else {
            total_time = 300;
        }
        // analyze desired quality - fake analysis
        if (assignment.quality === 0) {
            total_time = 0;
        } else if (assignment.quality === 1) {
            total_time /= 2;
        } else if (assignment.quality === 3) {
            total_time *= 1.5;
        }

        // analyze utilization rate - simple analysis
        total_time = Math.round(total_time * (1 + this._overall_utilization_rate));
        // analyze learning rate - simple analysis
        total_time = Math.round(total_time * (1 + this._overall_learning_speed));
        
        // configure study plan
        assignment.study_plan.planned_time = total_time;
    }
    
    learn(feedback){
        this._overall_utilization_rate = this._overall_utilization_rate * 0.6 + feedback.utilization_rate * 0.4;
        this._overall_learning_speed = this._overall_learning_speed * 0.6 + feedback.learning_speed * 0.4;
    }

    get utilization_rate(){
        return this._overall_utilization_rate;
    }

    get learning_speed(){
        return this._overall_learning_speed;
    }
}