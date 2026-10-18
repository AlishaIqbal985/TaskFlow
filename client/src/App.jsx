
import { useEffect, useRef, useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import TaskStats from './components/TaskStats.jsx'
import TaskList from './components/TaskList.jsx'
import FeedbackModal from './components/FeedbackModal.jsx'
import DueDatePicker from './components/DueDatePicker.jsx'
import CalendarView from './components/CalendarView.jsx'
import api from './services/api.js'
import Auth from './components/Auth.jsx'


import {
  Bell,
  BookOpen,
  Briefcase,
  CalendarDays,
  Code2,
  Dumbbell,
  ListTodo,
  Mail,
  Palette,
  ShoppingCart,
  UsersRound,
  Moon,
  Sun,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  Command,
  ExternalLink,
  HelpCircle,
  LifeBuoy,
  LogOut,
  MessageCircle,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
} from 'lucide-react'

function getTaskIcon(task) {
  const title = (task.title || '').toLowerCase()
  const category = (task.category || '').toLowerCase()
  const text = `${title} ${category}`

  if (/\b(code|coding|program|programming|developer|development|react|javascript|typescript|bug|api|website|app|software|git|github|debug)\b/.test(text)) {
    return { Icon: Code2, style: 'bg-violet-100 text-violet-700' }
  }
  if (/\b(meeting|team|call|interview|discussion|standup|sync|conference)\b/.test(title)) {
    return { Icon: UsersRound, style: 'bg-blue-100 text-blue-700' }
  }
  if (/\b(shop|shopping|buy|purchase|groceries|market|store|order)\b/.test(title)) {
    return { Icon: ShoppingCart, style: 'bg-orange-100 text-orange-700' }
  }
  if (/\b(study|learn|learning|read|reading|course|lesson|exam|practice|homework|assignment|research|book)\b/.test(text)) {
    return { Icon: BookOpen, style: 'bg-sky-100 text-sky-700' }
  }
  if (/\b(design|designing|ui|ux|figma|creative|art|logo|prototype|wireframe)\b/.test(title)) {
    return { Icon: Palette, style: 'bg-pink-100 text-pink-700' }
  }
  if (/\b(email|mail|inbox|reply|message|newsletter)\b/.test(title)) {
    return { Icon: Mail, style: 'bg-emerald-100 text-emerald-700' }
  }
  if (/\b(work|office|report|project|client|deadline|business|task|proposal)\b/.test(text)) {
    return { Icon: Briefcase, style: 'bg-amber-100 text-amber-700' }
  }
  if (/\b(workout|gym|exercise|fitness|run|running|yoga|walk|walking)\b/.test(title)) {
    return { Icon: Dumbbell, style: 'bg-rose-100 text-rose-700' }
  }
  if (/\b(calendar|schedule|appointment|event|plan|planning)\b/.test(title)) {
    return { Icon: CalendarDays, style: 'bg-cyan-100 text-cyan-700' }
  }
  return { Icon: ListTodo, style: 'bg-teal-100 text-teal-700' }
}

const defaultTasks = [
  { id: 1, title: 'Learn React basics', category: 'Learning', completed: true, priority: 'High', dueDate: '' },
  { id: 2, title: 'Build TaskFlow dashboard', category: 'Development', completed: false, priority: 'Medium', dueDate: '' },
  { id: 3, title: 'Practice JavaScript', category: 'Learning', completed: false, priority: 'Low', dueDate: '' },
]

const optionalFieldLabels = {
  category: 'Category',
  priority: 'Priority',
  dueDate: 'Due Date',
}

const readyAvatars = ['👩🏻‍💻', '👩🏽‍🎓', '👨🏻‍💻', '🧑🏻‍🎨', '🦊', '🐼', '🐱', '🚀']

const helpArticles = [
  {
    question: 'How do I add a task?',
    answer: 'Open My Tasks, enter a task name, and select Add Task. You can also add a category, priority, and due date.',
  },
  {
    question: 'How do I edit or complete a task?',
    answer: 'Use the actions shown on a task card to edit its details, mark it complete, or delete it.',
  },
  {
    question: 'How do I change my profile?',
    answer: 'Open the profile menu in the top-right corner, select Settings, update your information, and save your changes.',
  },
  {
    question: 'Why are my tasks saved in this browser?',
    answer: 'This version uses browser localStorage. Data is not yet connected to MongoDB and may not appear in another browser or device.',
  },
  {
    question: 'How do notifications work?',
    answer: 'The Notifications page checks your tasks for overdue deadlines, upcoming due dates, and incomplete tasks. It does not send push notifications.',
  },
]

function App() {
  const [tasks, setTasks] = useState([])
const [isLoadingTasks, setIsLoadingTasks] = useState(true)

const [authUser, setAuthUser] = useState(() => {
  try {
    const token = localStorage.getItem('taskflow-token')
    const savedUser = localStorage.getItem('taskflow-user')

    if (!token || !savedUser) return null

    return JSON.parse(savedUser)
  } catch {
    return null
  }
})

const [isCheckingAuth, setIsCheckingAuth] = useState(true)
function handleAuthenticated(user) {
  localStorage.setItem('taskflow-user', JSON.stringify(user))

  setAuthUser(user)

  setProfile((current) => ({
    ...current,
    name: user.name,
    email: user.email,
  }))

  setProfileDraft((current) => ({
    ...current,
    name: user.name,
    email: user.email,
  }))

  setIsCheckingAuth(false)
}

useEffect(() => {
  let isMounted = true;

  async function verifySession() {
    const token = localStorage.getItem('taskflow-token');

    if (!token) {
      if (isMounted) {
        setAuthUser(null);
        setIsCheckingAuth(false);
      }
      return;
    }

    try {
      const response = await api.get('/api/auth/me');

      if (isMounted) {
        const user = response.data.user;

        setAuthUser(user);
        localStorage.setItem('taskflow-user', JSON.stringify(user));
      }
    } catch (error) {
      if (isMounted) {
        localStorage.removeItem('taskflow-token');
        localStorage.removeItem('taskflow-user');
        setAuthUser(null);
      }
    } finally {
      if (isMounted) {
        setIsCheckingAuth(false);
      }
    }
  }

  verifySession();

  return () => {
    isMounted = false;
  };
}, []);


  const [newTask, setNewTask] = useState('')
  const [activeView, setActiveView] = useState('tasks')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const [newCategory, setNewCategory] = useState('')
  const [newPriority, setNewPriority] = useState('')
  const [newDueDate, setNewDueDate] = useState('')

  const [searchText, setSearchText] = useState('')
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('default')
  const [modal, setModal] = useState(null)

  const [showOptionalFieldsModal, setShowOptionalFieldsModal] = useState(false)
  const [missingFields, setMissingFields] = useState([])
  const [selectedOptionalFields, setSelectedOptionalFields] = useState([])
  const [fieldsToComplete, setFieldsToComplete] = useState(null)

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [showAvatarChoices, setShowAvatarChoices] = useState(false)
  const [helpSearch, setHelpSearch] = useState('')
  const [openHelpItem, setOpenHelpItem] = useState(0)
  const [isLoggedOut, setIsLoggedOut] = useState(false)

  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('taskflow-profile')
      return saved
        ? { name: 'TaskFlow User', email: '', avatar: '', ...JSON.parse(saved) }
        : { name: 'TaskFlow User', email: '', avatar: '' }
    } catch {
      return { name: 'TaskFlow User', email: '', avatar: '' }
    }
  })

  const [profileDraft, setProfileDraft] = useState(profile)

  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('taskflow-theme') === 'dark' ? 'dark' : 'light'
    } catch {
      return 'light'
    }
  })

  const photoInputRef = useRef(null)

  function showModal(details) {
    setModal(details)
  }

  function closeModal() {
    setModal(null)
  }

  useEffect(() => {
  let isMounted = true

  async function loadTasks() {
    if (isCheckingAuth) return

    if (!authUser) {
      setTasks([])
      setIsLoadingTasks(false)
      return
    }

    setIsLoadingTasks(true)

    try {
      const response = await api.get('/api/tasks')

      const databaseTasks = response.data.tasks.map((task) => ({
        ...task,
        id: task._id,
      }))

      if (isMounted) {
        setTasks(databaseTasks)
      }
    } catch (error) {
      console.error(
        'Could not load tasks from database:',
        error.response?.data || error.message,
      )

      if (isMounted) {
        setTasks([])

        setModal({
          type: 'error',
          title: 'Could not load tasks',
          message:
            error.response?.status === 401
              ? 'Your session has expired. Please log in again.'
              : 'Please check your backend server and MongoDB connection, then refresh the page.',
        })
      }
    } finally {
      if (isMounted) {
        setIsLoadingTasks(false)
      }
    }
  }

  loadTasks()

  return () => {
    isMounted = false
  }
}, [authUser, isCheckingAuth])

  useEffect(() => {
    try {
      localStorage.setItem('taskflow-profile', JSON.stringify(profile))
    } catch (error) {
      console.error('Could not save profile:', error)
      setModal({
        type: 'error',
        title: 'Profile could not be saved',
        message: 'Browser storage may be full. Try choosing a smaller photo.',
      })
    }
  }, [profile])

  useEffect(() => {
    try {
      localStorage.setItem('taskflow-theme', theme)
    } catch (error) {
      console.error('Could not save theme:', error)
    }
  }, [theme])

  const completedTasks = tasks.filter((task) => task.completed).length
  const pendingTasks = tasks.length - completedTasks

  const today = new Date()
  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-')

  const notifications = tasks
    .filter((task) => !task.completed && task.dueDate)
    .map((task) => {
      const overdue = task.dueDate < todayString
      return {
        id: task.id,
        title: task.title,
        category: task.category || '',
        dueDate: task.dueDate,
        overdue,
        message: overdue
          ? 'This task is overdue.'
          : task.dueDate === todayString
            ? 'This task is due today.'
            : `Due on ${task.dueDate}.`,
      }
    })
    .filter((item) => item.overdue || item.dueDate === todayString || item.dueDate > todayString)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))

  const overdueCount = notifications.filter((item) => item.overdue).length
  const todayCount = notifications.filter((item) => item.dueDate === todayString).length

  const searchedTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchText.toLowerCase()),
  )

  const filteredTasks = searchedTasks.filter((task) => {
    if (activeView === 'completed') return task.completed

    return (
      filter === 'all' ||
      (filter === 'pending' && !task.completed) ||
      (filter === 'completed' && task.completed)
    )
  })

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'priority') {
      const rank = { High: 3, Medium: 2, Low: 1 }
      return (rank[b.priority] || 0) - (rank[a.priority] || 0)
    }

    if (sortBy === 'dueDate') {
      if (!a.dueDate && !b.dueDate) return 0
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return a.dueDate.localeCompare(b.dueDate)
    }

    if (sortBy === 'newest')return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    if (sortBy === 'alphabetical') return a.title.localeCompare(b.title)

    return 0
  })

  function validateTaskName() {
    const title = newTask.trim()

    if (!title) {
      showModal({
        type: 'error',
        title: 'Task name required',
        message: 'Please enter a task name before adding a task.',
      })
      return null
    }

    if (title.length > 100) {
      showModal({
        type: 'error',
        title: 'Task name too long',
        message: 'Your task name cannot exceed 100 characters.',
      })
      return null
    }

    const duplicate = tasks.some(
      (task) => task.title.trim().toLowerCase() === title.toLowerCase(),
    )

    if (duplicate) {
      showModal({
        type: 'error',
        title: 'Duplicate task',
        message: `A task named "${title}" already exists. Please choose a different name.`,
      })
      return null
    }

    return title
  }

  function getMissingFields() {
    const missing = []

    if (!newCategory) missing.push('category')
    if (!newPriority) missing.push('priority')
    if (!newDueDate) missing.push('dueDate')

    return missing
  }

 
  async function saveTask() {
    const title = validateTaskName()
    if (!title) return

    const taskData = {
      title,
      description: '',
      category: newCategory,
      priority: newPriority,
      dueDate: newDueDate,
      completed: false,
    }

    try {
      const response = await api.post('/api/tasks', taskData)

      const savedTask = {
        ...response.data.task,
        id: response.data.task._id,
      }

      setTasks((current) => [...current, savedTask])

      setNewTask('')
      setNewCategory('')
      setNewPriority('')
      setNewDueDate('')
      setFieldsToComplete(null)
      setShowOptionalFieldsModal(false)
      setMissingFields([])
      setSelectedOptionalFields([])

      showModal({
        type: 'success',
        title: 'Task added successfully',
        message: `"${title}" has been saved to your database.`,
      })
    } catch (error) {
      console.error(
        'Could not save task:',
        error.response?.data || error.message,
      )

      showModal({
        type: 'error',
        title: 'Task could not be saved',
        message:
          error.response?.data?.message ||
          'Please check that your backend server and MongoDB connection are running, then try again.',
      })
    }
  }


  function addTask(event) {
    event.preventDefault()

    const title = validateTaskName()
    if (!title) return

    // If the user selected specific optional fields, validate only those fields.
    if (fieldsToComplete !== null) {
      const selectedFieldsMissing = fieldsToComplete.filter((field) => {
        if (field === 'category') return !newCategory
        if (field === 'priority') return !newPriority
        if (field === 'dueDate') return !newDueDate
        return false
      })

      if (selectedFieldsMissing.length > 0) {
        showModal({
          type: 'error',
          title: 'Complete selected fields',
          message: `Please complete: ${selectedFieldsMissing
            .map((field) => optionalFieldLabels[field])
            .join(', ')}.`,
        })
        return
      }

      saveTask()
      return
    }

    const missing = getMissingFields()

    if (missing.length === 0) {
      saveTask()
      return
    }

    setMissingFields(missing)
    setSelectedOptionalFields(missing)
    setShowOptionalFieldsModal(true)
  }

  function toggleOptionalField(field) {
    setSelectedOptionalFields((current) =>
      current.includes(field)
        ? current.filter((item) => item !== field)
        : [...current, field],
    )
  }

 
