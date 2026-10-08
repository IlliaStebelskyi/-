# 📋 PLAN РОЗРОБКИ TASK MANAGER - ФРОНТЕНД

## ✅ ЧТО УЖЕ РЕАЛІЗОВАНО

### Базова функціональність
- ✅ CRUD операції (add, edit, delete, read)
- ✅ Фільтр за статусом (All, Completed, Pending)
- ✅ Пошук по назві задачі
- ✅ Сортування (по даті, приоритету, назві, дедлайну)
- ✅ Статистика на Dashboard
- ✅ Експорт CSV/JSON
- ✅ Валідація форми
- ✅ Header компонент
- ✅ Аутентифікація (Login/Register)
- ✅ Категорії до задач

### Компоненти
- ✅ App.jsx - основна логіка
- ✅ Login.jsx - вхід користувача
- ✅ RegisterForm.jsx - реєстрація
- ✅ Dashboard.jsx - статистика
- ✅ Header.jsx - заголовок
- ✅ TaskCard.jsx - карточка задачі
- ✅ TaskForm.jsx - форма додавання/редагування
- ✅ ExportPanel.jsx - експорт даних

---

## 🆕 ЧТО ПОТРІБНО ДОБАВИТИ

### ФАЗА 0: ІНФРАСТРУКТУРА (ДЕНЬ 1)

#### 0.1 Організація файлової структури
```
src/
├── contexts/          # NEW
│   └── ThemeContext.jsx
├── styles/            # NEW
│   ├── global.css
│   ├── variables.css
│   ├── KanbanBoard.css
│   ├── CalendarView.css
│   ├── TaskDetailModal.css
│   └── DateFilter.css
├── components/
│   ├── ViewToggle.jsx              # NEW
│   ├── KanbanBoard.jsx             # NEW
│   ├── CalendarView.jsx            # NEW
│   ├── TaskDetailModal.jsx         # NEW
│   ├── DateFilter.jsx              # NEW
│   └── [існуючі компоненти]
└── [існуючі файли]
```

#### 0.2 Оновлення API (api.js)
Додати функції:
```javascript
- getTaskComments(taskId)
- addTaskComment(taskId, text)
- deleteTaskComment(taskId, commentId)
- updateTaskComment(taskId, commentId, text)
```

---

### ФАЗА 1: DARK MODE (ДЕНЬ 1-2)

#### Файл: `src/contexts/ThemeContext.jsx`
- Контекст для управління темою (light/dark)
- Функція toggleTheme()
- Збереження в localStorage

#### Файл: `src/styles/variables.css`
CSS змінні для обох тем:
```css
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --border-color: #e5e7eb;
  --accent-color: #3b82f6;
}

[data-theme="dark"] {
  --bg-primary: #1f2937;
  --bg-secondary: #111827;
  --text-primary: #f9fafb;
  --text-secondary: #d1d5db;
  --border-color: #374151;
  --accent-color: #60a5fa;
}
```

#### Оновлення Header.jsx
- Додати кнопку переключення теми
- Застосувати ThemeContext

#### Оновлення App.jsx, всіх компонентів
- Обгорнути в ThemeProvider
- Замінити hardcoded кольори на CSS змінні

---

### ФАЗА 2: NAVIGATION TABS (ДЕНЬ 2)

#### Файл: `src/components/ViewToggle.jsx`
```javascript
export default function ViewToggle({ view, setView }) {
  return (
    <div className="view-toggle">
      <button className={view === 'list' ? 'active' : ''}>
        Список
      </button>
      <button className={view === 'kanban' ? 'active' : ''}>
        Kanban
      </button>
      <button className={view === 'calendar' ? 'active' : ''}>
        Календар
      </button>
    </div>
  );
}
```

#### Оновлення App.jsx
- Додати state: `const [view, setView] = useState('list')`
- Збереження в localStorage
- Умовне відображення компонентів

---

### ФАЗА 3: KANBAN BOARD (ДЕНЬ 3-4)

#### Файл: `src/components/KanbanBoard.jsx`
Функціональність:
- 3 колони: To Do | In Progress | Done
- Drag & Drop між колонами (HTML5 API)
- Лічильник задач в кожній колоні
- Видалення задачі з колони (крупка/хрестик)
- Клік на карточку = відкрити TaskDetailModal

Структура:
```
KanbanBoard
├── Column (To Do)
│   ├── TaskCard (draggable)
│   ├── TaskCard
│   └── ...
├── Column (In Progress)
└── Column (Done)
```

#### Файл: `src/styles/KanbanBoard.css`
- Grid layout для 3 колон
- Dropzone стилі
- Hover ефекти

---

### ФАЗА 4: CALENDAR VIEW (ДЕНЬ 4-5)

#### Файл: `src/components/CalendarView.jsx`
Функціональність:
- Календар місяця 7×7 (день тижня)
- Кнопки назад/вперед для навігації місяцями
- Виділення сьогоднішньої дати жовтим фоном
- У кожній клітинці дня показувати список задач (макс 3 рядки, rest...)
- Клік на задачу = відкрити TaskDetailModal
- Клік на день = фільтрувати по цій даті в ListView

Структура:
```
CalendarView
├── CalendarHeader (Month Year + стрілки)
├── Weekdays (Пн, Вт, ...)
└── Days Grid
    ├── DayCell
    │   ├── DayNumber
    │   └── TasksList
    └── ...
```

#### Файл: `src/styles/CalendarView.css`
- Grid 7 колон
- Мінімальна висота дня
- Overflow для задач

---

### ФАЗА 5: DATE FILTERS (ДЕНЬ 5)

