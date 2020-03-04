import Product from '../../models/product';

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const RESERVE_PRODUCT = 'RESERVE_PRODUCT';
export const CHANGE_PRODUCT_STATUS = 'CHANGE_PRODUCT_STATUS';
export const SET_PRODUCTS = 'SET_PRODUCTS';

export const fetchProducts = () => {
  return async (dispatch, getState) => {
    // any async code you want!
    const userId = getState().auth.userId;
    try {
      const response = await fetch(
        'https://egnahemsfabriken.firebaseio.com/products.json'
      );

      if (!response.ok) {
        const errorResData = await response.json();
        const errorId = errorResData.error.message;
        let message = errorId;
        throw new Error(message);
      }

      const resData = await response.json();
      const loadedProducts = [];

      for (const key in resData) {
        const reservationExpiryDate = new Date(resData[key].reservedUntil);

        //If reservationExpiryDate is a date and it is less than today...
        if (
          reservationExpiryDate instanceof Date &&
          reservationExpiryDate <= new Date()
        ) {
          const categoryName = resData[key].categoryName;
          const title = resData[key].title;
          const description = resData[key].description;
          const price = resData[key].price;
          const image = resData[key].image;
          const reservedUntil = `expired ${resData[key].reservedUntil}`;
          const projectId = resData[key].projectId;
          const status =
            resData[key].status === 'reserverad' ? 'redo' : resData[key].status; //If the passed status is 'reserved' then update that product's status to 'redo'
          console.log('EXPIRED');
          console.log('title:', title);
          console.log('reservationExpiryDate:', reservationExpiryDate);
          console.log('thats a date?:', reservationExpiryDate instanceof Date);
          console.log('original status:', resData[key].status);
          console.log('new status:', status);
          console.log('original reservedUntil:', resData[key].reservedUntil);
          console.log('sets new reservedUntil as:', reservedUntil);
          console.log('----------');

          const token = getState().auth.token;
          const response = await fetch(
            `https://egnahemsfabriken.firebaseio.com/products/${key}.json?auth=${token}`,
            {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                categoryName,
                title,
                description,
                price,
                image,
                status,
                reservedUntil,
                projectId
              })
            }
          );

          if (!response.ok) {
            console.log(
              'actions/products.js fetchProducts: Something went wrong in attempting to update expired products'
            );
            const errorResData = await response.json();
            const errorId = errorResData.error.message;
            let message = errorId;
            throw new Error(message);
          }

          dispatch({
            type: UPDATE_PRODUCT,
            pid: key,
            productData: {
              categoryName,
              title,
              description,
              price,
              image,
              status,
              reservedUntil,
              projectId
            }
          });
        }

        loadedProducts.push(
          new Product(
            key,
            resData[key].ownerId,
            resData[key].categoryName,
            resData[key].title,
            resData[key].image,
            resData[key].description,
            resData[key].price,
            resData[key].date,
            resData[key].status,
            resData[key].reservedUntil,
            resData[key].projectId
          )
        );
      }

      dispatch({
        type: SET_PRODUCTS,
        products: loadedProducts,
        userProducts: loadedProducts.filter(prod => prod.ownerId === userId)
      });
    } catch (err) {
      // send to custom analytics server
      throw err;
    }
  };
};

export const deleteProduct = productId => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://egnahemsfabriken.firebaseio.com/products/${productId}.json?auth=${token}`,
      {
        method: 'DELETE'
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = errorId;
      throw new Error(message);
    }
    dispatch({ type: DELETE_PRODUCT, pid: productId });
  };
};

export const createProduct = (
  categoryName,
  title,
  description,
  price,
  image
) => {
  return (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const date = new Date();
    fetch(
      'https://us-central1-egnahemsfabriken.cloudfunctions.net/storeImage',
      {
        method: 'POST',
        body: JSON.stringify({
          image: image //this gets the base64 of the image to upload into cloud storage. note: very long string. Expo currently doesn't work well with react native and firebase storage, so this is why we are doing this approach through cloud functions.
        })
      }
    )
      .catch(err =>
        console.log('error when trying to post to cloudfunctions', err)
      )
      .then(res => res.json())
      .then(parsedRes => {
        const productData = {
          categoryName,
          title,
          description,
          price,
          image: parsedRes.image, //This is how we link to the image we store above
          ownerId: userId,
          date: date.toISOString(),
          status: 'redo',
          reservedUntil: ''
        };
        //Then upload the rest of the data to realtime database on firebase
        return fetch(
          `https://egnahemsfabriken.firebaseio.com/products.json?auth=${token}`,
          {
            method: 'POST',
            body: JSON.stringify(productData)
          }
        )
          .catch(err =>
            console.log(
              'Error when attempting to save to firebase realtime database: ',
              err
            )
          )
          .then(finalRes => finalRes.json())
          .then(finalResParsed => {
            dispatch({
              type: CREATE_PRODUCT,
              productData: {
                id: finalResParsed.name,
                categoryName,
                title,
                description,
                price,
                image,
                ownerId: userId,
                date: date,
                status: 'redo',
                reservedUntil: ''
              }
            });
          });
      });
  };
};

export const updateProduct = (
  id,
  categoryName,
  title,
  description,
  price,
  image
) => {
  return (dispatch, getState) => {
    const token = getState().auth.token;

    fetch(
      'https://us-central1-egnahemsfabriken.cloudfunctions.net/storeImage',
      {
        method: 'POST',
        body: JSON.stringify({
          image: image //this gets the base64 of the image to upload into cloud storage. note: very long string. Expo currently doesn't work well with react native and firebase storage, so this is why we are doing this approach through cloud functions.
        })
      }
    )
      .catch(err =>
        console.log('error when trying to post to cloudfunctions', err)
      )
      .then(res => res.json())
      .then(parsedRes => {
        const productData = {
          categoryName,
          title,
          description,
          price,
          image: parsedRes.image //This is how we link to the image we store above
        };
        //Then upload the rest of the data to realtime database on firebase
        return fetch(
          `https://egnahemsfabriken.firebaseio.com/products/${id}.json?auth=${token}`,
          {
            method: 'PATCH',
            body: JSON.stringify(productData)
          }
        )
          .catch(err =>
            console.log(
              'Error when attempting to save to firebase realtime database: ',
              err
            )
          )
          .then(finalRes => finalRes.json())
          .then(finalResParsed => {
            dispatch({
              type: UPDATE_PRODUCT,
              pid: id,
              productData: {
                categoryName,
                title,
                description,
                price,
                image
              }
            });
          });
      });
  };
};

export const changeProductStatus = (id, status) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;

    const response = await fetch(
      `https://egnahemsfabriken.firebaseio.com/products/${id}.json?auth=${token}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status
        })
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = errorId;
      throw new Error(message);
    }

    dispatch({
      type: CHANGE_PRODUCT_STATUS,
      pid: id,
      productData: {
        status
      }
    });
  };
};

export const reserveProduct = (id, status, reservedUntil, projectId) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;

    const response = await fetch(
      `https://egnahemsfabriken.firebaseio.com/products/${id}.json?auth=${token}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status,
          reservedUntil,
          projectId
        })
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = errorId;
      throw new Error(message);
    }

    dispatch({
      type: RESERVE_PRODUCT,
      pid: id,
      productData: {
        status,
        reservedUntil,
        projectId
      }
    });
  };
};