async function toggleTask(id) {
  const task = tasks.find((item) => item.id === id);

  if (!task) return;

  const updatedCompleted = !task.completed;

  try {
    const response = await api.put(`/api/tasks/${id}`, {
      completed: updatedCompleted,
    });

    const savedTask = response.data.task;

    setTasks((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, ...savedTask, id: savedTask._id }
          : item,
      ),
    );
  } catch (error) {
    console.error(
      "Could not update task status:",
      error.response?.data || error.message,
    );

    showModal({
      type: "error",
      title: "Task status not saved",
      message:
        error.response?.data?.message ||
        "Task status update nahi hua. Backend connection check karo.",
    });
  }
}


async function deleteTask(id) {
  try {
    const response = await api.delete(`/api/tasks/${id}`);

    if (!response.data.success) {
      throw new Error("Task could not be deleted.");
    }

    setTasks((current) =>
      current.filter((task) => task.id !== id),
    );

    showModal({
      type: "success",
      title: "Task deleted successfully",
      message: "The task has been removed from your database.",
    });
  } catch (error) {
    console.error(
      "Could not delete task:",
      error.response?.data || error.message,
    );

    showModal({
      type: "error",
      title: "Task deletion failed",
      message:
        error.response?.data?.message ||
        "Task delete nahi hua. Please backend connection check karo.",
    });
  }
}

 

