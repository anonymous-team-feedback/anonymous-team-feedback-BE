const { User } = require('../models/users');
const {JoinTeam} = require('../models/joinTeams')

async function createUser(userData) {
  const user = new User({
    firstName: userData.firstName,
    lastName: userData.lastName,
    password: userData.password,
    email: userData.email,
    jobTitle: userData.jobTitle
  });

  return await user.save();
}

async function deleteUser(userId) {
  return await User.findOneAndRemove({ _id: userId });
}

async function findUserByEmail(userEmail) {
  return await User.findOne({ email: userEmail });
}

async function findUserAndUpdate(user_id, data) {
  return await User.findByIdAndUpdate(user_id, data, { new: true });
}

// finds a user from the jointeams collection by userid 
// and merges it with the user and team information
// - if no jointeams collection, it returns just the user base information
async function findUser(userId) {
  const collection = await JoinTeam.find({ user: userId })
  if(collection.length > 0){ // if the collection is there, should be == 1
    //theres gotta be a better way
    // - i dont like querying the same thing twice. But its
    // all i can come up with as of now. Feel free to change!!
    const wholeUser = await JoinTeam.find({user: userId}).populate(
      "user",
      "email firstName lastName jobTitle"
    ).populate(
      "team",
      "name manager slug members"
    )
    return wholeUser
  }
  else{ // if the collection  is absent, should be == 0
    const baseUser = await User.find({_id: userId})
    return baseUser
  }
}

async function findUsers(email, userId) {
  const rgx = new RegExp(email, "ig");

  return await User.find({
    email: rgx,
    _id: { $ne: userId }
  }).select("email -_id");
}

module.exports = {
  findUserByEmail,
  createUser,
  deleteUser,
  findUserAndUpdate,
  findUsers,
  findUser
};
