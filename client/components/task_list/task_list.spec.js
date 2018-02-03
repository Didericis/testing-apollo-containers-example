import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { Factory } from 'rosie';

import TaskList from 'components/task_list';
import Task from 'containers/task';

describe('<TaskList />', () => {
  def('tasksProp', () => Factory.buildList('task'));
  def('props', () => ({
    tasks: $tasksProp,
  }));
  subject('wrapper', () => shallow(<TaskList {...$props} />));

  context('when there are no tasks', () => {
    def('tasksProp', undefined);

    it('does not throw an error', () => {
      expect(() => $wrapper).not.to.throw();
    });
  });

  context('when there are tasks', () => {
    def('tasksProp', () => Factory.buildList('task', 3));

    it('renders a task container for each task in the list', () => {
      $tasksProp.forEach(task => {
        expect($wrapper.find(Task).find({ task }).exists()).to.be.true;
      });
    });
  });
});
