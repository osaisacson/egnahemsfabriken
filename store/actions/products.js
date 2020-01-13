export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_CATEGORIES = 'SET_CATEGORIES';

export const deleteProduct = productId => {
  return { type: DELETE_PRODUCT, pid: productId };
};

export const createProduct = (
  title,
  description,
  imageUrl,
  price,
  categoryName
) => {
  //Dispatched this ways so it gets called by ReduxThunk
  return dispatch => {
    //any async code you want. will now not break the redux flow, because of ReduxThunk
    //...lets us make http requests.

    dispatch({
      type: CREATE_PRODUCT,
      productData: {
        title, //short syntax when properties have same name. same as title: title.
        description,
        imageUrl,
        price,
        categoryName
      }
    });
  };
};

export const updateProduct = (
  id,
  title,
  description,
  imageUrl,
  categoryName
) => {
  return {
    type: UPDATE_PRODUCT,
    pid: id,
    productData: {
      title,
      description,
      imageUrl,
      categoryName
    }
  };
};

export const setCategories = filterSettings => {
  return {
    type: SET_CATEGORIES,
    filters: filterSettings
  };
};
