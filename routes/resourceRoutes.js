const express = require('express');
const {
    createResource,
    getResources,
    getResourceById,
    updateResource,
    deleteResource
} = require('../contollers/reourceController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.route('/')
    .get(getResources)
    .post(protect, createResource);

router.route('/:id')
    .get(getResourceById)
    .put(protect, updateResource)
    .delete(protect, deleteResource);

module.exports = router;
