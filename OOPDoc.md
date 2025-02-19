# Object-Oriented Programming (OOP) Demonstration
This markdown document provides examples of OOP, SOLID principles, and design patterns.

## OOP Pillars

### 1. Abstraction

**Example: AssignmentEvent.js line88**
```
export default class AssignmentEvent extends UserEvent {
    ...
    create_studyplan(){
        const algo = new Algorithm();
        algo.generate_plan(this);
    }
    ...
}

// Usage:
event.create_studyplan(); //Planner.js line292
```

**Explanation:**  The create_studyplan() hides the implementation details of creating a study plan, the planner just calls create_studyplan() instead of knowing all the details of creating a plan.

**Violation Example:**
```
export default class AssignmentEvent extends UserEvent {
    ...
    analyze_length(){
    ...
    }
    analyze_quality() {
    ...
    }
    integrate_utilization_rate() {
    ...
    }
    integrate_learning_speed() {
    ...
    }
}
    
// Usage:
event.analyze_length();
event.analyze_quality();
event.integrate_utilization_rate();
event.integrate_learning_speed();
```

---

### 2. Encapsulation
**Example: Feedback.js**
```
export default class Feedback {
    _event;
    _total_actual_time;
    _contentCompleted;
    _actual_times;
    _additional_time;
    _utilization_rate;
    _learning_speed;
...
    get totaltime() {
        return this._total_actual_time;
    }
    get actual_times(){
        return this._actual_times;
    }
    ...
}
//Usage (example, not in code):
feedback = new Feedback(event);
total_time = feedback.totaltime;
feedback.totaltime = 10; // Error
```
**Explanation:** The Feedback object works as a unit, and it restricts direct access to the protected _total_actual_time attribute. Caller can read the value but is not allowed to set the value directly.

**Violation Example:**
```
export default class Feedback {
    event;
    total_actual_time;
    contentCompleted;
    actual_times;
    additional_time;
    utilization_rate;
    learning_speed;
...
}
//Usage:
const feedback = new Feedback(event);
const total_time = feedback.total_actual_time;
feedback.total_actual_time = 10;
```

---

### 3. Inheritance
**Example: UserEvent.js & AssignmentEvent.js**
```
export default class UserEvent {
    _id;
    _title;
    _start_time;
    _end_time;
    _type;

    constructor({id, title, start_time, end_time, type} = {}) {
        this._id = id;
        this._title = title;
        this._start_time = start_time;
        this._end_time = end_time;
        this._type = type;
    }

    get id() {
        return this._id;
    }
...
}

export default class AssignmentEvent extends UserEvent {
    _desired_study_quality;
    _assignement_description;
    _study_plan;
    _feedback;

    constructor({quality=3, description="", ...param} = {}){
        super({type: "assignment", ...param});
        this._desired_study_quality = quality;
        this._assignement_description = description;
        this._study_plan = new StudyPlan(this);
        this._feedback = new Feedback(this);
    }
...
}
```

**Explanation:** AssignmentEvent class inherites properties (id, title, start_time, end_time, type) and methods (getters) from  UserEvent without rewriting all the code.

**Violation Example:**
```
export default class UserEvent {
    _id;
    _title;
    _start_time;
    _end_time;
    _type;

    constructor({id, title, start_time, end_time, type} = {}) {
        this._id = id;
        this._title = title;
        this._start_time = start_time;
        this._end_time = end_time;
        this._type = type;
    }

    get id() {
        return this._id;
    }
...
}

export default class AssignmentEvent{
    _id;
    _title;
    _start_time;
    _end_time;
    _type;
    _desired_study_quality;
    _assignement_description;
    _study_plan;
    _feedback;

    constructor({quality=3, description="", id, title, start_time, end_time, type} = {}){
        this._id = id;
        this._title = title;
        this._start_time = start_time;
        this._end_time = end_time;
        this._type = type;
        this._desired_study_quality = quality;
        this._assignement_description = description;
        this._study_plan = new StudyPlan(this);
        this._feedback = new Feedback(this);
    }
...
}
```

