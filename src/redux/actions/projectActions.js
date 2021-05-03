import * as types from "./actionTypes";
import history from '../../helpers/history';
import sc from '../../lib/ServiceCatalog';
import bgt from '../../lib/Budget';
import { Auth } from "aws-amplify";
import { isEmpty } from "../../helpers/utils";

export const getAllProjects = () => {
  return async dispatch => {
    dispatch({ type: types.PROJECTS_FETCH });
    try {
      const projectList = await sc.listPortfolios('us-west-2');
      dispatch({ type: types.PROJECTS_SUCCESS, projectList });
    } catch (error) {
      dispatch({ type: types.PROJECT_NOT_SELECTED, provisionedProducts: {} });
      localStorage.removeItem('selectedProject');
      history.push('/login');
    }
  }
};


export const getProvisionedProducts = (accessLevelFilterKey = "Account") => {
  return async dispatch => {
    dispatch({ type: types.GETALL_PROVISIONEDPRODUCTS_FETCH });
    try {
      const _selectedProject = JSON.parse(localStorage.getItem('selectedProject'));
      if (_selectedProject) {
        const provisionedProducts = await sc.searchProvisionedProducts(accessLevelFilterKey, 'us-west-2');
        const filteredProvisionedProducts = provisionedProducts.filter((provisionedProduct) => provisionedProduct.Tags.filter((tag) => tag.Key === 'ProjectId' && tag.Value === _selectedProject.Id).length > 0)
        // {
        //   let selectedProjectTag = provisionedProduct.Tags.filter((tag) => tag.Key === 'ProjectId' && tag.Value === _selectedProject.Id);
        //   if (selectedProjectTag.length > 0)
        //     return provisionedProduct;
        // });
        // console.log('projectActions >> filteredProvisionedProducts >> ', filteredProvisionedProducts);
        dispatch({ type: types.GETALL_PROVISIONEDPRODUCTS_SUCCESS, provisionedProducts: filteredProvisionedProducts });
      } else {
        dispatch({ type: types.PROJECT_NOT_SELECTED, provisionedProducts: {} });
        console.log('projectActions >> getProvisionedProducts >> Redirecting to /project-select');
        history.push('/project-select');
      }
    } catch (error) {
      dispatch({ type: types.PROJECT_NOT_SELECTED, provisionedProducts: {} });
      localStorage.removeItem('selectedProject');
      console.log('projectActions >> getProvisionedProducts >> Exception - Redirecting to /project-select');
      history.push('/project-select');
    }
  }
};


export const getProvisionedProductsForUser = (accessLevelFilterKey = "Account") => {
  return async dispatch => {
    dispatch({ type: types.GETALL_PROVISIONEDPRODUCTS_FETCH });
    try {
      const _selectedProject = JSON.parse(localStorage.getItem('selectedProject'));

      if (_selectedProject) {
        const currentUser = await Auth.currentAuthenticatedUser();
        const provisionedProducts = await sc.searchProvisionedProducts(accessLevelFilterKey, 'us-west-2');
        // const filteredProvisionedProducts = await provisionedProducts.filter((provisionedProduct) => {
        //   let userNameTag = provisionedProduct.Tags.filter((tag) => tag.Key === 'UserName' && tag.Value === currentUser.username);
        //   let selectedProjectTag = provisionedProduct.Tags.filter((tag) => tag.Key === 'ProjectId' && tag.Value === _selectedProject.Id);
        //   if (userNameTag.length > 0 && selectedProjectTag.length > 0) {
        //     return provisionedProduct;
        //   }
        //   // return provisionedProduct;
        // });
        const filteredProvisionedProducts = await provisionedProducts.filter((provisionedProduct) =>
          (provisionedProduct.Tags.filter((tag) => tag.Key === 'UserName' && tag.Value === currentUser.username).length > 0 &&
            provisionedProduct.Tags.filter((tag) => tag.Key === 'ProjectId' && tag.Value === _selectedProject.Id).length > 0));
        dispatch({ type: types.GETALL_PROVISIONEDPRODUCTS_SUCCESS, provisionedProducts: filteredProvisionedProducts });
      } else {
        dispatch({ type: types.PROJECT_NOT_SELECTED, provisionedProducts: {} });
        console.log('projectActions >> getProvisionedProductsForUser >> Redirecting to /project-select');
        history.push('/project-select');
      }
    } catch (error) {
      dispatch({ type: types.PROJECT_NOT_SELECTED, provisionedProducts: {} });
      localStorage.removeItem('selectedProject');
      console.log('projectActions >> getProvisionedProductsForUser >> Exception - Redirecting to /project-select');
      history.push('/project-select');
    }
  }
};


