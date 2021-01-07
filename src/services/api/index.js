import db from '@/services/database';
import { keyBy, distinct } from '@/services/util';

const fetchPatientProfile = async (userId) => db.register.where({ id: userId }).first();

const fetchPatientDiagnosis = (userId) => {
  const result = [];
  const diseaseIds = new Set();
  return db.diseases
    .where({ id_person: userId })
    .toArray()
    .then((data) => {
      data.forEach((item) => {
        result.push({
          ...item,
          to: item.to && item.to.length > 0 ? item.to : null,
          chronic: item.chronic === '1' || item.chronic === true,
        });
        diseaseIds.add(parseInt(item.id_disease, 10));
      });
      return db.disease_register
        .where('id')
        .anyOf([...diseaseIds])
        .toArray();
    })
    .then((diseaseDefs) => {
      const idToDefMap = keyBy(diseaseDefs, 'id');
      return {
        data: result.map((item) => ({
          ...item,
          disease: idToDefMap[item.id_disease],
        })),
      };
    });
};

const oneToOneJoin = async (left, right, leftField, rightField, fieldName, keyByField) => {
  const sourceRecords = await left.toArray();
  const defKeys = distinct(sourceRecords, (item) => item[leftField]);
  const defs = await right.where(rightField).anyOf(defKeys).toArray();
  const keyedRightRecords = keyBy(defs, rightField);
  const result = sourceRecords.map((item) => {
    const copy = { ...item };
    copy[fieldName] = keyedRightRecords[item[leftField]];
    return copy;
  });
  if (keyByField) {
    return keyBy(result, keyByField);
  }
  return result;
};

const fetchUserPrescriptions = async (userId) => {
  const records = await oneToOneJoin(
    db.medicines.where({ id_person: userId }),
    db.medicine_register,
    'id_medicine',
    'id',
    'medicine',
  );
  const diseaseIds = distinct(records, (item) => item.id_disease);
  const diseases = await oneToOneJoin(
    db.diseases.where('id_care').anyOf(diseaseIds),
    db.disease_register,
    'id_disease',
    'id',
    'def',
    'id_care',
  );
  const allergyIds = distinct(records, (item) => item.id_allergy);
  const allergies = await oneToOneJoin(
    db.allergies.where('id_care').anyOf(allergyIds),
    db.allergy_register,
    'id_allergy',
    'id',
    'def',
    'id_care',
  );
  const interventionIds = distinct(records, (item) => item.id_intervention);
  const interventions = await oneToOneJoin(
    db.interventions.where('id_care').anyOf(interventionIds),
    db.intervention_register,
    'id_intervention',
    'id',
    'def',
    'id_care',
  );
  const traumasIds = distinct(records, (item) => item.id_trauma);
  const traumas = keyBy(await db.traumas.bulkGet(traumasIds), 'id_care');
  return {
    data: records.map((item) => ({
      ...item,
      disease: diseases[item.id_disease],
      allergy: allergies[item.id_allergy],
      intervention: interventions[item.id_intervention],
      trauma: traumas[item.id_trauma],
    })),
  };
};

const fetchUserContacts = (userId) => db.contact
  .where({ id_person: userId })
  .toArray()
  .then((data) => ({ data }));

const fetchUserAllergies = async (userId) => {
  const allergies = await db.allergies.where({ id_person: userId }).toArray();
  const allergyIds = [...new Set(allergies.map((item) => item.id_allergy))];
  const allergyDefs = await db.allergy_register.where('id').anyOf(allergyIds).toArray();
  const idToAllergy = keyBy(allergyDefs, 'id');
  return allergies.map((allergy) => ({
    ...allergy,
    def: idToAllergy[allergy.id_allergy],
    intolerance: allergy.intolerance === true || allergy.intolerance === 'S',
  }));
};

const fetchAllExams = async (userId) => {
  const userExams = await db.exams.where({ id_person: userId }).toArray();
  const defsId = userExams
    .filter((exam) => exam.macro_category !== 'LABORATORIO')
    .map((item) => item.id_exam);
  const defs = await db.exam_register.where('id').anyOf(defsId).toArray();
  const keyedDefs = keyBy(defs, 'id');
  return userExams.map((item) => ({
    ...item,
    def: keyedDefs[item.id_exam],
  }));
};

const fetchUserExams = async (userId, withValues = false) => {
  const userExams = await db.exams.where({ id_person: userId }).toArray();
  if (withValues) {
    const examIds = distinct(userExams, (item) => item.id_care);
    const values = await oneToOneJoin(
      db.exam_values.where('id_exam').anyOf(examIds),
      db.exam_register,
      'id_exam_type',
      'id',
      'def',
    );
    const keyedValues = keyBy(values, 'id_exam', true);
    return userExams
      .map((item) => ({
        ...item,
        values: keyedValues[item.id_care],
      }));
  }
  const defsId = distinct(userExams, (item) => item.id_exam);
  const defs = await db.exam_register.where('id').anyOf(defsId).toArray();
  const keyedDefs = keyBy(defs, 'id');
  return userExams.map((item) => ({
    ...item,
    def: keyedDefs[item.id_exam],
  }));
};

const login = (email, password) => new Promise((resolve, reject) => {
  db.users.where('email')
    .equalsIgnoreCase(email)
    .first((user) => {
      if (!user) {
        reject(new Error('email is not registered'));
      } else if (user.password !== password) {
        reject(new Error('incorrect password'));
      } else {
        resolve({
          id: user.id,
          type: user.type,
        });
      }
    });
});

export default {
  fetchPatientProfile,
  fetchPatientDiagnosis,
  fetchUserPrescriptions,
  fetchUserContacts,
  fetchUserAllergies,
  login,
  fetchUserExams,
  oneToOneJoin,
  fetchAllExams,
};
