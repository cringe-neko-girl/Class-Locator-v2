// Updated campus buildings data with class-to-building mapping
const campusBuildings = {
    "science-hall": {
        displayName: "Science Hall",
        floors: {
            1: { description: "Main Science Floor", rooms: generateRooms(3, 1) }, // Reduced room count to 3 per floor
            2: { description: "Advanced Labs", rooms: generateRooms(3, 2) },
            3: { description: "Research Labs", rooms: generateRooms(3, 3) },
            4: { description: "Special Projects", rooms: generateRooms(3, 4) },
            5: { description: "Graduate Studies", rooms: generateRooms(3, 5) }
        }
    },
    "engineering-center": {
        displayName: "Engineering Center",
        floors: {
            1: { description: "Engineering Basics", rooms: generateRooms(3, 1) },
            2: { description: "Advanced Engineering", rooms: generateRooms(3, 2) },
            3: { description: "Labs and Workshops", rooms: generateRooms(3, 3) },
            4: { description: "Research and Development", rooms: generateRooms(3, 4) },
            5: { description: "Graduate Engineering", rooms: generateRooms(3, 5) }
        }
    },
    "arts-complex": {
        displayName: "Arts Complex",
        floors: {
            1: { description: "Creative Arts Studios", rooms: generateRooms(3, 1) },
            2: { description: "Digital Arts and Media", rooms: generateRooms(3, 2) },
            3: { description: "Sculpture and Painting", rooms: generateRooms(3, 3) },
            4: { description: "Music Studios", rooms: generateRooms(3, 4) },
            5: { description: "Theater and Performance", rooms: generateRooms(3, 5) }
        }
    },
    "math-and-computing": {
        displayName: "Math and Computing Building",
        floors: {
            1: { description: "Math Courses", rooms: generateRooms(3, 1) },
            2: { description: "Computer Science Labs", rooms: generateRooms(3, 2) },
            3: { description: "Data Science", rooms: generateRooms(3, 3) },
            4: { description: "Advanced Computing", rooms: generateRooms(3, 4) },
            5: { description: "Math Research", rooms: generateRooms(3, 5) }
        }
    }
};

// Class-to-building mapping
const classToBuilding = {
    "Physics 101": "science-hall",
    "Biology 201": "science-hall",
    "Chemistry 301": "science-hall",
    "Mechanics 110": "engineering-center",
    "Thermodynamics 220": "engineering-center",
    "Circuits 330": "engineering-center",
    "Painting 101": "arts-complex",
    "Music Theory 150": "arts-complex",
    "Theater 200": "arts-complex",
    "Marketing 101": "math-and-computing"
};

// Function to generate rooms (3 rooms per floor)
function generateRooms(roomCount, floorNumber) {
    const rooms = [];
    for (let i = 1; i <= roomCount; i++) {
        rooms.push({
            id: `${floorNumber}${i}`,
            name: `Room ${floorNumber}${i}`,
            coordinates: { x: (i - 1) * 100, y: (floorNumber - 1) * 100 },
            dimensions: { width: 80, height: 80 }
        });
    }
    return rooms;
}

// Room options (example data, can be customized)
const roomOptions = {
    "Physics 101": ["101A", "101B", "101C"],
    "Biology 201": ["201A", "201B", "201C"],
    "Chemistry 301": ["301A", "301B", "301C"],
    "Mechanics 110": ["110A", "110B", "110C"],
    "Thermodynamics 220": ["220A", "220B", "220C"],
    "Circuits 330": ["330A", "330B", "330C"],
    "Painting 101": ["101A", "101B", "101C"],
    "Music Theory 150": ["150A", "150B", "150C"],
    "Theater 200": ["200A", "200B", "200C"],
    "Marketing 101": ["101A", "101B", "101C"]
};

// Initialize building dropdown
function initializeBuildingDropdown() {
    const dropdown = document.getElementById("buildingDropdown");
    dropdown.innerHTML = '<option value="" disabled selected>Select a building</option>';
    
    Object.entries(campusBuildings).forEach(([id, building]) => {
        const option = document.createElement("option");
        option.value = id;
        option.textContent = building.displayName;
        dropdown.appendChild(option);
    });
}

// Update class dropdown based on the selected building
function updateClassDropdown(buildingId) {
    const dropdown = document.getElementById("classDropdown");
    dropdown.innerHTML = '<option value="" disabled selected>Select a class</option>';

    if (buildingId) {
        const classesForBuilding = Object.keys(classToBuilding).filter(className => classToBuilding[className] === buildingId);
        classesForBuilding.forEach(course => {
            const option = document.createElement("option");
            option.value = course;
            option.textContent = course;
            dropdown.appendChild(option);
        });

        dropdown.disabled = false;
    } else {
        dropdown.disabled = true;
    }
}

