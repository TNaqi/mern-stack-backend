const Workout = require('../models/workoutModel')
const mongoose = require('mongoose')

// get all workouts
const getWorkouts = async (req, res) => {
  const user_id = req.user._id

  const workouts = await Workout.find({ user_id }).sort({createdAt: -1})

  res.status(200).json(workouts)
}

// get a single workout
const getWorkout = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such workout'})
  }

  const workout = await Workout.findById(id)

  if (!workout) {
    return res.status(400).json({error: 'No such workout'})
  }
  res.status(200).json(workout)
}

// create a workout
const createWorkout = async (req, res) => {
  const {title, load, reps} = req.body
  let emptyFileds = []

  if (!title) {
    emptyFileds.push('title')
  }
  if (!load) {
    emptyFileds.push('load')
  }
  if (!reps) {
    emptyFileds.push('reps')
  }
  if (emptyFileds.length > 0) {
    return res.status(400).json({error: 'please fill in all the fileds', emptyFileds})
  }

  try{
    const user_id = req.user._id
    const workout = await Workout.create({title, reps, load, user_id})
    res.status(200).json(workout)
  } catch(error){
    res.status(400).json({error: error.message})
  }
}

// delete a workout
const deleteWorkout = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'can\'t delete if there no workout'})
  }
  const workout = await Workout.findOneAndDelete({_id: id})
  if (!workout) {
    return res.status(400).json({error: 'can\'t delete if there no workout'})
  }
  res.status(200).json({
    success: "deleted successfully",
    title: workout.title,
    id: id
  })
}

// update a workout
const updateWorkout = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'can\'t update if there no workout'})
  }

  const workout = await Workout.findOneAndUpdate({_id: id}, {
    ...req.body
  })

  if (!workout) {
    return res.status(400).json({error: 'can\'t update if there no workout'})
  }

  res.status(200).json({
    success: 'updated successfully',
    title: workout.title,
    reps: workout.reps,
    load: workout.load
  })
}


module.exports = {
  getWorkouts,
  getWorkout,
  createWorkout,
  deleteWorkout,
  updateWorkout
}