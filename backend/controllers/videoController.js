const Video = require('../models/videoModel');

// Save video metadata
exports.saveVideo = async (req, res) => {
    try {
        const { title, videoUrl } = req.body;
        const video = new Video({ title, videoUrl });
        await video.save();
        res.status(201).json({ message: 'Video saved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving video' });
    }
};

// Delete video
exports.deleteVideo = async (req, res) => {
    try {
        const { id } = req.params;
        await Video.findByIdAndDelete(id);
        res.status(200).json({ message: 'Video deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting video' });
    }
};

