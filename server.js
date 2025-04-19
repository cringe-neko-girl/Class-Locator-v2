const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use('/images', express.static(path.join(__dirname, 'classroom-gps/images')));

function getFirstImageFromDir(directoryPath) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    const files = fs.readdirSync(directoryPath);
    return files.find(file => imageExtensions.includes(path.extname(file).toLowerCase())) || null;
}

app.get('/first-image', (req, res) => {
    const { building, floor, room } = req.query;
    const fullPath = path.join(__dirname, 'classroom-gps/images', building, floor, room);

    try {
        const imageName = getFirstImageFromDir(fullPath);
        if (imageName) {
            const imageUrl = `/images/${building}/${floor}/${room}/${imageName}`;
            res.json({ imageUrl });
        } else {
            res.status(404).json({ error: 'No image found in the folder.' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error reading directory.' });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
