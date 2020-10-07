import faker from 'faker';

export default () => {
  const fakerUser = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
  return fakerUser;
};
