import { Model } from 'objection';
// import objectionUnique from 'objection-unique';

// const unique = objectionUnique({ fields: ['email'] });

export default class User extends (Model) {
  static get tableName() {
    return 'users';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      requred: ['email', 'name'],
      properties: {
        id: { type: 'integer' },
        email: { type: 'string', format: 'email' },
        name: { type: 'string' },
      },
    };
  }
}
