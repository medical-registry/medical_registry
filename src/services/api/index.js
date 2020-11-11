import db from '@/services/database';
import { keyBy } from '@/services/util';

const fetchPatientProfile = (userId) => new Promise((resolve, reject) => {
  db.register.where({ id: userId })
    .first((user) => {
      if (!user) {
        reject(new Error(`no entry in 'register' for id: ${userId}`));
      } else {
        resolve(user);
      }
    });
});

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

const fetchUserPrescriptions = (userId) => {
  let prescriptions;
  return db.medicines
    .where({ id_person: userId })
    .toArray()
    .then((records) => {
      prescriptions = records;
      const medicineIds = new Set();
      const diseaseIds = new Set();
      const allergyIds = new Set();
      records.forEach((record) => {
        if (record.id_medicine && record.id_medicine !== '') {
          medicineIds.add(parseInt(record.id_medicine, 10));
        }
        if (record.id_disease && record.id_disease !== '') {
          diseaseIds.add(parseInt(record.id_disease, 10));
        }
        if (record.id_allergies && record.id_allergies !== '') {
          allergyIds.add(parseInt(record.id_allergies, 10));
        }
        // eslint-disable-next-line no-param-reassign
        record.to = !record.to || record.to === '' ? null : record.to;
      });
      return Promise.all([
        db.medicine_register.where('id').anyOf([...medicineIds]).toArray(),
        db.disease_register.where('id').anyOf([...diseaseIds]).toArray(),
        db.allergy_register.where('id').anyOf([...allergyIds]).toArray(),
      ]);
    })
    .then((values) => {
      const [medicineDefs, diseaseDefs, allergyDefs] = values;
      const idToMedicineDefs = keyBy(medicineDefs, 'id');
      const idToDiseaseDefs = keyBy(diseaseDefs, 'id');
      const idToAllergyDefs = keyBy(allergyDefs, 'id');
      return {
        data: prescriptions.map((item) => ({
          ...item,
          medicine: idToMedicineDefs[item.id_medicine],
          disease: idToDiseaseDefs[item.id_disease],
          allergy: idToAllergyDefs[item.id_allergies],
        })),
      };
    });
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

const fetchUserExams = async (userId) => {
  const exams = await db.exams.where({ id_person: userId }).toArray();
  return exams;
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
};
