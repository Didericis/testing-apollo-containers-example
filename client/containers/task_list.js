import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import TaskList from 'components/task_list';

export const TaskListQuery = gql`query TaskListQuery { tasks { id } }`;

// adds the 'tasks' prop 
const withTasks = graphql(
  TaskListQuery,
  {
    props: ({ data: { tasks } }) => ({ tasks })
  }
);

export const container = withTasks;

export default container(TaskList);
