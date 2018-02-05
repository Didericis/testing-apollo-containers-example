import { connect } from 'react-redux';
import { compose, mapProps } from 'recompose';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import _ from 'lodash';

import * as TaskActions from 'dux/tasks';
import Task from 'components/task';
import TasksQuery from 'queries/task_list/tasks.graphql';
import TaskQuery from 'queries/task/task.graphql'; 
import RemoveTaskMutation from 'mutations/task/remove_task.graphql';

// adds the 'selected' prop
const withSelected = connect(
  ({ tasks: { parentId } }, { task }) => ({ selected: task.id === parentId })
);

// adds the 'task' prop 
const withTask = graphql(
  TaskQuery,
  { 
    options: ({ task: { id } }) => ({
      variables: { input: { id }}, 
    }),
    props: ({ data, ownProps }) => ({ 
      loading: data.loadin,
      task: {
        ...ownProps.task,
        ...data.task,
      }
    })
  }
);

// adds the 'onClickRemove' prop
const withOnClickRemove = compose(
  connect(
    null,
    (dispatch) => ({ clearParentId: () => dispatch(TaskActions.clearParentId()) }),
  ),
  graphql(
    RemoveTaskMutation,
    { 
      props: ({ mutate, ownProps: { task, clearParentId } }) => ({ 
        onClickRemove: () => mutate({
          refetchQueries: [
            { query: TasksQuery },
            { query: TaskQuery, variables: { input: { id: task.parentId } } }
          ],
          variables: { input: { id: task.id }}, 
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

