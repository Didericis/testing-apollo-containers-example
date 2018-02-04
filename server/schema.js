const { makeExecutableSchema } = require('graphql-tools');
const Faker = require('faker');
const _ = require('lodash');

const typeDefs = `
  # --- Main Types ---

  type Task {
    id: ID!
    name: String!
    parentId: String
    tasks: [Task]
  }

  # --- Main Inputs ---

  input TaskInput {
    name: String!
    parentId: String
  }

  # --- Query Inputs ---

  input TaskQueryInput {
    id: String
  }

  # --- Query Payloads ---

  # --- Query Extension ---

  type Query {
    task(input: TaskQueryInput!): Task,
    tasks: [Task],
  }

  # --- Mutation Inputs ---

  input CreateTaskMutationInput {
    task: TaskInput!
  }

  input RemoveTaskMutationInput {
    id: String
  }

  # --- Mutation Payloads ---

  type CreateTaskMutationPayload {
    task: Task
  }

  type RemoveTaskMutationPayload {
    success: Boolean
  }

  # --- Extend Mutation ---

  type Mutation {
    createTask(input: CreateTaskMutationInput!): CreateTaskMutationPayload
    removeTask(input: RemoveTaskMutationInput!): RemoveTaskMutationPayload
  }
`;

let tasks = _.times(3, () => ({ 
  id: Faker.random.uuid(), 
  name: Faker.lorem.sentence(),
}));

const resolvers = {
  Query: {
    task: (_obj, { input }) => _.find(tasks, ({ id }) => id === input.id),
    tasks: () => tasks.filter((task) => !task.parentId),
  },
  Mutation: {
    createTask: (_obj, { input: { task: { name, parentId } } }) => {
      const task = { id: Faker.random.uuid(), name, parentId };
      tasks.push(task);
      tasks.forEach(_task => {
        if (_task.id === parentId) {
          _task.tasks = _task.tasks || [],
          _task.tasks.push(task)
        }
      });
      return { task };
    },
    removeTask: (_obj, { input }) => {
      task = _.remove(tasks, ({ id }) => id === input.id)[0];
      if (!task) return { success: false };
      if (task.parentId) {
        const parent = _.find(tasks, ({ id }) => id === task.parentId);
        _.remove(parent.tasks, ({ id }) => id === input.id);
      }
      return { success: true };
    },
  }
};

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers,
});
