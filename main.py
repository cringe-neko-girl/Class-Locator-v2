import os
import json

def create_all_room_folders(json_path: str, base_image_dir: str = "/workspaces/Class-Locator-v2/classroom-gps/images"):

    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    buildings = data.get("campusBuildings", {})
    
    for building_key, building_info in buildings.items():
        floors = building_info.get("floors", {})
        for floor_number, floor_info in floors.items():
            rooms = floor_info.get("rooms", [])
            for room in rooms:
                room_name = room.get("name")
                if room_name:
                    folder_path = os.path.join(base_image_dir, building_key, str(floor_number), room_name)
                    os.makedirs(folder_path, exist_ok=True)
                    print(f"Created: {folder_path}")

# Usage
create_all_room_folders("/workspaces/Class-Locator-v2/classroom-gps/data/class.json")
