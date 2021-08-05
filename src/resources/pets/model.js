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

  createTable();
  createMockData();

  return { selectAllPet };
}

module.exports = Pet;
