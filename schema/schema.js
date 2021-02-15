const graphql = require('graphql');
const _ = require('lodash');

const { GraphQLSchema, GraphQLObjectType, GraphQLID, GraphQLString } = graphql;

// dummy data
var tasks = [
    { id: '1', title: 'Complete To-Do', description: 'Follow REACT tutorial to get basis of to-do frontend layout', project: '3'  },
    { id: '2', title: 'Complete API - GraphQL', description: 'Follow GraphQL tutorial to get basis of GraphQL API point working', project: '1' },
    { id: '3', title: 'Complete API - REST', description: 'Set up REST API that matches GraphQL functionality', project: '1'  }
];
var projects = [
    { id: '1', name: 'API', user: '1' },
    { id: '2', name: 'SchradeAdevntures', user: '1' },
    { id: '3', name: 'To-Do', user: '1' }
];
var users = [
    { id: '1' , firstName: 'Jonathan', lastName: 'Schrade', email: 'jonathan.schrade@gmail.com' }
];

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString }
    })
});

const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        user: { type: UserType }
    })
}); 

const TaskType = new GraphQLObjectType({
    name: 'Task',
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        project: { type: ProjectType }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return _.find(users, { id: args.id });
            }
        },
        project: {
            type: ProjectType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return _.find(projects, { id: args.id });
            }
        },
        task: {
            type: TaskType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return _.find(tasks, { id: args.id });
            }
        },
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});