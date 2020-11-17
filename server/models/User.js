import { Model } from 'objection';
import objectionUnique from 'objection-unique';
import path from 'path';
import ecnrypt from '../lib/secure';

const unique = objectionUnique({ fields: ['email'] });

export default class User extends unique(Model) {
  static get tableName() {
    return 'users';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      requred: ['email', 'password'],
      properties: {
        id: { type: 'integer' },
        email: { type: 'string', format: 'email' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        password: { type: 'string', minLength: 5 },
      },
    };
  }

  fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  set password(value) {
    this.passwordDigest = ecnrypt(value);
  }

  static relationMappings = {
    assignedTasks: {
      relation: Model.HasManyRelation,
      modelClass: path.join(__dirname, 'Task'),
      join: {
        from: 'tasks.executor_id',
        to: 'users.id',
      },
    },
    createdTasks: {
      relation: Model.HasManyRelation,
      modelClass: path.join(__dirname, 'Task'),
      join: {
        from: 'tasks.creator_id',
        to: 'users.id',
      },
    },
  }
}
