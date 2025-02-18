export default class Preference {
    static _instance;
    _block_study_times;
    _minimum_session_duration;

    constructor() {
        if (Preference._instance){
            return Preference._instance;
        }
        Preference._instance = this;
        this._block_study_times =["00:00-08:00"];
        this._minimum_session_duration = 30;
    }

    get block_times(){
        return this._block_study_times;
    }

    get minimum(){
        return this._minimum_session_duration;
    }

    set block_times(times){
        if (times.every(item => typeof(item) === "string") == true) {
            this._block_study_times = times;
        } else {
            console.log('Invalid times. Block times should be ["00:00-08:00", "13:00-14:00"]');
        }
    }

    set minimum(value){
        if (value >= 30) {
            this._minimum_session_duration = value;
        } else {
            console.log("Invalid value. Minimum durations should be greater than or equal to 30 miniutes");
        }
    }
}