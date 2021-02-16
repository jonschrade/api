const graphql = require('graphql');
const _ = require('lodash');
const Task = require('../models/task');
const Project = require('../models/project');
const Label = require('../models/label');
const User = require('../models/user');

const { GraphQLSchema, GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList } = graphql;

// dummy data
var users = [
    { id: '1' , firstName: 'Jonathan', lastName: 'Schrade', email: 'jonathan.schrade@gmail.com' }
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
                //return  _.filter(projects, ({users}) => { return users.includes(parent.id) });
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
                //return  _.filter(users, ({id}) => {return parent.users.includes(id)});
            }
        },
        tasks: {
            type: new GraphQLList(TaskType),
            resolve(parent, args) {
                //return _.filter(tasks, { projectId: parent.id });
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
                //return _.find(projects, { id: parent.projectId });
            }
        },
        labels: {
            type: new GraphQLList(LabelType),
            resolve(parent, args) {
                //return  _.filter(labels, ({id}) => { return parent.labels.includes(id) });
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
                //return _.filter(tasks, ({labels}) => { return labels.includes(parent.id) })
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                //return _.find(users, { id: args.id });
            }
        },
        project: {
            type: ProjectType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                //return _.find(projects, { id: args.id });
            }
        },
        task: {
            type: TaskType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                //return _.find(tasks, { id: args.id });
            }
        },
        label: {
            type: LabelType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                //return _.find(labels, { id: args.id });
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                //return users;
            }
        },
        projects: {
            type: new GraphQLList(ProjectType),
            resolve(parent, args) {
                //return projects;
            }
        },
        tasks: {
            type: new GraphQLList(TaskType),
            resolve(parent, args) {
                //return tasks;
            }
        },
        labels: {
            type: new GraphQLList(LabelType),
            resolve(parent, args) {
                //return labels;
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args: { 
                firstName : { type: GraphQLString },
                lastName : { type: GraphQLString },
                email : { type: GraphQLString }
            },
            resolve(parent, args) {
                let newUser = new User({
                    firstName: args.firstName,
                    lastName: args.lastName,
                    email: args.email
                });
                newUser.save();
            }
        },
        addProject: {
            type: ProjectType,
            args:  { 
                name : { type: GraphQLString },
                users : { type: new GraphQLList(GraphQLString) }
            },
            resolve(parent, args) {
                let newProject = new Project({
                    name: args.name,
                    users: args.users
                });
                newProject.save();
            }
        },
        addTask: {
            type: TaskType,
            args: { 
                title : { type: GraphQLString },
                description : { type: GraphQLString },
                projectId: { type: GraphQLID },
                labels: { type: GraphQLList(GraphQLString) }
            },
            resolve(parent, args) {
                let newTask = new Task({
                    title: args.title,
                    description: args.description,
                    projectId: args.projectId,
                    labels: args.labels
                });
                newTask.save();
            }
        },
        addLabel: {
            type: LabelType,
            args: { 
                name : { type: GraphQLString }
            },
            resolve(parent, args) {
                let newLabel = new Label({
                    name: args.name
                });
                newLabel.save();
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});