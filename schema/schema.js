const graphql = require('graphql');
const _ = require('lodash');

const { GraphQLSchema, GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList } = graphql;

// dummy data
var tasks = [
    { id: '1', title: 'Complete To-Do', description: 'Follow REACT tutorial to get basis of to-do frontend layout', projectId: '3', status: 1, labels: ['1','3']  },
    { id: '2', title: 'Complete API - GraphQL', description: 'Follow GraphQL tutorial to get basis of GraphQL API point working', projectId: '1', status: 1, labels: ['1','4'] },
    { id: '3', title: 'Complete API - REST', description: 'Set up REST API that matches GraphQL functionality', projectId: '1', status: 1, labels: ['1','3'] }
];
var projects = [
    { id: '1', name: 'API', users: ['1'] },
    { id: '2', name: 'SchradeAdevntures', users: ['1'] },
    { id: '3', name: 'To-Do', users: ['1'] }
];
var users = [
    { id: '1' , firstName: 'Jonathan', lastName: 'Schrade', email: 'jonathan.schrade@gmail.com' }
];
var labels = [
    { id: '1', name: 'improvement' },
    { id: '2', name: 'bug-fix' },
    { id: '3', name: 'to-do' },
    { id: '4', name: 'working' }
];

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        projects: {
            type: new GraphQLList(ProjectType),
            resolve(parent, args) {
                return  _.filter(projects, ({users}) => { return users.includes(parent.id) });
            }
        }
    })
});

const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        users: { 
            type: new GraphQLList(UserType),
            resolve(parent, args){
                return  _.filter(users, ({id}) => {return parent.users.includes(id)});
            }
        },
        tasks: {
            type: new GraphQLList(TaskType),
            resolve(parent, args) {
                return _.filter(tasks, { projectId: parent.id });
            }
        },
    })
}); 

const TaskType = new GraphQLObjectType({
    name: 'Task',
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        project: { 
            type: ProjectType,
            resolve(parent, args){
                return _.find(projects, { id: parent.projectId });
            }
        },
        labels: {
            type: new GraphQLList(LabelType),
            resolve(parent, args) {
                return  _.filter(labels, ({id}) => { return parent.labels.includes(id) });
            }
        }
    })
});

const LabelType = new GraphQLObjectType({
    name: 'Label',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        tasks: {
            type: new GraphQLList(TaskType),
            resolve(parent, args) {
                return _.filter(tasks, ({labels}) => { return labels.includes(parent.id) })
            }
        }
    })
});

// const TaskLabelType = new GraphQLObjectType({
//     name: 'TaskLabel',
//     fields: () => ({
//         task: { 
//             type: TaskType,
//             resolve(parent, args) {
//                 return _.find(tasks, { id : parent.taskId });
//             }
//         },
//         label: { 
//             type: LabelType,
//             resolve(parent, args) {
//                 return _.find(labels, { id : parent.labelId });
//             } 
//         }
//     })
// });

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
        label: {
            type: LabelType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return _.find(labels, { id: args.id });
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return users;
            }
        },
        projects: {
            type: new GraphQLList(ProjectType),
            resolve(parent, args) {
                return projects;
            }
        },
        tasks: {
            type: new GraphQLList(TaskType),
            resolve(parent, args) {
                return tasks;
            }
        },
        labels: {
            type: new GraphQLList(LabelType),
            resolve(parent, args) {
                return labels;
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});