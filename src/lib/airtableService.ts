import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID as string,
);

export const insertRecord = async (tableName: string, fields: any) => {
  try {
    const record = await base(tableName).create([{ fields }]);

    return record;
  } catch (error) {
    console.error('❌ Error al insertar en Airtable:', error);
  }
};
