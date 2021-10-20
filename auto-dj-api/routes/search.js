import querystring from 'querystring';
import { searchForTracks } from '../services/searchService.js';

async function search(req, res) {
    var searchValue = req.params.searchValue;
    var result = await searchForTracks(searchValue);
    if(result != null) {
        res.json(result);
    }
    else {
        res.redirect('/#' +
        querystring.stringify({
          error: 'authorization_error'
      }));
    }
}

export default search;