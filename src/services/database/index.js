import Dexie from 'dexie';
import { version, defs } from '@/assets/db_def.json';
import dbData from '@/assets/db_data.json';

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
  records.forEach((r, i) => {
    const table = r[0];
    const schema = schemas[table];
    if (!schema) {
      throw new Error(`${table} has no schema`);
    }
    const record = buildObject(schema, r);
    db[table].add(record);
    console.log(`db loaded ${Math.floor((i / records.length) * 100.0)}%`);
  });
  db.metas.add({ key: 'version', val: version });
  console.log('db population complete');
};

db.version(version)
  .stores(stores);

const init = () => {
  console.log('init');
  return new Promise((resolve) => {
    if (!db.metas) {
      setTimeout(() => {
        populateDB();
        resolve();
      });
    } else {
      db.metas.get('version', (o) => {
        setTimeout(() => {
          if (!o || !o.val || o.val !== version) {
            populateDB();
          }
          resolve();
        });
      });
    }
  });
};

export default db;

export {
  init,
};
