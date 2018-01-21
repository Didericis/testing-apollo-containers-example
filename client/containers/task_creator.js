import { compose, mapProps } from 'recompose';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { connect } from 'react-redux';

import * as TaskActions from 'dux/tasks'; 
import TaskCreator from 'components/task_creator';
import { TaskListQuery } from 'containers/task_list';
import { TaskQuery } from 'containers/task';

// adds the 'clearParentTask' prop 
const withOnClickClearParent = connect(
  null,
  (dispatch) => ({
    onClickClearParent: () => dispatch(TaskActions.clearParentId())
  }),
);

export const ParentTaskQuery = gql`
query TaskCreatorQuery($input: TaskQueryInput!) {
  task(input: $input) { id name }
}`;

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
  mapProps(({ ...props, parentId }) => ({ ...props })),
);

export const CreateTaskMutation = gql`
mutation CreateTaskMutation($input: CreateTaskMutationInput!) {
  createTask(input: $input) {
    task { id name parentId }
  }
}`;

// adds the 'onClickCreate' prop 
const withOnClickCreate = graphql(
  CreateTaskMutation,
  {
    props: ({ mutate, ownProps: { parentTask } }) => ({
      onClickCreate: (task) => mutate({
        refetchQueries: [{ query: TaskListQuery }].concat(parentTask ? [{ 
          query: TaskQuery, 
          variables: { input: { id: parentTask.id } }
        }] : []),
        variables: { input: { task } }
      })
    })
  }
);

export const container = compose(
  withOnClickClearParent,
  withParentTask,
  withOnClickCreate,
);

export default container(TaskCreator);
