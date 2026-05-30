document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const addButtons = document.querySelectorAll('.add-btn');
    const motivationText = document.getElementById('motivationText');
    const quotes = [
        'Small steps every day lead to big results.',
        'Stay focused, stay motivated, stay consistent.',
        'Progress is progress, no matter how small.',
        'Success begins with the decision to try.',
        'Dream big, work hard, make it happen.',
        'Your future self will thank you for today.',
        'Keep going — you are closer than you think.',
        'Make today count and your goals will follow.',
        'One task at a time, one day at a time.',
        'Believe in yourself and all that you are.'
    ];
    let quoteIndex = 0;

    function activateTab(targetId) {
        tabPanes.forEach(pane => {
            pane.classList.toggle('active', pane.id === targetId);
        });

        tabButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.target === targetId);
        });
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            activateTab(button.dataset.target);
        });
    });

    addButtons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.dataset.target;
            const input = document.querySelector(`#${target}_input`);
            const dateInput = document.querySelector(`#${target}_date`);
            const list = document.querySelector(`#${target}_list`);
            const value = input.value.trim();
            const dateValue = dateInput ? dateInput.value : '';

            if (!value) {
                return;
            }

            const li = document.createElement('li');
            li.className = 'task-item';

            const taskContainer = document.createElement('div');
            taskContainer.className = 'task';

            const mainTaskWrapper = document.createElement('div');
            mainTaskWrapper.className = 'main-task';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'item-checkbox';
            checkbox.id = `${target}_item_${Date.now()}`;

            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
            label.className = 'item-label';
            label.textContent = value;

            if (dateValue) {
                const dateSpan = document.createElement('span');
                dateSpan.className = 'item-date';
                
                // Format date from YYYY-MM-DD to DD-MM-YY
                const [year, month, day] = dateValue.split('-');
                const formattedDate = `${day}-${month}-${year.slice(-2)}`;
                dateSpan.textContent = ` (${formattedDate})`;
                label.appendChild(dateSpan);
            }

            checkbox.addEventListener('change', () => {
                label.classList.toggle('completed', checkbox.checked);
            });

            // Create remaining days span for assignments and exams
            let remainingDaysSpan = null;
            if ((target === 'assignments' || target === 'exams') && dateValue) {
                remainingDaysSpan = document.createElement('span');
                remainingDaysSpan.className = 'remaining-days';
                
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const dueDate = new Date(dateValue);
                dueDate.setHours(0, 0, 0, 0);
                const timeDiff = dueDate - today;
                const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
                
                if (daysRemaining < 0) {
                    remainingDaysSpan.textContent = `Overdue`;
                    remainingDaysSpan.classList.add('overdue');
                } else if (daysRemaining === 0) {
                    remainingDaysSpan.textContent = `Today`;
                } else {
                    remainingDaysSpan.textContent = `${daysRemaining} days left`;
                }
            }

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = '×';
            deleteBtn.type = 'button';
            deleteBtn.addEventListener('click', () => {
                li.remove();
            });

            mainTaskWrapper.appendChild(checkbox);
            mainTaskWrapper.appendChild(label);
            if (remainingDaysSpan) {
                mainTaskWrapper.appendChild(remainingDaysSpan);
            }

            taskContainer.appendChild(mainTaskWrapper);

            const subtasksWrapper = document.createElement('div');
            subtasksWrapper.className = 'subtasks';
            taskContainer.appendChild(subtasksWrapper);

            // Add subtask support for exams
            if (target === 'exams') {
                const addSubtaskBtn = document.createElement('button');
                addSubtaskBtn.className = 'add-subtask-btn';
                addSubtaskBtn.textContent = '+';
                addSubtaskBtn.type = 'button';
                addSubtaskBtn.addEventListener('click', () => {
                    showSubtaskInput(li);
                });
                mainTaskWrapper.appendChild(addSubtaskBtn);
            }

            mainTaskWrapper.appendChild(deleteBtn);
            li.appendChild(taskContainer);
            list.appendChild(li);
            if (motivationText) {
                motivationText.textContent = quotes[quoteIndex];
                quoteIndex = (quoteIndex + 1) % quotes.length;
            }
            input.value = '';
            if (dateInput) {
                dateInput.value = '';
            }
        });
    });

    function showSubtaskInput(examItem) {
        let subtasksWrapper = examItem.querySelector('.subtasks');
        if (!subtasksWrapper) {
            subtasksWrapper = document.createElement('div');
            subtasksWrapper.className = 'subtasks';
            examItem.querySelector('.task').appendChild(subtasksWrapper);
        }

        let subtaskContainer = subtasksWrapper.querySelector('.subtask-container');
        if (!subtaskContainer) {
            subtaskContainer = document.createElement('div');
            subtaskContainer.className = 'subtask-container';
            subtasksWrapper.appendChild(subtaskContainer);
        }

        let subtaskInput = examItem.querySelector('.subtask-input');
        if (subtaskInput) {
            subtaskInput.focus();
            return;
        }

        const inputWrapper = document.createElement('div');
        inputWrapper.className = 'subtask-input-wrapper';

        subtaskInput = document.createElement('input');
        subtaskInput.type = 'text';
        subtaskInput.className = 'subtask-input';
        subtaskInput.placeholder = 'Add a subtask...';

        const addSubtaskBtn = document.createElement('button');
        addSubtaskBtn.className = 'add-subtask-confirm-btn';
        addSubtaskBtn.textContent = 'Add';
        addSubtaskBtn.type = 'button';
        addSubtaskBtn.addEventListener('click', () => {
            const subtaskText = subtaskInput.value.trim();
            if (!subtaskText) return;
            addSubtaskToExam(examItem, subtaskText);
            inputWrapper.remove();
        });

        subtaskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const subtaskText = subtaskInput.value.trim();
                if (!subtaskText) return;
                addSubtaskToExam(examItem, subtaskText);
                inputWrapper.remove();
            }
        });

        inputWrapper.appendChild(subtaskInput);
        inputWrapper.appendChild(addSubtaskBtn);
        subtaskContainer.appendChild(inputWrapper);
        subtaskInput.focus();
    }

    function addSubtaskToExam(examItem, subtaskText) {
        let subtasksWrapper = examItem.querySelector('.subtasks');
        if (!subtasksWrapper) {
            subtasksWrapper = document.createElement('div');
            subtasksWrapper.className = 'subtasks';
            examItem.querySelector('.task').appendChild(subtasksWrapper);
        }

        let subtaskContainer = subtasksWrapper.querySelector('.subtask-container');
        if (!subtaskContainer) {
            subtaskContainer = document.createElement('div');
            subtaskContainer.className = 'subtask-container';
            subtasksWrapper.appendChild(subtaskContainer);
        }

        let subtaskList = subtaskContainer.querySelector('.subtask-list');
        if (!subtaskList) {
            subtaskList = document.createElement('ul');
            subtaskList.className = 'subtask-list';
            subtaskContainer.appendChild(subtaskList);
        }

        const subtaskItem = document.createElement('li');
        subtaskItem.className = 'subtask-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'subtask-checkbox';

        const label = document.createElement('label');
        label.className = 'subtask-label';
        label.textContent = subtaskText;

        checkbox.addEventListener('change', () => {
            label.classList.toggle('completed', checkbox.checked);
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'subtask-delete-btn';
        deleteBtn.textContent = '×';
        deleteBtn.type = 'button';
        deleteBtn.addEventListener('click', () => {
            subtaskItem.remove();
        });

        subtaskItem.appendChild(checkbox);
        subtaskItem.appendChild(label);
        subtaskItem.appendChild(deleteBtn);
        subtaskList.appendChild(subtaskItem);
    }
});
