// Updated campus buildings data with class-to-building mapping
const campusBuildings = {
    "science-hall": {
        displayName: "Science Hall",
        floors: {
            1: { description: "Main Science Floor", rooms: generateRooms(10, 1) },
            2: { description: "Advanced Labs", rooms: generateRooms(10, 2) },
            3: { description: "Research Labs", rooms: generateRooms(10, 3) },
            4: { description: "Special Projects", rooms: generateRooms(10, 4) },
            5: { description: "Graduate Studies", rooms: generateRooms(10, 5) }
        }
    },
    "engineering-center": {
        displayName: "Engineering Center",
        floors: {
            1: { description: "Engineering Basics", rooms: generateRooms(10, 1) },
            2: { description: "Advanced Engineering", rooms: generateRooms(10, 2) },
            3: { description: "Labs and Workshops", rooms: generateRooms(10, 3) },
            4: { description: "Research and Development", rooms: generateRooms(10, 4) },
            5: { description: "Graduate Engineering", rooms: generateRooms(10, 5) }
        }
    },
    "arts-complex": {
        displayName: "Arts Complex",
        floors: {
            1: { description: "Creative Arts Studios", rooms: generateRooms(10, 1) },
            2: { description: "Digital Arts and Media", rooms: generateRooms(10, 2) },
            3: { description: "Sculpture and Painting", rooms: generateRooms(10, 3) },
            4: { description: "Music Studios", rooms: generateRooms(10, 4) },
            5: { description: "Theater and Performance", rooms: generateRooms(10, 5) }
        }
    },
    "math-and-computing": {
        displayName: "Math and Computing Building",
        floors: {
            1: { description: "Math Courses", rooms: generateRooms(10, 1) },
            2: { description: "Computer Science Labs", rooms: generateRooms(10, 2) },
            3: { description: "Data Science", rooms: generateRooms(10, 3) },
            4: { description: "Advanced Computing", rooms: generateRooms(10, 4) },
            5: { description: "Math Research", rooms: generateRooms(10, 5) }
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

// Function to generate rooms (10 rooms per floor)
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

// Room options
const roomOptions = {
    "Physics 101": ["101A", "101B", "101C", "101D", "101E", "101F", "101G", "101H", "101I", "101J"],
    "Biology 201": ["201A", "201B", "201C", "201D", "201E", "201F", "201G", "201H", "201I", "201J"],
    "Chemistry 301": ["301A", "301B", "301C", "301D", "301E", "301F", "301G", "301H", "301I", "301J"],
    "Mechanics 110": ["110A", "110B", "110C", "110D", "110E", "110F", "110G", "110H", "110I", "110J"],
    "Thermodynamics 220": ["220A", "220B", "220C", "220D", "220E", "220F", "220G", "220H", "220I", "220J"],
    "Circuits 330": ["330A", "330B", "330C", "330D", "330E", "330F", "330G", "330H", "330I", "330J"],
    "Painting 101": ["101A", "101B", "101C", "101D", "101E", "101F", "101G", "101H", "101I", "101J"],
    "Music Theory 150": ["150A", "150B", "150C", "150D", "150E", "150F", "150G", "150H", "150I", "150J"],
    "Theater 200": ["200A", "200B", "200C", "200D", "200E", "200F", "200G", "200H", "200I", "200J"],
    "Marketing 101": ["101A", "101B", "101C", "101D", "101E", "101F", "101G", "101H", "101I", "101J"]
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

// Handle classroom search
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
        document.getElementById("floorTitle").textContent = building.displayName + " - Floor " + roomDetails.floor;
        document.getElementById("svgContainer").innerHTML = `Room ${roomDetails.name} is on Floor ${roomDetails.floor}.`;
    }

    // Show the map container
    document.getElementById("mapContainer").style.display = "block";
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
