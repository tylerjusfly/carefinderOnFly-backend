import { Parser } from 'json2csv';

export const ParseToCSV = async (data) => {
  const json2csvParser = new Parser({
    header: true,
    quote: '"',
    delimiter: ',',
  });

  return json2csvParser.parse(data);
};
