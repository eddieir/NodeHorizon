const Resource = require('../models/resourceModel');

// Create a new resource
exports.createResource = async (req, res) => {
    try {
        const resource = await Resource.create({
            title: req.body.title,
            description: req.body.description,
            user: req.user.id
        });
        res.status(201).json(resource);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all resources
exports.getResources = async (req, res) => {
    try {
        const resources = await Resource.find().populate('user', 'name email');
        res.status(200).json(resources);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single resource by ID
exports.getResourceById = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id).populate('user', 'name email');
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }
        res.status(200).json(resource);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a resource
exports.updateResource = async (req, res) => {
    try {
        const resource = await Resource.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }
        res.status(200).json(resource);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete a resource
exports.deleteResource = async (req, res) => {
    try {
        const resource = await Resource.findByIdAndDelete(req.params.id);
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }
        res.status(200).json({ message: 'Resource deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
