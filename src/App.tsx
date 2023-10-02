import { apiKey } from "./config";
import React, {useState} from 'react';

function App() {
  const [results, setResults] = useState([])
  const search = async () => {
    const url = 'https://corsproxy.io/?https://api.metaphor.systems/search';

    const requestData = {
      query: 'ai startups',
      numResults: 5,
      useAutoprompt: true,
      type: 'neural'
    };

    const headers = {
      'x-api-key': apiKey,
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
      Hello World
      <button onClick={search}>Search</button>
      <div>
        {
          results.map((result : any) => {
            return (
              <div key={result.title}>
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