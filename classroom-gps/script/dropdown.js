document.addEventListener("DOMContentLoaded", () => {
    const buildingDropdown = document.getElementById('buildingDropdown');
    const classDropdown = document.getElementById('classDropdown');
    const roomDropdown = document.getElementById('roomDropdown');
    const searchButton = document.getElementById('searchButton');

    fetch('data/class.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }
            return response.json();
        })
        .then(data => {
            const campusData = data;

            // Populate the building dropdown with building names from the data
            Object.values(campusData.campusBuildings).forEach(building => {
                const option = document.createElement('option');
                option.value = building.displayName.toLowerCase().replace(/\s+/g, '-');
                option.textContent = building.displayName;
                buildingDropdown.appendChild(option);
            });

            buildingDropdown.addEventListener('change', () => {
                const buildingId = buildingDropdown.value;
                populateClassDropdown(buildingId, campusData);
                classDropdown.disabled = false;
            });

            classDropdown.addEventListener('change', () => {
                const buildingId = buildingDropdown.value;
                const classId = classDropdown.value;
                populateRoomDropdown(buildingId, classId, campusData);
                roomDropdown.disabled = false;
            });

            function populateClassDropdown(buildingId, campusData) {
                classDropdown.innerHTML = `<option value="" disabled selected>Select a class</option>`;
                let buildingFound = false;
                for (const building of Object.values(campusData.campusBuildings)) {
                    if (buildingId === building.displayName.toLowerCase().replace(/\s+/g, '-')) {
                        buildingFound = true;
                        for (const floor of Object.values(building.floors)) {
                            floor.rooms.forEach(room => {
                                const option = document.createElement('option');
                                option.value = room.class;
                                option.textContent = room.class;
                                classDropdown.appendChild(option);
                            });
                        }
                        break;
                    }
                }
                if (!buildingFound) console.error("No building found for the selected ID: " + buildingId);
            }

            function populateRoomDropdown(buildingId, classId, campusData) {
                roomDropdown.innerHTML = `<option value="" disabled selected>Select a room</option>`;
                let roomFound = false;
                for (const building of Object.values(campusData.campusBuildings)) {
                    if (buildingId === building.displayName.toLowerCase().replace(/\s+/g, '-')) {
                        for (const floor of Object.values(building.floors)) {
                            floor.rooms.forEach(room => {
                                if (room.class === classId) {
                                    const option = document.createElement('option');
                                    option.value = room.name;
                                    option.textContent = room.name;
                                    roomDropdown.appendChild(option);
                                    roomFound = true;
                                }
                            });
                        }
                        break;
                    }
                }
                if (!roomFound) console.error("No rooms found for class: " + classId);
            }

            searchButton.addEventListener('click', () => {
                const buildingId = buildingDropdown.value;
                const classId = classDropdown.value;
                const roomId = roomDropdown.value;

                // Check if the room is selected and update the dropdown value to the selected room
                if (buildingId && classId && roomId) {
                    // Update the selected room option
                    const selectedRoomOption = roomDropdown.querySelector(`option[value='${roomId}']`);
                    if (selectedRoomOption) {
                        selectedRoomOption.selected = true;
                    }

                    console.log(`Navigating to ${classId} in room ${roomId}, ${buildingId.replace(/-/g, ' ')}`);
                } else {
                    console.error('Please select a building, class, and room.');
                }
            });
        })
        .catch(error => {
            console.error("Failed to load classroom data: " + error.message);
        });
});
