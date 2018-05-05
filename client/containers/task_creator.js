import { compose, mapProps } from 'recompose';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { connect } from 'react-redux';

import * as TaskActions from 'dux/tasks'; 
import TaskCreator from 'components/task_creator';
import CreateTaskMutation from 'mutations/task_creator/create_task.graphql';
import TaskQuery from 'queries/task/task.graphql';
import TasksQuery from 'queries/task_list/tasks.graphql';
import ParentTaskQuery from 'queries/task_creator/parent_task.graphql';

// adds the 'onClickClearParentTask' prop 
const withOnClickClearParent = connect(
  null,
  (dispatch) => ({
    onClickClearParent: () => dispatch(TaskActions.clearParentId()),
  }),
);

// adds the 'parentTask' prop 
const withParentTask = compose(
  connect(({ tasks: { parentId } }) => ({ parentId })),
  graphql(
    ParentTaskQuery,
    { 
      options: ({ parentId }) => ({
        variables: { input: { id: parentId }}, 
        skip: !parentId
      }),
      props: ({ data }) => ({ parentTask: data.task })
    }
  ),
  // we don't want the parentId prop to get passed down
  mapProps(({ ...props, parentTask, parentId }) => ({ 
    ...props,
    parentTask: parentId ? parentTask : undefined,
  })),
);

// adds the 'onClickCreate' prop 
const withOnClickCreate = graphql(
  CreateTaskMutation,
  {
    props: ({ mutate, ownProps: { parentTask } }) => ({
      onClickCreate: (task) => mutate({
        refetchQueries: [{ query: TasksQuery }].concat(parentTask ? [{ 
          query: TaskQuery, 
          variables: { input: { id: parentTask.id } }
        }] : []),
        variables: { input: { task } }
      })
    })
  }
);

// hoc for our container (exported for testing)
export const container = compose(
  withOnClickClearParent,
  withParentTask,
  withOnClickCreate,
);

export default container(TaskCreator);
