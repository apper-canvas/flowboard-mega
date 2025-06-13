import ProjectsList from '@/components/pages/ProjectsList';
import Dashboard from '@/components/pages/Dashboard';
import ProjectBoard from '@/components/pages/ProjectBoard';
import MyTasks from '@/components/pages/MyTasks';
import Team from '@/components/pages/Team';
import Settings from '@/components/pages/Settings';

export const routes = {
  projects: {
    id: 'projects',
    label: 'Projects',
    path: '/',
    icon: 'FolderOpen',
    component: ProjectsList
  },
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  board: {
    id: 'board',
    label: 'Board',
    path: '/project/:projectId',
    icon: 'Columns3',
    component: ProjectBoard,
    hidden: true
  },
  tasks: {
    id: 'tasks',
    label: 'My Tasks',
    path: '/tasks',
    icon: 'CheckSquare',
    component: MyTasks
  },
  team: {
    id: 'team',
    label: 'Team',
    path: '/team',
    icon: 'Users',
    component: Team
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    component: Settings
},
  gantt: {
    id: 'gantt',
    label: 'Gantt Chart',
    path: '/project/:projectId/gantt',
    icon: 'Calendar',
    component: ProjectBoard,
    hidden: true
  }
};

export const routeArray = Object.values(routes);