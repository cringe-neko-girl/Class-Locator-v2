// Enhanced floor layout data structure with more detailed room information
const campusBuildings = {
    "science-hall": {
        displayName: "Science Hall",
        floors: {
            1: {
                description: "Main Science Floor",
                rooms: [
                    {
                        id: 101,
                        name: "Physics Lab",
                        coordinates: { x: 0, y: 0 },
                        dimensions: { width: 300, height: 300 },
                        design: {
                            wallThickness: 5,
                            spacing: 10,
                            roomSize: 50,
                            corridorWidth: 20
                        },
                        capacity: 30,
                        features: ["smart-board", "lab-equipment"]
                    },
                    {
                        id: 102,
                        name: "Biology Lab",
                        coordinates: { x: 310, y: 0 },
                        dimensions: { width: 300, height: 300 },
                        design: {
                            wallThickness: 5,
                            spacing: 10,
                            roomSize: 50,
                            corridorWidth: 20
                        },
                        capacity: 25,
                        features: ["microscopes", "lab-tables"]
                    }
                ]
            },
            2: {
                description: "Advanced Studies Floor",
                rooms: [
                    // Additional rooms can be added here
                ]
            }
        }
    },
    "engineering-center": {
        displayName: "Engineering Center",
        floors: {
            1: {
                description: "Engineering Fundamentals",
                rooms: [
                    {
                        id: 110,
                        name: "Engineering Workshop",
                        coordinates: { x: 0, y: 0 },
                        dimensions: { width: 350, height: 350 },
                        design: {
                            wallThickness: 5,
                            spacing: 10,
                            roomSize: 55,
                            corridorWidth: 25
                        },
                        capacity: 40,
                        features: ["workbenches", "3d-printers"]
                    },
                    {
                        id: 111,
                        name: "Materials Science Lab",
                        coordinates: { x: 360, y: 0 },
                        dimensions: { width: 350, height: 350 },
                        design: {
                            wallThickness: 5,
                            spacing: 10,
                            roomSize: 55,
                            corridorWidth: 25
                        },
                        capacity: 35,
                        features: ["testing-equipment", "safety-gear"]
                    }
                ]
            }
        }
    },
    "arts-complex": {
        displayName: "Arts Complex",
        floors: {
            1: {
                description: "Creative Arts Floor",
                rooms: [
                    {
                        id: 101,
                        name: "Painting Studio",
                        coordinates: { x: 0, y: 0 },
                        dimensions: { width: 250, height: 250 },
                        design: {
                            wallThickness: 4,
                            spacing: 8,
                            roomSize: 45,
                            corridorWidth: 15
                        },
                        capacity: 20,
                        features: ["easels", "natural-light"]
                    },
                    {
                        id: 102,
                        name: "Sculpture Studio",
                        coordinates: { x: 260, y: 0 },
                        dimensions: { width: 250, height: 250 },
                        design: {
                            wallThickness: 4,
                            spacing: 8,
                            roomSize: 45,
                            corridorWidth: 15
                        },
                        capacity: 15,
                        features: ["clay-station", "kiln"]
                    }
                ]
            }
        }
    }
    // Additional buildings can be added here
};

// Enhanced class options with more metadata
const campusCourses = {
    "science-hall": [
        { 
            code: "PHYS101",
            name: "Physics 101: Introduction to Mechanics", 
            floor: 1,
            room: 101,
            schedule: "MWF 10:00-11:15",
            instructor: "Dr. Smith"
        },
        { 
            code: "BIO101",
            name: "Biology 101: Cellular Biology", 
            floor: 1,
            room: 102,
            schedule: "TTH 13:00-14:30",
            instructor: "Prof. Johnson"
        }
    ],
    "engineering-center": [
        { 
            code: "ENG101",
            name: "Engineering 101: Fundamentals", 
            floor: 1,
            room: 110,
            schedule: "MW 14:00-15:30",
            instructor: "Dr. Williams"
        },
        { 
            code: "CHEM201",
            name: "Chemistry 201: Organic Chemistry", 
            floor: 1,
            room: 111,
            schedule: "TTH 9:00-10:30",
            instructor: "Prof. Brown"
        }
    ],
    "arts-complex": [
        { 
            code: "ART101",
            name: "Art History 101: Renaissance Art", 
            floor: 1,
            room: 101,
            schedule: "MWF 11:00-12:00",
            instructor: "Dr. Davis"
        },
        { 
            code: "SCULP102",
            name: "Sculpture 102: Advanced Techniques", 
            floor: 1,
            room: 102,
            schedule: "TTH 15:00-17:00",
            instructor: "Prof. Miller"
        }
    ]
};

