
export default {
  name: 'tableSettings',
  title: 'Table Settings',
  type: 'object',
  fields: [
    {
      name: 'heightSitting',
      title: 'Sitting height (cm)',
      type: 'number',
      validation: Rule => Rule.required().min(77).max(123)
    },
    {
      name: 'heightStanding',
      title: 'Standing height (cm)',
      type: 'number',
      validation: Rule => Rule.required().min(77).max(123)
    },
  ],
}
