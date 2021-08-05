const Pet = require("./model");

const { selectAllPet } = Pet();

function getAllPets(req, res) {
  selectAllPet().then((result) => res.json(result));
}

module.exports = { getAllPets };
