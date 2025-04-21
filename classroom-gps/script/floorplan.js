alert("✅ floorplan.js connected");

document.addEventListener('DOMContentLoaded', () => {
    const buildingDropdown = document.getElementById('buildingDropdown');
    const classDropdown = document.getElementById('classDropdown');
    const roomDropdown = document.getElementById('roomDropdown');
    const searchButton = document.getElementById('searchButton');
    const floorPlanContainer = document.getElementById('floorPlanContainer');
    let campusData = {};

    fetch('data/class.json')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            campusData = data.campusBuildings;
            showNotification('Campus data loaded successfully', 'success');
        })
        .catch(error => {
            console.error('Error loading campus data:', error);
            showNotification('Failed to load campus data. Please try again later.', 'error');
        });

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
        let floor = '';
        let targetRoom = null;

        // Find the correct floor and room
        for (const f in campusData[building].floors) {
            const rooms = campusData[building].floors[f].rooms;
            const foundRoom = rooms.find(r => r.name === roomId);
            if (foundRoom) {
                floor = f;
                targetRoom = foundRoom;
                break;
            }
        }
        floorPlanContainer.innerHTML = '';
        if (!targetRoom) {
            showNotification('Room not found.', 'error');
            return;
        }
        const imagePath = `${targetRoom.image}/${targetRoom.name}.png`;
        fetch(`${imagePath}`).then(res => res.ok && alert("Image exists:", res.url));

        alert(`Attempting to load image from: ${imagePath}`);
        showNotification(`Looking for image at: ${imagePath}`, 'info');

        checkImageExists(imagePath, exists => {
            if (exists) {
                showNotification('Image found! Loading floor plan...', 'success');
                const imageElement = document.createElement('img');
                imageElement.src = imagePath;
                imageElement.alt = 'Room Floor Plan';
                imageElement.className = 'floor-plan-image';
                
                imageElement.onerror = () => {
                    showNotification('Failed to display the image (load error)', 'error');
                };
                
                floorPlanContainer.appendChild(imageElement);
            } else {
                showNotification('Image not found at specified path', 'error');
                console.error('Image not found:', imagePath);
            }
        });
    }

    function checkImageExists(url, callback) {
        const img = new Image();
        img.onload = () => callback(true);
        img.onerror = () => callback(false);
        img.src = url;
    }

    function showNotification(message, type = 'success') {
        const existingNotifications = document.querySelectorAll('.notification-floor');
        existingNotifications.forEach(n => n.remove());

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
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, type === 'info' ? 5000 : 3000);
    }
});