'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const {Adoptr, AdoptrPreferences} = require('./models');

const router = express.Router();

const passport = require('passport');

const jwtAuth = passport.authenticate('jwt', { session: false });

const jsonParser = bodyParser.json();

//GET - getting all records
router.get('/', jsonParser, jwtAuth, (req, res) => {
	Adoptr
		.find()
		.then(pets => {
			res.status(200).json(pets.map(pet => pet.serialize()));
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({error: "Something went wrong"});
		});
});

// GET - for specific user
router.get('/:username', jsonParser, jwtAuth, (req, res) => {
	Adoptr
		.find({ username: req.params.username })
		.then(pets => {
			res.status(200).json(pets.map(pet => pet.serialize()));
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({error: "Something went wrong"});
		});
});

// POST
router.post('/', jsonParser, jwtAuth, (req, res) => {
	const requiredFields = ['name', 'username', 'waterEvery'];
	for (let i = 0; i < requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing ${field} in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}
	Adoptr
		.create({
			username: req.body.username,
			planted: new Date(),
			name: req.body.name,
			waterEvery: req.body.waterEvery,
			lastWatered: new Date()
		})
		.then(Adoptr => res.status(201).json(Adoptr.serialize()))
		.catch(err => {
			console.error(err);
			res.status(500).json({error: 'Internal server error'});
		});
});

// PUT
router.put('/:id', jsonParser, jwtAuth, (req, res) => {
	if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
		res.status(400).json({
			error: 'Request path id and request body id must match'
		});
	}
	const updated = {};
	const updateableFields = ['waterEvery', 'lastWatered'];
	updateableFields.forEach(field => {
		if (field in req.body) {
			updated[field] = req.body[field];
		}
	});
	Adoptr
		.findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
		.then(updatedPet => res.status(204).end())
		.catch(err => res.status(500).json({error: 'Internal server error'}));
});

// DELETE
router.delete('/:id', jwtAuth, (req, res) => {
	Adoptr
		.findByIdAndRemove(req.params.id)
		.then(() => {
			res.status(204).end();
		})
		.catch(err => res.status(500).json({error: 'Internal server error'}));
});

module.exports = {router};
