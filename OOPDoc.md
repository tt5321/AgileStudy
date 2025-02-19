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
export default class Preference {
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

export default class Planner {
    ...
    modify_preference(type, value){
        if (type === "block_times"){
            this._preference.block_times = value;
        } else if (type === "minimum") {
            this._preference.minimum = value;
        } else {
            console.log("Invalid preference type");
            return;
        }
        ...
    }
}
//Usage:
planner.modify_preference("minimum", 30); //main.js line278
planner.modify_preference("block_times", ["01:00-09:00"]); //main.is line284
```
**Explanation** If there is a new preference criteria added, I can add another setter function in Preference, and add another `else if` in the modify_preference function to call the setter. (Maybe not a good example.)

**Violation:**
```

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
```python
class Printer:
    def print(self):
        pass

class Scanner:
    def scan(self):
        pass
```

**Violation:**
```python
class BadMachine:
    def print(self):
        pass
    def scan(self):
        pass  # Forces unused implementations
```

---

### 5. Dependency Inversion Principle (DIP)
**Example:**
```python
class Database:
    def save(self):
        pass

class UserService:
    def __init__(self, db: Database):
        self.db = db
```

**Violation:**
```python
class BadUserService:
    def __init__(self):
        self.db = MySQLDatabase()  # Hardcoded dependency
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