// Update room dropdown based on selected class
function updateRoomDropdown(courseName) {
    const roomDropdown = document.getElementById("roomDropdown");
    roomDropdown.innerHTML = '<option value="" disabled selected>Select a room</option>';

    if (courseName) {
        const rooms = roomOptions[courseName];
        rooms.forEach(room => {
            const option = document.createElement("option");
            option.value = room;
            option.textContent = room;
            roomDropdown.appendChild(option);
        });
        
        roomDropdown.disabled = false;
    } else {
        roomDropdown.disabled = true;
    }
}

// Handle classroom search and floor generation
function handleClassroomSelection() {
    const buildingId = document.getElementById("buildingDropdown").value;
    const courseName = document.getElementById("classDropdown").value;
    const room = document.getElementById("roomDropdown").value;

    if (!buildingId || !courseName || !room) {
        alert("Please select a building, class, and room.");
        return;
    }

    // Get the selected building and course data
    const building = campusBuildings[buildingId];
    const courseRooms = roomOptions[courseName];

    // Find the floor and room
    let selectedRoom = courseRooms.find(r => r === room);
    if (selectedRoom) {
        const roomDetails = building.floors[Math.floor(parseInt(room.substring(0, 1)) / 10)].rooms.find(r => r.id === room);
        
        // Create a floor map
        generateFloorPlan(building, roomDetails.floor);

        // Show selected room on the floor plan
        document.getElementById("floorTitle").textContent = `${building.displayName} - Floor ${roomDetails.floor}`;
        document.getElementById("svgContainer").innerHTML = `Room ${roomDetails.name} is on Floor ${roomDetails.floor}.`;
    }

    // Show the map container
    document.getElementById("mapContainer").style.display = "block";

    // Save data to JSON
    saveCampusFloorsToJson(buildingId, roomDetails);
}

// Function to generate floor plan SVG
function generateFloorPlan(building, floorLevel) {
    const floor = building.floors[floorLevel];
    const rooms = floor.rooms;
    
    let html = `<svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 800 600"
        style="border: 1px solid #000;"
    >
        <text x="50%" y="10%" text-anchor="middle" font-size="24" font-family="Arial" fill="black">
            Floor: ${floorLevel} - ${floor.description}
        </text>`;

    rooms.forEach((room, index) => {
        html += `<rect x="${room.coordinates.x}" y="${room.coordinates.y}" width="${room.dimensions.width}" height="${room.dimensions.height}" fill="#ddd" stroke="#000" />
                 <text x="${room.coordinates.x + 10}" y="${room.coordinates.y + 20}" font-size="14" font-family="Arial" fill="black">
                     ${room.name}
                 </text>`;
    });

    html += `</svg>`;
    document.getElementById("svgContainer").innerHTML = html;
}

// Function to save campusFloors data to JSON
function saveCampusFloorsToJson(buildingId, roomDetails) {
    const campusFloors = JSON.parse(localStorage.getItem("campusFloors")) || {};

    if (!campusFloors[buildingId]) {
        campusFloors[buildingId] = {};
    }

    const floorKey = roomDetails.floor;
    if (!campusFloors[buildingId][floorKey]) {
        campusFloors[buildingId][floorKey] = [];
    }

    const roomExists = campusFloors[buildingId][floorKey].find(room => room.room === roomDetails.name);
    if (!roomExists) {
        campusFloors[buildingId][floorKey].push({
            floor: floorKey,
            room: roomDetails.name,
            room_x: roomDetails.coordinates.x,
            room_y: roomDetails.coordinates.y
        });

        localStorage.setItem("campusFloors", JSON.stringify(campusFloors));
        alert("Room data added to campusFloors.");
    } else {
        alert("Room data already exists.");
    }
}

// Initialize page elements
initializeBuildingDropdown();

// Event listener for building selection
document.getElementById("buildingDropdown").addEventListener("change", (e) => {
    const buildingId = e.target.value;
    updateClassDropdown(buildingId);
});

// Event listener for class selection
document.getElementById("classDropdown").addEventListener("change", (e) => {
    const courseCode = e.target.value;
    updateRoomDropdown(courseCode);
});

// Event listener for searching classroom
document.getElementById("searchButton").addEventListener("click", handleClassroomSelection);