---

### 4. Polymorphism
**Example: UserEvent.js & AssignmentEvent.js**
```
export default class UserEvent {
    _id;
    _title;
    _start_time;
    _end_time;
    _type;

    constructor({id, title, start_time, end_time, type} = {}) {
        this._id = id;
        this._title = title;
        this._start_time = start_time;
        this._end_time = end_time;
        this._type = type;
    }

    get id() {
        return this._id;
    }
...
}

export default class AssignmentEvent extends UserEvent {
    _desired_study_quality;
    _assignement_description;
    _study_plan;
    _feedback;

    constructor({quality=3, description="", ...param} = {}){
        super({type: "assignment", ...param});
        this._desired_study_quality = quality;
        this._assignement_description = description;
        this._study_plan = new StudyPlan(this);
        this._feedback = new Feedback(this);
    }
...
    create_studyplan(){
        const algo = new Algorithm();
        algo.generate_plan(this);
    }

}
// Usage (example, not in code):
const event1 = new UserEvent({
    id: 1, 
    title: "A", 
    start_time: new Date("2025-02-21T13:00:00Z"), 
    end_time: new Date("2025-02-21T14:00:00Z"), 
    type: "userevent"});

const event2 = new AssignmentEvent({
    id: 2,
    title: "B",
    start_time: new Date("2025-02-22T15:55:00Z"),
    end_time: new Date("2025-02-22T16:00:00Z"),
    quality: 3,
    description: "assignment2"
})

const id_userevent = event1.id; //1
const id_assign = event2.id; //2
```

**Explanation:** The getter method for UserEvent and its subclass AssignmentEvent can be used interchangebly. Also, AssignmentEvent can expand its own method, like create_studyplan.

**Violation Example:**
If we check types manually instead of using polymorphism, it would be bad practice.
```
export default class UserEvent {
    _id;
    _title;
    _start_time;
    _end_time;
    _type;
...
    get id() {
        return this._id;
    }
...
}

export default class AssignmentEvent extends UserEvent {
    _desired_study_quality;
    _assignement_description;
    _study_plan;
    _feedback;
...
    get id() {
        throw new Error("Accessing ID is prohibited.");
    }

}
// Usage:
const event1 = new UserEvent({
    id: 1, 
    title: "A", 
    start_time: new Date("2025-02-21T13:00:00Z"), 
    end_time: new Date("2025-02-21T14:00:00Z"), 
    type: "userevent"});

const event2 = new AssignmentEvent({
    id: 2,
    title: "B",
    start_time: new Date("2025-02-22T15:55:00Z"),
    end_time: new Date("2025-02-22T16:00:00Z"),
    quality: 3,
    description: "assignment2"
})

const id_userevent = event1.id; // 1
const id_assign = event2.id; //Error
```  

---

## SOLID Principles

### 1. Single Responsibility Principle
**Example:**
```
// In Preference.js
export default class Preference {
    static _instance;
    _block_study_times;
    _minimum_session_duration;

    ...
    constructor() {
        if (Preference._instance){
            return Preference._instance;
        }
        Preference._instance = this;
        this._block_study_times =["00:00-08:00"];
        this._minimum_session_duration = 30;
    }
    ...
    get block_times(){
        return this._block_study_times;
    }
    ...
    get minimum(){
        return this._minimum_session_duration;
    }
    ...
    set block_times(times){
        if (times.every(item => typeof(item) === "string") == true) {
            this._block_study_times = times;
        } else {
            console.log('Invalid times. Block times should be ["00:00-08:00", "13:00-14:00"]');
        }
    }
    ...
    set minimum(value){
        if (value >= 30) {
            this._minimum_session_duration = value;
        } else {
            console.log("Invalid value. Minimum durations should be greater than or equal to 30 miniutes");
        }
    }
}
```

**Explanation:** Preference.js only has Preference class, which only contains method to set and get user preference.

