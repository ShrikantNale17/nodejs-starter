const allRoles = {
  user: ['userDetails', 'posts'],
  admin: ['admin', 'getUsers', 'manageUsers'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
