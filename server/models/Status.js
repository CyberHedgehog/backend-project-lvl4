import { Model } from 'objection';
import objectionUnique from 'objection-unique';
import path from 'path';

const unique = objectionUnique({ fields: ['name'] });

export default class Status extends unique(Model) {
  static get tableName() {
    return 'statuses';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      requred: ['name'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1 },
      },
    };
  }

  static relationMappings = {
    tasks: {
      relation: Model.HasManyRelation,
      modelClass: path.join(__dirname, 'Task'),
      join: {
        from: 'statuses.id',
        to: 'tasks.status_id',
      },
    },
  }
}
