export type BreadcrumbTransformer = {
  transform: (slug: string) => { name: string };
};
