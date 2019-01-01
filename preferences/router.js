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
		'username', 
		'dog', 
		'cat', 
		'puppyOrKitten', 
		'young',
		'adult',
		'senior',
		'small',
		'medium',
		'large',
		'extraLarge',
		'female',
		'male',
		'cats',
		'dogs',
		'children',
		'altered',
		'hasShots',
		'housetrained'
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
			dog: req.body.dog,
			cat: req.body.cat,
			puppyOrKitten: req.body.puppyOrKitten,
			young: req.body.young,
			adult: req.body.adult,
			senior: req.body.senior,
			small: req.body.small,
			medium: req.body.medium,
			large: req.body.large,
			extraLarge: req.body.extraLarge,
			female: req.body.female,
			male: req.body.male,
			cats: req.body.cats,
			dogs: req.body.dogs,
			children: req.body.children,
			altered: req.body.altered,
			hasShots: req.body.hasShots,
			housetrained: req.body.housetrained,
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
		'dog', 
		'cat', 
		'puppyOrKitten', 
		'young',
		'adult',
		'senior',
		'small',
		'medium',
		'large',
		'extraLarge',
		'female',
		'male',
		'cats',
		'dogs',
		'children',
		'altered',
		'hasShots',
		'housetrained'
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