// Function to render the floor layout with enhanced SVG
function renderFloorLayout(buildingId, floorNumber) {
    const building = campusBuildings[buildingId];
    if (!building) {
        console.error("Building not found!");
        return;
    }

    const floor = building.floors[floorNumber];
    if (!floor) {
        console.error("Floor not found in building!");
        return;
    }

    const svgContainer = document.getElementById('svgContainer');
    svgContainer.innerHTML = '';  // Clear previous content

    // Create header with building and floor info
    const floorHeader = document.createElement('div');
    floorHeader.className = 'floor-header';
    floorHeader.innerHTML = `
        <h2>${building.displayName}</h2>
        <h3>Floor ${floorNumber}: ${floor.description}</h3>
    `;
    svgContainer.appendChild(floorHeader);

    // Create SVG container for the floor plan
    const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgElement.setAttribute("viewBox", "0 0 1000 500"); // Adjust based on your needs
    svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svgElement.style.border = "1px solid #ccc";
    svgElement.style.backgroundColor = "#f9f9f9";

    // Render each room
    floor.rooms.forEach(room => {
        const roomGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        roomGroup.setAttribute("class", "room-group");
        roomGroup.setAttribute("data-room-id", room.id);

        // Room rectangle
        const roomRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        roomRect.setAttribute("x", room.coordinates.x);
        roomRect.setAttribute("y", room.coordinates.y);
        roomRect.setAttribute("width", room.dimensions.width);
        roomRect.setAttribute("height", room.dimensions.height);
        roomRect.setAttribute("fill", "#e6f7ff");
        roomRect.setAttribute("stroke", "#1890ff");
        roomRect.setAttribute("stroke-width", "2");
        roomRect.setAttribute("rx", "5"); // Rounded corners
        roomGroup.appendChild(roomRect);

        // Room label
        const roomLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
        roomLabel.setAttribute("x", room.coordinates.x + room.dimensions.width/2);
        roomLabel.setAttribute("y", room.coordinates.y + room.dimensions.height/2);
        roomLabel.setAttribute("text-anchor", "middle");
        roomLabel.setAttribute("dominant-baseline", "middle");
        roomLabel.setAttribute("fill", "#000");
        roomLabel.textContent = `${room.name} (${room.id})`;
        roomGroup.appendChild(roomLabel);

        // Room capacity
        const capacityLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
        capacityLabel.setAttribute("x", room.coordinates.x + room.dimensions.width/2);
        capacityLabel.setAttribute("y", room.coordinates.y + room.dimensions.height/2 + 20);
        capacityLabel.setAttribute("text-anchor", "middle");
        capacityLabel.setAttribute("dominant-baseline", "middle");
        capacityLabel.setAttribute("fill", "#666");
        capacityLabel.setAttribute("font-size", "12");
        capacityLabel.textContent = `Capacity: ${room.capacity}`;
        roomGroup.appendChild(capacityLabel);

        svgElement.appendChild(roomGroup);
    });

    svgContainer.appendChild(svgElement);

    // Add legend
    const legend = document.createElement('div');
    legend.className = 'floor-legend';
    legend.innerHTML = `
        <h4>Floor Legend</h4>
        <div class="legend-item"><span class="color-box" style="background:#e6f7ff;"></span> Classroom</div>
        <div class="legend-item"><span class="color-box" style="background:#f6ffed;"></span> Laboratory</div>
    `;
    svgContainer.appendChild(legend);
}

// Function to handle classroom selection with more details
function handleClassroomSelection() {
    const buildingId = document.getElementById("buildingDropdown").value;
    const courseId = document.getElementById("classDropdown").value;

    if (!buildingId || !courseId) {
        alert("Please select both a building and a course.");
        return;
    }

    const course = campusCourses[buildingId].find(c => c.code === courseId);
    if (!course) {
        console.error("Course not found in the selected building.");
        return;
    }

    // Render the floor with the classroom
    renderFloorLayout(buildingId, course.floor);

    // Display course information
    const infoPanel = document.getElementById('courseInfoPanel');
    infoPanel.innerHTML = `
        <h3>${course.name} (${course.code})</h3>
        <p><strong>Location:</strong> Room ${course.room}</p>
        <p><strong>Schedule:</strong> ${course.schedule}</p>
        <p><strong>Instructor:</strong> ${course.instructor}</p>
    `;

    // Highlight the specific room
    setTimeout(() => {
        const roomElement = document.querySelector(`.room-group[data-room-id="${course.room}"] rect`);
        if (roomElement) {
            roomElement.setAttribute("fill", "#b7eb8f");
            roomElement.setAttribute("stroke", "#52c41a");
            roomElement.setAttribute("stroke-width", "3");
        }
    }, 100);
}

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

// Update class dropdown when building is selected
function updateClassDropdown(buildingId) {
    const dropdown = document.getElementById("classDropdown");
    dropdown.innerHTML = '<option value="" disabled selected>Select a course</option>';
    
    if (buildingId) {
        const courses = campusCourses[buildingId] || [];
        courses.forEach(course => {
            const option = document.createElement("option");
            option.value = course.code;
            option.textContent = `${course.code}: ${course.name}`;
            dropdown.appendChild(option);
        });
        
        dropdown.disabled = false;
    } else {
        dropdown.disabled = true;
    }
}

// Initialize the application
function initializeApp() {
    initializeBuildingDropdown();
    
    // Set up event listeners
    document.getElementById("buildingDropdown").addEventListener("change", function() {
        updateClassDropdown(this.value);
    });
    
    document.getElementById("searchButton").addEventListener("click", handleClassroomSelection);
    
    // Add keyboard support
    document.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            handleClassroomSelection();
        }
    });
}

// Start the application when the DOM is loaded
document.addEventListener("DOMContentLoaded", initializeApp);