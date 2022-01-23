window.addEventListener("DOMContentLoaded", ()=>{
    
    // HMTL elements

    const form = document.querySelector("form");
    const endTimeInput = document.querySelector("#end-time");
    const startTimeInput = document.querySelector("#start-time");
    const hideBtn = document.querySelector(".add-item-wrapper");
    const calendarLayout = document.querySelector(".calendar-layout");
    const detailView = document.querySelector(".detail-view");
    const createView = document.querySelector(".create-view");
    const closeBtn = document.querySelector("#close");
    const deleteBtn = document.querySelector("#delete");
    const cancelBtn = document.querySelector("#cancel");

    // Variable definitions

        let itemToDelete = null;
        let eventToRemove = null;
        const preloadStorageJan = [
            {"title":"My call","startTime":"19:28","endTime":"22:28","eventDate":"2022-01-13","eventType":"call","description":"Call to my friend","color":"orange","id":"My call_19:28_22:28_2022-01-13_call_Call to my friend_orange"},
            {"title":"Doctor visit","startTime":"09:30","endTime":"10:30","eventDate":"2022-01-13","eventType":"out-of-office","description":"","color":"magenta","id":"Doctor visit_09:30_10:30_2022-01-13_out-of-office__magenta"},
            {"title":"Business strategy review","startTime":"09:30","endTime":"12:00","eventDate":"2022-01-24","eventType":"meeting","description":"Review status of the strategy execution","color":"lightblue","id":"Business strategy review_09:30_12:00_2022-01-24_meeting_Review status of the strategy execution_lightblue"}
        ];
        const preloadStorageFeb = [
            {"title":"My call","startTime":"19:28","endTime":"22:28","eventDate":"2022-02-13","eventType":"call","description":"Call to my friend","color":"orange","id":"My call_19:28_22:28_2022-02-13_call_Call to my friend_orange"},
            {"title":"Doctor visit","startTime":"09:30","endTime":"10:30","eventDate":"2022-02-13","eventType":"out-of-office","description":"","color":"magenta","id":"Doctor visit_09:30_10:30_2022-02-13_out-of-office__magenta"},
            {"title":"Business strategy review","startTime":"09:30","endTime":"12:00","eventDate":"2022-02-24","eventType":"meeting","description":"Review status of the strategy execution","color":"lightblue","id":"Business strategy review_09:30_12:00_2022-02-24_meeting_Review status of the strategy execution_lightblue"}
        ];

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

    // Event listeners

    cancelBtn.addEventListener("click", ()=> {
        createView.classList.add("hidden");
    });

    hideBtn.addEventListener("click", ()=>{
        createView.classList.remove("hidden");
    });

    endTimeInput.addEventListener("change", ()=>{
        if (startTimeInput.value) {
            endTimeInput.min = startTimeInput.value;
            startTimeInput.max = endTimeInput.value;
        } else {
            startTimeInput.max = endTimeInput.value;
        }
    });

    startTimeInput.addEventListener("change", ()=>{
        if (endTimeInput.value) {
            startTimeInput.max = endTimeInput.value;
            endTimeInput.min = startTimeInput.value;
        } else {
            endTimeInput.min = startTimeInput.value;
        }
    });
    

    form.addEventListener("submit", (e)=>{
        e.preventDefault();
        createView.classList.add("hidden");
        const events = getDataFromStorage();

        const newEvent = new Event(form.elements);
        newEvent.id = Object.values(newEvent).join("_");
        form.reset();

        events.push(newEvent);
        updateDataInStorage(events);
        loadAndDisplayEventsFromStorage();


    });

    closeBtn.addEventListener("click", () => {
        detailView.classList.add("hidden");
    });

    deleteBtn.addEventListener("click", displayDeletePrompt);

    // Main logic

    generateCalenderView();
    loadAndDisplayEventsFromStorage();

    


    // Function definitions

    function displayDeletePrompt() {
        const popup = createElementWithClass("div", ["pop-up"]);
        const popupText = createElementWithClass("div", ["pop-up-text"]);
        popupText.textContent = "Do you want to delete this event?"
        const buttonContainer = createElementWithClass("div", ["popup-btn-container"]);
        const confirmBtn = createElementWithClass("button", ["confirm", "pop-btn"]);
        confirmBtn.textContent = "Confirm";
        const declineBtn = createElementWithClass("button", ["decline", "pop-btn"]);
        declineBtn.textContent = "Cancel";

        
        confirmBtn.addEventListener("click", () => {deleteEvent(popup)}); 
        declineBtn.addEventListener("click", () => {popup.remove()}); 

        buttonContainer.append(confirmBtn, declineBtn);
        popup.append(popupText, buttonContainer);
        detailView.append(popup);
    }

    function deleteEvent(popup) {
        const events = getDataFromStorage();
        itemToDelete.remove();
        const filteredEvent = events.filter(item => item.id === eventToRemove);
        events.splice(events.indexOf(filteredEvent[0]),1);
        updateDataInStorage(events);
        detailView.classList.add("hidden");
        popup.remove();
    }

    function createElementWithClass (tag, classArr) {
        const element = document.createElement(tag);
        classArr.forEach(item => {element.classList.add(item)});

        return element;
    }

    function loadAndDisplayEventsFromStorage() {
        const daysArr = [...calendarLayout.children];
        const events = getDataFromStorage();

        daysArr.forEach(day => {
            const fullDate = day.dataset.fullDate;
            const eventsThisDay = events.filter(event => event.eventDate === fullDate);
            if (eventsThisDay.length > 0) displayEvents(day, eventsThisDay);
        });
    }

    function displayEvents(day, eventsThisDay) {
        const dayArr = [...day.children];
        eventsThisDay.forEach(event => {
            if (dayArr.filter(item => item.dataset.id === event.id).length == 0) {
                const newEvent = document.createElement("div");
                newEvent.dataset.id = event.id;
                newEvent.textContent = event.title;
                newEvent.style.background = `${event.color}`;
                newEvent.addEventListener("click", (clickEvent) => {
                    openDetailView(clickEvent, event);
                });
                day.append(newEvent);
            }
            
        });
    }

    function openDetailView(clickEvent, event) {
        itemToDelete = clickEvent.target;
        eventToRemove = event.id;
        detailView.classList.remove("hidden");
        document.querySelector("#detail-title").textContent = event.title;
        document.querySelector("#detail-date").textContent = event.eventDate;
        document.querySelector("#detail-start-time").textContent = event.startTime;
        document.querySelector("#detail-end-time").textContent = event.endTime;
        document.querySelector("#detail-type").textContent = event.eventType;
        const description = event.description? event.description : "N/A";
        document.querySelector("#detail-description").textContent = description;

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
            day.classList.add("day");

            dayNum.textContent = i+1;

            let daysDate = (i+1).toString();
            if (daysDate.length == 1) daysDate = "0".concat(daysDate); 

            day.dataset.fullDate = currentMonthProps.yearAndMonthStr+daysDate;
            day.setAttribute("data-value","".concat(i+1));
            day.append(dayNum);
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
            const today = new Date;
            events = today.getMonth() == 0? preloadStorageJan : preloadStorageFeb;
            sessionStorage.setItem("eventList", JSON.stringify(events));
        }
        return events;
    }

    function updateDataInStorage(events) {
        sessionStorage.setItem("eventList", JSON.stringify(events));
    }

});