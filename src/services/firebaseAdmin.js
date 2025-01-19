import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = {
  "type": "service_account",
  "project_id": "easyagentcreator",
  "private_key_id": "278a8594606260eb7471f39ad7a70c2504a827bd",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC/87mWUisPl2sj\nXkAOyg2mMz1iUxLu0SF6hk6oeTEYXskeB0HN1aXVP7pN4hrd8vY4TGgUN33VXXsq\nEPkhAJvBKyJet2fDaqRkqg4SVVAxKQA7HMMdas5AcUNzpIwSCwMVn+6KX4AeIgN0\nmW68KuQ/IXdPw7qDH3XSfSxnnm3/z7WP2yTKiEPCE2mn8+kbkha2l2byrLltuwHw\nj8Thv/W1DA9u4a96daVCwDfzhNkj/pCHepC7PrtIINhUh65w3hrmVA+7OdN5NVRy\n5y5zAfN5xPDY0wpx/WMSl1YM1kcp/ddv7zbpsM00wLURbg3wU7RiHx/V6dRTKhnn\ntWRhEzc7AgMBAAECggEAEC2G+TvgpDZDUd5KMNTntJfB9y0APf+DPlPegkWAlUi7\n05uR+LqmeOQfnBvP3t/wz4rlBLsukFKKJF/810K5Xdz4TxpPFQHCbDeG6xWkphgK\nDHFeonaTfovtPuxh381sy6BIlwH4htGgD+40johg5083QpJBAHcg04Y4PV11cOdX\nsGSLqi8qSixzlGt8a15v1ddd2VgBEB4BrkWRIFAJHBJ3YnnGfgQLCcIihXC1dYc3\nx/iKMG0J5boZSU0losRMGCMXS0zr4ZR6qfYlEQTSEBixRIDjSdDABc6z91e2+C9x\notIRHMMbteeBO+rfX3v7/FEUM0wJLS79bHSZKuf07QKBgQDvbGqO2ZZbfjyzpyu8\nG5bc0EklEMODm/4Kvv0myq5E39W/UDssYL1uY40CJoK6x5/I3AbfAKUdgOnhu7GG\n+pR4eDsCxHC3UgoEZ+6d+c0o867kSLv93UfkDVBExFpBq/8BTA4lShucGwDTePvo\nhnO9ywfdbxjCfETHfVNy050+dwKBgQDNPeqdpbsgNrwAymPjLNoxtNf4S9JXk+hP\nT3SQ4v2CkrknXB91CzAixCvlwV1J5Kt4efYP6JDvMsOamh07GBzei7SMp/wnOt+R\n1fVXhy9pOKC0JWQcg9YzqDOWwvjpzeEW98sab/NZDS3tQWaFzLekctgcN5PkbpVM\nUsptmewqXQKBgA9qr8HbCO+DRW1cCljmfeRiFROp7K0A0m7mtW5WBrqwnxbel7DX\n2drN1jqZODnGuOc6I8cgR4GK14SNjXTflcfcFhCrjYaAZdy6xIavmyJT7qMMe+5w\n3Tw2D0EeU6F+7cCroQ2NpBF9O6RiWfYzEijadfswOCvtzI/75e+y6KEpAoGBAMoZ\nzCuMhOVFwH8uzIlpIzqLD5fqYafnd3yRiwEY4/VtsXD2n+tLJw01CtzlOY2H5Olv\nf0NPCVjhLgfQ9jO4nMTv4MwYpo2ixX//peWYsrD0GBsMLrZ9g7G+UX6FY0Infxx0\nyMSxtHjeJ3lXSzM50SPYCsJOYA0yb0WGyNqAFTPpAoGAbllg4OJbXpxLcqRG0ydW\n/2yO8pJYj1x1149xzCj0aVmbjkCQj7ooYcaf1wbWZRDk+iMgIKV/BTenuoe0VpFv\nU1OGUtn3KofC8JHQicYltPnsoAhdKtxnoZm6DFEhJXHVJ9WcMNKKVniL01fIsLal\naaUI0qnU3e4nrYXG+yiGAOo=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@easyagentcreator.iam.gserviceaccount.com",
  "client_id": "111292306250829547381",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40easyagentcreator.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

// Initialize Firebase Admin
const app = initializeApp({
  credential: cert(serviceAccount)
});

// Initialize Firestore
const db = getFirestore(app);

export { db };