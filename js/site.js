var events = [
  {
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 240000,
    date: "06/01/2017",
  },
  {
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 250000,
    date: "06/01/2018",
  },
  {
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 257000,
    date: "06/01/2019",
  },
  {
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 130000,
    date: "06/01/2017",
  },
  {
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 140000,
    date: "06/01/2018",
  },
  {
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 150000,
    date: "06/01/2019",
  },
  {
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 40000,
    date: "06/01/2017",
  },
  {
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 45000,
    date: "06/01/2018",
  },
  {
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 50000,
    date: "06/01/2019",
  },
];

//build dropdown for specific cities
function buildDropdown() {
    let dropdownMenu = document.getElementById('eventDropdown');

    dropdownMenu.innerHTML = '';

    let currentEvents = getEventData(); 

    let cityNames = currentEvents.map(
        function (event) {
          return event.city;
        }
    );
    //let cityNames = currentEvents.map(event => event.city);   **same as above

    let citiesSet = new Set(cityNames); //sets do not allow repeated values 
    let distinctCities = [...citiesSet]; //creates this: ['Charlotte', 'San Diego', 'New York']

    const dropdownTemplate = document.getElementById('dropdownItemTemplate');

    //copy the template, importNode allows us to make that copy
    let dropdownItemNode = document.importNode(dropdownTemplate.content, true);

    //make our changes
    let dropdownItemLink = dropdownItemNode.querySelector('a');
    dropdownItemLink.innerText = 'All Cities';
    dropdownItemLink.setAttribute('data-string', 'All');

    //add our copy to the page
    dropdownMenu.appendChild(dropdownItemNode);
    
    for (let i = 0; i < distinctCities.length; i++) {
      //get the city name
      let cityName = distinctCities[i];

      //generate a dropdown element
      let itemNode = document.importNode(dropdownTemplate.content, true);
      let anchorTag = itemNode.querySelector('a');
      anchorTag.innerText = cityName;
      anchorTag.setAttribute('data-string', cityName);

      //append it to the dropdown menu
      dropdownMenu.appendChild(itemNode);
    }

    displayEventData(currentEvents);
    displayStats(currentEvents);
    document.getElementById('location').innerText = 'All Events';
}

function displayEventData(currentEvents) {

    const eventTable = document.getElementById('eventTable');
    const template = document.getElementById('tableRowTemplate');

    eventTable.innerHTML = '';

    for (let i = 0; i < currentEvents.length; i++) {
        let event = currentEvents[i];
        let tableRow = document.importNode(template.content, true);

        tableRow.querySelector('[data-id="event"]').textContent = event.event;
        tableRow.querySelector('[data-id="city"]').textContent = event.city;
        tableRow.querySelector('[data-id="state"]').textContent = event.state;
        tableRow.querySelector('[data-id="attendance"]').textContent = event.attendance.toLocaleString();
        tableRow.querySelector('[data-id="date"]').textContent = new Date(event.date).toLocaleDateString();
  
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
      least: least
    }

    return stats;
}

function displayStats(currentEvents) {
    let statistics = calculateStats(currentEvents);

    //get the elements where the stats go
    //set their text to be the correct stat from statistics
    document.getElementById('total').textContent = statistics.total.toLocaleString();

   //Math.round rounds up or down to a whole number, toLocalString() removes decimals and adds commas
    document.getElementById('average').textContent = Math.round(statistics.average).toLocaleString(); 

    document.getElementById('most').textContent = statistics.most.toLocaleString();
    document.getElementById('least').textContent = statistics.least.toLocaleString();
}

function getEventData() {
    let data = localStorage.getItem('rdSuperDogEventData2023');

    if (data == null) {
        localStorage.setItem('rdSuperDogEventData2023', JSON.stringify(events));   //JSON = javascript object notation
    }

    let currentEvents = data == null ? events : JSON.parse(data); 

    // if statement below is same as turnary statement above
    // if (data == null) {
    //  currentEvents = events;
    //} else {
    //  currentEvents = JSON.parse(data);
    //}

    return currentEvents;
}     

function viewFilteredEvents(dropdownItem) {
    let cityName = dropdownItem.getAttribute('data-string');

    //get all my events
    let allEvents = getEventData();

    if (cityName == 'All') {
        displayEventData(allEvents);
        document.getElementById('location').innerText = 'All Events';
    
        return; //return in this instance will end the function if cityName does not equal All
      }  

      //filter those events to just the selected city
      let filteredEvents = allEvents.filter(event => event.city.toLowerCase() == cityName.toLowerCase());
      // let filteredEvents = allEvents.filter(
      //    function (event)) {
      //    return event.city.toLowerCase() == cityName.toLowerCase();
      //}

      //display the stats for those events
      displayStats(filteredEvents);

      //change the stats header
      document.getElementById('location').innerText = cityName;

      //display only those events in the table
      displayEventData(filteredEvents);
    
}

function saveNewEvent() {
    //get the form input values
    let name = document.getElementById('newEventName').value;
    let city = document.getElementById('newEventCity').value;

    let stateSelect = document.getElementById('newEventState');
    let stateIndex = stateSelect.selectedIndex;
    let state = stateSelect.options[stateIndex].text;

    let attendance = parseInt(document.getElementById('newEventAttendance').value, 10);

    let dateValue = document.getElementById("newEventDate").value;
    dateValue = new Date(dateValue);
    let date = dateValue.toLocaleDateString();

    //create a new event object
    let newEvent = {
      event: name,
      city: city,
      state: state,
      attendance: attendance,
      date: date,
    };

    //add it to the array of current events
    let events = getEventData();
    events.push(newEvent);

    //save the array with the new event
    localStorage.setItem('rdSuperDogEventData2023', JSON.stringify(events));

    buildDropdown();
}