import axios from 'axios';
import React from 'react';
import { useLocation } from 'react-router-dom';
const Config = require('config');

function GetNotesFromDb(props) {
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
  
  const getIdToken = async () => {
    // Call decode JWT API
    const decodeUrl = 'https://a4m9zicl40.execute-api.ap-southeast-1.amazonaws.com/dev/decode';
    const configAPI = {
      headers: {
        'Content-Type': 'application/json',
        'X-Amz-Security-Token': window.localStorage.id_token
      }
    }
    const paramsAPI = {
        "token": window.localStorage.id_token
    }
    try { 
      let res = await axios.post(decodeUrl, paramsAPI, configAPI);
      window.localStorage.userId = res.data.sub
    } catch (err) {
      console.log(err.message);
    } 
  } 
  
  
  const getJWT = async (config, params) => {
    try {
      // Call the Authorization server to get the access tokens
      const url = 'https://notekeeper-wootoodoo.auth.ap-southeast-1.amazoncognito.com/oauth2/token';
      let response = await axios.post(url, params, config);
      window.localStorage.id_token = response.data.id_token;
  
    } catch (err) {
      console.log(err.message)
    }
  }

  let query = new URLSearchParams(useLocation().search);
  if (query.get("code")) {
    const authCode = query.get("code");
    const params = new URLSearchParams()
    params.append('grant_type', 'authorization_code');
    params.append('client_id', '3lnu5men15m7vofvtj80bkrhme',);
    params.append('code', authCode);
    params.append('redirect_uri', 'https://notes.wootoodoo.com');
    const config = {
      headers: {
        'Authorization': 'Basic ' + Config.get('Base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    if (!window.localStorage.id_token){
      getJWT(config, params)
      .then(getIdToken)
      .then(getUserNotes)
      .then(props.setLoggedIn(true));
    } else {
      getIdToken()
      .then(getUserNotes)
      .then(props.setLoggedIn(true));
    }
  }
  return null;
}

export default GetNotesFromDb;