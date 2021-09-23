const db = require("../../data/db-config");

function find() {
  return db("schemes as sc")
    .leftJoin("steps as st", "sc.scheme_id", "=", "st.scheme_id")
    .select("sc.*")
    .count("st.step_id as number_of_steps")
    .groupBy("sc.scheme_id")
    .orderBy("sc.scheme_id", "asc");
}

function getSchemeById(scheme_id) {
  return db("schemes").where("scheme_id", scheme_id).first();
}

async function findById(scheme_id) {
  const rows = await db("schemes as sc")
    .leftJoin("steps as st", "sc.scheme_id", "st.scheme_id")
    .select("sc.scheme_name", "st.*")
    .where("sc.scheme_id", scheme_id)
    .orderBy("st.step_number", "asc");

  result = {
    scheme_id: rows[0].scheme_id,
    scheme_name: rows[0].scheme_name,
    steps: rows[0].step_id
      ? rows.map((row) => ({
          step_id: row.step_id,
          step_number: row.step_number,
          instructions: row.instructions,
        }))
      : [],
  };
  return result;
}

function findSteps(scheme_id) {
  return db("schemes as sc")
    .join("steps as st", "sc.scheme_id", "st.scheme_id")
    .select("sc.scheme_name", "st.step_id", "st.step_number", "st.instructions")
    .where("sc.scheme_id", scheme_id)
    .orderBy("st.step_number", "asc");
}

async function add(scheme) {
  const [id] = await db("schemes").insert(scheme);
  return getSchemeById(id);
  // EXERCISE D
  /*
    1D- This function creates a new scheme and resolves to _the newly created scheme_.
  */
}

function addStep(scheme_id, step) {
  return db("steps")
    .insert({
      ...step,
      scheme_id
    })
    .then(() => {
      return db("steps as st")
        .join("schemes as sc", "sc.scheme_id", "st.scheme_id")
        .select("step_id", "step_number", "instructions", "scheme_name")
        .orderBy("step_number")
        .where("sc.scheme_id", scheme_id);
    });
  // EXERCISE E
  /*
    1E- This function adds a step to the scheme with the given `scheme_id`
    and resolves to _all the steps_ belonging to the given `scheme_id`,
    including the newly created one.
  */
}

module.exports = {
  find,
  findById,
  getSchemeById,
  findSteps,
  add,
  addStep,
};
