const { ApolloServer, makeExecutableSchema } = require('apollo-server-express');
const { applyMiddleware } = require('graphql-middleware');
const { PubSub } = require('graphql-subscriptions');
const express = require('express');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { PORT, USER_MONGODB, MDP_MONGODB, DATABASE, SECRET_KEY, DOMAINE } = require('./config')
const typeDefs = require('./schemas');
const resolvers = require('./resolvers');
const models = require('./models');
const permissions = require('./permissions');
const schemaDirectives = require('./directives')
const app = express();
const pubsub = new PubSub()

// Connecting MongoDB
mongoose.connect(`mongodb+srv://${USER_MONGODB}:${MDP_MONGODB}@cluster0.uira6.mongodb.net/${DATABASE}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('Error MongoDB', err))

// Middlewares
app.use(
    expressJwt({
        secret: SECRET_KEY,
        algorithms: ["HS256"],
        credentialsRequired: false
    })
)

// Create Apollo Server
const server = new ApolloServer({
    schema: applyMiddleware(
        makeExecutableSchema({
            typeDefs,
            resolvers,
            schemaDirectives,
        }),
        permissions
    ),
    subscriptions: {
        onConnect: (connectionParams, websocket) => {
            const { Authorization } = connectionParams
            if (Authorization){
                const token = Authorization.replace('Bearer ', '') || null
                jwt.verify(token, SECRET_KEY)
            }
            throw new Error('User is not authenticated')
        }
    },
    context({ req }) {
        const user = (req && req.user) || null
        return { models, user, pubsub }
    },
    tracing: true
});

// Create Server Apollo with express app
server.applyMiddleware({ app, path: '/' })

const ws = require('http').createServer(app);
server.installSubscriptionHandlers(ws);

ws.listen(PORT, () => {
    console.log(`🚀 Server ready at ${DOMAINE}:${PORT}${server.graphqlPath}`)
    console.log(`🚀 Subscriptions ready at ws://${DOMAINE}:${PORT}${server.subscriptionsPath}`)
});
