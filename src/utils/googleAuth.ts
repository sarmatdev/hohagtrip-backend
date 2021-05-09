import axios from 'axios'

const fetchGoogleUserData = (idToken: string) => {
  return axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${idToken}`)
}

export default fetchGoogleUserData
