"use strict";

var listElement = document.querySelector('.list');
var itemElementList = listElement.children;

var ENTER_KEYCODE = 13;
var templateElement = document.getElementById('todoTemplate');
var templateContainer = 'content' in templateElement ? templateElement.content : templateElement;

// сформируем задачки
/**
 * @typedef {Object} TodoItem
 * @property {string} name - имя тудушки
 * @property {string} status - статус
 */

/**
 * @type {Array.<TodoItem>}
 */
var todoList = [
    {
        name: 'Позвонить в сервис',
        status: 'todo'
    },
    {
        name: 'Купить хлеб',
        status: 'done'
    },
    {
        name: 'Захватить мир',
        status: 'todo'
    },
    {
        name: 'Добавить тудушку в список',
        status: 'todo'
    }
];

// функция по генерации элементов
function addTodoFromTemplate(todo) {
    var newElement = templateContainer.querySelector('.task').cloneNode(true);
    newElement.querySelector('.task__name').textContent = todo.name;
    setTodoStatusClassName(newElement, todo.status === 'todo');

    return newElement;
}

function setTodoStatusClassName(todo, flag) {
    todo.classList.toggle('task_todo', flag);
    todo.classList.toggle('task_done', !flag);
}

function onListClick(event) {
    var target = event.target;
    var element;

    if (isStatusBtn(target)) {
        element = target.parentNode;
        changeTodoStatus(element);
    }

    if (isDeleteBtn(target)) {
        element = target.parentNode;
        deleteTodo(element);
    }
}

function isStatusBtn(target) {
    return target.classList.contains('task__status');
}

function isDeleteBtn(target) {
    return target.classList.contains('task__delete-button');
}

function deleteTodo(element) {
    listElement.removeChild(element);
}

function checkIfTodoAlreadyExists(todoName) {
    var todoElements = listElement.querySelectorAll('.task__name');
    var namesList = Array.prototype.map.call(todoElements, function (element) {
        return element.textContent;
    });
    return namesList.indexOf(todoName) > -1;
}

function createNewTodo(name) {
    return {
        name: name,
        status: 'todo'
    }
}

// todoList
//     .map(addTodoFromTemplate)
//     .forEach(insertTodoElement);

listElement.addEventListener('click', onListClick);

var inputElement = document.querySelector('.add-task__input');
inputElement.addEventListener('keydown', onInputKeydown);

/*==================================
 =            СТАТИСТИКА            =
 ==================================*/

// формируем счетчик статистики
var stats = {
    done: 0,
    todo: 0
};

// необходимые DOM элементы
var statsElement = document.querySelector('.statistic');
var statsDonelElement = statsElement.querySelector('.statistic__done');
var statsTodoElement = statsElement.querySelector('.statistic__left');
var statsTotalElement = statsElement.querySelector('.statistic__total');

// создадим функции работы со статистикой
/**
 * отрисовывает статистику в DOM
 */
function renderStats() {
    statsDonelElement.textContent = stats.done;
    statsTodoElement.textContent = stats.todo;
    statsTotalElement.textContent = stats.done + stats.todo;
}

// теперь на каждое из действий — обновление статистики
/**
 * добавляет значение к статистике и обновляет DOM
 * @param {boolean} isTodo — статус новой тудушки
 */
function addToStats(isTodo) {
    if (isTodo) {
        stats.todo++;
    } else {
        stats.done++;
    }
    renderStats();
}

/**
 * измененяет статус тудушки и обновляет DOM
 * @param {boolean} isTodo статус после изменения
 */
function changeStats(isTodo) {
    if (isTodo) {
        stats.todo++;
        stats.done--;
    } else {
        stats.todo--;
        stats.done++;
    }
    renderStats();
}

/**
 * отрабатывает удаление тудушки и обновляет DOM
 * @param {boolean} isTodo статус удаленной тудушки
 */
function deleteFromStats(isTodo) {
    if (isTodo) {
        stats.todo--;
    } else {
        stats.done--;
    }
    renderStats();
}

// теперь надо переписать старые методы, чтобы учесть статистику

/**
 * вставляет тудушку и обновляет статистику
 * @param {TodoItem} todo
 */
function insertTodoElement(todo) {
    var elem = addTodoFromTemplate(todo);
    listElement.insertBefore(elem, listElement.firstElementChild);
    addToStats(todo.status === 'todo');
}

// из-за изменений в insertTodoElement чуть упростили onInputKeydown

/**
 * отслеживает нажатие ENTER пользователем и создает новую тудушку, если такой нет
 * @param {KeyboardEvent} event
 */
function onInputKeydown(event) {

    if (event.keyCode !== ENTER_KEYCODE) {
        return;
    }

    var todoName = inputElement.value.trim();

    if (todoName.length === 0 || checkIfTodoAlreadyExists(todoName)) {
        return;
    }

    var todo = createNewTodo(todoName);
    insertTodoElement(todo);
    inputElement.value = '';
}

/**
 * изменяет статус тудушки, обновляет статистику
 * @param {Element} element
 */
function changeTodoStatus(element) {
    var isTodo = element.classList.contains('task_todo');
    setTodoStatusClassName(element, !isTodo);

    changeStats(!isTodo);
}

/**
 * удаляет тудушку, обновляет статистику
 * @param {Element} element
 */
function deleteTodo(element) {
    var isTodo = element.classList.contains('task_todo');
    listElement.removeChild(element);

    deleteFromStats(isTodo);
}

// отрендерим первоначальный список тудушек
renderStats();
todoList.forEach(insertTodoElement);
