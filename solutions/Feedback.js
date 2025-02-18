export default class Feedback {
    _event;
    _total_actual_time;
    _contentCompleted;
    _actual_times;
    _additional_time;
    _utilization_rate;
    _learning_speed;

    constructor(event){
        this._event = event;
    }

    get totaltime() {
        return this._total_actual_time;
    }

    get actual_times(){
        return this._actual_times;
    }

    get additonal_time(){
        return this._additional_time;
    }

    get utilization_rate(){
        return this._utilization_rate;
    }

    get learning_speed(){
        return this._learning_speed;
    }

    set actual_times(times){
        this._actual_times = times;
    }

    calculate_total_time(){
       this._total_actual_time = this._actual_times.reduce((total, slot) => {
            let duration = (slot.end - slot.start) / (1000 * 60); // Convert milliseconds to minutes
            return total + duration;
        }, 0);
    }

    calculate_utilization_rate(){
        const plan = this._event.study_plan;
        const planned_time = plan.planned_time;
        this._additional_time = this._total_actual_time - planned_time;
        this._utilization_rate = this._total_actual_time / planned_time;
    }

    calculate_learning_speed(complete_rate){
        this._learning_speed = complete_rate / this._utilization_rate;
    }
}