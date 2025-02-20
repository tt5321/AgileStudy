import AssignmentEvent from "./solutions/AssignmentEvent.js";
import Planner from "./solutions/Planner.js";
import StudySession from "./solutions/StudySession.js";
import TimeSlot from "./solutions/TimeSlot.js";
import UserEvent from "./solutions/UserEvent.js";
/**
 * This main.js tests different scenarios of event changes, assuming these event changes come from a webhood of an external calendar,
 * as well as modifying preference and providing feedback
 * It prints out the information of events, you can see the automatic changes of study sessions based on these changes
 */

/**
 * A function that prints out information of events in an array
 * @param {Array<UserEvent|AssignmentEvent|StudySession>} events
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
console.log(`\n***********************************************************************`);
console.log(`0. Show existing events:`);
toString(planner.user_events);
toString(planner.assignments);
toString(planner.study_sessions);


console.log(`\n1. Create a user event:`);
console.log(`   Expectation: a user event with id 3 is added`);
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
toString(planner.user_events);
toString(planner.assignments);
toString(planner.study_sessions);
console.log(`\n***********************************************************************`);

console.log(`\n2. Update a user event:`);
console.log(`   Expectation: the times of user event (id 3) are modified`);
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
toString(planner.user_events);
toString(planner.assignments);
toString(planner.study_sessions);
console.log(`\n***********************************************************************`);

console.log(`\n3. Delete a user event:`);
console.log(`   Expectation: user event (id 3) is deleted`);
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


console.log(`\n4. Create an assignment:`);
console.log(`   Expectation: an assignment event is added and a few study session events are automatically added`);
planner.sync(
    {
        "type": "created", // "created", "updated", "deleted"
        "eventType": "assignment", // "normal", "studysession", "assignment"
        "details": {
            "id": "4",
            "summary": "Project1 Due",
            "start": { "dateTime": "2025-02-27T23:50:00Z" },
            "end": { "dateTime": "2025-02-27T23:59:00Z" },
            "quality": "2",
            "description": "Complete design and code implementation using OOP for a topic"
            }
    }
)

toString(planner.user_events);
toString(planner.assignments);
toString(planner.study_sessions);
console.log(`\n***********************************************************************`);

console.log(`\n5. Update an assignment:`);
console.log(`   Expectation: The assignment event time and quality were updated, and the study sessions were recreated based on new plan`);
planner.sync(
    {
        "type": "updated", // "created", "updated", "deleted"
        "eventType": "assignment", // "normal", "studysession", "assignment"
        "details": {
            "id": "4",
            "summary": "Project1 Due",
            "start": { "dateTime": "2025-02-28T23:50:00Z" },
            "end": { "dateTime": "2025-02-28T23:59:00Z" },
            "quality": "3",
            "description": "Complete design and code implementation using OOP for a topic"
            }
    }
)
toString(planner.user_events);
toString(planner.assignments);
toString(planner.study_sessions);
console.log(`\n***********************************************************************`);


console.log(`\n6. Delete an assignment:`);
console.log(`   Expectation: The assignment and the corresponding study sessions are deleted.`);
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
console.log(`\n***********************************************************************`);


console.log(`\n7. Create assignment-2 (for the following tests):`);
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
console.log(`\n***********************************************************************`);

console.log(`\n8. Create a study session:`);
console.log(`   Expectation: No change of the displayed events (creating a study session by user is prohibited).`);
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

toString(planner.user_events);
toString(planner.assignments);
toString(planner.study_sessions);
console.log(`\n***********************************************************************`);

console.log(`\n9. Update a study session:`);
console.log(`   Expectation: the time of study session 1009 is modified, and the planned time in the study plan changes correspondingly.\n`);
let assign_id5;
for (let a of planner.assignments) {
    if (a.id === 5) {
        assign_id5 = a;
        break;
    }
}
console.log("\nBefore update, planned time of assignment id 5:");
console.log(assign_id5.study_plan.planned_time);
planner.sync(
    {
        "type": "updated", // "created", "updated", "deleted"
        "eventType": "studysession", // "normal", "studysession", "assignment"
        "details": {
            "id": "1009",
            "summary": "study session 1009 modified for Project 2",
            "start": { "dateTime": "2025-02-19T17:00:00Z" },
            "end": { "dateTime": "2025-02-19T18:30:00Z" },
            }
    }
)
console.log("\nShow only study sessions:");
toString(planner.study_sessions);
console.log("After update, planned time of assignment id 5:");
console.log(assign_id5.study_plan.planned_time);
console.log(`\n***********************************************************************`);


console.log(`\n10. Delete a study session:`);
console.log(`    Expectation: the time of study session 1009 is deleted, and the planned time in the study plan changes correspondingly.\n`);
console.log("\nBefore deletion, planned time of assignment id 5:");
console.log(assign_id5.study_plan.planned_time);
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

console.log("\nShow only study sessions:");
toString(planner.study_sessions);
console.log("After deleteion, planned time of assignment id 5:");
console.log(assign_id5.study_plan.planned_time);
console.log(`\n***********************************************************************`);

console.log(`\n11. Create a user event that conflicts with an existed study session:`);
console.log(`    Expectation: a user events is added, and the conflicted study session (id 1008) is reallocated.\n`);
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
console.log(`\n***********************************************************************`);

console.log(`\n12. Update an user event that will conflicts with an existed study session:`);
console.log(`    Expectation: the user events times are updated, and the conflicted study session (id 1008) is reallocated.\n`);
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
console.log(`\n***********************************************************************`);

console.log(`\n13. Modify preference - minimum_duration (default 30 -> 70):`);
console.log(`    Expectation: All the study sessions have been rescheduled with at least 70 miniutes duration\n`);
planner.modify_preference("minimum", 70);
console.log("\nShow only assignments and study sessions:");
// toString(planner.user_events);
toString(planner.assignments);
toString(planner.study_sessions);
console.log(`\n***********************************************************************`);

console.log(`\n14. Modify preference - blocked_times (default ["00:00-08:00]->["01:00-09:00"]):`);
console.log(`    Expectation: All the study sessions have been rescheduled and not allocated at [01:00-09:00]\n`);
planner.modify_preference("block_times", ["01:00-09:00"]);
console.log("\nShow only assignments and study sessions:");
// toString(planner.user_events);
toString(planner.assignments);
toString(planner.study_sessions);
console.log(`\n***********************************************************************`);


console.log(`\n15. Provide a feedback to assignment (for the folloing test 16)`);
let actual_times = [new TimeSlot("2025-02-18T17:00:00Z", "2025-02-18T17:00:00Z"), 
                new TimeSlot("2025-02-19T17:00:00Z", "2025-02-19T18:00:00Z")];
planner.provide_feedback("5", actual_times, 0.8);
console.log(`\n***********************************************************************`);


console.log(`\n16. Create a new assignment similar to similar to assignment id 5 (original planned time = 225):`);
console.log(`    Expectation: The total planned time for the new assignment will increase because the algorithm has integrated the feedback from test 15\n`);
planner.sync(
    {
        "type": "created", // "created", "updated", "deleted"
        "eventType": "assignment", // "normal", "studysession", "assignment"
        "details": {
            "id": "9",
            "summary": "Project3 Due",
            "start": { "dateTime": "2025-02-28T16:00:00Z" },
            "end": { "dateTime": "2025-02-28T16:30:00Z" },
            "quality": "3",
            "description": "Complete design and code implementation using functional programming for a topic."
            }
    }
)
console.log("\nShow only assignments and study sessions:");
// toString(planner.user_events);
toString(planner.assignments);
toString(planner.study_sessions);

let assign_id9;
for (let a of planner.assignments) {
    if (a.id === 9) {
        assign_id9 = a;
        break;
    }
}
console.log("Planned time for new assignment id 9:");
console.log(assign_id9.study_plan.planned_time);

console.log(`\n***********************************************************************`);

console.log("Finally, display assignment id5 object");
console.log(assign_id5.study_plan);