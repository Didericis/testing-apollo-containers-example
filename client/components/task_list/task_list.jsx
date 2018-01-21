import React, { Component } from 'react';
import classNames from 'classnames';

import Task from 'containers/task';
import styles from './task_list.css';

export default class TaskList extends Component {
  static defaultProps = {
    tasks: [],
  }

  render() {
    const { className, tasks } = this.props;
    return (
      <div className={classNames(styles.main, className)}>
        {tasks.map(task => <Task key={task.id} taskId={task.id} className={styles.task}/>)} 
      </div>
    );
  }
}
