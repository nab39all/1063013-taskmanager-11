import {createBoardTemplate} from './components/board.js';
import {createFilterTemplate} from './components/filter.js';
import {createLoadMoreButtonTemplate} from './components/load-more-button';
import {createSiteMenuTemplate} from './components/site-menu';
import {createTaskEditTemplate} from './components/task-edit';
import {createTaskTemplate} from './components/task';

import {generateTasks} from './mock/task';

import {render, RenderPosition} from './utils';

const TASK_COUNT = 22;
const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;
const tasks = generateTasks(TASK_COUNT);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const filters = [{
  name: `all`,
  count: TASK_COUNT
}, {
  name: `overdue`,
  count: tasks.reduce((count, task) => new Date() < task.dueDate ? count + 1 : count, 0)
}, {
  name: `today`,
  count: tasks.reduce((count, task) => task.dueDate === null ? count + 1 : count, 0)
}, {
  name: `favorites`,
  count: tasks.reduce((count, task) => task.isFavorite ? count + 1 : count, 0)
}, {
  name: `repeating`,
  count: tasks.reduce((count, task) => task.repeatingDays[`mo`] === false ? count + 1 : count, 0)
}, {
  name: `archive`,
  count: tasks.reduce((count, task) => task.isArchive ? count + 1 : count, 0)
}];

render(siteMainElement, createFilterTemplate(filters), `beforeend`);
render(siteHeaderElement, createSiteMenuTemplate(), `beforeend`);
render(siteMainElement, createBoardTemplate(), `beforeend`);

const taskListElement = siteMainElement.querySelector(`.board__tasks`);
const boardElement = siteMainElement.querySelector(`.board`);

render(taskListElement, createTaskEditTemplate(tasks[0]), `beforeend`);

let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

tasks.slice(1, showingTasksCount)
  .forEach((task) => render(taskListElement, createTaskTemplate(task), `beforeend`));
render(boardElement, createLoadMoreButtonTemplate(), `beforeend`);

const loadMoreButton = boardElement.querySelector(`.load-more`);

loadMoreButton.addEventListener(`click`, () => {
  const prevTasksCount = showingTasksCount;
  showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

  tasks.slice(prevTasksCount, showingTasksCount)
    .forEach((task) => render(taskListElement, createTaskTemplate(task), `beforeend`));

  if (showingTasksCount >= tasks.length) {
    loadMoreButton.remove();
  }
});

