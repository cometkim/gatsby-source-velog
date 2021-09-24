export type PluginOptions = {
  /**
   * Velog base URL
   *
   * @default https://velog.io
   */
  baseUrl?: string,

  /**
   * Velog API(v2) endpoint
   *
   * @default https://v2.velog.io/graphql
   */
  endpoint?: string,

  /**
   * Username of author
   */
  username: string,

  /**
   * Tag names to include
   */
  includeTags?: string[],
};