function editTask(id, newTitle, newCategory, newPriority, newDueDate) {
  const title = newTitle.trim();

  if (!title) {
    showModal({
      type: "error",
      title: "Task title required",
      message: "Please enter a task title.",
    });
    return false;
  }

  const duplicate = tasks.some(
    (task) =>
      task.id !== id &&
      task.title.trim().toLowerCase() === title.toLowerCase(),
  );

  if (duplicate) {
    showModal({
      type: "error",
      title: "Task already exists",
      message: "A task with this name already exists.",
    });
    return false;
  }

  const updates = {
    title,
    category: newCategory || "",
    priority: newPriority || "",
    dueDate: newDueDate || "",
  };

  // Start the database update without changing the existing
  // synchronous true/false return expected by TaskList.
  (async () => {
    try {
      const response = await api.put(`/api/tasks/${id}`, updates);
      const savedTask = response.data.task;

      setTasks((current) =>
        current.map((task) =>
          task.id === id
            ? { ...task, ...savedTask, id: savedTask._id }
            : task,
        ),
      );

      showModal({
        type: "success",
        title: "Task updated successfully",
        message: `"${title}" has been saved to your database.`,
      });
    } catch (error) {
      console.error(
        "Could not update task:",
        error.response?.data || error.message,
      );

      showModal({
        type: "error",
        title: "Task update failed",
        message:
          error.response?.data?.message ||
          "Could not save the changes. Please check your backend connection.",
      });
    }
  })();

  return true;
}

  

  function openSettings() {
    setProfileDraft(profile)
    setActiveView('settings')
    setIsProfileMenuOpen(false)
    setIsSidebarOpen(false)
    setShowAvatarChoices(false)
  }

  function openHelpCenter() {
    setActiveView('help')
    setIsProfileMenuOpen(false)
    setIsSidebarOpen(false)
    setHelpSearch('')
  }

  function openNotifications() {
    setActiveView('notifications')
    setIsProfileMenuOpen(false)
    setIsSidebarOpen(false)
  }

  function saveProfile(event) {
    event.preventDefault()

    const name = profileDraft.name.trim()
    const email = profileDraft.email.trim()

    if (!name) {
      showModal({
        type: 'error',
        title: 'Name required',
        message: 'Please enter your profile name.',
      })
      return
    }

    setProfile({ ...profileDraft, name, email })

    showModal({
      type: 'success',
      title: 'Profile updated',
      message: 'Your profile changes have been saved in this browser.',
    })
  }

  function chooseAvatar(avatar) {
    setProfileDraft((current) => ({ ...current, avatar }))
    setProfile((current) => ({ ...current, avatar }))
    setShowAvatarChoices(false)
  }

  function handlePhotoUpload(event) {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      showModal({
        type: 'error',
        title: 'Invalid file',
        message: 'Please choose an image file.',
      })
      event.target.value = ''
      return
    }

    if (file.size > 500 * 1024) {
      showModal({
        type: 'error',
        title: 'Image is too large',
        message: 'Please choose an image smaller than 500 KB.',
      })
      event.target.value = ''
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      const avatar = String(reader.result)
      setProfileDraft((current) => ({ ...current, avatar }))
      setProfile((current) => ({ ...current, avatar }))
      setShowAvatarChoices(false)
    }

    reader.onerror = () => {
      showModal({
        type: 'error',
        title: 'Upload failed',
        message: 'The selected image could not be read.',
      })
    }

    reader.readAsDataURL(file)
    event.target.value = ''
  }

  function removePhoto() {
    setProfileDraft((current) => ({ ...current, avatar: '' }))
    setProfile((current) => ({ ...current, avatar: '' }))
  }

  

