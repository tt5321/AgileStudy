import Planner from "./solutions/Planner.js";
import TimeSlot from "./solutions/TimeSlot.js";

function toString(events) {
    for (let event of events) {
        console.log(`id: ${event.id}`);
        console.log(`title: ${event.title}`);
        console.log(`start: ${event.start_time}`);
        console.log(`end: ${event.end_time}`);
        console.log(`type: ${event.type}`);
    }

}
let exist_events = [];
exist_events.push({
    "type": "",
    "eventType": "normal", // "normal", "studysession", "assignment"
    "details": {
        "id": "1",
        "summary": "Dance club meeting",
        "start": { "dateTime": "2025-03-11T10:00:00Z" },
        "end": { "dateTime": "2025-03-11T11:00:00Z" }
        }
    }
);
exist_events.push({
    "type": "",
    "eventType": "normal",
    "details": {
        "id": "2",
        "summary": "March Social Event",
        "start": { "dateTime": "2025-02-28T15:00:00Z" },
        "end": { "dateTime": "2025-02-28T16:00:00Z" }
        }
    }
);

const planner = new Planner(exist_events);
// toString(planner.user_events);
// toString(planner.assignments);
// toString(planner.study_sessions);

console.log(`\ncreate:`);
planner.sync(
    {
        "type": "created", // "created", "updated", "deleted"
        "eventType": "normal", // "normal", "studysession", "assignment"
        "details": {
            "id": "3",
            "summary": "Visit Katy",
            "start": { "dateTime": "2025-02-24T11:30:00Z" },
            "end": { "dateTime": "2025-02-24T14:00:00Z" }
            }
    }
)
// toString(planner.user_events);
// toString(planner.assignments);
// toString(planner.study_sessions);

console.log(`\nupdate:`);
planner.sync(
    {
        "type": "updated", // "created", "updated", "deleted"
        "eventType": "normal", // "normal", "studysession", "assignment"
        "details": {
            "id": "3",
            "summary": "Visit Katy",
            "start": { "dateTime": "2025-02-24T12:00:00Z" },
            "end": { "dateTime": "2025-02-24T14:30:00Z" }
            }
    }
)
// toString(planner.user_events);
// toString(planner.assignments);
// toString(planner.study_sessions);

console.log(`\ndelete:`);
planner.sync(
    {
        "type": "deleted", // "created", "updated", "deleted"
        "eventType": "normal", // "normal", "studysession", "assignment"
        "details": {
            "id": "3",
            "summary": "Visit Katy",
            "start": { "dateTime": "2025-02-24T12:00:00Z" },
            "end": { "dateTime": "2025-02-24T14:30:00Z" }
            }
    }
)
toString(planner.user_events);
toString(planner.assignments);
toString(planner.study_sessions);


console.log(`\ncreate assignment:`);
planner.sync(
    {
        "type": "created", // "created", "updated", "deleted"
        "eventType": "assignment", // "normal", "studysession", "assignment"
        "details": {
            "id": "4",
            "summary": "Project1 Due",
            "start": { "dateTime": "2025-02-21T23:50:00Z" },
            "end": { "dateTime": "2025-02-21T23:59:00Z" },
            "quality": "2",
            "description": "Complete design and code implementation using OOP for a topic"
            }
    }
)

toString(planner.user_events);
toString(planner.assignments);
toString(planner.study_sessions);

console.log(`\nupdate assignment:`);
planner.sync(
    {
        "type": "updated", // "created", "updated", "deleted"
        "eventType": "assignment", // "normal", "studysession", "assignment"
        "details": {
            "id": "4",
            "summary": "Project1 Due",
            "start": { "dateTime": "2025-02-24T23:50:00Z" },
            "end": { "dateTime": "2025-02-24T23:59:00Z" },
            "quality": "2",
            "description": "Complete design and code implementation using OOP for a topic"
            }
    }
)
toString(planner.user_events);
toString(planner.assignments);
toString(planner.study_sessions);


console.log(`\ndelete assignment:`);
planner.sync(
    {
        "type": "deleted", // "created", "updated", "deleted"
        "eventType": "assignment", // "normal", "studysession", "assignment"
        "details": {
            "id": "4",
            "summary": "Project1 Due",
            "start": { "dateTime": "2025-02-24T23:50:00Z" },
            "end": { "dateTime": "2025-02-24T23:59:00Z" },
            "quality": "2",
            "description": "Complete design and code implementation using OOP for a topic"
            }
    }
)
toString(planner.user_events);
toString(planner.assignments);
toString(planner.study_sessions);


