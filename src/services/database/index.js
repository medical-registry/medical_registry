import Dexie from 'dexie';
import { version, defs } from '@/assets/db_def.json';
import dbData from '@/assets/db_data.json';
import { keyBy } from '@/services/util';

const stores = {};
const schemas = {};
defs.forEach((d) => {
  stores[d.table] = d.indexes;
  schemas[d.table] = d.columns;
});
const db = new Dexie('mr_local');

const buildObject = (columns, data) => {
  const result = {};
  for (let i = 0; i < columns.length; i += 1) {
    result[columns[i]] = data[i + 1];
  }
  return result;
};

const populateDB = () => {
  console.log('populating db db data');
  const { records } = dbData;
  const grouped = keyBy(records, 0, true);
  const promises = [];
  Object.entries(grouped).forEach(([table, entries]) => {
    const schema = schemas[table];
    const objs = entries.map((record) => buildObject(schema, record));
    promises.push(db[table].bulkAdd(objs));
  });
  return Promise.all(promises)
    .then(() => db.metas.add({ key: 'version', val: version }))
    .then(() => console.log('db population complete'));
};

db.version(version)
  .stores(stores);

const init = () => {
  console.log('init');
  if (!db.metas) {
    return populateDB();
  }
  return db.metas.get('version')
    .then((o) => {
      if (!o || o.val !== version) {
        return populateDB();
      }
      return Promise.resolve();
    });
};

export default db;

export {
  init,
};
