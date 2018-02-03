import { graphql } from 'react-apollo';

import TaskList from 'components/task_list';
import TasksQuery from 'queries/task_list/tasks.graphql';

// adds the 'tasks' prop 
const withTasks = graphql(
  TasksQuery,
  {
    props: ({ data: { tasks } }) => ({ tasks })
  }
);

export const container = withTasks;

export default container(TaskList);