console.log(`\ncreate assignment-2:`);
planner.sync(
    {
        "type": "created", // "created", "updated", "deleted"
        "eventType": "assignment", // "normal", "studysession", "assignment"
        "details": {
            "id": "5",
            "summary": "Project2 Due",
            "start": { "dateTime": "2025-02-28T16:00:00Z" },
            "end": { "dateTime": "2025-02-28T16:30:00Z" },
            "quality": "3",
            "description": "Complete design and code implementation using functional programming for a topic."
            }
    }
)

toString(planner.user_events);
toString(planner.assignments);
toString(planner.study_sessions);
console.log(planner.assignments[0].study_plan);

console.log(`\ncreate studysession:`);
planner.sync(
    {
        "type": "created", // "created", "updated", "deleted"
        "eventType": "studysession", // "normal", "studysession", "assignment"
        "details": {
            "id": "7",
            "summary": "study session created by user",
            "start": { "dateTime": "2025-02-23T17:00:00Z" },
            "end": { "dateTime": "2025-02-23T18:00:00Z" },
            }
    }
)

// toString(planner.user_events);
// toString(planner.assignments);
// toString(planner.study_sessions);

console.log(`\nupdate studysession:`);
planner.sync(
    {
        "type": "updated", // "created", "updated", "deleted"
        "eventType": "studysession", // "normal", "studysession", "assignment"
        "details": {
            "id": "1009",
            "summary": "study session 1009 modified for Project 2",
            "start": { "dateTime": "2025-02-19T17:00:00Z" },
            "end": { "dateTime": "2025-02-19T18:00:00Z" },
            }
    }
)
toString(planner.user_events);
toString(planner.assignments);
toString(planner.study_sessions);

console.log(`\ndelete studysession:`);
planner.sync(
    {
        "type": "deleted", // "created", "updated", "deleted"
        "eventType": "studysession", // "normal", "studysession", "assignment"
        "details": {
            "id": "1009",
            "summary": "study session 1009 modified for Project 2",
            "start": { "dateTime": "2025-02-19T17:00:00Z" },
            "end": { "dateTime": "2025-02-19T18:00:00Z" },
            }
    }
)
toString(planner.user_events);
toString(planner.assignments);
toString(planner.study_sessions);

console.log(`\ncreate conflict user event:`);
planner.sync(
    {
        "type": "created", // "created", "updated", "deleted"
        "eventType": "normal", // "normal", "studysession", "assignment"
        "details": {
            "id": "8",
            "summary": "Appointment with advisor",
            "start": { "dateTime": "2025-02-18T16:30:00Z" },
            "end": { "dateTime": "2025-02-18T17:00:00Z" },
            }
    }
)
toString(planner.user_events);
toString(planner.assignments);
toString(planner.study_sessions);

console.log(`\nupdate conflict user event:`);
planner.sync(
    {
        "type": "updated", // "created", "updated", "deleted"
        "eventType": "normal", // "normal", "studysession", "assignment"
        "details": {
            "id": "8",
            "summary": "Appointment with advisor",
            "start": { "dateTime": "2025-02-18T17:30:00Z" },
            "end": { "dateTime": "2025-02-18T18:00:00Z" },
            }
    }
)
toString(planner.user_events);
toString(planner.assignments);
toString(planner.study_sessions);

console.log(`\nmodify preference - minimum_duration:`);
planner.modify_preference("minimum", 30);
toString(planner.user_events);
toString(planner.assignments);
toString(planner.study_sessions);

console.log(`\nmodify preference - blocked_times:`);
planner.modify_preference("block_times", ["01:00-09:00"]);
toString(planner.user_events);
toString(planner.assignments);
toString(planner.study_sessions);


console.log(`\nprovide feedback:`);
let actual_times = [new TimeSlot("2025-02-18T17:00:00Z", "2025-02-18T17:00:00Z"), 
                new TimeSlot("2025-02-19T17:00:00Z", "2025-02-19T18:00:00Z")];
planner.provide_feedback("5", actual_times, 0.8);
toString(planner.user_events);
toString(planner.assignments);
toString(planner.study_sessions);


console.log(`\ncreate assignment:`);
planner.sync(
    {
        "type": "created", // "created", "updated", "deleted"
        "eventType": "assignment", // "normal", "studysession", "assignment"
        "details": {
            "id": "9",
            "summary": "Project2 Due",
            "start": { "dateTime": "2025-02-21T23:50:00Z" },
            "end": { "dateTime": "2025-02-21T23:59:00Z" },
            "quality": "2",
            "description": "Complete design and code implementation using OOP for a topic"
            }
    }
)

toString(planner.user_events);
toString(planner.assignments);
toString(planner.study_sessions);
console.log(planner.assignments[1].study_plan);