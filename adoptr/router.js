'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const {Adoptr} = require('./models');
const router = express.Router();
const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', { session: false });
const jsonParser = bodyParser.json();

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
	const requiredFields = [
		'username', 
		'animal', 
		'name', 
		'age', 
		'size',
		'animalId',
		'breed',
		'sex',
		'altered',
		'hasShots',
		'housetrained',
		'goodWith',
		'contact',
		'photo',
		'description'
	];
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
			animal: req.body.animal,
			name: req.body.name,
			age: req.body.age,
			size: req.body.size,
			animalId: req.body.animalId,
			breed: req.body.breed,
			sex: req.body.sex,
			altered: req.body.altered,
			hasShots: req.body.hasShots,
			housetrained: req.body.housetrained,
			goodWith: req.body.goodWith,
			contact: req.body.contact,
			photo: req.body.photo,
			description: req.body.description
		})
		.then(Adoptr => res.status(201).json(Adoptr.serialize()))
		.catch(err => {
			console.error(err);
			res.status(500).json({error: 'Internal server error'});
		});
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
