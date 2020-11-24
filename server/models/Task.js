import { Model } from 'objection';
import Label from './Label';
import Status from './Status';
import User from './User';

export default class Task extends Model {
  static get tableName() {
    return 'tasks';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'statusId', 'creatorId'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1 },
        description: { type: 'string' },
        statusId: { type: 'integer' },
        creatorId: { type: 'integer' },
        executorId: { type: 'integer' },
      },
    };
  }

  static relationMappings = {
    status: {
      relation: Model.HasOneRelation,
      modelClass: Status,
      join: {
        from: 'tasks.status_id',
        to: 'statuses.id',
      },
    },
    creator: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'tasks.creator_id',
        to: 'users.id',
      },
    },
    executor: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'tasks.executor_id',
        to: 'users.id',
      },
    },
    labels: {
      relation: Model.ManyToManyRelation,
      modelClass: Label,
      join: {
        from: 'tasks.id',
        through: {
          from: 'tasks_labels.taskId',
          to: 'tasks_labels.labelId',
        },
        to: 'labels.id',
      },
    },
  }

  static modifiers = {
    findByStatus(query, { statusId }) {
      if (!statusId) {
        return query;
      }
      return query.where({ statusId });
    },
    // findByLabel(query, labelId, app) {
    //   query.whereIn('tasks.id', app.objection
    //     .knex('tasks_labels')
    //     .select('task_id')
    //     .where('label_id', labelId));
    // },
    findByLabel(query, { labelId }) {
      if (!labelId) {
        return query;
      }
      return query.where({ labelId });
    },
    findByExecutor(query, { executorId }) {
      if (!executorId) {
        return query;
      }
      return query.where({ executorId });
    },
    findByCreator(query, { creatorId }) {
      if (!creatorId) {
        return query;
      }
      return query.where({ creatorId });
    },
  }
}
