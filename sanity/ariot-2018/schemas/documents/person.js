import icon from 'react-icons/lib/md/person'

export default {
  name: 'person',
  title: 'Person',
  type: 'document',
  icon,
  fields: [
    {
      name: 'id',
      title: 'Card ID',
      type: 'string',
    },
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Please use "Firstname Lastname" format',
    },
    {
      name: 'tablePreferences',
      title: 'Table Preferences',
      type: 'tableSettings',
    },
    {
      name: 'tempPreferences',
      title: 'Temperature Preferences (Celsius)',
      type: 'number',
    },
    {
      title: 'Hours',
      name: 'hours',
      type: 'array',
      of: [{
        type: 'timeRange',
      }],
    },
  ],
  preview: {
    select: {title: 'name', media: 'image'}
  }
}