const _isRecentlyUsedUsedProduct = (provisionedProducts, productCatalog) => {
  console.log('projectActions >> _isRecentlyUsedUsedProduct >> ', productCatalog);
  if (!isEmpty(productCatalog) && !isEmpty(productCatalog.product)) {
    const matchedProvisionedProducts = provisionedProducts.filter(provisionedProduct => provisionedProduct.ProductId === productCatalog.product.ProductViewSummary.ProductId);
    if (matchedProvisionedProducts.length > 0)
      return true;
    return false;
  }
}

export const getRecentlyUsedProducts = () => {
  return async dispatch => {
    dispatch({ type: types.GETALL_RECENTLYUSED_FETCH });
    try {
      let recentlyUsed = {}
      const provisionedProducts = await sc.searchProvisionedProducts("Account", 'us-west-2');
      const selectedProject = JSON.parse(localStorage.getItem('selectedProject'));
      if (!isEmpty(selectedProject)) {
        const productsCatalog = await sc.searchProducts(selectedProject, 'us-west-2');
        if (isEmpty(productsCatalog) || productsCatalog.length < 1) {
          recentlyUsed = {};
        }
        else {
          console.log("projectActions >> getRecentlyUsedProducts");
          recentlyUsed = productsCatalog.filter(_productCatalog => _isRecentlyUsedUsedProduct(provisionedProducts, _productCatalog));
          // recentlyUsed = productsCatalog.filter(_productCatalog => {
          //   if (!isEmpty(_productCatalog) && !isEmpty(_productCatalog.product)) {
          //     const matchedProvisionedProducts = provisionedProducts.filter(provisionedProduct => provisionedProduct.ProductId === _productCatalog.product.ProductViewSummary.ProductId);
          //     if (matchedProvisionedProducts.length > 0)
          //       return _productCatalog;
          //   }
          // });
        }
      }
      dispatch({ type: types.GETALL_RECENTLYUSED_SUCCESS, recentlyUsed });
    } catch (error) {
      // console.log("projectActions >> getRecentlyUsedProducts >> error >> ", error)
      dispatch({ type: types.PROJECT_NOT_SELECTED, provisionedProducts: {} });
      localStorage.removeItem('selectedProject');
      console.log('projectActions >> getRecentlyUsedProducts >> Exception - Redirecting to /project-select', error);
      //history.push('/project-select');
    }
  }
}

export const getProductsCatalogItems = () => {
  return async dispatch => {
    dispatch({ type: types.GETALL_PRODUCTSCATALOG_FETCH });
    try {
      const _selectedProject = JSON.parse(localStorage.getItem('selectedProject'));
      const productsCatalog = await sc.searchProducts(_selectedProject, 'us-west-2');
      console.log('projectActions >> getProductsCatalogItems >> productsCatalog >> ', productsCatalog);
      dispatch({ type: types.GETALL_PRODUCTSCATALOG_SUCCESS, productsCatalog });
    } catch (error) {
      dispatch({ type: types.PROJECT_NOT_SELECTED, provisionedProducts: {} });
      localStorage.removeItem('selectedProject');
      console.log('projectActions >> getProductsCatalogItems >> Redirecting to /project-select');
      //history.push('/project-select');
    }
  }
}

