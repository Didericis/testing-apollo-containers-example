import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import Faker from 'faker';
import TaskCreator from './task_creator.jsx';

describe('<TaskCreator />', () => {
  def('onClickClearParent', () => sandbox.stub());
  def('onClickCreate', () => sandbox.stub());
  def('parentTask', undefined);
  def('props', () => ({
    onClickClearParent: $onClickClearParent,
    onClickCreate: $onClickCreate,
    parentTask: $parentTask,
  }));
  subject('wrapper', () => shallow(
    <TaskCreator {...$props}></TaskCreator>
  ));

  context('when there is a parent task', () => {
    def('parentTask', () => ({ 
      id: Faker.random.uuid(),
      name: 'Parent Task' 
    }));

    it('displays the parent task name', () => {
      const text = $wrapper.find({ name: 'parent-task' }).text();
      expect(text).to.include($parentTask.name);
    });

    context('and the clear parent button is clicked', () => {
      beforeEach(() => {
        $wrapper.find({ name: 'clear-parent-task-button' }).simulate('click');
      });

      it('calls the onClickClearParent prop', () => {
        expect($onClickClearParent.called).to.be.true;
      });
    });

    context('and a new task is entered', () => {
      def('name', 'New Task');

      beforeEach(() => {
        $wrapper.find({ name: 'new-task' }).find('input')
          .simulate('change', { target: { value: $name } });
        $wrapper.find({ name: 'new-task' }).find('button')
          .simulate('click');
      });

      it('creates a new task with the parent task id', () => {
        expect($onClickCreate.calledWith({ 
          parentId: $parentTask.id,
          name: $name 
        })).to.be.true;
      });
    });
  });

  context('when there is no parent task', () => {
    def('parentTask', undefined);

    it('does not display the parent task', () => {
      expect($wrapper.find('.parent-task').exists()).to.be.false;
    });

    context('and a new task is entered', () => {
      def('name', 'New task');

      beforeEach(() => {
        $wrapper.find({ name: 'new-task' }).find('input')
          .simulate('change', { target: { value: $name } });
        $wrapper.find({ name: 'new-task' }).find('button')
          .simulate('click');
      });

      it('creates a new task without a parent task id', () => {
        expect($onClickCreate.calledWith({ name: $name })).to.be.true;
      });
    });
  });
});
