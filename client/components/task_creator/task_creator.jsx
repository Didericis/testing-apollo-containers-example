import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './task_creator.css';

export default class TaskCreator extends Component {
  static propTypes = {
    onClickClearParent: PropTypes.func.isRequired,
    onClickCreate: PropTypes.func.isRequired,
    parentTask: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    }),
  }

  state = { name: '' }

  onClickCreate = () => {
    const { name } = this.state;
    const { onClickCreate, parentTask } = this.props;
    const newTask = { name };
    if (parentTask) newTask.parentId = parentTask.id;
    onClickCreate(newTask);
  }

  onClickClearParent = () => {
    const { onClickClearParent, parentTask } = this.props;
    onClickClearParent(parentTask);
  }

  onChangeNewTask = (e) => {
    this.setState({ name: e.target.value });
  }

  render() {
    const { className, parentTask } = this.props;
    return (
      <div className={classNames(styles.main, className)}>
        { parentTask && 
          <div className={styles.parentTask} name='parent-task'>
            <span>PARENT: {parentTask.name}</span>
            <button name='clear-parent-task-button' onClick={this.onClickClearParent}>
              Clear
            </button>
          </div>
        }
        <div className={styles.newTask} name='new-task'>
          <input onChange={this.onChangeNewTask} />
          <button name='create-task-button' onClick={this.onClickCreate}>
            Create
          </button>
        </div>
      </div>
    );
  }
}
