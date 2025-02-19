/**
 * This main.js tests different scenarios of event changes, assuming these event changes come from a webhood of an external calendar,
 * as well as modifying preference and providing feedback
 * It prints out the information of events, you can see the automatic changes of study sessions based on these changes
 */
import AssignmentEvent from "./solutions/AssignmentEvent.js";
import Planner from "./solutions/Planner.js";
import StudySession from "./solutions/StudySession.js";
import TimeSlot from "./solutions/TimeSlot.js";
import UserEvent from "./solutions/UserEvent.js";

/**
 * A function that prints out information of events in an array
 * @param {Array<UserEvent|AssignmentEvent|StudySessio>} events
 * @returns {void} Nothing 
 */
function toString(events) {
    for (let event of events) {
        console.log(`id: ${event.id}`);
        console.log(`title: ${event.title}`);
        console.log(`start: ${event.start_time}`);
        console.log(`end: ${event.end_time}`);
        console.log(`type: ${event.type}`);
    }

}
/* Initialize with two existed user events*/
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

/* Start the Planner*/
const planner = new Planner(exist_events);
// toString(planner.user_events);
// toString(planner.assignments);
// toString(planner.study_sessions);


console.log(`\n1. reate a user event:`);
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

console.log(`\nu2. update a user event:`);
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

console.log(`\n3. delete a user event:`);
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


console.log(`\n4. create an assignment:`);
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

console.log(`\n5. update an assignment:`);
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


console.log(`\n6. delete an assignment:`);
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


console.log(`\n7. create assignment-2:`);
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

console.log(`\n8. create a studysession (prohibited):`);
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

console.log(`\n9. update studysession:`);
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

console.log(`\n10. delete a studysession:`);
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

console.log(`\n11. create a user event that conflicts with an existed study session:`);
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

console.log(`\n12. update an user event that will conflicts with an existed study session:`);
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

console.log(`\n13. modify preference - minimum_duration:`);
planner.modify_preference("minimum", 30);
toString(planner.user_events);
toString(planner.assignments);
toString(planner.study_sessions);

console.log(`\n14. modify preference - blocked_times:`);
planner.modify_preference("block_times", ["01:00-09:00"]);
toString(planner.user_events);
toString(planner.assignments);
toString(planner.study_sessions);


console.log(`\n15. provide feedback:`);
let actual_times = [new TimeSlot("2025-02-18T17:00:00Z", "2025-02-18T17:00:00Z"), 
                new TimeSlot("2025-02-19T17:00:00Z", "2025-02-19T18:00:00Z")];
planner.provide_feedback("5", actual_times, 0.8);
toString(planner.user_events);
toString(planner.assignments);
toString(planner.study_sessions);


console.log(`\n16. create a new assignment (total planned time increase):`);
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