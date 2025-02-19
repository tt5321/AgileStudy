import AssignmentEvent from "./AssignmentEvent.js";
import UserEvent from "./UserEvent.js";
import StudySession from "./StudySession.js";
import Scheduler from "./Scheduler.js";
import Preference from "./Preference.js";
import TimeSlot from "./TimeSlot.js";

/**
 * The Planner - orchestrator of this system
 * @class
 */
export default class Planner {
    _user_events;
    _assignments;
    _study_sessions;
    _scheduler;
    _preference;

    /**
     * A constructor function
     * @param {Array<{ type: string, eventType: string, details: { id: string, summary: string, start: { dateTime: string }, end: { dateTime: string } } }>} exist_events  - List of existing events 
     * exist_events example:
     * [{
     *     "type": "",
     *     "eventType": "normal", // "normal", "studysession", "assignment"
     *     "details": {
     *         "id": "1",
     *         "summary": "Dance club meeting",
     *         "start": { "dateTime": "2025-03-11T10:00:00Z" },
     *         "end": { "dateTime": "2025-03-11T11:00:00Z" }
     *         }
     *  }, ...]
     */
    constructor(exist_events) {
        this._user_events = [];
        this._assignments = [];
        this._study_sessions = [];
        this._scheduler = new Scheduler();
        this._preference = new Preference();
        this._get_existing_events(exist_events);
    }

    /**
     * A protected function that transforms existed events in JSON format objects in a list to UserEvent objects
     * @param {Array<{ type: string, eventType: string, details: { id: string, summary: string, start: { dateTime: string }, end: { dateTime: string } } }>} exist_events  - List of existing events 
     * @returns {void} Nothing
     */
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

   /**
    * A function that accepts an event in JSON format object and calls coresponding based on event type
    * Note: Assumed there is an external calendar and a webhood, so user changes of events on calendar will be synced to here
    * @param {Object} event_data - The event object
    * @param {string} event_data.type - Event type (e.g., "created", "updated", "deleted")
    * @param {string} event_data.eventType - Event category (e.g., "normal", "studysession", "assignment")
    * @param {Object} event_data.details - Event details
    * @param {string} event_data.details.id - Event ID
    * @param {string} event_data.details.summary - Event summary
    * @param {Object} event_data.details.start - Event start time
    * @param {string} event_data.details.start.dateTime - Start time (ISO 8601 format)
    * @param {Object} event_data.details.end - Event end time
    * @param {string} event_data.details.end.dateTime - End time (ISO 8601 format)
    * 
    * event_data example (from ChatGPT):
    * {
    * "type": "created", // "created", "updated", "deleted"
    * "eventType": "normal", // "normal", "studysession", "assignment"
    * "details": {
    *     "id": "12345",
    *     "summary": "Dance club meeting",
    *     "start": { "dateTime": "2025-02-11T10:00:00Z" },
    *     "end": { "dateTime": "2025-02-11T11:00:00Z" }
    *     }
    * }
    * @returns {void} Nothing
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

    /**
     * A protected function that syncs a list of events from this system back to the external calendar
     * Note: fake implementation for now
     * @param {Array<UserEvent|AssignmentEvent|StudySession>} events 
     * @param {string} op - operation e.g. "deleted", "updated" 
     */
    _sync_back(events, op) {
        for (let event of events) {
            // fake implemention
            console.log(`Sync back to the calendary - ${op} event ${event} - Succeed.`);
        }
    }

    /**
     * A protected function for this system to handle a create/update/delete of a user event
     * Note: If the user creates or updates an user event, which conflicts with some existed study sessions, these study sessions will be reallocated
     * @param {string} op - operation e.g. "created", "updated", "deleted"
     * @param {Object} details - Event details
     * @param {string} details.id - Event ID
     * @param {string} details.summary - Event summary
     * @param {Object} details.start - Event start time
     * @param {string} details.start.dateTime - Start time (ISO 8601 format)
     * @param {Object} details.end - Event end time
     * @param {string} details.end.dateTime - End time (ISO 8601 format)
     * @returns {void} Nothing
     */
    _handler_userevent_change(op, details) {
        // create a a UserEvent object
        if (op === "created") {
            const event = new UserEvent({
                id: Number(details.id), 
                title: details.summary, 
                start_time: new Date(details.start.dateTime), 
                end_time: new Date(details.end.dateTime), 
                type: "userevent"});
            this._user_events.push(event);
            // detect if there are conflicts with existed study sessions, if any, reallocate the study sessions
            let conflicts = this._detect_conflict(event);
            if (conflicts.length !== 0) {
                this._study_sessions = this._study_sessions.filter(s => !conflicts.includes(s));
                for (let s of conflicts) {
                    this._scheduler.reallocate_session(s, [...this._user_events, ...this._assignments, ...this._study_sessions]);
                    this._study_sessions.push(s);
                }
                // sync the changes of reallocated study sessions back to the external calendar 
                this._sync_back(conflicts, "updated");
            }
        }

        // update a UserEvent object
        if (op === "updated") {
            for (let event of this._user_events) {
                if (event.id === Number(details.id)) {
                    event.title = details.summary;
                    event.start_time = new Date(details.start.dateTime);
                    event.end_time = new Date(details.end.dateTime);
                    // detect if there are conflicts with existed study sessions, if any, reallocate the study sessions
                    const conflicts = this._detect_conflict(event);
                    this._study_sessions = this._study_sessions.filter(s => !conflicts.includes(s));
                    for (let s of conflicts) {
                        this._scheduler.reallocate_session(s, [...this._user_events, ...this._assignments, ...this._study_sessions]);
                        this._study_sessions.push(s);
                    }
                    // sync the changes of reallocated study sessions back to the external calendar 
                    this._sync_back(conflicts, "updated");
                    break;
                }
            }
        }

        // delete a UserEvent object
        if (op === "deleted") {
            this._user_events = this._user_events.filter(event => event.id !== Number(details.id));
        }
        
    }

