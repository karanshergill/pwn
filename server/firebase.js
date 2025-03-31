import admin from 'firebase-admin';
import fs from 'fs';

const serviceAccount = JSON.parse(
    fs.readFileSync('serviceAccountKey.json', 'utf8')
);

// initialize firebase admin sdk
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// test firestore connection
// db.collection('test-collection').limit(1).get()
//     .then(snapshot => {
//         if (snapshot.empty) {
//             console.log('Connected to Firestore: No documents found in test-collection');
//         } else {
//             console.log('Connected to Firestore: Documents retrieved');
//         }
//     })
//     .catch(error => {
//         console.error('Error connecting to Firestore:', error);
//     });

// export firestore instance
export { db };
