# AgileStudy Planner
A study planner system that automatically schedules study time on your calendar based on your expectations for study quality, assignment deadlines, and your personal characteristics. The system includes a feedback mechanism that helps it learn personal learning patterns, and becomes more personalized over time.
## Setting up
```
git clone <url> <project_folder>
cd <project_folder>
npm install
```
To run all the test cases (output will be printed to the console)
```
node main.js
```
## Documentation
./docs/
- Business Requirement:
(1) v1: CS5010 Spring 2025 - Project 1_v1.pdf
(2) v2: BusinessRequirement_v2.pdf
- OOP examples: OOP_Documentation.md
- JSDoc: out/

## Coder
Tiantian

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
- ./README.md,
- ./docs/OOP_Documentation.md,
- ./docs/Reference_For_Code.md
- ./docs/CS5010 Spring 2025 - Project 1_v1.pdf
- ./docs/BusinessRequirement_v2.pdf

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
Please see the "Index: Use of AI" part of the Business Requirement & Design document
#### Use of AI In Implementation
Please see Reference_For_Code.md