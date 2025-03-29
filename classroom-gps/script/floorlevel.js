alert("✅ floorlevel.js connected ")

async function loadClassesData() {
    try {
        const response = await fetch('data/class.json');
        return await response.json();
    } catch (error) {
        alert("Error loading classes data: " + error);
    }
}

function createFloorSelection(floorNumber, totalFloors) {
    const floorBar = document.createElement('div');
    floorBar.style.position = 'absolute';
    floorBar.style.right = '5%';
    floorBar.style.top = '50%';
    floorBar.style.transform = 'translateY(-50%)';
    floorBar.style.width = '300px';
    floorBar.style.height = '350px';
    floorBar.style.border = '2px solid #333';
    floorBar.style.backgroundColor = '#f0f0f0';
    floorBar.style.display = 'flex';
    floorBar.style.flexDirection = 'column-reverse';
    floorBar.style.alignItems = 'center';
    floorBar.style.justifyContent = 'space-between';

    for (let i = 1; i <= totalFloors; i++) {
        const floor = document.createElement('div');
        floor.style.width = '80%';
        floor.style.height = `${100 / totalFloors}%`;
        floor.style.borderBottom = '2px solid #444';
        floor.style.backgroundColor = i === floorNumber ? '#ff5c8e' : '#dcdcdc';
        floor.style.position = 'relative';

        const floorLabel = document.createElement('span');
        floorLabel.innerText = `Floor ${i}`;
        floorLabel.style.fontSize = '14px';
        floorLabel.style.fontWeight = 'bold';
        floorLabel.style.color = i === floorNumber ? '#fff' : '#333';
        floorLabel.style.position = 'absolute';
        floorLabel.style.top = '50%';
        floorLabel.style.left = '50%';
        floorLabel.style.transform = 'translate(-50%, -50%)';

        floor.appendChild(floorLabel);
        floorBar.appendChild(floor);
    }
    document.body.appendChild(floorBar);
}

document.getElementById("searchButton").addEventListener("click", async function () {
    const buildingId = document.getElementById("buildingDropdown").value;
    const courseName = document.getElementById("classDropdown").value;
    const room = document.getElementById("roomDropdown").value;

    // Alert the current room value being searched for
    alert(`Searching for Room: ${room}`);

    if (!buildingId || !courseName || !room) {
        alert("Please select a building, class, and room.");
        return;
    }

    const data = await loadClassesData();
    if (!data) return;

    const building = data.campusBuildings[buildingId];
    if (!building) {
        alert("Building not found.");
        return;
    }

    let floorNumber = null;
    for (let floor in building.floors) {
        const rooms = building.floors[floor].rooms;

        if (!rooms || rooms.length === 0) continue;

        const roomNames = rooms.map(r => `${r.name} (${r.class})`).join(", ");
        alert(`Floor ${floor} has rooms: ${roomNames}`);

        // Check if selected room exists on this floor
        const roomDetails = rooms.find(r => r.name === room);
        if (roomDetails) {
            floorNumber = parseInt(floor);
            alert(`✅ Room ${room} found on Floor ${floor}`);
            break;
        }
    }

    if (floorNumber !== null) {
        createFloorSelection(floorNumber, Object.keys(building.floors).length);
    } else {
        alert(`❌ Room ${room} not found in the selected building.`);
    }
});
