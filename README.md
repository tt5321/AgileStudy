# AgileStudy Planner
A study planner system that automatically schedules study time on your calendar based on your expectations for study quality, assignment deadlines, and your personal characteristics. The system includes a feedback mechanism that helps it learn personal learning patterns, and becomes more personalized over time.
## Setting up
```
git clone https://github.com/tt5321/AgileStudy.git agilestudy
cd agilestudy/
npm install
```
Note: If you cannot do `git clone`, please:
1.  download the zip file and unzip 
2. `npm install`
## Run Test
Output will be printed to the console
```
npm start
```
Note: this equals to ```node main.js```
## Documentation
./docs/
### Business Requirement:
- **v1**: CS5010 Spring 2025 - Project 1_v1.pdf
- **v2**: BusinessRequirement_v2.pdf
### OOP examples:
- OOP_Documentation.md
### JSDoc: 
- out/
## Coder
Tiantian Ma

## Features
1. When a user marks an assignment due-date event on the calendar, the system automatically analyzes the deadlie, the assignement description, the user’s desired study quality, and creates a personalized study plan. It automatically allocates study sessions on the calendar without conflicting with existing events.
2. Users can set/modify preferences, including blocked study times, preferred study times, minimum study session duration.
3. The system includes a feedback mechanism to track the actual time users spend on their study sessions.
4. The system learns from the feedbacks about users’ personal characteristics, such as learning speed and time management efficienc, and continuously refines its model for future study plans.
5. Automatically scheduled study sessions can be freely modified or deleted by users.
6. New user event that conflicts with a current study session will triger a re-assignment of the study sessions.
## Implementations
**Classes**
./solutions/
- Algorithm.js
- AssignmentEvent.js
- Feedback.js
- Planner.js
- Preference.js
- Scheduler.js
- StudyPlan.js
- StudySession.js
- TimeSlot.js
- UserEvent.js

**Test**
- main.js

**Docs**
- ./README.md
- ./docs/OOP_Documentation.md
- ./docs/Reference_For_Code.md
- ./docs/CS5010 Spring 2025 - Project 1_v1.pdf
- ./docs/BusinessRequirement_v2.pdf

## Exaplanation of Classes and Tests
### Classess
- Planner: orchestrate all things when users create/update/delete an event
- Calendar events will be categorized into 3 categories: UserEvent, AssignmentEvent, StudySession
- UserEvent: normal calendar event e.g. club meeting
- AssignmentEvent: assignment event e.g. HW3 due
- StudySession: study session event e.g. study session for HW3
- Algorithm: generate planned time and learns from feedback
- Scheduler: allocate StudySession based on planned time
- StudyPlan: contains planned time and study sessions for an assignment
- Feedback: each assignment has a feedback
- Preference: user preference, include block study times, minimum study duration
- TimeSlot: an auxiliary class used in calculation available times for allocation 

### Test
- Use main.js for testing
#### Assumptions:
1. There are some existing user events, in JSON formats, stored in an array of JSON objects, before the planner system starts
2. There is a web hook of the external calendar, and the AgileStudy Planner will receive an event change from the web hook. The event change is triggered when a user creates, deletes, or modifies a calendar event and is represented as a JSON object. 
#### Test Cases:
    0. Create UserEvent objects for existing events
    1. Create a user event
    2. Update a user event
    3. Delete a user event
    4. Create an assignment
    5. Update an assignment
    6. Delete an assignment
    7. Create another assignment (for the following tests)
    8. Create a study session (not allowed)
    9. Update a study session
    10. Delete a study session 
    11. Create a user event that conflicts with an existed study session
    12.  Update an user event that will conflicts with an existed study session
    13. Modify preference - minimum_duration
    14. Modify preference - blocked_times
    15. Provide a feedback to assignment
    16. Create a new assignment similar to similar to assignment created in case 7 after providing a feedback

## Links
### Business Requirement & Design
https://docs.google.com/document/d/1abc1gMzMHnemnLY11MnZFfONOnCetKsnhX8Nu0dClZ8/edit?usp=sharing
### UML Diagram
https://lucid.app/lucidchart/5c3524c7-0963-4b2d-9a4e-0852fd970371/edit?viewport_loc=-665%2C85%2C3290%2C1566%2CHWEp-vi-RSFO&invitationId=inv_c16e9371-4793-4b2f-896f-311fc6110f71
### Mockups
https://www.figma.com/design/PDzRWOuGklJXukKSzWz2SR/CS5010-Project1-Mockup?node-id=0-1&t=Ja1AW8kmkSjJUAwN-1
### Video
- Introductory Video: https://youtu.be/KiWLQ1hNssY
- Detailed Explanation of code: https://youtu.be/ASok6bfpmAU
## Resources Reference
### Use of AI
#### Use of AI In Design
- Please see the "Index: Use of AI" part of the Business Requirement & Design document
#### Use of AI In Implementation
- Please see Reference_For_Code.md