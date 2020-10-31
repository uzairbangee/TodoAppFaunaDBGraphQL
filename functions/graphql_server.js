const { ApolloServer, gql } = require('apollo-server-lambda')
const faunadb = require('faunadb'),
  q = faunadb.query;

const dotenv = require('dotenv');
dotenv.config();

const typeDefs = gql`
    type Query {
        todo : [Todo!]
    }

    type Todo {
        id: ID!
        title: String!
        completed: Boolean!
    }

    type Mutation {
        addTodo(title: String!) : Todo
        removeTodo(id: ID!) : Todo
        updateTodo(id: ID!, completed: Boolean!): Todo
    }
`

const resolvers = {
    Query : {
        todo : async (root, args, context) => {
            try {
                const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET_KEY });
                const result = await client.query(
                    q.Map(
                        q.Paginate(q.Documents(q.Collection('todos'))),
                        q.Lambda('todo', q.Get(q.Var('todo')))
                    )
                )
                
                return result.data.map(dt => (
                    {
                        id: dt.ref.id,
                        title: dt.data.title,
                        completed: dt.data.completed
                    }
                ))
            }
            catch(err){
                return err.toString()
            }
        }
    },
    Mutation : {
        addTodo: async (_, {title}) => {
            try{
                const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET_KEY });
                const result = await client.query(
                    q.Create(
                        q.Collection('todos'),
                        {
                            data: {
                                title: title,
                                completed: false
                            }
                        }
                    )
                )
                
                return {
                    id : result.ref.id,
                    title: result.data.title,
                    completed: result.data.completed
                }
            }
            catch(err){
                return err.toString()
            }
        },
        removeTodo: async (_, {id}) => {
            try {
                const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET_KEY });
                const result = await client.query(
                    q.Delete(
                        q.Ref(q.Collection("todos"), ""+id)
                    )
                )
                
                return {
                    id : result.ref.id,
                    title: result.data.title,
                    completed: result.data.completed
                }
            }
            catch(err){
                return err.toString()
            }
        },
        updateTodo: async(_, {id, completed}) => {
            try {
                const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET_KEY });
                const result = await client.query(
                    q.Update(
                        q.Ref(q.Collection("todos"), ""+id),
                        {
                            data: {
                              completed: completed
                            }
                        }
                    )
                )
                
                return {
                    id : result.ref.id,
                    title: result.data.title,
                    completed: result.data.completed
                }
            }
            catch(err){
                return err.toString()
            }
        }
    }
}


const server = new ApolloServer({
    typeDefs,
    resolvers,
    playground: true
})

exports.handler = server.createHandler()