async function clearAllTasks() {
  if (tasks.length === 0) {
    showModal({
      type: "info",
      title: "No tasks to clear",
      message: "There are no tasks to delete.",
    });
    return;
  }

  const confirmed = window.confirm(
    `Are you sure you want to delete all ${tasks.length} tasks? This action cannot be undone.`,
  );

  if (!confirmed) return;

  try {
    await Promise.all(
      tasks.map((task) =>
        api.delete(`/api/tasks/${task.id}`),
      ),
    );

    setTasks([]);

    showModal({
      type: "success",
      title: "All tasks cleared",
      message: "All tasks have been deleted from your database.",
    });
  } catch (error) {
    console.error(
      "Could not clear all tasks:",
      error.response?.data || error.message,
    );

    // Reload tasks from the database because some deletions
    // might have succeeded before another one failed.
    try {
      const response = await api.get("/api/tasks");

      setTasks(
        response.data.tasks.map((task) => ({
          ...task,
          id: task._id,
        })),
      );
    } catch (reloadError) {
      console.error("Could not reload tasks:", reloadError);
    }

    showModal({
      type: "error",
      title: "Could not clear all tasks",
      message:
        "Some tasks may have been deleted. Please refresh and check your tasks.",
    });
  }
}



  
function handleLogout() {
  setIsProfileMenuOpen(false)

  const confirmed = window.confirm(
    'Do you want to log out of TaskFlow?',
  )

  if (!confirmed) return

  localStorage.removeItem('taskflow-token')
  localStorage.removeItem('taskflow-user')
  localStorage.removeItem('taskflow-profile')

  setAuthUser(null)
  setTasks([])
  setActiveView('tasks')
  setIsLoggedOut(false)
  setIsLoadingTasks(false)
}


  function returnToApp() {
    setIsLoggedOut(false)
    setActiveView('tasks')
  }

  const showCategoryField =
    fieldsToComplete === null ||
    fieldsToComplete.includes('category') ||
    Boolean(newCategory)

  const showPriorityField =
    fieldsToComplete === null ||
    fieldsToComplete.includes('priority') ||
    Boolean(newPriority)

  const showDueDateField =
    fieldsToComplete === null ||
    fieldsToComplete.includes('dueDate') ||
    Boolean(newDueDate)

  const isDark = theme === 'dark'

  const pageTitles = {
    tasks: 'My Tasks',
    completed: 'Completed Tasks',
    calendar: 'Monthly Calendar',
    settings: 'Settings',
    help: 'Help Center',
    notifications: 'Notifications',
  }

  const pageTitle = pageTitles[activeView] || 'My Tasks'

  const filteredHelpArticles = helpArticles.filter((article) =>
    `${article.question} ${article.answer}`
      .toLowerCase()
      .includes(helpSearch.trim().toLowerCase()),
  )

 if (!authUser) {
  return <Auth onAuthenticated={handleAuthenticated} />
}


  return (
    <div
      data-theme={theme}

      className={`taskflow-root min-h-screen md:flex ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'
      }`}
    >
      <style>{`
        .taskflow-root[data-theme="dark"] .bg-white {
          background-color: #1e293b !important;
        }
        .taskflow-root[data-theme="dark"] .bg-slate-50 {
          background-color: #0f172a !important;
        }
        .taskflow-root[data-theme="dark"] .bg-slate-100 {
          background-color: #334155 !important;
        }
        .taskflow-root[data-theme="dark"] .text-slate-900,
        .taskflow-root[data-theme="dark"] .text-slate-800,
        .taskflow-root[data-theme="dark"] .text-slate-700 {
          color: #f1f5f9 !important;
        }
        .taskflow-root[data-theme="dark"] .text-slate-600,
        .taskflow-root[data-theme="dark"] .text-slate-500 {
          color: #cbd5e1 !important;
        }
        .taskflow-root[data-theme="dark"] .border-slate-200,
        .taskflow-root[data-theme="dark"] .border-slate-300 {
          border-color: #475569 !important;
        }
        .taskflow-root[data-theme="dark"] input,
        .taskflow-root[data-theme="dark"] select {
          background-color: #0f172a;
          color: #f1f5f9;
          border-color: #475569;
        }
        .taskflow-root[data-theme="dark"] input::placeholder {
          color: #94a3b8;
        }
        @keyframes taskflow-menu-in {
          from { opacity: 0; transform: translateY(-6px) scale(.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .taskflow-menu-animation {
          animation: taskflow-menu-in 160ms ease-out;
          transform-origin: top right;
        }
        .taskflow-root button,
        .taskflow-root input {
          transition-property: color, background-color, border-color, box-shadow, transform, opacity;
          transition-duration: 180ms;
          transition-timing-function: ease-out;
        }
        .taskflow-root button:focus-visible,
        .taskflow-root input:focus-visible {
          outline: 3px solid rgba(20, 184, 166, .35);
          outline-offset: 3px;
        }
        @keyframes taskflow-fade-up {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes taskflow-soft-pop {
          from { opacity: 0; transform: scale(.97); }
          to { opacity: 1; transform: scale(1); }
        }
        .taskflow-fade-up {
          animation: taskflow-fade-up .45s ease-out both;
        }
        .taskflow-soft-pop {
          animation: taskflow-soft-pop .22s ease-out both;
        }
        .taskflow-help-card {
          transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
        }
        .taskflow-help-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 28px rgba(15, 23, 42, .07);
          border-color: rgba(20, 184, 166, .45);
        }
        @media (prefers-reduced-motion: reduce) {
          .taskflow-root *,
          .taskflow-root *::before,
          .taskflow-root *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      {!isLoggedOut && (
        <Sidebar
          tasks={tasks}
          completedTasks={completedTasks}
          activeView={activeView}
          onViewChange={(view) => {
            setActiveView(view)
            setIsProfileMenuOpen(false)
          }}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}

      <main
        className={`min-w-0 flex-1 p-4 pt-5 md:p-8 lg:p-10 ${
          isLoggedOut ? 'flex items-center justify-center' : ''
        }`}
      >
        {isLoggedOut ? (
          <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-teal-50 text-4xl">
              ✓
            </div>
            <h1 className="mt-6 text-2xl font-bold">You have left TaskFlow</h1>
            <p className="mt-3 leading-6 text-slate-500">
              This demo screen does not end a secure account session. Authentication will be added with the backend.
            </p>
            <button
              type="button"
              onClick={returnToApp}
              className="mt-6 w-full rounded-xl bg-teal-600 px-5 py-3 font-semibold text-white transition hover:bg-teal-700"
            >
              Return to TaskFlow
            </button>
          </section>
        ) : (
          <>
            <header className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsSidebarOpen(true)}
                    aria-label="Open navigation menu"
                    aria-expanded={isSidebarOpen}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-xl transition hover:bg-slate-100 md:hidden"
                  >
                    ☰
                  </button>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold tracking-wider text-teal-700 sm:text-sm">
                      YOUR WORKSPACE
                    </p>
                    <h2 className="mt-1 truncate text-2xl font-bold tracking-tight sm:text-3xl">
                      {pageTitle}
                    </h2>
                    <p className="mt-1 hidden text-sm text-slate-500 sm:block">
                      Stay focused and get things done.
                    </p>
                  </div>
                </div>

                <div className="relative flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={openNotifications}
                    aria-label="Open notifications"
                    className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-xl transition hover:bg-slate-100"
                  >
                    <Bell size={20} strokeWidth={1.8} aria-hidden="true" />

                    {notifications.length > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                        {notifications.length > 99 ? '99+' : notifications.length}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsProfileMenuOpen((open) => !open)}
                    aria-label="Open profile menu"
                    aria-expanded={isProfileMenuOpen}
                    className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-teal-100 text-xl font-bold text-teal-800 ring-4 ring-teal-50 transition hover:scale-105"
                  >
                    {profile.avatar ? (
                      profile.avatar.startsWith('data:image/') ? (
                        <img src={profile.avatar} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        <span>{profile.avatar}</span>
                      )
                    ) : (
                      (profile.name.trim()[0] || 'A').toUpperCase()
                    )}
                  </button>

                  {isProfileMenuOpen && (
                    <div className="taskflow-menu-animation absolute right-0 top-full z-40 mt-3 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-2xl">
                      <div className="bg-gradient-to-r from-teal-700 to-emerald-600 p-4 text-white">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white/60 bg-white/20 text-xl font-bold">
                            {profile.avatar ? (
                              profile.avatar.startsWith('data:image/') ? (
                                <img src={profile.avatar} alt="" className="h-full w-full object-cover" />
                              ) : (
                                profile.avatar
                              )
                            ) : (
                              (profile.name.trim()[0] || 'A').toUpperCase()
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-semibold">{profile.name}</p>
                            <p className="truncate text-xs text-white/80">
                              {profile.email || 'Your TaskFlow profile'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-2">
                        <button
                          type="button"
                          onClick={() => {
                            setProfileDraft(profile)
                            setActiveView('settings')
                            setIsProfileMenuOpen(false)
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition hover:bg-slate-100"
                        >
                          <UserRound size={18} />
                          <span className="flex-1 font-medium">My Profile</span>
                          <span className="text-slate-400">›</span>
                        </button>

                        <button
                          type="button"
                          onClick={openSettings}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition hover:bg-slate-100"
                        >
                          <Settings size={18} />
                          <span className="flex-1 font-medium">Settings</span>
                          <span className="text-slate-400">›</span>
                        </button>

                        <button
                          type="button"
                          onClick={openNotifications}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition hover:bg-slate-100"
                        >
                          <Bell size={18} />
                          <span className="flex-1 font-medium">Notifications</span>
                          {notifications.length > 0 && (
                            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                              {notifications.length}
                            </span>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={openHelpCenter}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition hover:bg-slate-100"
                        >
                          <CircleHelp size={18} />
                          <span className="flex-1 font-medium">Help Center</span>
                          <span className="text-slate-400">›</span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setTheme((current) => (current === 'light' ? 'dark' : 'light'))
                          }
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition hover:bg-slate-100"
                        >
                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                              isDark
                                ? 'bg-amber-100 text-amber-600'
                                : 'bg-indigo-100 text-indigo-600'
                            }`}
                          >
                            {isDark ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
                          </span>
                          <span className="flex-1 font-medium">
                            {isDark ? 'Light mode' : 'Dark mode'}
                          </span>
                          <span
                            className={`relative h-6 w-11 rounded-full transition ${
                              isDark ? 'bg-teal-600' : 'bg-slate-300'
                            }`}
                          >
                            <span
                              className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${
                                isDark ? 'left-6' : 'left-1'
                              }`}
                            />
                          </span>
                        </button>
                      </div>

                      <div className="border-t border-slate-200 p-2">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                        >
                          <LogOut size={18} />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </header>

            {activeView !== 'settings' &&
              activeView !== 'help' &&
              activeView !== 'notifications' && (
                <TaskStats
                  totalTasks={tasks.length}
                  completedTasks={completedTasks}
                  pendingTasks={pendingTasks}
                />
              )}

            {activeView === 'tasks' || activeView === 'completed' ? (
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
                <div className="mb-6">
                  <h3 className="text-xl font-bold">
                    {activeView === 'completed' ? 'Completed Tasks' : 'Task List'}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {activeView === 'completed'
                      ? 'Review the tasks you have completed.'
                      : 'Add tasks and track your progress.'}
                  </p>
                </div>

                <input
                  type="text"
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder="Search tasks..."
                  aria-label="Search tasks"
                  className="mb-4 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />

                {activeView === 'tasks' && (
                  <div className="mb-5 flex flex-wrap gap-2">
                    {[
                      { value: 'all', label: 'All Tasks' },
                      { value: 'pending', label: 'Pending' },
                      { value: 'completed', label: 'Completed' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFilter(option.value)}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                          filter === option.value
                            ? 'bg-teal-600 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}

                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                  <label htmlFor="task-sort" className="text-sm font-medium">
                    Sort tasks by
                  </label>
                  <select
                    id="task-sort"
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                    className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  >
                    <option value="default">Default order</option>
                    <option value="priority">Priority: High to Low</option>
                    <option value="dueDate">Due Date: Earliest First</option>
                    <option value="newest">Newest First</option>
                    <option value="alphabetical">Alphabetical: A to Z</option>
                  </select>
                </div>

                {activeView === 'tasks' && (
                  <form
                    onSubmit={addTask}
                    className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
                  >
                    <div className="min-w-0">
                      <label htmlFor="new-task" className="mb-2 block text-sm font-medium">
                        Task name *
                      </label>
                      <input
                        id="new-task"
                        type="text"
                        value={newTask}
                        onChange={(event) => setNewTask(event.target.value)}
                        maxLength={100}
                        placeholder="e.g. Complete React project"
                        aria-describedby="task-name-help"
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                      />
                      <p id="task-name-help" className="mt-2 text-xs text-slate-500">
                        Required. Maximum 100 characters.
                      </p>
                    </div>

                    {showCategoryField && (
                      <div>
                        <label htmlFor="new-category" className="mb-2 block text-sm font-medium">
                          Category (optional)
                        </label>
                        <select
                          id="new-category"
                          value={newCategory}
                          onChange={(event) => setNewCategory(event.target.value)}
                          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
                        >
                          <option value="">Select category</option>
                          <option value="Personal">Personal</option>
                          <option value="Learning">Learning</option>
                          <option value="Work">Work</option>
                          <option value="Development">Development</option>
                        </select>
                      </div>
                    )}

                    {showPriorityField && (
                      <div>
                        <label htmlFor="new-priority" className="mb-2 block text-sm font-medium">
                          Priority (optional)
                        </label>
                        <select
                          id="new-priority"
                          value={newPriority}
                          onChange={(event) => setNewPriority(event.target.value)}
                          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
                        >
                          <option value="">Select priority</option>
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      </div>
                    )}

                    {showDueDateField && (
                      <DueDatePicker value={newDueDate} onChange={setNewDueDate} />
                    )}

                    <div className="flex items-end">
                      <button
                        type="submit"
                        className="w-full rounded-xl bg-teal-600 px-6 py-3 font-semibold text-white transition hover:bg-teal-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-teal-300"
                      >
                        + Add Task
                      </button>
                    </div>
                  </form>
                )}

                <TaskList
                  tasks={sortedTasks}
                  toggleTask={toggleTask}
                  deleteTask={deleteTask}
                  editTask={editTask}
                  showModal={showModal}
                />
              </section>
            ) : activeView === 'calendar' ? (
              <CalendarView tasks={tasks} />
            ) : activeView === 'notifications' ? (
              <section className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold">Your notifications</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Task deadline reminders based on your saved tasks.
                      </p>
                    </div>
                    <span className="rounded-full bg-teal-50 px-3 py-1.5 text-sm font-semibold text-teal-700">
                      {notifications.length} reminders
                    </span>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">Overdue</p>
                      <p className="mt-2 text-2xl font-bold text-red-600">{overdueCount}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">Due today</p>
                      <p className="mt-2 text-2xl font-bold text-amber-600">{todayCount}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">Pending tasks</p>
                      <p className="mt-2 text-2xl font-bold">{pendingTasks}</p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    {notifications.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-slate-300 px-5 py-12 text-center">
                        <div className="text-4xl">🔔</div>
                        <h4 className="mt-3 font-semibold">You're all caught up!</h4>
                        <p className="mt-1 text-sm text-slate-500">
                          No upcoming or overdue task deadlines found.
                        </p>
                      </div>
                    ) : (
                      notifications.map((item) => {
                        const { Icon: TaskIcon, style: taskIconStyle } = getTaskIcon(item)

                        return (
                        <div
                          key={item.id}
                          className={`flex flex-col gap-3 rounded-xl border p-4 transition hover:shadow-sm sm:flex-row sm:items-center ${
                            item.overdue
                              ? 'border-red-200'
                              : item.dueDate === todayString
                                ? 'border-amber-200'
                                : 'border-slate-200'
                          }`}
                        >
                          <div className="relative shrink-0">
                            <div
                              className={`flex h-11 w-11 items-center justify-center rounded-xl ${taskIconStyle}`}
                              aria-hidden="true"
                            >
                              <TaskIcon size={20} strokeWidth={1.9} />
                            </div>
                            <span
                              className={`absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white text-white ${
                                item.overdue
                                  ? 'bg-red-500'
                                  : item.dueDate === todayString
                                    ? 'bg-amber-500'
                                    : 'bg-teal-600'
                              }`}
                              aria-label={item.overdue ? 'Overdue task' : item.dueDate === todayString ? 'Task due today' : 'Upcoming task'}
                              title={item.overdue ? 'Overdue' : item.dueDate === todayString ? 'Due today' : 'Upcoming'}
                            >
                              {item.overdue ? <Clock3 size={11} /> : item.dueDate === todayString ? <Bell size={10} /> : <CalendarDays size={10} />}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold">{item.title}</p>
                            <p className="mt-1 text-sm text-slate-500">{item.message}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setSearchText(item.title)
                              setActiveView('tasks')
                            }}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium transition hover:bg-slate-50"
                          >
                            View task
                          </button>
                        </div>
                        )
                      })
                    )}
                  </div>

                  <p className="mt-5 text-xs leading-5 text-slate-400">
                    These reminders appear inside TaskFlow. Browser push notifications and email reminders are not enabled.
                  </p>
                </div>
              </section>
            ) : activeView === 'help' ? (
              <section className="taskflow-fade-up space-y-6">
                <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-teal-950 to-emerald-900 p-6 text-white shadow-xl sm:p-10 lg:p-12">
                  <div className="pointer-events-none absolute -right-16 -top-20 -z-10 h-64 w-64 rounded-full bg-teal-400/20 blur-3xl" />
                  <div className="pointer-events-none absolute -bottom-24 left-1/3 -z-10 h-64 w-64 rounded-full bg-emerald-400/15 blur-3xl" />

                  <div className="relative max-w-2xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-teal-100 backdrop-blur">
                      <Sparkles size={14} />
                      TASKFLOW SUPPORT
                    </div>

                    <h3 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                      How can we help?
                    </h3>

                    <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                      Find quick answers, explore helpful guides, and get back to what matters most.
                    </p>

                    <div className="mt-7 flex items-center gap-3 rounded-2xl border border-white/15 bg-white p-2 shadow-lg transition focus-within:ring-4 focus-within:ring-teal-400/30">
                      <Search className="ml-2 shrink-0 text-slate-500" size={21} />
                      <input
                        type="search"
                        value={helpSearch}
                        onChange={(event) => setHelpSearch(event.target.value)}
                        placeholder="Search questions, tasks, settings..."
                        aria-label="Search help articles"
                        className="min-w-0 flex-1 border-0 bg-transparent px-1 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:ring-0"
                      />
                      {helpSearch && (
                        <button
                          type="button"
                          onClick={() => setHelpSearch('')}
                          aria-label="Clear help search"
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>

                    <p className="mt-3 text-xs text-slate-400">
                      Search our FAQs to find the answer you need.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => {
                      setHelpSearch('task')
                      setOpenHelpItem(0)
                    }}
                    className="taskflow-help-card rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                      <CheckCircle2 size={23} />
                    </div>
                    <h4 className="mt-4 font-bold">Managing tasks</h4>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Learn how to create, edit, complete, and organize your tasks.
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-teal-700">
                      Explore guides <ChevronRight size={16} />
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setHelpSearch('profile')
                      setOpenHelpItem(2)
                    }}
                    className="taskflow-help-card rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                      <UserRound size={23} />
                    </div>
                    <h4 className="mt-4 font-bold">Profile & settings</h4>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Update your profile, change the appearance, and manage preferences.
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-teal-700">
                      Explore guides <ChevronRight size={16} />
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setHelpSearch('notifications')
                      setOpenHelpItem(4)
                    }}
                    className="taskflow-help-card rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm sm:col-span-2 lg:col-span-1"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                      <Bell size={23} />
                    </div>
                    <h4 className="mt-4 font-bold">Deadlines & reminders</h4>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Understand due dates, overdue tasks, and in-app reminders.
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-teal-700">
                      Explore guides <ChevronRight size={16} />
                    </span>
                  </button>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-teal-700">
                        <LifeBuoy size={21} />
                        <span className="text-xs font-bold tracking-widest">HELP LIBRARY</span>
                      </div>
                      <h3 className="mt-3 text-xl font-bold sm:text-2xl">
                        Frequently asked questions
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        Simple answers to help you use TaskFlow with confidence.
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                      {filteredHelpArticles.length} articles
                    </span>
                  </div>

                  <div className="mt-6 space-y-3">
                    {filteredHelpArticles.length === 0 ? (
                      <div className="taskflow-soft-pop rounded-2xl border border-dashed border-slate-300 px-5 py-12 text-center">
                        <Search className="mx-auto text-slate-400" size={32} />
                        <h4 className="mt-4 font-semibold">No matching articles</h4>
                        <p className="mt-2 text-sm text-slate-500">
                          Try different keywords or clear your search.
                        </p>
                        <button
                          type="button"
                          onClick={() => setHelpSearch('')}
                          className="mt-4 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
                        >
                          Clear search
                        </button>
                      </div>
                    ) : (
                      filteredHelpArticles.map((article) => {
                        const articleIndex = helpArticles.findIndex(
                          (item) => item.question === article.question,
                        )
                        const isOpen = openHelpItem === articleIndex

                        return (
                          <div
                            key={article.question}
                            className={`overflow-hidden rounded-2xl border transition-colors duration-200 ${
                              isOpen
                                ? 'border-teal-300 bg-teal-50/40'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => setOpenHelpItem(isOpen ? -1 : articleIndex)}
                              aria-expanded={isOpen}
                              className="flex w-full items-center gap-3 px-4 py-4 text-left sm:px-5"
                            >
                              <span
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                                  isOpen
                                    ? 'bg-teal-100 text-teal-800'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                <CircleHelp size={19} />
                              </span>
                              <span className="flex-1 text-sm font-semibold sm:text-base">
                                {article.question}
                              </span>
                              <ChevronDown
                                size={19}
                                className={`shrink-0 text-slate-500 transition-transform duration-200 ${
                                  isOpen ? 'rotate-180' : ''
                                }`}
                              />
                            </button>

                            {isOpen && (
                              <div className="taskflow-fade-up border-t border-slate-200/80 px-4 pb-5 pt-4 sm:px-5 sm:pl-[4.25rem]">
                                <p className="text-sm leading-7 text-slate-600">
                                  {article.answer}
                                </p>
                              </div>
                            )}
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="taskflow-help-card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                        <ShieldCheck size={23} />
                      </div>
                      <div>
                        <h4 className="font-bold">Your data, explained</h4>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          Your current tasks and profile are stored in this browser. Database sync and account security will be added separately.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="taskflow-help-card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                        <MessageCircle size={23} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold">Need more help?</h4>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          This version has a local help library. Live chat and support tickets are not connected yet.
                        </p>
                        <button
                          type="button"
                          onClick={() => setActiveView('tasks')}
                          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
                        >
                          Back to My Tasks <ExternalLink size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            ) : (
              <section className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold">Profile settings</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Update your name, email and profile picture.
                    </p>
                  </div>

                  <form onSubmit={saveProfile} className="space-y-5">
                    <div className="flex flex-wrap items-center gap-5">
                      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-teal-100 text-4xl font-bold text-teal-800 ring-4 ring-teal-50">
                        {profileDraft.avatar ? (
                          profileDraft.avatar.startsWith('data:image/') ? (
                            <img
                              src={profileDraft.avatar}
                              alt="Profile preview"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            profileDraft.avatar
                          )
                        ) : (
                          (profileDraft.name.trim()[0] || 'A').toUpperCase()
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => photoInputRef.current?.click()}
                          className="rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
                        >
                          Upload photo
                        </button>
                        <input
                          ref={photoInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => setShowAvatarChoices((open) => !open)}
                          className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold hover:bg-slate-100"
                        >
                          Choose avatar
                        </button>
                        {profileDraft.avatar && (
                          <button
                            type="button"
                            onClick={removePhoto}
                            className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>

                    {showAvatarChoices && (
                      <div className="rounded-xl border border-slate-200 p-4">
                        <p className="mb-3 text-sm font-semibold">Choose your avatar</p>
                        <div className="flex flex-wrap gap-3">
                          {readyAvatars.map((avatar) => (
                            <button
                              key={avatar}
                              type="button"
                              onClick={() => chooseAvatar(avatar)}
                              aria-label={`Choose avatar ${avatar}`}
                              className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-slate-200 bg-slate-50 text-2xl transition hover:border-teal-500 hover:bg-teal-50"
                            >
                              {avatar}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <label htmlFor="profile-name" className="mb-2 block text-sm font-medium">
                        Full name
                      </label>
                      <input
                        id="profile-name"
                        type="text"
                        maxLength={60}
                        value={profileDraft.name}
                        onChange={(event) =>
                          setProfileDraft((current) => ({
                            ...current,
                            name: event.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="profile-email" className="mb-2 block text-sm font-medium">
                        Email address
                      </label>
                      <input
                        id="profile-email"
                        type="email"
                        value={profileDraft.email}
                        onChange={(event) =>
                          setProfileDraft((current) => ({
                            ...current,
                            email: event.target.value,
                          }))
                        }
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                      />
                    </div>

                    <button
                      type="submit"
                      className="rounded-xl bg-teal-600 px-6 py-3 font-semibold text-white hover:bg-teal-700"
                    >
                      Save profile changes
                    </button>
                  </form>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                  <h3 className="text-xl font-bold">Appearance</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Choose the look that feels comfortable for you.
                  </p>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setTheme('light')}
                      aria-pressed={!isDark}
                      className={`rounded-xl border-2 p-5 text-left transition ${
                        !isDark
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                        <Sun size={24} strokeWidth={1.8} />
                      </span>
                      <span className="mt-2 block font-semibold">Light mode</span>
                      <span className="mt-1 block text-sm text-slate-500">
                        Bright background and dark text.
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTheme('dark')}
                      aria-pressed={isDark}
                      className={`rounded-xl border-2 p-5 text-left transition ${
                        isDark
                          ? 'border-teal-500 bg-slate-800'
                          : 'border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                        <Moon size={24} strokeWidth={1.8} />
                      </span>
                      <span className="mt-2 block font-semibold">Dark mode</span>
                      <span className="mt-1 block text-sm text-slate-500">
                        Dark background for low-light use.
                      </span>
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                  <h3 className="text-xl font-bold">Task data</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Your tasks are currently stored in this browser using localStorage.
                  </p>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">Total tasks</p>
                      <p className="mt-2 text-2xl font-bold">{tasks.length}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">Completed tasks</p>
                      <p className="mt-2 text-2xl font-bold text-teal-700">{completedTasks}</p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-500">
                    Clearing browser site data may remove saved tasks and profile settings. Clear All Tasks only removes tasks, not your profile.
                  </p>

                  <button
                    type="button"
                    onClick={clearAllTasks}
                    disabled={tasks.length === 0}
                    className="mt-4 rounded-xl border border-red-300 px-5 py-3 font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Clear all tasks
                  </button>
                </div>
              </section>
            )}

            <footer className="py-6 text-center text-sm text-slate-400">
              TaskFlow · Stay organized, one task at a time.
            </footer>
          </>
        )}

        <FeedbackModal modal={modal} onClose={closeModal} />

        {showOptionalFieldsModal && !isLoggedOut && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="optional-fields-title"
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            >
              <h2 id="optional-fields-title" className="text-xl font-bold text-slate-900">
                Add More Details?
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                You have not selected these optional fields. Select the fields you want to complete, or add your task with the information you already entered.
              </p>

              <div className="mt-5 space-y-3">
                {missingFields.map((field) => (
                  <label
                    key={field}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:bg-slate-50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedOptionalFields.includes(field)}
                      onChange={() => toggleOptionalField(field)}
                      className="h-4 w-4 accent-teal-600"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      {optionalFieldLabels[field]}
                    </span>
                  </label>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    setShowOptionalFieldsModal(false)
                    setFieldsToComplete(null)
                    setSelectedOptionalFields([])
                    setMissingFields([])
                  }}
                  className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={saveTask}
                  className="flex-1 rounded-xl border border-teal-600 px-4 py-3 text-sm font-semibold text-teal-700 hover:bg-teal-50"
                >
                  Add Anyway
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFieldsToComplete([...selectedOptionalFields])
                    setShowOptionalFieldsModal(false)
                  }}
                  disabled={selectedOptionalFields.length === 0}
                  className="flex-1 rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Add More Fields
                </button>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