export const provisionProduct = (catalogProduct, resourceName, formValues) => {
  return async dispatch => {
    try {
      const user = await Auth.currentUserInfo()
      const selectedProject = JSON.parse(localStorage.getItem('selectedProject'));
      const provisioningParams = Object.keys(formValues).map(key => ({ Key: key, Value: formValues[key] }));
      const { product, artifact, tags, launchPath } = catalogProduct
      const provisionedProduct = await sc.provisionProduct({
        ProductId: product.ProductViewSummary.ProductId,
        ProvisioningArtifactId: artifact.Id,
        PathId: launchPath.Id,
        ResourceName: resourceName,
        Tags: tags,
        User: user,
        SelectedProject: selectedProject,
        ProvisioningParams: provisioningParams
      });

      dispatch({ type: types.PROVISIONE_PRODUCT_SUCCESS, provisionedProduct });
      showBanner(String("New Product Created Successfuly!"), "success", dispatch);
      history.push('/');
    } catch (error) {
      console.log("projectActions >> executeServiceActionForProvisionedProduct >> exception ", error);
      showBanner(String(error), "error", dispatch);
    }
  }
}

export const terminateProvisionedProduct = (provisionedProduct) => {
  return async dispatch => {
    try {
      const _terminatedProduct = await sc.terminateProvisionedProduct(provisionedProduct.Id);
      showBanner("Provision product termination for product: " + _terminatedProduct.RecordDetail.ProvisionedProductName + " initiated!!", "success", dispatch);
      history.push('/');
    } catch (error) {
      console.log("projectActions >> executeServiceActionForProvisionedProduct >> exception ", error);
      showBanner(String(error), "error", dispatch);
    }
  }
}


export const getProvisionedProductDetails = (provisionedProduct) => {
  return async dispatch => {
    const _productDetails = await sc.describeProduct(provisionedProduct.ProductId);
    const _serviceActions = await sc.listServiceActionsForProvisioningArtifact(provisionedProduct.ProductId, provisionedProduct.ProvisioningArtifactId);
    const _recordHistory = await sc.listRecordHistory(provisionedProduct.Id);

    const provisionedProductDetails = {
      ProvisionedProduct: provisionedProduct,
      ServiceActions: _serviceActions,
      ProductDetails: _productDetails,
      RecordHistory: _recordHistory,
    };
    console.log("projectActions >> getProvisionedProductDetails >> provisionedProductDetails >> ", provisionedProductDetails);
    dispatch({ type: types.GETALL_PROVISIONEDPRODUCTDETAILS_SUCCESS, provisionedProductDetails: provisionedProductDetails });
    history.push('/provisioned-product-details');
  }
}


export const showBanner = (text, status, dispatch) => {
  if (text.length < 1 || status === false) {
    return;
  }

  const bannerData = {
    status: status,
    text: text,
    show: true
  }
  dispatch({ type: types.BANNER, bannerData: bannerData });
  setTimeout(() => {
    dispatch({ type: types.BANNER, bannerData: {} });
  }, 20000)
}


export const executeServiceActionForProvisionedProduct = (provisionedProduct, servieAction) => {
  return async dispatch => {
    try {
      const _serviceActionResult = await sc.executeProvisionedProductServiceAction(provisionedProduct.Id, servieAction.Id);
      console.log("projectActions >> executeServiceActionForProvisionedProduct >> _serviceActionResult >> ", _serviceActionResult);

      dispatch({ type: types.SERVICEACTION_EXECUTE_STATUS, serviceActionResult: _serviceActionResult });
    } catch (error) {
      console.log("projectActions >> executeServiceActionForProvisionedProduct >> exception ", error);
      showBanner(String(error), "error", dispatch);
    }
  }
}


/* ----Banner Data Format---
const bannerData = {
status: "success" or "error" or "info",
text: "This is a test Banner",
show: true
}
dispatch({ type: types.BANNER, bannerData: bannerData });
*/

export const projectSelect = (selectedProject) => {
  return dispatch => {
    localStorage.setItem('selectedProject', JSON.stringify(selectedProject));
    dispatch({ type: types.PROJECTS_SELECTED, selectedProject });
    history.push('/');
  }
}

