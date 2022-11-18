const menuData = [
  {
    icon: 'simple-icon-chart',
    label: 'Dashboard',
    to: "/app/dashboard",
  },
  {
    icon: 'simple-icon-grid',
    label: 'Inventory',
    to: "/app/inventory",
  },
  {
    icon: 'simple-icon-user',
    label: 'Holders',
    to: "/app/holders",
  },
  {
    icon: 'simple-icon-diamond',
    label: 'Rewards',
    to: "/app/rewards",
  },
  {
    icon: 'simple-icon-globe',
    label: 'Portal',
    to: "/app/portal",
  },
  {
    icon: 'simple-icon-refresh',
    label: 'Updates',
    to: "/app/updates",
  },
  {
    icon: 'simple-icon-layers',
    label: 'Meta data',
    to: "/app/meta-data",
  },
];

const data = [
  {
    id: 'gogo',
    icon: 'iconsminds-air-balloon-1',
    label: 'F',
    to: "/app",
    // roles: [UserRole.Admin, UserRole.Editor],
    subs: menuData
  },
  {
    id: 'secondmenu',
    icon: 'iconsminds-three-arrow-fork',
    label: 'R',
    to: "/app",
    subs: menuData
  },
  {
    id: 'newcommunity',
    icon: 'simple-icon-plus',
    label: 'Create',
    to: "/app/new-community",
  }
];
export default data;
