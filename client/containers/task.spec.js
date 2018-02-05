import React from 'react';
import Faker from 'faker';
import { mount } from 'enzyme';
import { Factory } from 'rosie';
import { expect } from 'chai';
import waitUntil from 'wait-until-promise';
import _ from 'lodash';

import * as TaskActions from 'dux/tasks';
import TestProvider from 'test_provider';
import { container } from 'containers/task';

const Component = () => null;
const Container = container(Component);

describe('<TaskContainer />', () => {
  def('storeState', {});
  def('graphqlMocks', {});
  def('inputTaskProp', () => ({ id: Faker.random.uuid() })); 
  def('inputProps', () => ({
    task: $inputTaskProp,
  }));
  def('container', () => mount(
    <TestProvider storeState={$storeState} graphqlMocks={$graphqlMocks}>
      <Container {...$inputProps} />
    </TestProvider>
  ));
  def('testProvider', () => $container.instance());
  subject('getProps', () => () => $container.update().find(Component).props());

  context('when the task query will succeed', () => {
    def('resolvedTask', () => Factory.build('task', { id: $inputTaskProp.id }));
    def('taskQuery', () => sandbox.stub());
    def('graphqlMocks', () => ({
      Query: () => ({
        task: $taskQuery.returns($resolvedTask),
      })
    }));
    beforeEach(() => waitUntil(() => !$getProps().loading, 100, 10));

    it('adds the subtasks to the tasks prop', () => {
      expect($taskQuery.called).to.be.true;
      expect($getProps().task).to.include(_.pick($resolvedTask, ['id', 'tasks'])); 
    });
  });

  context('when the parentId in the store is the same as the task id', () => {
    def('storeState', () => ({ tasks: { parentId: $inputTaskProp.id } }));

    it('sets the selected prop to true', () => {
      expect($getProps().selected).to.be.true;
    });

    context('and the onClick prop is called', () => {
      def('onClickArg', () => $inputTaskProp);
      beforeEach(() => { $getProps().onClick($onClickArg); });

      it('dispatches the clearParentId action', () => {
        expect($testProvider.getLastAction()).to.eql(TaskActions.clearParentId());
      });
    });
  });

  context('when the parentId in the store is not the same as the task id', () => {
    def('storeState', () => ({ tasks: { parentId: null } }));

    it('sets the selected prop to false', () => {
      expect($getProps().selected).to.be.false;
    });

    context('and the onClick prop is called', () => {
      def('onClickArg', () => $inputTaskProp);
      beforeEach(() => { $getProps().onClick($onClickArg); });

      it('dispatches the the setParentId action', () => {
        expect($testProvider.getLastAction()).to.eql(TaskActions.setParentId($onClickArg.id));
      });
    });
  });

  context('when the removeTask mutation will succeed', () => {
    def('removeTaskMutation', () => sandbox.stub());
    def('mutationResult', () => ({ success: true }));
    def('graphqlMocks', () => ({
      Mutation: () => ({
        removeTask: $removeTaskMutation.returns($mutationResult),
      })
    }));

    context('and the onClickRemove prop is called', () => {
      beforeEach(() => $getProps().onClickRemove());

      it('calls the createTask mutation with the task prop id', () => {
        expect($removeTaskMutation.args[0][1].input.id).to.eql($inputTaskProp.id);
      });
    });
  });
});
