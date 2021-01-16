const { DOMAINE } = require('../config')

module.exports = checkPermission = (user, permission) => {
    if (user && user[DOMAINE]) {
        return user[DOMAINE].permissions.includes(
            permission
        );
    }
    return false;
}