const graphql = require('graphql');
const _ = require('lodash');
const Task = require('../models/task');
const Project = require('../models/project');
const Label = require('../models/label');
const User = require('../models/user');

const { GraphQLSchema, GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList } = graphql;

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
                return Project.find({users: parent._id });
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
                return User.find({ _id: { $in: parent.users } });
            }
        },
        tasks: {
            type: new GraphQLList(TaskType),
            resolve(parent, args) {
                return Task.find({ projectId: parent._id });
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
                return Project.findById(parent.projectId);
            }
        },
        labels: {
            type: new GraphQLList(LabelType),
            resolve(parent, args) {
                return Label.find({ _id: { $in: parent.labels } });
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
                return Task.find({ labels: parent._id });
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
                return User.findById(args.id);
            }
        },
        project: {
            type: ProjectType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Project.findById(args.id);
            }
        },
        task: {
            type: TaskType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Task.findById(args.id);
            }
        },
        label: {
            type: LabelType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Label.findById(args.id);
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return User.find({});
            }
        },
        projects: {
            type: new GraphQLList(ProjectType),
            resolve(parent, args) {
                return Project.find({});
            }
        },
        tasks: {
            type: new GraphQLList(TaskType),
            resolve(parent, args) {
                return Task.find({});
            }
        },
        labels: {
            type: new GraphQLList(LabelType),
            resolve(parent, args) {
                return Label.find({});
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
                email : { type: GraphQLString, required: [true, 'Please enter an email'] }
            },
            resolve(parent, args) {
                let newUser = new User({
                    firstName: args.firstName,
                    lastName: args.lastName,
                    email: args.email
                });
                return newUser.save();
            }
        },
        addProject: {
            type: ProjectType,
            args:  { 
                name : { type: GraphQLString, required: [true, 'Please enter a name for the Project'] },
                users : { type: new GraphQLList(GraphQLID), required: [true, 'Project must have at least one User'] }
            },
            resolve(parent, args) {
                let newProject = new Project({
                    name: args.name,
                    users: args.users
                });
                return newProject.save();
            }
        },
        addTask: {
            type: TaskType,
            args: { 
                title : { type: GraphQLString, required: [true, 'Please enter a title for the Task'] },
                description : { type: GraphQLString },
                projectId: { type: GraphQLID, required: [true, 'Task must be linked to a Project'] },
                labels: { type: GraphQLList(GraphQLID) }
            },
            resolve(parent, args) {
                let newTask = new Task({
                    title: args.title,
                    description: args.description,
                    projectId: args.projectId,
                    labels: args.labels
                });
                return newTask.save();
            }
        },
        addLabel: {
            type: LabelType,
            args: { 
                name : { type: GraphQLString, required: [true, 'Please enter a name for the Label'] }
            },
            resolve(parent, args) {
                let newLabel = new Label({
                    name: args.name
                });
                return newLabel.save();
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});