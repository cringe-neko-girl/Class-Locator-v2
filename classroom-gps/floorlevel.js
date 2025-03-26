// Load JSON data
async function loadClassesData() {
    try {
        const response = await fetch('data/class.json');
        const data = await response.json();
        return data;
    } catch (error) {
        alert("Error loading classes data: " + error);
    }
}

// Function to create the floor selection bar and highlight the floor
function createFloorSelection(floorNumber, totalFloors) {
    alert(`Creating floor selection for floor ${floorNumber} of ${totalFloors} floors.`);

    // Create the outer container for the floor selection
    const floorBar = document.createElement('div');
    floorBar.style.position = 'absolute';
    floorBar.style.right = '5%'; // Place near the right side of the screen
    floorBar.style.top = '50%'; // Center vertically
    floorBar.style.transform = 'translateY(-50%)'; // Correct positioning
    floorBar.style.width = '300px'; // Width of the floor selection bar
    floorBar.style.height = '350px'; // Height of the floor selection bar
    floorBar.style.border = '2px solid #333'; // Border around the floor selection bar
    floorBar.style.backgroundColor = '#f0f0f0'; // Light background color
    floorBar.style.display = 'flex';
    floorBar.style.flexDirection = 'column-reverse'; // Reverse the order of floors
    floorBar.style.alignItems = 'center';
    floorBar.style.justifyContent = 'space-between'; // Evenly space out the floors

    // Create the individual floor sections
    for (let i = 1; i <= totalFloors; i++) {
        const floor = document.createElement('div');
        floor.style.width = '80%'; // Width of each floor section inside the floor bar
        floor.style.height = `${100 / totalFloors}%`; // Divide the total height evenly by the number of floors (30px per floor)
        floor.style.borderBottom = '2px solid #444'; // Thin line between floors
        floor.style.backgroundColor = i === floorNumber ? '#ff5c8e' : '#dcdcdc'; // Highlight selected floor in pinkish red
        floor.style.position = 'relative';

        // Add floor label
        const floorLabel = document.createElement('span');
        floorLabel.innerText = `Floor ${i}`;
        floorLabel.style.fontSize = '14px';
        floorLabel.style.fontWeight = 'bold';
        floorLabel.style.color = i === floorNumber ? '#fff' : '#333'; // White text for selected floor
        floorLabel.style.position = 'absolute';
        floorLabel.style.top = '50%';
        floorLabel.style.left = '50%';
        floorLabel.style.transform = 'translate(-50%, -50%)'; // Center label within the floor section

        // Append label to the floor
        floor.appendChild(floorLabel);

        // Add floor to the floorBar
        floorBar.appendChild(floor);
    }

    // Append the floor bar to the body or container
    document.body.appendChild(floorBar);
}



// Event listener for search button
document.getElementById("searchButton").addEventListener("click", async function () {
    const buildingId = document.getElementById("buildingDropdown").value;
    const courseName = document.getElementById("classDropdown").value;
    const room = document.getElementById("roomDropdown").value;

    alert(`Search button clicked. Building: ${buildingId}, Course: ${courseName}, Room: ${room}`);

    if (!buildingId || !courseName || !room) {
        alert("Please select a building, class, and room.");
        return;
    }

    // Load the class data
    const data = await loadClassesData();

    if (!data) {
        alert("Failed to load data from the JSON file.");
        return;
    }

    // Find the building in the JSON
    const building = data.campusBuildings[buildingId];
    if (!building) {
        alert("Building not found in the JSON data.");
        return;
    }

    alert(`Found building: ${building.displayName}`);

    let floorNumber = null;

    // Loop through the floors to find the floor where the selected room exists by name
    for (let floor in building.floors) {
        const rooms = building.floors[floor].rooms;

        // Check each room and log the room names
        const roomDetails = rooms.find(r => r.name === room);
        
        // Log each floor and its rooms
        alert(`Checking floor ${floor}, Rooms: ${rooms.map(r => r.name).join(", ")}`);
        
        if (roomDetails) {
            floorNumber = parseInt(floor);
            alert(`Room ${room} found on floor ${floorNumber}`);
            break;
        }
    }

    if (floorNumber !== null) {
        // Call function to draw the floor plan and highlight the selected floor
        createFloorSelection(floorNumber, Object.keys(building.floors).length);
    } else {
        alert("Room not found in the selected building.");
    }
});
