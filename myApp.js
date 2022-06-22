require('dotenv').config();

/** 1) Install & Set up mongoose */
const MONGO_URI = process.env.MONGO_URI;
let mongoose = require("mongoose");
mongoose.connect(MONGO_URI, { useNewUrlParser: true /*, useUnifiedTopology: true*/})
  .then(() =>  console.log('Connected to database') )
  .catch(err =>  console.error('Could not connect to mongo DB', err) );

/** 2) Create a 'Person' Model */
const personSchema = new mongoose.Schema({
  //_id: mongoose.ObjectId,
  name: {
    type: String,
    required: [true, "Name required"]
    //unique: true
  },
  age: {
    type: Number,
    min: [0, "Nobody has negative years!"],
    max: [120, "Are you sure you are that old?"]
  },
  favoriteFoods: [String]
});

/** 3) Create and Save a Person */
const Person = mongoose.model("Person", personSchema);

/*const person = new Person({
    name: "Andre Barreira Dinis",
    age: 30,
    favoriteFoods: ["Pizza", "Lasanha", "Cozido à Portuguesa"]
  });*/

const createAndSavePerson = function(done) {
  const janeDoe = new Person({
    name: "Jane Doe",
    age: 21,
    favoriteFoods: ["Vegan Steak", "Vegetarian Fish"]
  });
  janeDoe.save(function(err, data) {
    if (err) return console.error(err);
    done(null, data);
  });
};

/*
const arrayOfPeople = [
    {name:"John Doe", age:51},
    {name:"Adolfo Dias", age:32, favoriteFoods:["Veal on the plate", "Fish in the oven sky"]},
    {name:"Amílcar Alho", age: 60, favoriteFoods:["Codfish À Brás", "Veal Stue"]},
    {name:"Ismaylov", age:21, favoriteFoods:["Steak on the rocks", "Meat in the fish"]}
  ];*/

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, function(err, data) {
    if (err) return console.error(err);
    done(null, data);
  });
};

const findPeopleByName = (personName, done) => {
  Person.find({ name: personName }, (err, data) => {
    if (err) return console.error(err);
    done(null, data);
  });
};

const findOneByFood = (food, done) => {
  Person.findOne({ favoriteFoods: food }, (err, data) => {
    if (err) return console.error(err);
    done(null, data);
  })
};

const findPersonById = (personId, done) => {
  Person.findById(personId, function(err, data) {
    if (err) return console.log(err);
    done(null, data);
  });
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";
  Person
    .findById(personId, (err, doc) => {
      if (err) return console.error(err);
      doc.favoriteFoods.push(foodToAdd);
      doc.save((err, doc) => {
        if (err) return console.error(err);
        done(null, doc);
      });
    });
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;
  Person.findOneAndUpdate(
    { name: personName },
    { age: ageToSet },
    { new: true },
    (err, doc) => {
      if (err) return console.error(err);
      doc.save((err, doc) => {
        if (err) return console.error(err);
        done(null, doc);
      });
    }
  );
};

const removeById = (personId, done) => {
  Person.findOneAndRemove(
    { _id: personId },
    (err, doc) => {
      if (err) return console.error(err);
      done(null, doc);
    }
  );
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
  // Person.deleteMany() also works
  Person.remove({name: nameToRemove}, (err, data) => {
    if(err) return console.log(err);
    data.ok = true;
    //data.n = 0;
    console.log(data);
    done(null, data);
  });
};

const queryChain = (done) => {
  const foodToSearch = "burrito";
  Person.
    find({favoriteFoods: foodToSearch}).
    sort("name"). // ascending
    limit(2). // show up to 2 docs
    select("-age"). // hides "age"
    exec((err, data) => {
      if (err) return console.error(err);
      done(null, data);
    });
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
