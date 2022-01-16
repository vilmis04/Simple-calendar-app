window.addEventListener("DOMContentLoaded", ()=>{
    
    // HMTL elements

    const form = document.querySelector("form");
    const endTimeInput = document.querySelector("#end-time");
    const startTimeInput = document.querySelector("#start-time");
    const hideBtn = document.querySelector(".hide-btn");
    const calendarLayout = document.querySelector(".calendar-layout");

    // Class definitions

    class Event {
        constructor(elements) {
            this.title = elements["title"].value;
            this.startTime = elements["start-time"].value;
            this.endTime = elements["end-time"].value;
            this.eventDate = elements["date"].value;
            this.eventType = elements["type"].value;
            this.description = elements["description"].value;
            this.color = this.eventType == "call" ? "orange"
                : this.eventType == "meeting"? "lightblue" : "magenta";
        }
    }

    // Variable definitions


    // Event listeners

    hideBtn.addEventListener("click", ()=>{
        document.querySelector(".create-view").classList.toggle("hidden");
        hideBtn.classList.toggle("rotated");
    });

    endTimeInput.addEventListener("change", ()=>{
        console.log("change event fired");
        if (startTimeInput.value) {
            endTimeInput.min = startTimeInput.value;
        } else {
            startTimeInput.max = endTimeInput.value;
        }
    });
    

    form.addEventListener("submit", (e)=>{
        e.preventDefault();
        const events = getDataFromStorage();

        const newEvent = new Event(form.elements);
        form.reset();

        events.push(newEvent);
        updateDataInStorage(events);
        loadAndDisplayEventsFromStorage();

        console.log(events);

    });

    // Main logic

    generateCalenderView();
    loadAndDisplayEventsFromStorage();

    


    // Function definitions

    function loadAndDisplayEventsFromStorage() {
        // console.log(calendarLayout.children);

        calendarLayout.children.forEach()
    }

    function generateCalenderView() {
        const currentMonthProps = getMonthData();

        const firstWeekday = currentMonthProps.firstWeekday;
        const numOfEmptyDays = firstWeekday == 0 ? 6 : firstWeekday-1;
        for (let i=0; i<numOfEmptyDays; i++) {
            const emptyDay = document.createElement("div");
            emptyDay.classList.add("empty-day");
            calendarLayout.append(emptyDay);

        }
        for (let i=0; i<currentMonthProps.daysInMonth; i++) {
            const day = document.createElement("div");
            const dayNum = document.createElement("div");
            const eventList = document.createElement("div");
            day.classList.add("day");

            dayNum.textContent = i+1;

            let daysDate = (i+1).toString();
            if (daysDate.length == 1) daysDate = "0".concat(daysDate); 

            day.dataset.fullDate = currentMonthProps.yearAndMonthStr+daysDate;
            day.setAttribute("data-value","".concat(i+1));
            day.append(dayNum, eventList);
            calendarLayout.append(day);
        }

    }

    function getMonthData() {
        const monthData = {};
        const currentDate = new Date;
        const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth()+1, 0);
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        
        let monthString = (currentDate.getMonth()+1).toString();
        if (monthString.length == 1) monthString = "0".concat(monthString);

        monthData.daysInMonth = currentMonth.getDate();
        monthData.firstWeekday = firstDay.getDay();
        monthData.yearAndMonthStr = `${currentDate.getFullYear()}-${monthString}-`

        return monthData;
    }

    function getDataFromStorage() {
        let events = JSON.parse(sessionStorage.getItem("eventList"));
        if (!events) {
            events = [];
            sessionStorage.setItem("eventList", JSON.stringify(events));
        }
        return events;
    }

    function updateDataInStorage(events) {
        sessionStorage.setItem("eventList", JSON.stringify(events));
    }

});