#### Файл: `src/components/DateFilter.jsx`
Кнопки для швидкого фільтру:
- 📅 Today (задачи на сьогодні)
- 📆 This Week (сьогодні + 6 днів)
- 📊 This Month (сьогодні + до кінця місяця)
- 🔄 All (без фільтру по датам)

Логіка в App.jsx:
```javascript
const filterByDate = (dateFilter) => {
  const today = new Date();
  return tasks.filter(task => {
    if (dateFilter === 'today') 
      return same day as today
    if (dateFilter === 'week')
      return between today and today+7
    if (dateFilter === 'month')
      return between today and end of month
    return true
  });
}
```

---

### ФАЗА 6: TASK DETAIL MODAL (ДЕНЬ 6-7)

#### Файл: `src/components/TaskDetailModal.jsx`
Структура:
```
Modal (fullscreen або 90% ширини)
├── Header (Задача #ID + Close button)
├── Main Content
│   ├── Task Info (title, description, priority, category, dueDate, status)
│   ├── Edit Button (перейти в edit mode)
│   └── Delete Button (з підтвердженням)
├── Comments Section
│   ├── Comment List
│   │   ├── Comment (text + timestamp + delete button)
│   │   └── ...
│   └── Add Comment Form
│       ├── Textarea
│       └── Button "Add"
└── Footer (Close button)
```

Функціональність:
- Показати всю інформацію про задачу
- Редагування полів (onClick на поле = стає input)
- Додавання коментарів (задачу коментарів зберігати локально або на сервері?)
- Видалення задачі з модалу
- Индикатор "Прострочена" якщо dueDate < today

#### Оновлення api.js
Додати функції для коментарів (якщо на сервері):
```javascript
- getTaskComments(taskId)
- addTaskComment(taskId, text)
- deleteTaskComment(commentId)
```

---

### ФАЗА 7: POLISH & IMPROVEMENTS (ДЕНЬ 7-8)

#### Toast Notifications
Компонент `Toast.jsx` для повідомлень:
- Успіх: "Задача створена ✓"
- Помилка: "Помилка завантаження! ✗"
- Info: "Задача видалена"

#### Confirm Dialog
Модальне вікно перед видаленням:
```
"Ви впевнені що хочете видалити задачу?"
[Скасувати] [Видалити]
```

#### Responsive Design
- Медіа-запити для мобільних (<768px)
- Kanban в мобільній версії = 1 колона з табами
- Calendar в мобільній версії = 5 днів на екран або daily view

#### Loading States
- Spinner під час завантаження
- Skeleton для TaskCard
- Disable buttons під час процесу

---

## 📊 ЗАЛЕЖНОСТІ МІЖ КОМПОНЕНТАМИ

```
App.jsx
├── ViewToggle → показує яку view вибрати
│
├── ListView (вже є)
│   └── TaskCard
│       └── Click → TaskDetailModal
│
├── KanbanBoard (НОВЕ)
│   ├── Column (To Do, In Progress, Done)
│   └── TaskCard
│       └── Click → TaskDetailModal
│
├── CalendarView (НОВЕ)
│   └── DayCell
│       ├── Show tasks
│       └── Click task → TaskDetailModal
│
├── DateFilter (НОВЕ)
│   └── filteredTasks = filterByDate(tasks)
│
└── TaskDetailModal (НОВЕ)
    ├── Show/Edit task info
    ├── Comments List
    └── Add Comment Form
```

---

## 🗓️ РЕКОМЕНДОВАНА ПОСЛІДОВНІСТЬ ДНІВ

**День 1-2:** Infrastructure + Dark Mode + Navigation
- Папки, контекст, CSS змінні, ThemeContext

**День 3-4:** Kanban Board
- Компонент + CSS + drag-drop

**День 4-5:** Calendar View
- Компонент + CSS + навігація

**День 5:** Date Filters
- Компонент + логіка фільтрації в App.jsx

**День 6-7:** Task Detail Modal + Comments
- Модальне вікно + коментарі + edit

**День 7-8:** Polish
- Toast, confirmations, responsive, loading states

---

## 🚀 КРИТИЧНІ МОМЕНТИ

1. **Drag & Drop в Kanban** - потребує атрибутів `draggable`, `onDragStart`, `onDragOver`, `onDrop`
2. **Comments** - розирити backend API або зберігати в localStorage?
3. **Date Filtering** - правильна логіка для "This Week", "This Month"
4. **Modal Z-index** - переконатися що модал вище за все
5. **Performance** - якщо задач > 1000, потребує паджинації або віртуалізації

---

## 📝 ФАЙЛИ ПОТРЕБУЮТЬ ОНОВЛЕННЯ

- ✏️ `App.jsx` - додати state для view, theme, date filter
- ✏️ `Header.jsx` - додати ViewToggle, ThemeToggle
- ✏️ `api.js` - додати функції для коментарів
- ✏️ `index.css` або новий `global.css` - зберегти существующие стили
- ✏️ `App.css` - додати стилі для нових компонентів

---

## 📦 НОВЫЕ ФАЙЛЫ

Всього нових файлів: **12-15**

```
src/contexts/
  └── ThemeContext.jsx

src/styles/
  ├── global.css
  ├── variables.css
  ├── KanbanBoard.css
  ├── CalendarView.css
  ├── TaskDetailModal.css
  └── DateFilter.css

src/components/
  ├── ViewToggle.jsx
  ├── KanbanBoard.jsx
  ├── CalendarView.jsx
  ├── TaskDetailModal.jsx
  ├── DateFilter.jsx
  ├── Toast.jsx (optional)
  └── ConfirmDialog.jsx (optional)
```

---

**Готово до реалізації!** 🎯