    /**
     * A protected function for this to detect if a newly created or updated user event conflicts with some existed study sessions 
     * @param {UserEvent} user_event 
     * @returns {Array<StudySession>} conflict_sessions
     */
    _detect_conflict(user_event){
        let conflict_sessions;
        conflict_sessions = this._study_sessions.filter(s => {
            return user_event.start_time <= s.end_time && user_event.end_time >= s.start_time;
        })
        // console.log(conflict_sessions);
        return conflict_sessions;
    }

    /**
     * A protected function for this system to handle a create/update/delete of a study session event
     * @param {string} op - operation e.g. "created", "updated", "deleted"
     * @param {Object} details - Event details
     * @param {string} details.id - Event ID
     * @param {string} details.summary - Event summary
     * @param {Object} details.start - Event start time
     * @param {string} details.start.dateTime - Start time (ISO 8601 format)
     * @param {Object} details.end - Event end time
     * @param {string} details.end.dateTime - End time (ISO 8601 format)
     * @returns {void} Nothing
     */
    _handler_studysession_change(op, details) {
        // Do not allow the user to create a study session on the external calendar
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

        // User can modify the time of a study session on the external calendar, the modification will be reflected on the total planned time of the study plan
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

        // User can delete a study session on the external calendar, the modification will be reflected on the total planned time of the study plan
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

    /**
     * A protected function for this system to handle a create/update/delete of an assignment event
     * @param {string} op - operation e.g. "created", "updated", "deleted"
     * @param {Object} details - Event details
     * @param {string} details.id - Event ID
     * @param {string} details.summary - Event summary
     * @param {Object} details.start - Event start time
     * @param {string} details.start.dateTime - Start time (ISO 8601 format)
     * @param {Object} details.end - Event end time
     * @param {string} details.end.dateTime - End time (ISO 8601 format)
     * @param {string} details.quality - Event quality level
     * @param {string} details.description - Additional event description
     * @returns {void} Nothing
     */
    _handler_assignment_change(op, details) {
        // When the user creates an assignment event on the external calendar, the system automatically creates a study plan and create study sessions
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
            // create study plan
            event.create_studyplan();
            // create study sessions
            let new_sessions = this._scheduler.allocate_sessions(event, [...this._user_events, ...this._assignments, ...this._study_sessions]);
            this._study_sessions.push(...new_sessions);
            // sync the newly created study sessions back to the calendar
            this._sync_back(event.study_plan.sessions, "created");
        }

        // When the user updates an assignment event, the system automatically re-creates a study plan and re-allocate study sessions
        if (op === "updated") {
            for (let event of this._assignments) {
                if (event.id === Number(details.id)) {
                    event.title = details.summary;
                    event.start_time = new Date(details.start.dateTime);
                    event.end_time = new Date(details.end.dateTime);
                    // delete the old sessions
                    this._sync_back(event.study_plan.sessions, "deleted");
                    this._study_sessions = this._study_sessions.filter(s => !event.study_plan.sessions.includes(s));
                    // re-create study plan and study sessions
                    event.create_studyplan();
                    let new_sessions = this._scheduler.allocate_sessions(event, [...this._user_events, ...this._assignments, ...this._study_sessions]);
                    this._study_sessions.push(...new_sessions);
                    // sync the newly re-created study sessions back to the calendar
                    this._sync_back(event.study_plan.sessions, "created");
                    break;
                }
            }
        }

        // When the user deletes an assignment event, the system automatically deletes its corresponding study sessions
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
            // sync the deleted study sessions back to the calendar
            this._sync_back(plan.sessions, "deleted");

            this._study_sessions = this._study_sessions.filter(session => !plan.sessions.includes(session));
            this._assignments = this._assignments.filter(event => event.id !== Number(details.id));
        }
    }

    /**
     * A function for providing feedback to an assignment
     * @param {number} assignment_id 
     * @param {Array<TimeSlot>} actual_times 
     * @param {number} complete_rate e.g. 0.8
     * @returns {void} Nothing
     */
    provide_feedback(assignment_id, actual_times, complete_rate) {
        for (let a of this._assignments) {
            if (a.id === Number(assignment_id)) {
                a.create_feedback(actual_times, complete_rate);
                break;
            }
        }
    }

    /**
     * A function for modifying
     * @param {string} type "block_times" or "minimum"
     * @param {string | number} value 
     * - {string} for block_times, e.g. ["01:00-09:00", "12:00-13:00"]
     * - {number} for minimum , e.g. 15 (=15 minumutes)
     * @returns {void} Nothing
     */
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

    /**
     * A getter function for a list of all user_events
     * @returns {Array<UserEvent>} user_events
     */
    get user_events() {
        return this._user_events;
    }

    /**
     * A getter function for a list of all assignments
     * @returns {Array<AssignmentEvent>} assignments
     */
    get assignments() {
        return this._assignments;
    }

    /**
     * A getter function for a list of all study sessions
     * @returns {Array<StudySession>} study_sessions
     */
    get study_sessions(){
        return this._study_sessions;
    }
}