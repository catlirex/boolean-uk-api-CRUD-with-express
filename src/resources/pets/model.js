const db = require("../../utils/database");
const { buildAnimalDatabase } = require("../../utils/mockData");

function Pet() {
  function createTable() {
    const createTable = `
        DROP TABLE IF EXISTS pets;
        
        CREATE TABLE IF NOT EXISTS pets(
        id        SERIAL        PRIMARY KEY,
        name      VARCHAR(255)   NOT NULL,
        age       INTEGER       NOT NULL,
        type      VARCHAR(255)   NOT NULL,
        breed     VARCHAR(255)   NOT NULL,
        microchip BOOLEAN       NOT NULL
        );
        `;

    db.query(createTable)
      .then(() => console.log("[DB] PET Table ready"))
      .catch(console.error);
  }

  function createMockData() {
    const createPet = `
    INSERT INTO pets
      (name, age, type, breed, microchip)
    VALUES
      ($1, $2, $3, $4, $5)
  `;

    const pets = buildAnimalDatabase();

    pets.forEach((pet) => {
      db.query(createPet, Object.values(pet));
    });
  }

  async function selectAllPet() {
    const selectAll = `
      SELECT * FROM pets;`;

    const result = await db.query(selectAll);
    return result.rows;
  }

  async function selectAllPetFilterMicrochip(microchip) {
    const selectAllFilterMicrochip = `
    SELECT * FROM pets
    WHERE microchip=$1;`;
    try {
      const result = await db.query(selectAllFilterMicrochip, [microchip]);
      return result.rows;
    } catch (e) {
      throw e;
    }
  }

  async function selectOnePet(id) {
    const selectOne = `
    SELECT * FROM pets
    WHERE id = $1;`;

    try {
      const result = await db.query(selectOne, [id]);
      return result.rows[0];
    } catch (e) {
      throw e;
    }
  }

  async function createOnePet(newPet) {
    const { name, type, age, breed, microchip } = newPet;
    const createOne = `
    INSERT INTO pets (name, type, age, breed, microchip)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
    `;

    try {
      const result = await db.query(createOne, [
        name,
        type,
        age,
        breed,
        microchip,
      ]);
      return result.rows[0];
    } catch (e) {
      throw e;
    }
  }

  async function updateOnePet(id, toUpdatePet) {
    const { name, type, age, breed, microchip } = toUpdatePet;
    const updatePet = `
      UPDATE pets
      SET   name = $2,
            type = $3,
            age = $4,
            breed = $5,
            microchip = $6
      WHERE id = $1
      RETURNING *;`;
    try {
      const result = await db.query(updatePet, [
        id,
        name,
        type,
        age,
        breed,
        microchip,
      ]);

      return result.rows[0];
    } catch (e) {
      throw e;
    }
  }

  async function deleteServerPet(id) {
    const delPet = `
    DELETE FROM pets
    WHERE id = $1;`;

    try {
      const result = await db.query(delPet, [id]);
      return result;
    } catch (e) {
      throw e;
    }
  }

  async function selectPetType() {
    const petTypes = `
      SELECT type FROM pets
      GROUP BY type`;
    try {
      const result = await db.query(petTypes);
      return result.rows;
    } catch (e) {
      throw e;
    }
  }

  async function selectPetByType(type) {
    const selectPetByType = `
        SELECT * FROM pets
        WHERE type =$1;`;

    try {
      const result = await db.query(selectPetByType, [type]);
      return result.rows;
    } catch (e) {
      throw e;
    }
  }

  async function selectPetByTypeWithBreed(type, breed) {
    const selectByTypeWithBreed = `
      SELECT * FROM pets
      WHERE type = $1 AND breed = $2;`;

    try {
      const result = await db.query(selectByTypeWithBreed, [type, breed]);
      return result.rows;
    } catch (e) {
      throw e;
    }
  }

  createTable();
  createMockData();

  return {
    selectAllPet,
    selectOnePet,
    createOnePet,
    updateOnePet,
    deleteServerPet,
    selectPetType,
    selectPetByType,
    selectPetByTypeWithBreed,
    selectAllPetFilterMicrochip,
  };
}

module.exports = Pet;
