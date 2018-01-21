const { makeExecutableSchema } = require('graphql-tools');
const Faker = require('faker');
const { Router }= require('express');
const graphqlHTTP = require('express-graphql');
const _ = require('lodash');

const typeDefs = `
  type Task {
    id: ID!
    name: String!
    parentId: String
    tasks: [Task]
  }

  input TaskQueryInput {
    id: String
  }

  type Query {
    task(input: TaskQueryInput!): Task,
    tasks: [Task],
  }

  input TaskInput {
    name: String!
    parentId: String
  }

  input CreateTaskMutationInput {
    task: TaskInput!
  }

  type CreateTaskMutationPayload {
    task: Task
  }

  input RemoveTaskMutationInput {
    id: String
  }

  type RemoveTaskMutationPayload {
    success: Boolean
  }

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

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

module.exports = graphqlHTTP({
  schema,
  graphiql: true
});
