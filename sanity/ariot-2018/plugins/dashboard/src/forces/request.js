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
  const query = "*[_type == 'person']";
  const requestParams = { type: 'person' };
  return await client.fetch(query, requestParams);
};
