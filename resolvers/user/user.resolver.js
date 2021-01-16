const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { DOMAINE, SECRET_KEY } = require('../../config')

module.exports = {
    Query: {
        users: (_, { input }, { models, pubsub }) => {
            // publish event subscription
            pubsub.publish('GET_USERS2', { users: models.User.find(input) })
            return models.User.find(input)
        },
        profil: (_, __, { models, user }) => models.User.findOne({ _id: user.sub })
    },

    Mutation: {
        addUser: (_, { input }, { models }) => {
            const { username, password, roles } = input

            const user = new models.User({
                username,
                roles,
                password: bcrypt.hashSync(password, 3)
            })
            user.save()
            return user
        },

        login: async (_, args, { models }) => {
            const user = await models.User.findOne({ username: args.username })
            if (!user) throw new Error('mauvais login');

            const matchPassword = bcrypt.compareSync(args.password, user.password)
            if (!matchPassword) throw new Error('mauvais password');

            return {
                token: jwt.sign(
                    { [DOMAINE]: { roles: user.roles, permissions: user.permissions } },
                    SECRET_KEY,
                    { algorithm: "HS256", subject: `${user._id}`, expiresIn: "1d" }
                )
            };
        }
    },

    Subscription: {
        // ready to recept event subscription
        users: {
            subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(['GET_USERS', 'GET_USERS2'])
        }
    },

    User: {
        pets: (user, _, { models }) => models.Pet.find({ owner: user._id })
    }
}