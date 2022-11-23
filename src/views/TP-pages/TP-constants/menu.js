const menuData = [
  {
    icon: 'iconsminds-file-edit',
    label: 'Post',
    to: "/owner/portal",
  }
  ,
  {
    icon: 'simple-icon-user',
    label: 'Holders',
    to: "/owner/holders",
  },
  {
    icon: 'simple-icon-arrow-right',
    label: 'Air Drop',
    to: "/owner/air-drop",
  },
  {
    icon: 'simple-icon-diamond',
    label: 'Mint',
    to: "/owner/mint",
  },
  {
    icon: 'simple-icon-refresh',
    label: 'Modify Contract',
    to: "/owner/modify-contract",
  },
  {
    icon: 'simple-icon-power',
    label: 'Deploy Contract',
    to: "/owner/deploy-contract",
  }
];

const data = [
  {
    id: 'gogo',
    to: "/user",
    subs: menuData
  }
];

export default data;