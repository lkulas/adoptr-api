'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const {Preferences} = require('./models');

const router = express.Router();

const passport = require('passport');

const jwtAuth = passport.authenticate('jwt', { session: false });

const jsonParser = bodyParser.json();

// GET - for specific user
router.get('/:username', jsonParser, jwtAuth, (req, res) => {
	Preferences
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
	const requiredFields = [
		'animal', 
		'username', 
		'age', 
		'size', 
		'gender',
		'goodWith',
		'health'
	];
	for (let i = 0; i < requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing ${field} in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}
	Preferences
		.create({
			username: req.body.username,
			animal: req.body.animal,
			age: req.body.age,
			size: req.body.size,
			gender: req.body.gender,
			goodWith: req.body.goodWith,
			health: req.body.health
		})
		.then(Preferences => res.status(201).json(Preferences.serialize()))
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
	const updateableFields = [
		'animal', 
		'age',
		'size',
		'gender',
		'goodWith',
		'health'
	];
	updateableFields.forEach(field => {
		if (field in req.body) {
			updated[field] = req.body[field];
		}
	});
	Preferences
		.findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
		.then(updatedPet => res.status(204).end())
		.catch(err => res.status(500).json({error: 'Internal server error'}));
});

module.exports = {router};
