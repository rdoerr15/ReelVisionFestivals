var events = [
  {
    event: "FilmFusion",
    city: "Charleston",
    state: "South Carolina",
    attendance: 240000,
    date: "06/01/2017",
  },
  {
    event: "FilmFusion",
    city: "Charleston",
    state: "South Carolina",
    attendance: 250000,
    date: "06/01/2018",
  },
  {
    event: "FilmFusion",
    city: "Charleston",
    state: "South Carolina",
    attendance: 257000,
    date: "06/01/2019",
  },
  {
    event: "FilmFusion",
    city: "Denver",
    state: "Colorado",
    attendance: 130000,
    date: "06/01/2017",
  },
  {
    event: "FilmFusion",
    city: "Denver",
    state: "Colorado",
    attendance: 140000,
    date: "06/01/2018",
  },
  {
    event: "FilmFusion",
    city: "Denver",
    state: "Colorado",
    attendance: 150000,
    date: "06/01/2019",
  },
  {
    event: "CineFest",
    city: "Wilmington",
    state: "North Carolina",
    attendance: 40000,
    date: "06/01/2017",
  },
  {
    event: "CineFest",
    city: "Wilmington",
    state: "North Carolina",
    attendance: 45000,
    date: "06/01/2018",
  },
  {
    event: "CineFest",
    city: "Wilmington",
    state: "North Carolina",
    attendance: 50000,
    date: "06/01/2019",
  },
];

//build dropdown for specific cities
function buildDropdown() {
  let dropdownMenu = document.getElementById("eventDropdown");

  dropdownMenu.innerHTML = "";

  let currentEvents = getEventData();

  let cityNames = currentEvents.map(function (event) {
    return event.city;
  });
  //let cityNames = currentEvents.map(event => event.city);   **same as above

  let citiesSet = new Set(cityNames); //sets do not allow repeated values
  let distinctCities = [...citiesSet]; //creates this: ['Wilmington', 'Denver', 'Charleston']

  const dropdownTemplate = document.getElementById("dropdownItemTemplate");

  //copy the template, importNode allows us to make that copy
  let dropdownItemNode = document.importNode(dropdownTemplate.content, true);

  //make our changes
  let dropdownItemLink = dropdownItemNode.querySelector("a");
  dropdownItemLink.innerText = "All Cities";
  dropdownItemLink.setAttribute("data-string", "All");

  //add our copy to the page
  dropdownMenu.appendChild(dropdownItemNode);

  for (let i = 0; i < distinctCities.length; i++) {
    //get the city name
    let cityName = distinctCities[i];

    //generate a dropdown element
    let itemNode = document.importNode(dropdownTemplate.content, true);
    let anchorTag = itemNode.querySelector("a");
    anchorTag.innerText = cityName;
    anchorTag.setAttribute("data-string", cityName);

    //append it to the dropdown menu
    dropdownMenu.appendChild(itemNode);
  }

  displayEventData(currentEvents);
  displayStats(currentEvents);
  document.getElementById("location").innerText = "All Events";
}

function displayEventData(currentEvents) {
  const eventTable = document.getElementById("eventTable");
  const template = document.getElementById("tableRowTemplate");

  eventTable.innerHTML = "";

  for (let i = 0; i < currentEvents.length; i++) {
    let event = currentEvents[i];
    let tableRow = document.importNode(template.content, true);

    tableRow.querySelector('[data-id="event"]').textContent = event.event;
    tableRow.querySelector('[data-id="city"]').textContent = event.city;
    tableRow.querySelector('[data-id="state"]').textContent = event.state;
    tableRow.querySelector('[data-id="attendance"]').textContent =
      event.attendance.toLocaleString();
    tableRow.querySelector('[data-id="date"]').textContent = new Date(
      event.date
    ).toLocaleDateString();

    tableRow.querySelector("tr").setAttribute("data-event", event.id);

    eventTable.appendChild(tableRow);
  }
}

function calculateStats(currentEvents) {
  let total = 0;
  let avg = 0;
  let most = 0;
  let least = currentEvents[0].attendance;

  for (let i = 0; i < currentEvents.length; i++) {
    let currentAttendance = currentEvents[i].attendance;

    total += currentAttendance;

    if (currentAttendance > most) {
      most = currentAttendance;
    }

    if (currentAttendance < least) {
      least = currentAttendance;
    }
  }
  avg = total / currentEvents.length;

  let stats = {
    total: total,
    average: avg,
    most: most,
    least: least,
  };

  return stats;
}

function displayStats(currentEvents) {
  let statistics = calculateStats(currentEvents);

  //get the elements where the stats go
  //set their text to be the correct stat from statistics
  document.getElementById("total").textContent =
    statistics.total.toLocaleString();

  //Math.round rounds up or down to a whole number, toLocalString() removes decimals and adds commas
  document.getElementById("average").textContent = Math.round(
    statistics.average
  ).toLocaleString();

  document.getElementById("most").textContent =
    statistics.most.toLocaleString();
  document.getElementById("least").textContent =
    statistics.least.toLocaleString();
}

