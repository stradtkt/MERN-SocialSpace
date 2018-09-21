const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');
router.get('/', passport.authenticate('jwt', {session: false}), (req,res) => {
    const errors = {};
    Profile.findOne({user: req.user.id})
    .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile) {
                errors.noprofile = 'There is no profile for this user';
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});


router.get('/all', (req,res) => {
    Profile.find()
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
        if(!profiles) {
            errors.noprofile = "There are no profiles";
            return res.status(404).json(errors);
        }
        res.json(profiles);
    })
    .catch(err => res.status(404).json({profile: 'The are no profiles'}));
});


router.get('/handle/:handle', (req,res) => {
    const errors = {};
    Profile.findOne({handle: req.params.handle})
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile) {
                errors.noprofile = 'There is no profile for this user';
                res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});






router.get('/user/:user_id', (req,res) => {
    const errors = {};
    Profile.findOne({user: req.params.user_id})
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile) {
                errors.noprofile = 'There is no profile for this user';
                res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json({profile: 'There is no profile for this user'}));
});






router.post('/', passport.authenticate('jwt', {session: false}), (req,res) => {
    const {errors, isValid} = validateProfileInput(req.body);
    if(!isValid) {
        return res.status(400).json(errors);
    }
   const profilefields = {};
   profilefields.user = req.user.id;
   if(req.body.handle) profilefields.handle = req.body.handle;
   if(req.body.company) profilefields.company = req.body.company;
   if(req.body.website) profilefields.website = req.body.website;
   if(req.body.location) profilefields.location = req.body.location;
   if(req.body.bio) profilefields.bio = req.body.bio;
   if(req.body.status) profilefields.status = req.body.status;
   if(req.body.githubusername) profilefields.githubusername = req.body.githubusername;
   if(typeof req.body.skills !== 'undefined') {
       profilefields.skills = req.body.skills.split(',');
   }
   profilefields.social = {};
   if(req.body.youtube) profilefields.social.youtube = req.body.youtube;
   if(req.body.twitter) profilefields.social.twitter = req.body.twitter;
   if(req.body.facebook) profilefields.social.facebook = req.body.facebook;
   if(req.body.linkedin) profilefields.social.linkedin = req.body.linkedin;
   if(req.body.instagram) profilefields.social.instagram = req.body.instagram;

   Profile.findOne({ user: req.user.id })
    .then(profile => {
        if(profile) {
            Profile.findByIdAndUpdate({user: req.user.id}, {$set: profilefields}, {new: true})
                .then(profile => res.json(profile));
        } else {
            Profile.findOne({handle: profilefields.handle})
                .then(profile => {
                    if(profile) {
                        errors.handle = "That handle already exists";
                        res.status(400).json(errors);
                    }
                    new Profile(profilefields).save().then(profile => res.json(profile));
                })
        }
    })
});

router.post('/experience', passport.authenticate('jwt', {session: false}), (req,res) => {
    const {errors, isValid} = validateExperienceInput(req.body);
    if(!isValid) {
        return res.status(400).json(errors);
    }
    Profile.findOne({user: request.user.id})
        .then(profile => {
            const newExp = {
                title: req.body.title,
                company: req.body.company,
                location: req.body.location,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            }
            profile.experience.unshift(newExp);
            profile.save().then(profile => res.json(profile));
        })
});
router.post('/education', passport.authenticate('jwt', {session: false}), (req,res) => {
    const {errors, isValid} = validateEducationInput(req.body);
    if(!isValid) {
        return res.status(400).json(errors);
    }
    Profile.findOne({user: req.user.id})
        .then(profile => {
            const newEdu = {
                school: req.body.school,
                degree: req.body.degree,
                fieldofstudy: req.body.fieldofstudy,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            }
            profile.education.unshift(newEdu);
            profile.save().then(profile => res.json(profile));
        })
});

router.post('/experience/:exp_id', passport.authenticate('jwt', {session: false}), (req,res) => {
    Profile.findOne({user: req.user.id})
      .then(profile => {
          const removeIndex = profile.experience
            .map(item => item.id)
            .indexOf(req.params.exp_id);

            //Splice
            profile.experience.splice(removeIndex, 1);

            //Save
            profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
});

module.exports = router;