import React from 'react';

import TaskList from 'containers/task_list';
import TaskCreator from 'containers/task_creator';
import styles from './main.css';

export default () => (
  <div className={styles.main}>
    <TaskList className={styles.tasks}/>
    <TaskCreator />
  </div>
)
