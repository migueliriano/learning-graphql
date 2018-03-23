'use strict';

const express = require('express');

const graphqlHTTP = require('express-graphql');

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLInputObjectType,
} = require('graphql');

const { 
  getVideoById,
  getVideos,
  createVideo,
} = require('./src/data');

const nodeInterface = require('./src/node');

const PORT = process.env.PORT || 3000;

const server = express();

const videoType = new GraphQLObjectType({
  name: 'videoType',
  description: 'A video on egghead.io',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'The id of the video.',
    },
    title: {
      type: GraphQLString,
      description: 'The title of the video.',
    },
    duration: {
      type: GraphQLInt,
      description: 'The duration of the video (in seconds).',
    },
    release: {
      type: GraphQLBoolean,
      description: 'Whether or not the viewer has watched the video.',
    },
  },
  interfaces: [nodeInterface],  
});

exports.videoType = videoType;

const queryType = new GraphQLObjectType({
  name: 'queryType',
  description: 'The root query type',
  fields: {
    videos: {
      type: GraphQLList(videoType),
      resolve: getVideos,
    },
    video:{
      type: videoType,
      args: {
        id: {
          type: GraphQLNonNull(GraphQLID),
          description: 'The id of the video.'
        }
      },
      resolve: (_, args) => {
        return getVideoById(args.id);
      },
    }
  }
});

const videoInputType = new GraphQLInputObjectType({
  name: 'VideoInput',
  fields: {
    title: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The title of the video.',
    },
    duration: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The duration of the video (in seconds).',
    },
    released: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Whether or not the video is released.',
    },
  }
});

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'The root Mutation Type',
  fields:{
    createVideo:{
      type: videoType,
      args: {
        video: {
          type: new GraphQLNonNull(videoInputType),
        }
      },
      resolve: (_, args) => {
        return createVideo(args.video);
      },
    }
  }
});

const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});

server.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
