import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import TaskList from 'components/task_list';
import styles from './task.css';

export default class Task extends Component {
  static defaultProps = {
    task: {}
  }

  static propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    onClickRemove: PropTypes.func.isRequired,
    selected: PropTypes.bool,
    task: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    })
  }

  onClick = () => {
    const { onClick, task } = this.props;
    onClick(task);
  }

  onClickRemove = (e) => {
    const { onClickRemove, task } = this.props;
    e.stopPropagation();
    onClickRemove(task);
  }

  render() {
    const { className, selected, task } = this.props;

    return (
      <div className={classNames(styles.main, className)}>
        <div onClick={this.onClick} className={classNames(styles.task, { [styles.selected]: selected })}>
          <h1>{task.name}</h1>
          <button onClick={this.onClickRemove}>x</button>
        </div>
        <div className={styles.subtasks} >
          <TaskList tasks={task.tasks || []}/>
        </div>
      </div>
    );
  }
}

