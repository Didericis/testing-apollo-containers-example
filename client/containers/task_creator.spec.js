import React from 'react';
import Faker from 'faker';
import { mount } from 'enzyme';
import { Factory } from 'rosie';
import { expect } from 'chai';
import waitUntil from 'wait-until-promise';
import _ from 'lodash';

import * as TaskActions from 'dux/tasks';
import TestProvider from 'test_provider';
import { container } from 'containers/task_creator';

const Component = () => null;
const Container = container(Component);

describe('<TaskCreatorContainer />', () => {
  def('storeState', {});
  def('graphqlMocks', {});
  def('container', () => mount(
    <TestProvider storeState={$storeState} graphqlMocks={$graphqlMocks}>
      <Container/>
    </TestProvider>
  ));
  def('testProvider', () => $container.instance());
  subject('getProps', () => () => $container.update().find(Component).props());

  context('when there is a parentId in the store', () => {
    def('parentId', () => Faker.random.uuid());
    def('storeState', () => ({ tasks: { parentId: $parentId } }));

    context('and the parentTask query will succeed', () => {
      def('resolvedTask', () => Factory.build('task', { id: $parentId }));
      def('taskQuery', () => sandbox.stub());
      def('graphqlMocks', () => ({
        Query: () => ({
          task: $taskQuery.returns($resolvedTask),
        })
      }));
      beforeEach(() => waitUntil(() => !$getProps().loading, 100, 10));

      it('sets the parentTask prop to the query result', () => {
        expect($getProps().parentTask).to.include(_.pick($resolvedTask, ['id', 'name'])); 
      });

      context('and the onClickClearParent prop is called', () => {
        beforeEach(() => { 
          $getProps().onClickClearParent() 
          return waitUntil(() => !$getProps().loading, 100, 10);
        });

        it('dispatches the clearParentId action', () => {
          expect($testProvider.getLastAction()).to.eql(TaskActions.clearParentId());
        });

        it('clears the parentTask prop', () => {
          expect($getProps().parentTask).to.be.undefined;
        });
      });
    });
  });

  context('when the createTask mutation will succeed', () => {
    def('createTaskMutation', () => sandbox.stub());
    def('createdTask', () => Factory.build('task', $onClickCreateArgs));
    def('mutationResult', () => ({ task: $createdTask }));
    def('graphqlMocks', () => ({
      Mutation: () => ({
        createTask: $createTaskMutation.returns($mutationResult),
      })
    }));

    context('and the onClickCreate prop is called with a name arg', () => {
      def('onClickCreateArgs', { name: 'Blah' });
      beforeEach(() => $getProps().onClickCreate($onClickCreateArgs));

      it('calls the createTask mutation with the correct args', () => {
        expect($createTaskMutation.args[0][1].input.task).to.eql($onClickCreateArgs);
      });
    });
  });
});
