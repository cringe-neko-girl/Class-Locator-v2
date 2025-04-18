alert("✅ floorplan.js connected");

document.addEventListener('DOMContentLoaded', () => {
    const buildingDropdown = document.getElementById('buildingDropdown');
    const classDropdown = document.getElementById('classDropdown');
    const roomDropdown = document.getElementById('roomDropdown');
    const searchButton = document.getElementById('searchButton');
    const floorPlanContainer = document.getElementById('floorPlanContainer'); // Added container reference
    let campusData = {};

    fetch('data/class.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            campusData = data.campusBuildings;
            populateBuildingDropdown();
        })
        .catch(error => {
            console.error('Error loading campus data:', error);
            showNotification('Failed to load campus data. Please try again later.', 'error');
        });

    function populateBuildingDropdown() {
        buildingDropdown.innerHTML = '<option value="" disabled selected>Select a building</option>';
        Object.keys(campusData).forEach(building => {
            const option = document.createElement('option');
            option.value = building;
            option.textContent = campusData[building].displayName;
            buildingDropdown.appendChild(option);
        });
    }

    buildingDropdown.addEventListener('change', () => {
        classDropdown.disabled = true;
        roomDropdown.disabled = true;
        classDropdown.innerHTML = '<option value="" disabled selected>Select a class</option>';
        roomDropdown.innerHTML = '<option value="" disabled selected>Select a room</option>';
        
        const selectedBuilding = buildingDropdown.value;
        if (selectedBuilding) {
            populateClassDropdown(selectedBuilding);
        }
    });

    function populateClassDropdown(building) {
        classDropdown.disabled = false;
        classDropdown.innerHTML = '<option value="" disabled selected>Select a class</option>';
        
        Object.keys(campusData[building].floors).forEach(floor => {
            campusData[building].floors[floor].rooms.forEach(room => {
                const option = document.createElement('option');
                option.value = room.id;
                option.textContent = room.class;
                classDropdown.appendChild(option);
            });
        });
    }

    classDropdown.addEventListener('change', () => {
        roomDropdown.disabled = true;
        roomDropdown.innerHTML = '<option value="" disabled selected>Select a room</option>';
        
        const selectedRoomId = classDropdown.value;
        if (selectedRoomId) {
            populateRoomDropdown(selectedRoomId);
        }
    });

    function populateRoomDropdown(roomId) {
        const selectedBuilding = buildingDropdown.value;
        roomDropdown.disabled = false;
        roomDropdown.innerHTML = '<option value="" disabled selected>Select a room</option>';
        
        Object.keys(campusData[selectedBuilding].floors).forEach(floor => {
            campusData[selectedBuilding].floors[floor].rooms.forEach(room => {
                if (room.id === roomId) {
                    const option = document.createElement('option');
                    option.value = room.id;
                    option.textContent = room.name;
                    roomDropdown.appendChild(option);
                }
            });
        });
    }

    searchButton.addEventListener('click', () => {
        const selectedBuilding = buildingDropdown.value;
        const selectedRoomId = roomDropdown.value;
        if (selectedBuilding && selectedRoomId) {
            displayFloorPlanImage(selectedBuilding, selectedRoomId);
        } else {
            showNotification('Please select both a building and a room.', 'error');
        }
    });

    function displayFloorPlanImage(building, roomId) {
        let imageUrl = '';
        let roomFound = false;
        
        Object.keys(campusData[building].floors).forEach(floor => {
            campusData[building].floors[floor].rooms.forEach(room => {
                if (room.id === roomId) {
                    imageUrl = room.image;
                    roomFound = true;
                }
            });
        });

        // Clear previous image
        floorPlanContainer.innerHTML = '';
        
        if (roomFound && imageUrl) {
            const imageElement = document.createElement('img');
            imageElement.src = imageUrl;
            imageElement.alt = 'Room Floor Plan';
            imageElement.className = 'floor-plan-image';
            floorPlanContainer.appendChild(imageElement);
        } else {
            showNotification('No floor plan image available for the selected room.', 'error');
        }
    }

    function showNotification(message, type = 'success') {
        const existingNotifications = document.querySelectorAll('.notification-floor');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `notification-floor ${type}`;
        
        const iconSvg = type === 'success' ? 
            '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>' :
            '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
        
        notification.innerHTML = `
            <div class="notification-icon">${iconSvg}</div>
            <div class="notification-message">${message}</div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
});