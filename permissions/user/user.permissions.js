const { and, or, rule } = require('graphql-shield');
const checkPermission = require('../check.permissions')

const isAuthenticated = rule()((_, __, { user }) => {
    return user !== null;
});

const canReadPets = rule()((_, __, { user }) => {
    return checkPermission(user, "read:pets");
});

const canCreatePet = rule()((parent, args, {user}) => {
    return checkPermission(user, "create:pet");
});

const isReadingOwnUser = rule()(({ _id }, __, { user }) => {
    return _id == user.sub;
});

module.exports = {
 
};
