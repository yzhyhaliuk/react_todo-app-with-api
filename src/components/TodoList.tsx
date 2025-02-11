/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import React, { Dispatch, SetStateAction } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[] | null;
  toggleTodo: (id: number) => void;
  updatingTodoId: number | null;
  handleDelete: (id: number) => void;
  deletingTodoIds: number[];
  editingId: number | null;
  setEditingId: Dispatch<SetStateAction<number | null>>;
  setTitle: Dispatch<SetStateAction<string>>;
  title: string;
  renameTodo: (id: number, title: string) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  toggleTodo,
  updatingTodoId,
  handleDelete,
  deletingTodoIds,
  editingId,
  setEditingId,
  setTitle,
  title,
  renameTodo,
}) => {
  const handleTitleChange = (todoId: number) => {
    if (title.trim() === '') {
      handleDelete(todoId);
    } else if (title !== todos?.find(todo => todo.id === todoId)?.title) {
      renameTodo(todoId, title.trim());
    } else {
      setEditingId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handleBlur = () => {
    handleTitleChange(editingId as number);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos?.map(todo => (
        <div
          key={todo.id}
          data-cy="Todo"
          className={classNames('todo', { completed: todo.completed })}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              onChange={() => toggleTodo(todo.id)}
              checked={todo.completed}
            />
          </label>
          {editingId === todo.id ? (
            <form
              onSubmit={event => {
                event.preventDefault();
                handleTitleChange(todo.id);
              }}
            >
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={title}
                onChange={event => setTitle(event.target.value)}
                onBlur={handleBlur}
                onKeyUp={handleKeyUp}
                autoFocus
              />
            </form>
          ) : (
            <>
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => {
                  setEditingId(todo.id);
                  setTitle(todo.title);
                }}
              >
                {todo.title}
              </span>

              {/* Remove button appears only on hover */}
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => handleDelete(todo.id)}
              >
                ×
              </button>
            </>
          )}

          {/* overlay will cover the todo while it is being deleted or updated */}
          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', {
              'is-active':
                updatingTodoId === todo.id || deletingTodoIds.includes(todo.id),
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </section>
  );
};
