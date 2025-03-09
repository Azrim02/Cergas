import { firebase } from '../api/firebase/firebaseConfig';

export const fetchStepsFromGoogleFit = async () => {
  const user = firebase.auth().currentUser;
  if (!user) return;

  const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
  const { googleFitAccessToken } = userDoc.data();

  if (!googleFitAccessToken) {
    console.error('No Google Fit token available.');
    return;
  }

  const endDate = Date.now();
  const startDate = endDate - 7 * 24 * 60 * 60 * 1000; // last 7 days

  const response = await fetch(
    'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${googleFitAccessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        aggregateBy: [{ dataTypeName: 'com.google.step_count.delta' }],
        bucketByTime: { durationMillis: 86400000 },
        startTimeMillis: startDate,
        endTimeMillis: endDate,
      }),
    }
  );

  const result = await response.json();
  console.log(result);
};
