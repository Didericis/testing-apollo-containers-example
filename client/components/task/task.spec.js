import React from 'react';
import { Factory } from 'rosie';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import Task from 'components/task';
import TaskContainer from 'containers/task';

import ('components/task_list').then(_TaskList => {
  const TaskList = _TaskList.default;

  describe('<Task />', () => {
    def('onClickProp', () => sandbox.stub());
    def('onClickRemoveProp', () => sandbox.stub());
    def('subtasks', () => null);
    def('props', () => ({
      onClick: $onClickProp,
      onClickRemove: $onClickRemoveProp,
      task: $taskProp,
    }));
    subject('wrapper', () => shallow(<Task {...$props} />));

    context ('when there is no task', () => {
      def('taskProp', undefined);

      it('does not throw an error', () => {
        expect(() => $wrapper).not.to.throw();
      });
    });

    context('when there is a task', () => {
      def('taskProp', () => Factory.build('task', { tasks: $subtasks }));

      it('displays the task name', () => {
        expect($wrapper.text()).to.include($taskProp.name);
      });

      context('with subtasks', () => {
        def('subtasks', () => Factory.buildList('task', 3));

        it('renders a subtasks list for the tasks', () => {
          expect($wrapper.find(TaskList).find({ tasks: $subtasks }).exists()).to.be.true;
        });
      });

      context('with no subtasks', () => {
        def('subtasks', null);

        it('does not render the task list', () => {
          expect($wrapper.find(TaskList).exists()).to.be.false;
        });
      });
    });
  });
});
