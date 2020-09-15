import moment from 'moment';

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
const fetchPatientProfile = (userId) => Promise.resolve(
  {
    data: {
      id: 123,
      code: 'MRORSS88T12F205H',
      name: 'Mario',
      surname: 'Rossi',
      birthdate: '12/11/1988',
      sex: 'M',
      address: 'Piazza della Scala 2',
      city: 'Milano',
      zip_code: '20121',
      country: 'IT',
      country_mother: 'IT',
      country_father: 'IT',
      urgent_info: 'Allergia all\'Amoxicillina. Celiachia.',
      telephone_1: '+391234567890',
      telephone_2: '+390987654321',
      email: 'mario.rossi@email.com',
      particular_signs: 'Neo sul braccio destro',
      blood_group: '0-',
    },
  },
);

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
const fetchUserContacts = (userId) => Promise.resolve({
  data: [
    {
      id_contact: 1,
      id_person: 2,
      name: 'Maria Bianchi',
      typology: 'phone',
      contact: '+39 321 567 8904',
      note: 'Madre',
    },
    {
      id_contact: 3,
      id_person: 3,
      name: 'Luca Rossi',
      typology: 'phone',
      contact: '+39 456 678 9012',
      note: 'Padre',
    },
  ],
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
export default {
  fetchUserExamsRegister,
  fetchUserExamsCategories,
  fetchPatientProfile,
  fetchPatientActiveDiagnosis,
  fetchUserPrescriptions,
  fetchUserContacts,
  fetchUserAllergies,
};
