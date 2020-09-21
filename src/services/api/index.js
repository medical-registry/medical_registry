import db from '@/services/database';
import { keyBy } from '@/services/util';

// eslint-disable-next-line no-unused-vars
const fetchUserExamsRegister = (userId) => Promise.resolve(
  {
    data: {
      categories: [
        {
          examId: 9, category: 'SANGUE', name: 'ALDOSTERONE', sex: 'A',
        },
        {
          examId: 26, category: 'SANGUE', name: 'ANTIGENE CARBOIDRATO 19-9', sex: 'A',
        },
        {
          examId: 33, category: 'SANGUE', name: 'AZOTO UREICO EMATICO', sex: 'A',
        },
        {
          examId: 42, category: 'SANGUE', name: 'CERUPLASMINA', sex: 'A',
        },
        {
          examId: 45, category: 'SANGUE', name: 'CONCENTRAZIONE CORPUSCOLARE MEDIA DI EMOGLOBINA', sex: 'A',
        },
        {
          examId: 57, category: 'SANGUE', name: 'CREATININEMIA', sex: 'A',
        },
        {
          examId: 116, category: 'SANGUE', name: 'PROTEINA C', sex: 'A',
        },
        {
          examId: 157, category: 'SANGUE', name: 'TRIGLICERIDI', sex: 'A',
        },
        {
          examId: 182, category: 'URINE', name: 'URINOCOLTURA', sex: 'A',
        },
        {
          examId: 187, category: 'URINE', name: 'DROGHE URINARIE', sex: 'A',
        },
        {
          examId: 269, category: 'RADIOGRAFIA', name: 'CON CONTRASTO', sex: 'A',
        },
        {
          examId: 270, category: 'RADIOGRAFIA', name: 'SENZA CONTRASTO', sex: 'A',
        },
        {
          examId: 301, category: 'VISITA', name: 'GASTROENTEROLOGICA', sex: 'A',
        },
        {
          examId: 304, category: 'VISITA', name: 'DERMATOLOGICA', sex: 'A',
        },

      ],
    },
  },
);

const fetchUserExamsCategories = async (userId) => {
  fetchUserExamsRegister(userId)
    .then((response) => [...new Set(response.data.categories.map((item) => item.cateogy))]);
};

const fetchPatientProfile = (userId) => new Promise((resolve, reject) => {
  db.register.where({ id: userId })
    .first((user) => {
      if (!user) {
        reject(new Error(`no entry in 'register' for id: ${userId}`));
      } else {
        resolve({
          data: user,
        });
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

const fetchUserAllergies = (userId) => {
  let userAllergies;
  return db.allergies
    .where({ id_person: userId })
    .toArray()
    .then((res) => {
      userAllergies = res;
      const allergyIds = new Set();
      res.forEach((item) => allergyIds.add(parseInt(item.id_allergy, 10)));
      return db.allergy_register.where('id')
        .anyOf([...allergyIds])
        .toArray();
    })
    .then((allergyDefs) => {
      const idToAllergy = keyBy(allergyDefs, 'id');
      return {
        data: userAllergies.map((item) => ({
          ...item,
          allergy: idToAllergy[item.id_allergy],
        })),
      };
    });
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
  fetchUserExamsRegister,
  fetchUserExamsCategories,
  fetchPatientProfile,
  fetchPatientDiagnosis,
  fetchUserPrescriptions,
  fetchUserContacts,
  fetchUserAllergies,
  login,
};
