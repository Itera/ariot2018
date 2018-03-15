import format from "date-fns/format";

export default {
  name: 'timeRange',
  title: 'Time range',
  type: 'object',
  fields: [
    {
      name: 'from',
      title: 'From',
      type: 'datetime',
    },
    {
      name: 'to',
      title: 'To',
      type: 'datetime',
    },
  ],
  preview: {
    select: {
      from: 'from',
      to: 'to',
      type: '_type',
    },
    prepare(selection) {
      return {
        title: `From: ${format(selection.from, 'DD.MM.YY, HH:mm')} | To: ${format(selection.to, 'DD.MM.YY, HH:mm')}`,
        subtitle: `Type: ${selection.type}`,
      }
    }
  },
}
