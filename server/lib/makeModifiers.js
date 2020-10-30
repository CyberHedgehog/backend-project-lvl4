import _ from 'lodash';

export default (filterObject) => {
  const keys = _.keys(filterObject);
  console.log(filterObject);
  const modifiers = keys.reduce((acc, key) => {
    if (filterObject[key] === 'null') {
      return acc;
    }
    let modifier;
    if (key === 'labelId') {
      modifier = (query) => query.where('tasks_labels.label_id', '=', filterObject.labelId);
    } else {
      modifier = (query) => query.where(key, '=', filterObject[key]);
    }
    return [...acc, modifier];
  }, []);
  return modifiers;
};
