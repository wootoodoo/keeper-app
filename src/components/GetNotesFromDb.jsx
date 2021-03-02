import axios from 'axios';
import React from 'react';
import { useLocation } from 'react-router-dom';
import Config from '../config/config';


function GetNotesFromDb(props) {

  // POST to /usernotes?:userId&:noteTime&operation=query to get back the user's notes stored in dynamodb
  const getUserNotes = async () => {
    const userIdParam = '?user_id=' + window.localStorage.userId;
    let noteTimeParam = '&note_time=' + (new Date()).toJSON();
    let operationParam = '&operation=query'
    let url = 'https://a4m9zicl40.execute-api.ap-southeast-1.amazonaws.com/dev/usernotes' + userIdParam + noteTimeParam + operationParam;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'X-Amz-Security-Token': window.localStorage.id_token
      }
    }
    let res = await axios.get(url, config);
    let notesDb = res.data.Items;
    notesDb.forEach((noteItem => {
      props.getNotes({
        title: noteItem.note_title,
        content: noteItem.note_content,
        noteId: noteItem.note_time
      });
    }))
  }

  // POST to Cognito authorization server to refresh the JWT
  const refreshJWT = async () => {
    const params = new URLSearchParams()
    params.append('grant_type', 'refresh_token');
    params.append('client_id', Config.client_id);
    params.append('refresh_token', window.localStorage.refresh_token);
    const config = {
      headers: {
        'Authorization': 'Basic ' + Config.Base64,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    try {
      const url = Config.auth_server + '/oauth2/token';
      let response = await axios.post(url, params, config);
      // console.log("response from refresh server", response)
      window.localStorage.tokenTimeout = Date.now() + response.data.expires_in * 1000;
      window.localStorage.id_token = response.data.id_token;
      window.localStorage.access_token = response.data.access_token;
      window.localStorage.refresh_token = response.data.refresh_token;
    } catch (err) {
      console.log(err.message)
    }
  }
  
  // GET from the JWT from /decode
  const getIdToken = async () => {
    const decodeUrl = 'https://a4m9zicl40.execute-api.ap-southeast-1.amazonaws.com/dev/decode';
    const configAPI = {
      headers: {
        'Content-Type': 'application/json',
        'X-Amz-Security-Token': window.localStorage.id_token
      }
    }
    try { 
      let res = await axios.get(decodeUrl, configAPI);
      console.log(res);
      window.localStorage.name = res.data.name;
      window.localStorage.userId = res.data.sub;
    } catch (err) {
      console.log(err.message);
    } 
  } 
  
  // POST to the JWT from Cognito authorization server
  const getJWT = async (config, params) => {
    try {
      const url = Config.auth_server + '/oauth2/token';
      let response = await axios.post(url, params, config);
      // console.log("response from auth server", response)
      window.localStorage.tokenTimeout = Date.now() + response.data.expires_in * 1000;
      window.localStorage.id_token = response.data.id_token;
      window.localStorage.access_token = response.data.access_token;
      window.localStorage.refresh_token = response.data.refresh_token;
    } catch (err) {
      console.log(err.message)
    }
  }

  let query = new URLSearchParams(useLocation().search);
  if (query.get("code")) {
    const authCode = query.get("code");
    const params = new URLSearchParams()
    params.append('grant_type', 'authorization_code');
    params.append('client_id', Config.client_id);
    params.append('code', authCode);
    params.append('redirect_uri', Config.redirect_uri);
    const config = {
      headers: {
        'Authorization': 'Basic ' + Config.Base64,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    // If not logged in before
    if (!window.localStorage.id_token){
      getJWT(config, params)
      .then(getIdToken)
      .then(getUserNotes)
      .then(props.setLoggedIn(true));
    } else {
        // If token has timed out, go to refreshJWT
        // console.log("Date now...", Date.now())
        if (Date.now() > window.localStorage.tokenTimeout) {
          // console.log("refreshing token...")
          refreshJWT()
          .then(getIdToken)
          .then(getUserNotes)
          .then(props.setLoggedIn(true));
        }
        else {
          // Authenticated before but no userId
          if (!window.localStorage.userId) {
            // console.log("getting UserId...")
            getIdToken()
            .then(getUserNotes)
            .then(props.setLoggedIn(true));
          }
          // Get the userNotes
          // console.log("getting user notes...")
          getUserNotes()
          .then(props.setLoggedIn(true));
        }
    }
  }
  return null;
}

export default GetNotesFromDb;
