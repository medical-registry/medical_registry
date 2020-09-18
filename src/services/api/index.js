import moment from 'moment';
import db from '@/services/database';

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

// eslint-disable-next-line no-unused-vars
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

// eslint-disable-next-line no-unused-vars
const fetchPatientActiveDiagnosis = (userId) => Promise.resolve(
  {
    data: [
      {
        id_person: 123,
        id_care: 345,
        name: 'FRATTURA DELLA ROTULA',
        id_disease: 1396,
        chronic: false,
        note: 'Frattura pluriframmentata composta accompagnata da artrite reumatoide.',
        body_impacted: 'Ginocchio sinistro',
        from: moment().subtract(14, 'days').format(),
      },
      {
        id_person: 123,
        id_care: 345,
        name: 'DIABETE MELLITO',
        id_disease: 839,
        chronic: true,
        from: moment().subtract(400, 'days').format(),
      },
      {
        id_person: 123,
        id_care: 345,
        name: 'CELIACHIA',
        id_disease: 71,
        chronic: true,
        from: moment().subtract(3000, 'days').format(),
      },
    ],
  },
);

// eslint-disable-next-line no-unused-vars
const fetchUserPrescriptions = (userId) => Promise.resolve({
  data:
    [
      {
        id_person: 123,
        name: 'ACARPHAGE*40 CPR 100 MG',
        medicine: {
          id: 2,
          equivalent: 'ACARBOSIO 100MG 40 UNITÁ USO ORALE',
          active_principle: 'ACARBOSIO',
          name: 'ACARPHAGE*40 CPR 100 MG',
          aic_code: 'MERCK SERONO SPA',
          code: '38835144',
          category: 'H1A',
        },
        disease: {
          name: 'DIABETE MELLITO',
          id_disease: 839,
        },
        dosage: '100 MG',
        daily_frequency: '3 volte al giorno dopo i pasti',
        from: moment()
          .subtract(398, 'days')
          .format(),
      },
    ],
});

// eslint-disable-next-line no-unused-vars
const fetchUserContacts = (userId) => new Promise((resolve, reject) => {
  db.contact.where({ id_person: userId })
    .toArray((data) => {
      if (!data) {
        reject(new Error('contact fetching error'));
      } else {
        resolve({
          data,
        });
      }
    });
});

// eslint-disable-next-line no-unused-vars
const fetchUserAllergies = (userId) => Promise.resolve(
  {
    data: [
      {
        id_person: 1,
        id_care: 1,
        name: '',
        id_allergy: 24,
        allergy: {
          id: 24,
          name: 'PIOPPO',
          category: 'ALBERI',
        },
        severity: 'MEDIA',
        intolerance: 'N',
        from: '2019-04-02',
      },
    ],
  },
);

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
          id: user,
          type: user.type,
        });
      }
    });
});

export default {
  fetchUserExamsRegister,
  fetchUserExamsCategories,
  fetchPatientProfile,
  fetchPatientActiveDiagnosis,
  fetchUserPrescriptions,
  fetchUserContacts,
  fetchUserAllergies,
  login,
};