function getEventData() {
  let data = localStorage.getItem("ReelVisionData");

  if (data == null) {
    let identifiedEvents = events.map((event) => {
      event.id = generateId();
      return event;
    });

    localStorage.setItem("ReelVisionData", JSON.stringify(identifiedEvents)); //JSON = javascript object notation
    data = localStorage.getItem("ReelVisionData");
  }

  let currentEvents = JSON.parse(data);

  if (currentEvents.some((event) => event.id == undefined)) {
    //if any events dont have an ID, then it will be true
    currentEvents.forEach((event) => (event.id = generateId()));

    localStorage.setItem("ReelVisionData", JSON.stringify(currentEvents));
  }

  return currentEvents;
}

function viewFilteredEvents(dropdownItem) {
  let cityName = dropdownItem.getAttribute("data-string");

  //get all my events
  let allEvents = getEventData();

  if (cityName == "All") {
    displayEventData(allEvents);
    document.getElementById("location").innerText = "All Events";

    return; //return in this instance will end the function if cityName does not equal All
  }

  //filter those events to just the selected city
  let filteredEvents = allEvents.filter(
    (event) => event.city.toLowerCase() == cityName.toLowerCase()
  );
  // let filteredEvents = allEvents.filter(
  //    function (event)) {
  //    return event.city.toLowerCase() == cityName.toLowerCase();
  //}

  //display the stats for those events
  displayStats(filteredEvents);

  //change the stats header
  document.getElementById("location").innerText = cityName;

  //display only those events in the table
  displayEventData(filteredEvents);
}

function saveNewEvent() {
  //get the form input values
  let name = document.getElementById("newEventName").value;
  let city = document.getElementById("newEventCity").value;

  let stateSelect = document.getElementById("newEventState");
  let stateIndex = stateSelect.selectedIndex;
  let state = stateSelect.options[stateIndex].text;

  let attendance = parseInt(
    document.getElementById("newEventAttendance").value,
    10
  );

  let dateValue = document.getElementById("newEventDate").value;
  dateValue = new Date(dateValue);
  let date = dateValue.toLocaleDateString();

  //create a new event object
  const newEvent = {
    event: name,
    city: city,
    state: state,
    attendance: attendance,
    date: date,
    id: generateId(),
  };

  //add it to the array of current events
  let events = getEventData();
  events.push(newEvent);

  //save the array with the new event
  localStorage.setItem("ReelVisionData", JSON.stringify(events));

  buildDropdown();

  document.getElementById("newEventForm").reset();
}

function generateId() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

function editEvent(eventRow) {
  let eventId = eventRow.getAttribute("data-event");

  let currentEvents = getEventData();

  let eventToEdit = currentEvents.find(
    (eventObject) => eventObject.id == eventId
  );

  document.getElementById("editEventId").value = eventToEdit.id;
  document.getElementById("editEventName").value = eventToEdit.event;
  document.getElementById("editEventCity").value = eventToEdit.city;

  let editStateSelect = document.getElementById("editEventState");

  /*let optionsArray = [...editStateSelect.options];
    let index = optionsArray.findIndex(option => eventToEdit.state == option.text);
    editStateSelect.selectedIndex = index;*/ //*** these 3 lines are same as for loop and if statement below
  for (let i = 0; i < editStateSelect.options.length; i++) {
    let option = editStateSelect.options[i];

    if (eventToEdit.state == option.text) {
      editStateSelect.selectedIndex = i;
    }
  }

  document.getElementById("editEventAttendance").value = eventToEdit.attendance;

  let eventDate = new Date(eventToEdit.date);
  let eventDateString = eventDate.toISOString();
  let dateArray = eventDateString.split("T");
  formattedDate = dateArray[0];
  document.getElementById("editEventDate").value = formattedDate;
}

function deleteEvent() {
  let eventId = document.getElementById("editEventId").value;

  //get the events in local storage
  let currentEvents = getEventData();
  //filter out any event(s) with that eventId
  let filteredEvents = currentEvents.filter((event) => event.id != eventId);
  //save that array to local storage
  localStorage.setItem("ReelVisionData", JSON.stringify(filteredEvents));

  buildDropdown();
}

function updateEvent() {
  let eventId = document.getElementById("editEventId").value;

  //get the form input values
  let name = document.getElementById("editEventName").value;
  let city = document.getElementById("editEventCity").value;

  let stateSelect = document.getElementById("editEventState");
  let stateIndex = stateSelect.selectedIndex;
  let state = stateSelect.options[stateIndex].text;

  let attendance = parseInt(
    document.getElementById("editEventAttendance").value,
    10
  );

  let dateValue = document.getElementById("editEventDate").value;
  dateValue = new Date(dateValue);
  let date = dateValue.toLocaleDateString();

  //create a new event object
  let newEvent = {
    event: name,
    city: city,
    state: state,
    attendance: attendance,
    date: date,
    id: eventId,
  };

  //get my events array
  let currentEvents = getEventData();

  //find the location of the old event with this ID

  for (let i = 0; i < currentEvents.length; i++) {
    if (currentEvents[i].id == eventId) {
      //replace that event with newEvent
      currentEvents[i] = newEvent;
      break; //break says stop looping
    }
  }

  //save it in local storage
  localStorage.setItem("ReelVisionData", JSON.stringify(currentEvents));

  buildDropdown();
}
