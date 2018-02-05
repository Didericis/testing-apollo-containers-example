import React from 'react';
import Faker from 'faker';
import { mount } from 'enzyme';
import { Factory } from 'rosie';
import { expect } from 'chai';
import waitUntil from 'wait-until-promise';
import _ from 'lodash';

import TestProvider from 'test_provider';
import { container } from 'containers/task_list';

const Component = () => null;
const Container = container(Component);

describe('<TaskListContainer />', () => {
  def('storeState', {});
  def('graphqlMocks', {});
  def('container', () => mount(
    <TestProvider storeState={$storeState} graphqlMocks={$graphqlMocks}>
      <Container/>
    </TestProvider>
  ));
  def('testProvider', () => $container.instance());
  subject('getProps', () => () => $container.update().find(Component).props());

  context('when the tasks query will succeed', () => {
    def('tasks', () => Factory.buildList('task', 3, { parentId: null }));
    def('tasksQuery', () => sandbox.stub());
    def('graphqlMocks', () => ({
      Query: () => ({
        tasks: $tasksQuery.returns($tasks),
      })
    }));
    beforeEach(() => waitUntil(() => !$getProps().loading, 100, 10));

    it('gets the name, id, and parentId of each task for the tasks prop', () => {
      expect($tasksQuery.called).to.be.true;
      $getProps().tasks.forEach((task, i) => {
        expect(_.omit(task, '__typename')).to.eql(_.pick($tasks[i], ['id', 'name', 'parentId']));
      });
    });
  });
});
