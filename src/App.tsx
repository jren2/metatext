import { METAPHOR_API, COHERE_API } from "./config";
import React, {useState} from 'react';
import './input.css';

function App() {
  const [results, setResults] = useState([])
  const search = async () => {
    const searchArea = document.getElementById("search-area") as HTMLTextAreaElement | null;
    const query = searchArea?.value || '';


    const url = 'https://corsproxy.io/?https://api.metaphor.systems/search';

    const requestData = {
      query: query,
      numResults: 3,
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
              </div>
            )
          })
        }
      </div>
    </div>
  );
}

export default App;