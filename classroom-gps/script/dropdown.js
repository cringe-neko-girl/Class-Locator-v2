document.addEventListener("DOMContentLoaded", () => {
    alert("✅ dropdown.js connected");

    const buildingDropdown = document.getElementById('buildingDropdown');
    const classDropdown = document.getElementById('classDropdown');
    const roomDropdown = document.getElementById('roomDropdown');
    const searchButton = document.getElementById('searchButton');

    if (!buildingDropdown || !classDropdown || !roomDropdown || !searchButton) {
        return;
    }

    fetch('data/class.json')
        .then(response => {
            if (!response.ok) throw new Error("Failed to fetch data");
            return response.json();
        })
        .then(data => {
            const campusData = data;

            // Populate buildings
            Object.entries(campusData.campusBuildings).forEach(([key, building]) => {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = building.displayName;
                buildingDropdown.appendChild(option);
            });

            buildingDropdown.addEventListener('change', () => {
                const buildingId = buildingDropdown.value;
                classDropdown.disabled = true;
                roomDropdown.disabled = true;
                classDropdown.innerHTML = `<option value="" disabled selected>Select a class</option>`;
                roomDropdown.innerHTML = `<option value="" disabled selected>Select a room</option>`;

                if (campusData.campusBuildings[buildingId]) {
                    populateClassDropdown(buildingId, campusData);
                    classDropdown.disabled = false;
                }
            });

            classDropdown.addEventListener('change', () => {
                const buildingId = buildingDropdown.value;
                const classId = classDropdown.value;
                roomDropdown.disabled = true;
                roomDropdown.innerHTML = `<option value="" disabled selected>Select a room</option>`;

                populateRoomDropdown(buildingId, classId, campusData);
                roomDropdown.disabled = false;
            });

            function populateClassDropdown(buildingId, data) {
                const building = data.campusBuildings[buildingId];
                const classSet = new Set();

                for (const floor of Object.values(building.floors)) {
                    floor.rooms.forEach(room => {
                        if (!classSet.has(room.class)) {
                            const option = document.createElement('option');
                            option.value = room.class;
                            option.textContent = room.class;
                            classDropdown.appendChild(option);
                            classSet.add(room.class);
                        }
                    });
                }
            }

            function populateRoomDropdown(buildingId, classId, data) {
                const building = data.campusBuildings[buildingId];
                let found = false;

                for (const floor of Object.values(building.floors)) {
                    floor.rooms.forEach(room => {
                        if (room.class === classId) {
                            const option = document.createElement('option');
                            option.value = room.name;
                            option.textContent = room.name;
                            roomDropdown.appendChild(option);
                            found = true;
                        }
                    });
                }

                if (!found) {
                    const fallback = document.createElement('option');
                    fallback.value = "";
                    fallback.textContent = "No rooms available";
                    roomDropdown.appendChild(fallback);
                }
            }

            searchButton.addEventListener('click', () => {
                const buildingId = buildingDropdown.value;
                const classId = classDropdown.value;
                const roomId = roomDropdown.value;

            });
        })
        .catch(error => {
            console.error("Failed to load classroom data:", error);
        });
});
