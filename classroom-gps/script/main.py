import os

def get_first_image_from_dir(directory):
    # List of image file extensions to check
    image_extensions = ('.jpg', '.jpeg', '.png', '.gif')

    # Iterate through files in the directory
    for file in os.listdir(directory):
        if file.lower().endswith(image_extensions):  # Check if the file is an image
            return file  # Return the first image file found

    return None  # If no image is found, return None

# Example usage
folder_path = 'classroom-gps/images/science-hall/1/100'  # Replace with your folder path
image_file = get_first_image_from_dir(folder_path)
if image_file:
    print(f"The first image in the directory is: {image_file}")
else:
    print("No image files found in the directory.")
