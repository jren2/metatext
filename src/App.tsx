import { METAPHOR_API } from "./config";
import React, {useState} from 'react';
import './input.css';

function App() {
  const [results, setResults] = useState([])
  const [contents, setContents] = useState([])
  const search = async () => {
    const searchArea = document.getElementById("search-area") as HTMLTextAreaElement | null;
    const query = "here is a recent news article about " + (searchArea?.value || '') + ":";

    const url = 'https://corsproxy.io/?https://api.metaphor.systems/search';

    const requestData = {
      query: query,
      numResults: 1,
      useAutoprompt: true,
      type: 'neural'
    };

    const headers = {
      'x-api-key': METAPHOR_API,
      'Content-Type': 'application/json',
      "Access-Control-Allow-Origin": "*"
    };
    fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setResults(data.results)
        const ids = data.results.map((result : any) => result.id)
        const dataIds = ids.join(',')
        const contentURL = `https://corsproxy.io/?https://api.metaphor.systems/contents?ids=${dataIds}`
        const fetchContent = async () => {
          fetch(contentURL, {
            method: 'GET',
            headers: headers,
          }).then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          }).then(data => {
            setContents(data.contents)
          })
        }
        fetchContent()
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
  }

  return (
    <div className="App">
      <textarea id="search-area"></textarea>
      <button className="search-button" onClick={() => search()}>Search</button>
      <div>
        {
          results.map((result : any) => {
            return (
              <div key={result.id}>
                {result.title}
                {result.url}
              </div>
            )
          })
        }
      </div>
      <div>
        {
          contents?.map((content : any) => {
            return (
              <div key={content.id}>
                {content.extract.replace( /(<([^>]+)>)/ig, '')}
              </div>
            )
          })
        }
      </div>
    </div>
  );
}

export default App;