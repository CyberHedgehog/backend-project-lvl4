import { Model } from 'objection';
import objectionUnique from 'objection-unique';

const unique = objectionUnique({ fields: ['name'] });

export default class Label extends unique(Model) {
  static get tableName() {
    return 'labels';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1 },
      },
    };
  }

  // static relationMappings = {
  //   tasks: {
  //     relation: Model.ManyToManyRelation,
  //     modelClass: 'Task',
  //     join: {
  //       from: 'labels.id',
  //       through: {
  //         from: 'tasks_labels.labelId',
  //         to: 'tasks_labels.taskId',
  //       },
  //       to: 'tasks.id',
  //     },
  //   },
  // s
}
