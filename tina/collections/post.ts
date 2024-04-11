import { Collection } from "tinacms";

const Post: Collection = {
  name: "post",
  label: "Posts",
  path: "content/post",
  fields: [
    {
      type: "string",
      name: "title",
      label: "Title",
      isTitle: true,
      required: true,
    },
    {
      type: "datetime",
      label: "Date",
      name: "date",
    },
    {
        type: 'string',
        label: 'Image',
        name: 'image',
        description: 'Image for this post',
    },
    {
      type: 'string',
      name: 'frontmatter_tags',
      nameOverride: 'frontmatter.tags',
      label: 'Tags',
      description: 'Tags for this post',
      list: true,
      ui: {
          component: 'tags',
      },
    },
    {
      type: "boolean",
      name: "draft",
      label: "Draft",
      required: true,
      description: 'If this is checked the post will not be published',
    },
    {
      type: "rich-text",
      name: "body",
      label: "Body",
      isBody: true,
    },
  ],
};

export default Post;