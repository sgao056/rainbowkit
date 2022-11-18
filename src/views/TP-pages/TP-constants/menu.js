const menuData = [
  {
    icon: 'simple-icon-globe',
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
    icon: 'simple-icon-layers',
    label: 'Air Drop',
    to: "/owner/air-drop",
  },
  {
    icon: 'simple-icon-globe',
    label: 'Mint',
    to: "/owner/mint",
  },
  {
    icon: 'iconsminds-shop',
    label: 'Modify Contract',
    to: "/owner/modify-contract",
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