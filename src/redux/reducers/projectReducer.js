import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default function projectReducer(state = initialState.project, action) {
  // debugger
  switch (action.type) {
    case types.PROJECTS_FETCH:
      return { ...state, projectList: { ...state.projectList, isFetching: true } }
    case types.PROJECTS_SUCCESS:
      return { ...state, projectList: { isFetching: false, data: action.projectList } }
    case types.PROJECTS_SELECTED:
      return { ...state, selectedProject: action.selectedProject };
    case types.GETALL_STATS_FETCH:
      return { ...state, stats: { ...state.stats, isFetching: true } };
    case types.GETALL_STATS_SUCCESS:
      return { ...state, stats: { isFetching: false, data: action.stats } };
    case types.GETALL_RECENTLYUSED_FETCH:
      return { ...state, recentlyUsed: { ...state.recentlyUsed, isFetching: true } };
    case types.GETALL_RECENTLYUSED_SUCCESS:
      return { ...state, recentlyUsed: { isFetching: false, data: action.recentlyUsed } };
    case types.GETALL_PROVISIONEDPRODUCTS_FETCH:
      return { ...state, provisionedProducts: { ...state.provisionedProducts, isFetching: true } };
    case types.GETALL_PROVISIONEDPRODUCTS_SUCCESS:
      return { ...state, provisionedProducts: { isFetching: false, data: action.provisionedProducts } };
    case types.GETALL_PRODUCTSCATALOG_FETCH:
      return { ...state, productsCatalog: { ...state.productsCatalog, isFetching: true } };
    case types.GETALL_PRODUCTSCATALOG_SUCCESS:
      return { ...state, productsCatalog: { isFetching: false, data: action.productsCatalog } };
    case types.GETALL_PROVISIONEDPRODUCTDETAILS_SUCCESS:
      return { ...state, provisionedProductDetails: action.provisionedProductDetails };
    case types.PROVISIONE_PRODUCT_SELECTED:
      return { ...state, catalogProduct: action.catalogProduct };
    case types.SERVICEACTION_EXECUTE_STATUS:
      return { ...state, catalogProduct: action.serviceActionResult };
    case types.BANNER:
      return { ...state, bannerData: action.bannerData };
    case types.CHANGE_VIEW:
      return { ...state, tableView: !state.tableView };
    default:
      return state;
  }
}
