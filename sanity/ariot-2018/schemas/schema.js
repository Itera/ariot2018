import createSchema from 'part:@sanity/base/schema-creator'
import schemaTypes from 'all:part:@sanity/base/schema-type'
import timeRange from "./types/timeRange";
import person from "./documents/person";
import tableSettings from "./types/tableSettings";

const types = [
  tableSettings,
  timeRange,
];

const documents = [
  person,
];

export default createSchema({
  name: 'default',
  types: schemaTypes.concat([
    ...types,
    ...documents,
  ]),
});
