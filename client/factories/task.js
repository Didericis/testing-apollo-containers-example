import Faker from 'faker';
import { Factory } from 'rosie';

Factory
  .define('task')
  .attrs({
    id: Faker.random.uuid,
    name: Faker.lorem.sentence,
    parentId: null,
    tasks: null,
  })

