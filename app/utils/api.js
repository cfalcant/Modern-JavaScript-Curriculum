import axios from 'axios';

const id = "YOUR_CLIENT_ID";
const sec = "YOUR_SECRET_ID";
const params = `?client_id=${id}&client_secret=${sec}`;

async function getProfile (username) {
  const profile = await axios.get(`https://api.github.com/users/${username}${params}`)

  return profile.data

  // return axios.get('https://api.github.com/users/' + username + params)
  //   .then(function (user) {
  //     return user.data;
  //   });
}

function getRepos (username) {
  return axios.get(`https://api.github.com/users/${username}/repos${params}&per_page=100`);
}

function getStarCount (repos) {
  return repos.data.reduce((count, {stargazers_count}) => count + stargazers_count, 0);
}

function calculateScore ({followers}, repos) {
  // var followers = profile.followers;
  // var totalStars = getStarCount(repos);
  return (followers * 3) + getStarCount(repos);
}

function handleError (error) {
  console.warn(error);
  return null;
}

async function getUserData (player) {
  const [profile, repos] = await Promise.all([
    getProfile(player),
    getRepos(player)
  ])

  return {
    profile,
    score: calculateScore(profile,repos)
  }
//   return axios.all([
//     getProfile(player),
//     getRepos(player)
//   ]).then(function (data) {
//     var profile = data[0];
//     var repos = data[1];

//     return {
//       profile: profile,
//       score: calculateScore(profile, repos)
//     }
//   });
// }
}

function sortPlayers (players) {
  return players.sort((a,b) => b.score - a.score);
}

export async function battle (players) {
  const results = await Promise.all(players.map(getUserData))

  .catch(handleError)

  return results === null
  ? results
  : sortPlayers(results);
}

export async function fetchPopularRepos(language) {
  const encodedURI = window.encodeURI(`https://api.github.com/search/repositories?q=stars:>1+language:${language}&sort=stars&order=desc&type=Repositories`);

  const repors = await axios.get(encodedURI)
    .catch(handleError)

  return repos.data.items  
}

// module.exports = {
//   battle: function (players) {
//     return axios.all(players.map(getUserData))
//       .then(sortPlayers)
//       .catch(handleError);
//   },
//   fetchPopularRepos: function (language) {
//     var encodedURI = window.encodeURI('https://api.github.com/search/repositories?q=stars:>1+language:'+ language + '&sort=stars&order=desc&type=Repositories');

//     return axios.get(encodedURI)
//       .then(function (response) {
//         return response.data.items;
//       });
//   }
// };