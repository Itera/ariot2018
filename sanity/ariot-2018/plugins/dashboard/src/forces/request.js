import SanityClient from '@sanity/client';

const connectToSanity = () =>
  SanityClient({
    projectId: "k06fkcmv",
    dataset: "production",
    useCdn: true,
  });

export const fetchPersons = async () => {
  const client = connectToSanity();
  const query = "*[_type == 'person']";
  const requestParams = { type: 'person' };
  return await client.fetch(query, requestParams);
};

export const fetchSummary = async () => {
  const client = connectToSanity();
  const query = `
{
  'users': count(*[_type == 'person']),
  'tempPreferences': *[_type == 'person'].tempPreferences,
  'tablePreferencesStanding': *[_type == 'person'].tablePreferences.heightStanding,
  'tablePreferencesSitting': *[_type == 'person'].tablePreferences.heightSitting
}
  `;
  const requestParams = { type: 'person' };
  return await client.fetch(query, requestParams);
};

export const fetchHours = async () => {
  const client = connectToSanity();
  const query = "*[_type == 'person']{hours}";
  const requestParams = { type: 'person' };
  return await client.fetch(query, requestParams);
};