**Violation:**
```
// In Preference.js
export default class Preference {
    ...
    set minimum(value){
        if (value >= 30) {
            this._minimum_session_duration = value;
        } else {
            console.log("Invalid value. Minimum durations should be greater than or equal to 30 miniutes");
        }
    }
    calculate_free_time(){
    ...
    }
}

export default class Algorithm {
    ...
}
```

---

### 2. Open-Closed Principle
**Example: Preference.js line42**
```
// In UserEvent.js
export default class UserEvent {
    _id;
    _title;
    _start_time;
    _end_time;
    _type;

    constructor({id, title, start_time, end_time, type} = {}) {
        this._id = id;
        this._title = title;
        this._start_time = start_time;
        this._end_time = end_time;
        this._type = type;
    }
    
    get type() {
        return this._type;
    }

}

// In AssignmentEvent.js
export default class AssignmentEvent extends UserEvent {
    ...
}

// In StudySession.js
export default class StudySession extends UserEvent {
    ...
}
```
**Explanation** If there is a new type of calendar event, I can easily add a new type of event by creating another class that extendsthe UserEvent class, by passing the type to the constructor.

**Violation:**
```
// In UserEvent.js
export default class UserEvent {
    _id;
    _title;
    _start_time;
    _end_time;
    _type;

    constructor({id, title, start_time, end_time} = {}) {
        this._id = id;
        this._title = title;
        this._start_time = start_time;
        this._end_time = end_time;
    }

    // every time a subclass is created, get type() needs to be modified
    get type() {
        if (this instanceof AssignmentEvent) {
            return "assignment";
        } else if (this instanceof StudySession) { 
            return "studysession";
        } else {
            return "userevent";
        }
    }
}
```

---

### 3. Liskov Substitution Principle (LSP)
**Example: UserEvent.js & AssignmentEvent.js**
```
export default class UserEvent {
    _id;
    _title;
    _start_time;
    _end_time;
    _type;

    constructor({id, title, start_time, end_time, type} = {}) {
        this._id = id;
        this._title = title;
        this._start_time = start_time;
        this._end_time = end_time;
        this._type = type;
    }

    get id() {
        return this._id;
    }
...
}

export default class AssignmentEvent extends UserEvent {
    _desired_study_quality;
    _assignement_description;
    _study_plan;
    _feedback;

    constructor({quality=3, description="", ...param} = {}){
        super({type: "assignment", ...param});
        this._desired_study_quality = quality;
        this._assignement_description = description;
        this._study_plan = new StudyPlan(this);
        this._feedback = new Feedback(this);
    }
...
}
// Usage (example, not in code):
const event1 = new UserEvent({
    id: 1, 
    title: "A", 
    start_time: new Date("2025-02-21T13:00:00Z"), 
    end_time: new Date("2025-02-21T14:00:00Z"), 
    type: "userevent"});

const event2 = new AssignmentEvent({
    id: 2,
    title: "B",
    start_time: new Date("2025-02-22T15:55:00Z"),
    end_time: new Date("2025-02-22T16:00:00Z"),
    quality: 3,
    description: "assignment2"
})

const id_userevent = event1.id; //1
const id_assign = event2.id; //2
```

**Explanation:** The getter method for UserEvent and its subclass AssignmentEvent can be used interchangebly.

**Violation Example:**
If we check types manually instead of using polymorphism, it would be bad practice.
```
export default class UserEvent {
    _id;
    _title;
    _start_time;
    _end_time;
    _type;
...
    get id() {
        return this._id;
    }
...
}

export default class AssignmentEvent extends UserEvent {
    _desired_study_quality;
    _assignement_description;
    _study_plan;
    _feedback;
...
    get id() {
        throw new Error("Accessing ID is prohibited.");
    }

}
// Usage:
const event1 = new UserEvent({
    id: 1, 
    title: "A", 
    start_time: new Date("2025-02-21T13:00:00Z"), 
    end_time: new Date("2025-02-21T14:00:00Z"), 
    type: "userevent"});

const event2 = new AssignmentEvent({
    id: 2,
    title: "B",
    start_time: new Date("2025-02-22T15:55:00Z"),
    end_time: new Date("2025-02-22T16:00:00Z"),
    quality: 3,
    description: "assignment2"
})

const id_userevent = event1.id; // 1
const id_assign = event2.id; //Error
```  

