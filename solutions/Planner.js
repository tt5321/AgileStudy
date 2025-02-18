import AssignmentEvent from "./AssignmentEvent.js";
import UserEvent from "./UserEvent.js";
import StudySession from "./StudySession.js";
import Scheduler from "./Scheduler.js";
import Preference from "./Preference.js";

export default class Planner {
    _user_events;
    _assignments;
    _study_sessions;
    _scheduler;
    _preference;

    constructor(exist_events) {
        this._user_events = [];
        this._assignments = [];
        this._study_sessions = [];
        this._scheduler = new Scheduler();
        this._preference = new Preference();
        this._get_existing_events(exist_events);
    }

    _get_existing_events(exist_events) {
        for (let event of exist_events) {
            const e_id = Number(event.details.id);
            const e_title = event.details.summary;
            const e_start = new Date(event.details.start.dateTime);
            const e_end = new Date(event.details.end.dateTime);

            //create object and push into list
            this._user_events.push(new UserEvent({
                id: e_id, 
                title: e_title, 
                start_time: e_start, 
                end_time: e_end, 
                type: "userevent"}));
        }
    }

    /* 
    event_data example (from ChatGPT):
    {
    "type": "created", // "created", "updated", "deleted"
    "eventType": "normal", // "normal", "studysession", "assignment"
    "details": {
        "id": "12345",
        "summary": "Dance club meeting",
        "start": { "dateTime": "2025-02-11T10:00:00Z" },
        "end": { "dateTime": "2025-02-11T11:00:00Z" }
        }
    }
    */
    sync(event_data) {
        const type = event_data.eventType; 
        const op = event_data.type;
        const details = event_data.details;

        switch (type) {
            case 'normal':
              this._handler_userevent_change(op, details);
              break;
            case 'studysession':
              this._handler_studysession_change(op, details);
              break;
            case 'assignment':
                this._handler_assignment_change(op, details);
              break;
            default:
              console.log('Unknown event type');
          }

        console.log('Synchronization complete.');
    }

    _sync_back(events, op) {
        for (let event of events) {
            // not implemented
            console.log(`Sync back to the calendary - ${op} event ${event} - Succeed.`);
        }
    }

    _handler_userevent_change(op, details) {
        if (op === "created") {
            const event = new UserEvent({
                id: Number(details.id), 
                title: details.summary, 
                start_time: new Date(details.start.dateTime), 
                end_time: new Date(details.end.dateTime), 
                type: "userevent"});
            this._user_events.push(event);
            let conflicts = this._detect_conflict(event);
            if (conflicts.length !== 0) {
                this._study_sessions = this._study_sessions.filter(s => !conflicts.includes(s));
                for (let s of conflicts) {
                    this._scheduler.reallocate_session(s, [...this._user_events, ...this._assignments, ...this._study_sessions]);
                    this._study_sessions.push(s);
                }
                this._sync_back(conflicts, "updated");
            }
        }

        if (op === "updated") {
            for (let event of this._user_events) {
                if (event.id === Number(details.id)) {
                    event.title = details.summary;
                    event.start_time = new Date(details.start.dateTime);
                    event.end_time = new Date(details.end.dateTime);
                    const conflicts = this._detect_conflict(event);
                    this._study_sessions = this._study_sessions.filter(s => !conflicts.includes(s));
                    for (let s of conflicts) {
                        this._scheduler.reallocate_session(s, [...this._user_events, ...this._assignments, ...this._study_sessions]);
                        this._study_sessions.push(s);
                    }
                    this._sync_back(conflicts, "updated");
                    break;
                }
            }
        }

        if (op === "deleted") {
            this._user_events = this._user_events.filter(event => event.id !== Number(details.id));
        }
        
    }

    _detect_conflict(user_event){
        let conflict_sessions;
        conflict_sessions = this._study_sessions.filter(s => {
            return user_event.start_time <= s.end_time && user_event.end_time >= s.start_time;
        })
        // console.log(conflict_sessions);
        return conflict_sessions;
    }

