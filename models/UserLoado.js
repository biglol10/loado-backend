const mongoose = require('mongoose');

const UserLoadoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  character: {
    type: String,
    required: [true, 'Character required'],
  },
  characterName: {
    type: String,
    required: [true, 'Character name required'],
    trim: true,
    maxLength: [12, 'Character name cannot be longer than 12 characters'],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  idx: Number,
  chaosRestValue: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
  guardianRestValue: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
  eponaRestValue: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
  chaosDone: {
    type: Number,
    min: 0,
    max: 2,
    required: true,
  },
  guardianDone: {
    type: Number,
    min: 0,
    max: 2,
    required: true,
  },
  eponaDone: {
    type: Number,
    min: 0,
    max: 3,
    required: true,
  },
  guardianWeeklyDone: {
    type: Number,
    min: 0,
    max: 3,
    required: true,
  },
  abyssDungeon6Types: {
    type: Boolean,
    default: false
  },
  abyssDungeon3Nakwon: {
    type: Boolean,
    default: false
  },
  abyssDungeon2: {
    type: Boolean,
    default: false,
  },
  abyssDungeonWeekly: {
    type: Boolean,
    default: false,
  },
  rehearsalAndDejavu: {
    type: [String],
    enum: ['kukuseitn', 'abrel'],
  },
  argos: {
    type: Boolean,
    default: false,
  },
  baltan: {
    type: Boolean,
    default: false,
  },
  biakiss: {
    type: Boolean,
    default: false,
  },
  kukuseitn: {
    type: Boolean,
    default: false,
  },
  abrel: {
    type: Boolean,
    default: false,
  },
  attributeChanged: {
    type: Boolean,
    default: false,
  },
  weeklyAttributeChanged: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  dontChange: {
    type: Boolean,
    default: false,
  },
  note: {
    type: String,
    maxLength: 20,
  },
});

module.exports = mongoose.model('UserLoado', UserLoadoSchema);
