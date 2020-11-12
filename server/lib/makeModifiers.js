import _ from 'lodash';

export default (filterObject, app) => {
  const keys = _.keys(filterObject);
  const modifiers = keys.reduce((acc, key) => {
    if (filterObject[key] === 'null') {
      return acc;
    }
    let modifier;
    if (key === 'labelId') {
      modifier = (query) => query.whereIn('tasks.id', app.objection
        .knex('tasks_labels')
        .select('task_id')
        .where('label_id', filterObject[key]));
    } else {
      modifier = (query) => query.where(key, '=', filterObject[key]);
    }
    return [...acc, modifier];
  }, []);
  return modifiers;
};
