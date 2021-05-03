export default {
  auth: {
    session: {},
    user: {},
    // isAuthenticated: false
  },
  project: {
    projectList: { isFetching: false, data: [] },
    selectedProject: {},
    stats: { isFetching: false, data: {} },
    recentlyUsed: { isFetching: false, data: [] },
    provisionedProducts: { isFetching: false, data: [] },
    productsCatalog: { isFetching: false, data: [] },
    tableView: true,
    provisionedProductDetails: {},
    bannerData: {}
  }
};
