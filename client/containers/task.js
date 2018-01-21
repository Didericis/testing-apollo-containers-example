import { connect } from 'react-redux';
import { compose, mapProps } from 'recompose';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import _ from 'lodash';

import Task from 'components/task';
import * as TaskActions from 'dux/tasks';
import { TaskListQuery } from 'containers/task_list';

// adds the 'selected' prop
const withSelected = connect(
  ({ tasks: { parentId } }, { taskId }) => ({ selected: taskId === parentId }),
);

export const TaskQuery = gql`
query TaskQuery($input: TaskQueryInput!) {
  task(input: $input) { id name parentId tasks { id } }
}`;

// adds the 'task' prop 
const withTask = graphql(
  TaskQuery,
  { 
    options: ({ taskId }) => ({
      variables: { input: { id: taskId }}, 
    }),
    props: ({ data }) => ({ task: data.task })
  }
);

export const RemoveTaskMutation = gql`
mutation removeTask($input: RemoveTaskMutationInput!) {
  removeTask(input: $input) {
    success
  }
}`;

// adds the 'onClickRemove' prop
const withOnClickRemove = compose(
  connect(
    null,
    (dispatch) => ({ clearParentId: () => dispatch(TaskActions.clearParentId()) }),
  ),
  graphql(
    RemoveTaskMutation,
    { 
      props: ({ mutate, ownProps: { taskId, clearParentId } }) => ({ 
        onClickRemove: ({ parentId }) => mutate({
          refetchQueries: [
            { query: TaskListQuery },
            { query: TaskQuery, variables: { input: { id: parentId } } }
          ],
          variables: { input: { id: taskId }}, 
        }).then(clearParentId)
      })
    }
  ),
  mapProps(props => _.omit(props, 'clearParentId'))
);

// adds the 'onClick' prop
const withOnClick = connect(
  null,
  (dispatch, { selected }) => ({
    onClick: (task) => selected ? 
      dispatch(TaskActions.clearParentId()) : 
      dispatch(TaskActions.setParentId(task.id)),
  })
);

export const container = compose(
  withSelected,
  withOnClick,
  withOnClickRemove,
  withTask,
);

export default container(Task);
