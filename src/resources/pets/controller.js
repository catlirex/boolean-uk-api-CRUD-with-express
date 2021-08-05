const Pet = require("./model");

const {
  selectAllPet,
  selectOnePet,
  createOnePet,
  updateOnePet,
  deleteServerPet,
  selectPetType,
  selectPetByType,
} = Pet();

function getAllPets(req, res) {
  selectAllPet().then((result) => res.json(result));
}

function getOnePet(req, res) {
  const petId = req.params.id;
  selectOnePet(petId)
    .then((result) => {
      if (result) res.json(result);
      else res.json({ ERROR: `Pet not found, petId: ${petId}` });
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({ msg: `Internal Server Error, try again later` });
    });
}

function postOnePet(req, res) {
  let newPet = req.body;
  const validPet = petObjChecker("new", newPet);
  if (!validPet) return res.json({ ERROR: "BOOK info invalid" });
  createOnePet(newPet)
    .then((result) => res.json(result))
    .catch((e) => {
      console.log(e);
      res.status(500).json({ msg: `Internal Server Error, try again later` });
    });
}

function patchOnePet(req, res) {
  const toUpdateId = req.params.id;
  const toUpdateContent = req.body;
  selectOnePet(toUpdateId)
    .then((result) => {
      console.log(result);
      if (!result)
        return res.json({ ERROR: `PET NOT FOUND petId:${toUpdateId}` });

      const toUpdatePet = { ...result, ...toUpdateContent };
      const validPet = petObjChecker("update", toUpdatePet);
      console.log(validPet);
      if (!validPet) return res.json({ ERROR: `Update info incorrect` });

      updateOnePet(toUpdateId, toUpdatePet)
        .then((updatedPet) => res.json({ updatedPet }))
        .catch((e) => {
          console.log(e);
          res
            .status(500)
            .json({ msg: `Internal Server Error, try again later` });
        });
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({ msg: `Internal Server Error, try again later` });
    });
}

function deleteOnePet(req, res) {
  const toDelId = req.params.id;
  selectOnePet(toDelId).then((pet) => {
    if (!pet) return res.json({ ERROR: `PET NOT FOUND, petId:${toDelId}` });
    deleteServerPet(toDelId)
      .then(() => res.json({ MSG: "DONE" }))
      .catch((e) => {
        console.log(e);
        res.status(500).json({ msg: `Internal Server Error, try again later` });
      });
  });
}

function getPetTypes(req, res) {
  selectPetType()
    .then((result) => {
      const petTypes = [];
      for (const target of result) petTypes.push(target.type);
      res.json({ result: petTypes });
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({ msg: `Internal Server Error, try again later` });
    });
}

function getPetByType(req, res) {
  const type = req.params.type;
  selectPetByType(type)
    .then((result) => res.json(result))
    .catch((e) => {
      console.log(e);
      res.status(500).json({ msg: `Internal Server Error, try again later` });
    });
}

function petObjChecker(checkerType, petObject) {
  const NewPetRequirements = ["name", "age", "type", "breed", "microchip"];
  const UpdatePetRequirements = [
    "id",
    "name",
    "age",
    "type",
    "breed",
    "microchip",
  ];

  if (petObject.age && typeof petObject.age !== "number") return false;
  if (petObject.microchip && typeof petObject.microchip !== "boolean")
    return false;

  if (checkerType === "new") {
    const hasAllKeys = NewPetRequirements.every((item) =>
      petObject.hasOwnProperty(item)
    );

    if (
      hasAllKeys &&
      Object.keys(petObject).length === NewPetRequirements.length
    )
      return true;
    else return false;
  } else if (checkerType === "update") {
    const hasAllKeys = UpdatePetRequirements.every((item) =>
      petObject.hasOwnProperty(item)
    );
    if (
      hasAllKeys &&
      Object.keys(petObject).length === UpdatePetRequirements.length
    )
      return true;
    else return false;
  } else return false;
}

module.exports = {
  getAllPets,
  getOnePet,
  postOnePet,
  patchOnePet,
  deleteOnePet,
  getPetTypes,
  getPetByType,
};
