import { MarkdownRemarkEdge } from './../graphql-types.d';
import {CreatePagesArgs} from 'gatsby';
import path from 'path';
import {Query} from '../graphql-types';

export async function createPages({actions, graphql}: CreatePagesArgs) {
  const {createPage} = actions;

  const {data, errors}  = await graphql<Query>(`  
    query ListQuery {
      allMarkdownRemark {
        edges {
          node {
            html
            frontmatter {
              title
              path
              date(formatString: "YYYY-MM-DD HH:mm:ss")
            }
          }
        }
      }
    }
  `);

  if (errors) {
    throw errors;
  }
  if (!data) {
    return null;
  }

  data.allMarkdownRemark.edges.forEach(({node}: MarkdownRemarkEdge) => {
    createPage({
      path: node.frontmatter?.path ?? '',
      context: {
        html: node.html,
        title: node.frontmatter?.title,
        date: node.frontmatter?.date
      },
      component: path.resolve(__dirname, '../templates/PostTemplate.tsx'),
    });
  });
}