    _handler_studysession_change(op, details) {
        if (op === "created") {
            const event = new StudySession({
                id: Number(details.id),
                title: details.summary,
                start_time: new Date(details.start.dateTime),
                end_time: new Date(details.end.dateTime),
                type: "studysession"
            })
            this._sync_back([event], "deleted");
            console.log("Creating a study session is not allowed, use modify or delete");
        }

        if (op === "updated") {
            for (let session of this._study_sessions) {
                if (session.id === Number(details.id)) {
                    const old_start = new Date(session.start_time);
                    const old_end = new Date(session.end_time);
                    session.title = details.summary;
                    session.start_time = new Date(details.start.dateTime);
                    session.end_time = new Date(details.end.dateTime);
                    session.change = "user_modified";

                    // Change total planned time
                    const old_duration = (old_end - old_start) / (1000 * 60);
                    const new_duration = (session.end_time - session.start_time) / (1000 * 60);
                    session.study_plan.planned_time += (new_duration - old_duration);
                    break;
                }
            }
        }

        if (op === "deleted") {
            for (let session of this._study_sessions) {
                if (session.id === Number(details.id)) {
                    const old_duration = (session.end_time - session.start_time) / (1000 * 60);
                    session.study_plan.planned_time -= old_duration;
                    session.study_plan.sessions = session.study_plan.sessions.filter(s => s.id !== Number(details.id));
                    break;
                }
            }
            this._study_sessions = this._study_sessions.filter(s => s.id !== Number(details.id));
        }
    }

    _handler_assignment_change(op, details) {
        if (op === "created") {
            const event = new AssignmentEvent({
                id: Number(details.id),
                title: details.summary,
                start_time: new Date(details.start.dateTime),
                end_time: new Date(details.end.dateTime),
                quality: details.quality,
                description: details.description
            })
            this._assignments.push(event);
            event.create_studyplan();
            let new_sessions = this._scheduler.allocate_sessions(event, [...this._user_events, ...this._assignments, ...this._study_sessions]);
            this._study_sessions.push(...new_sessions);
            this._sync_back(event.study_plan.sessions, "created");
        }

        if (op === "updated") {
            for (let event of this._assignments) {
                if (event.id === Number(details.id)) {
                    event.title = details.summary;
                    event.start_time = new Date(details.start.dateTime);
                    event.end_time = new Date(details.end.dateTime);
                    this._sync_back(event.study_plan.sessions, "deleted");
                    this._study_sessions = this._study_sessions.filter(s => !event.study_plan.sessions.includes(s));
                    event.create_studyplan();
                    let new_sessions = this._scheduler.allocate_sessions(event, [...this._user_events, ...this._assignments, ...this._study_sessions]);
                    this._study_sessions.push(...new_sessions);
                    this._sync_back(event.study_plan.sessions, "created");
                    break;
                }
            }
        }

        if (op === "deleted") {
            let assignment;
            let plan;
            for (let event of this._assignments) {
                if (event.id === Number(details.id)) {
                    assignment = event;
                    plan = event.study_plan;
                    break;
                }
            }
            this._sync_back(plan.sessions, "deleted");
            this._study_sessions = this._study_sessions.filter(session => !plan.sessions.includes(session));
            this._assignments = this._assignments.filter(event => event.id !== Number(details.id));
        }

    }

    provide_feedback(assignment_id, actual_times, complete_rate) {
        for (let a of this._assignments) {
            if (a.id === Number(assignment_id)) {
                a.create_feedback(actual_times, complete_rate);
                break;
            }
        }
    }

    modify_preference(type, value){
        if (type === "block_times"){
            this._preference.block_times = value;
        } else if (type === "minimum") {
            this._preference.minimum = value;
        } else {
            console.log("Invalid preference type");
            return;
        }
        for (let a of this._assignments) {
            this._sync_back(a.study_plan.sessions, "deleted");
            this._study_sessions = this._study_sessions.filter(s => !a.study_plan.sessions.includes(s));
            a.create_studyplan();
            let new_sessions = this._scheduler.allocate_sessions(a, [...this._user_events, ...this._assignments, ...this._study_sessions]);
            this._study_sessions.push(...new_sessions);
            this._sync_back(a.study_plan.sessions, "created");
        }
    }

    get user_events() {
        return this._user_events;
    }

    get assignments() {
        return this._assignments;
    }

    get study_sessions(){
        return this._study_sessions;
    }
}