export const provisionProductIntent = (catalogProduct) => {
  return dispatch => {
    dispatch({ type: types.PROVISIONE_PRODUCT_SELECTED, catalogProduct });
    history.push('/provision-product');
  }
}

export const getProjectSelected = (project) => {
  return dispatch => {
    const _selectedProject = JSON.parse(localStorage.getItem('selectedProject'));
    if (_selectedProject) {
      dispatch({ type: types.PROJECTS_SELECTED, selectedProject: _selectedProject });
      // history.push('/');
    }
  }
}


export const getStats = (selectedProject) => {
  // console.log('ProjectActions >> getStats >> selectedProject >> ', selectedProject)
  return async dispatch => {
    try {
      dispatch({ type: types.GETALL_STATS_FETCH });
      const _selectedProject = JSON.parse(localStorage.getItem('selectedProject'));
      let _filteredProvisionedProducts = [];
      let _totalCredits = 0;
      let _totalSpend = 0;
      let _timePeriodStart = new Date();
      let _timePeriodEnd = new Date();
      let _timeUnit = '';

      if (!isEmpty(_selectedProject)) {
        const _provisionedProducts = await sc.searchProvisionedProducts('Account', 'us-west-2');
        _filteredProvisionedProducts = _provisionedProducts.filter((provisionedProduct) =>
          provisionedProduct.Tags.filter((tag) => tag.Key === 'ProjectId' && tag.Value === _selectedProject.Id).length > 0);

        // _filteredProvisionedProducts = _provisionedProducts.filter((provisionedProduct) => {
        //   let selectedProjectTag = provisionedProduct.Tags.filter((tag) => tag.Key === 'ProjectId' && tag.Value === _selectedProject.Id);
        //   if (selectedProjectTag.length > 0)
        //     return provisionedProduct;
        // })

        const _budgetsList = await sc.listBudgetsForResource(_selectedProject.Id);
        const _budgetDetails = _budgetsList.map(async (_budget) => await bgt.describeBudget(_budget.BudgetName));
        const budgetDetails = await Promise.all(_budgetDetails);
        // console.log("ProjectActions >> getStats >> _budgetDetails >>", await Promise.all(_budgetDetails));

        budgetDetails.forEach(_budgetDetail => {
          _totalCredits += parseFloat(_budgetDetail.Budget.BudgetLimit.Amount);
          _totalSpend += parseFloat(_budgetDetail.Budget.CalculatedSpend.ActualSpend.Amount);
        });

        if (budgetDetails.length > 0) {
          _timePeriodStart = budgetDetails[0].Budget.TimePeriod.Start;
          _timePeriodEnd = budgetDetails[0].Budget.TimePeriod.End;
          _timeUnit = budgetDetails[0].Budget.TimeUnit;
        }

      }
      const stats = {
        activeProducts: _filteredProvisionedProducts.length,
        totalCredits: _totalCredits,
        totalCreditsSpent: _totalSpend,
        timePeriodStart: _timePeriodStart.toISOString().substring(0, 10),
        timePeriodEnd: _timePeriodEnd.toISOString().substring(0, 10),
        timeUnit: _timeUnit,
        progress: "On Track"
      };

      dispatch({ type: types.GETALL_STATS_SUCCESS, stats });
    } catch (error) {
      dispatch({ type: types.PROJECT_NOT_SELECTED, provisionedProducts: {} });
      showBanner(String(error), "error", dispatch);
      localStorage.removeItem('selectedProject');
      console.log('projectActions >> getStats >> Exception - Redirecting to /project-select');
      history.push('/project-select');
    }

  }
};


export const changeView = () => {
  return dispatch => {
    // const _tableView = JSON.parse(localStorage.getItem('tableView'));
    // localStorage.setItem('tableView', !_tableView);
    dispatch({ type: types.CHANGE_VIEW });
  }
}

export const closeBanner = () => {
  return dispatch => {
    dispatch({ type: types.BANNER, bannerData: {} });
  }
}