---

### 4. Interface Segregation Principle
**Example:**
```
// In UserEvent.js
export default class UserEvent {
    _id;
    _title;
    _start_time;
    _end_time;
    _type;
    ...
}

// In AssignmentEvent.js
export default class AssignmentEvent extends UserEvent {
    _desired_study_quality;
    _assignement_description;
    _study_plan;
    _feedback;
    ...
}

// In StudySession.ks
export default class StudySession extends UserEvent {
    _study_plan;
    _change;
    ...
}

```
**Explanation:** The UserEvent only has the basic attributes instead contains all the attributes an event can possible have, such as the assignment_description of AssignmentEvent. It only contains what it needs.

**Violation:** 
```
// In UserEvent.js
export default class UserEvent {
    _id;
    _title;
    _start_time;
    _end_time;
    _type;
    _desired_study_quality;
    _assignement_description;
    _study_plan;
    _feedback;
     _change;
    ...
}
```

---

### 5. Dependency Inversion Principle (DIP)
**Example:**
```
export default class Feedback {
    ...
    constructor(event){
        this._event = event;
    }

    ...
    calculate_utilization_rate(){
        const plan = this._event.study_plan;
        const planned_time = plan.planned_time;
        this._additional_time = this._total_actual_time - planned_time;
        this._utilization_rate = this._total_actual_time / planned_time;
    }
}
//In Algorithm.js
import Feedback from "./Feedback.js";
export default class Algorithm {
    ...
    learn(feedback){
        this._overall_utilization_rate = this._overall_utilization_rate * 0.6 + feedback.utilization_rate * 0.4;
        this._overall_learning_speed = this._overall_learning_speed * 0.6 + feedback.learning_speed * 0.4;
    }
}
```
**Explanation:** Altough it is no completely follow DIP, it does somehow. The Algorithm depends on Feedback instead of AssignmentEvent or StudySession. If anything with the states of AssignmentEvent or StudySession, these changes will not affect Algorithm.

**Violation:**
```
import AssignmentEvent from "./AssignmentEvent.js";
export default class Algorithm {
    ...
    learn(assignment){
        this._overall_utilization_rate = this._overall_utilization_rate * 0.6 + assignment.feedback.utilization_rate * 0.4;
        this._overall_learning_speed = this._overall_learning_speed * 0.6 + assignment.feedback.learning_speed * 0.4;
    }
}
```

---

## Design Patterns

### 1. Singleton
**Example:**
```
export default class Scheduler{
    static _instance;
    _id_counter;    

    /**
     * A constructor in singular pattern
     */
    constructor() {
        if (Scheduler._instance){
            return Scheduler._instance;
        }
        Scheduler._instance = this;
        this._id_counter = 1000;
    }
    ...
}
```
**Explanation:** Always returns the same Scheduler object

**Violation:**
```
export default class Scheduler{
    _id_counter;    

    /**
     * A constructor in singular pattern
     */
    constructor() {
        this._id_counter = 1000;
    }
    ...
}
```

---

### 2. Module
**Example:**
```
// In Scheduler.js
export default class Scheduler{
...
}

// In Planner.js
import Scheduler from "./Scheduler.js";
```
**Explanation:** Use ES6 Modules to avoid global scope pollution

**Violation:**
```
// In a single .js file
class Scheduler{
...
}

class Planner{
...
}
...

---
```

### 3. Factory
**Example:**
```
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
```
**Explanation:** This might not be a complete implmentation of factory pattern, but maybe somehow similar. The sync function accepts all data event, and calls different handlers by identifying different types of event. sync acts like a factory.

**Violation:**
```
sync_user_event(op, details){
    ...
}
sync_assignment (op, details){
    ...
}

sync_study_session(op, details){
    ...
}
```


