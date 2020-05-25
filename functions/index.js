// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const admin = require('firebase-admin');
const functions = require('firebase-functions');
// The Firebase Admin SDK to access the Firebase Realtime Database.
admin.initializeApp();
const cors = require('cors')({ origin: true });
const fs = require('fs');
const UUID = require('uuid-v4');
// Imports the Google Cloud client library
const { Storage } = require('@google-cloud/storage');
const { Expo } = require('expo-server-sdk');

// Create a new Expo SDK client
const expo = new Expo();

// Creates a client
const storage = new Storage({
  projectId: 'egnahemsfabriken',
  keyFilename: 'egnahemsfabriken-firebase.json',
});

exports.storeImage = functions.https.onRequest((request, response) => {
  return cors(request, response, () => {
    const body = JSON.parse(request.body);
    console.log('request from cloud function storeImage in index.js', request);
    console.log('request.body from cloud function storeImage in index.js', request.body);
    console.log('JSON.parse(request.body) from cloud function storeImage in index.js', body);
    fs.writeFileSync('/tmp/uploaded-image.jpg', body.image, 'base64', (err) => {
      console.log(err);
      return response.status(500).json({ error: err });
    });
    const bucket = storage.bucket('egnahemsfabriken.appspot.com');
    const uuid = UUID();

    return bucket.upload(
      '/tmp/uploaded-image.jpg',
      {
        uploadType: 'media',
        destination: '/pictures/' + uuid + '.jpg',
        metadata: {
          metadata: {
            contentType: 'image/jpeg',
            firebaseStorageDownloadTokens: uuid,
          },
        },
      },
      (err, file) => {
        if (!err) {
          return response.status(201).json({
            image:
              'https://firebasestorage.googleapis.com/v0/b/' +
              bucket.name +
              '/o/' +
              encodeURIComponent(file.name) +
              '?alt=media&token=' +
              uuid,
          });
        } else {
          console.log(
            'Error when trying to upload the image into bucket, storeImage index.js: ',
            err
          );
          return response.status(500).json({ error: err });
        }
      }
    );
  });
});

function denormalize(data) {
  const keys = Object.keys(data);

  if (keys) {
    return data[keys[0]];
  }
  return null;
}

function getUserProfileById(profileId) {
  return new Promise((resolve, reject) => {
    admin
      .database()
      .ref('profiles')
      .orderByChild('profileId')
      .equalTo(profileId)
      .on('value', (snapshot) => {
        if (snapshot.exists) {
          resolve(denormalize(snapshot.val()));
        } else {
          reject();
        }
      });
  });
}

exports.sendPushNotificationsOnReserve = functions.database
  .ref('/products/{productId}')
  .onUpdate(async ({ before, after }) => {
    const beforeVal = before.val();
    const afterVal = after.val();
    const beforeReservedDate = beforeVal.reservedDate;
    const afterReservedDate = afterVal.reservedDate;

    if (!beforeReservedDate && afterReservedDate) {
      const reservedUserId = afterVal.reservedUserId;
      const ownerId = afterVal.ownerId;
      const productName = afterVal.title;

      try {
        const [reservedBy, productOwner] = await Promise.all([
          getUserProfileById(reservedUserId),
          getUserProfileById(ownerId),
        ]);

        if (reservedBy && productOwner.expoTokens) {
          const message = {
            to: productOwner.expoTokens,
            sound: 'default',
            title: 'Produkt Reserverad',
            body: `${reservedBy.profileName} reserverade precis ditt återbruk ${productName}`,
            _displayInForeground: true,
          };

          return expo
            .sendPushNotificationsAsync([message])
            .then(() => console.info('Product notification sent!'))
            .catch((e) => console.error('Product notification failed!', e.message));
        }
      } catch (error) {
        return console.error(error.message);
      }
    }

    return null;
  });
