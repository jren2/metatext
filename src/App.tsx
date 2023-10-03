import { METAPHOR_API, COHERE_API } from "./config";
import React, {useState} from 'react';
import './input.css';

function App() {
  const [results, setResults] = useState([])
  const [contents, setContents] = useState([])
  const [summary, setSummary] = useState("")
  
  const Summarize = async (text : string) => {
    const options = {
      "method": "POST",
      "headers": {
          "accept": "application/json",
          "content-type": "application/json",
          "authorization": "Bearer " + COHERE_API
      },
      "body": JSON.stringify({
          "length": "medium",
          "format": "bullets",
          "model": "command",
          "text": text,
          "additional_command": "of this text"
      })
  };
    await fetch('https://api.cohere.ai/v1/summarize', options)
    .then((response) => response.json())
    .then((response) => {
        if (response.summary === undefined) {
            return response;
        } else {
          setSummary(response.summary)
          return response;
        }
    });
  }

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
          }).then(async data => {
            setContents(data.contents)
            const fullContent = data.contents.map((content : any) => content.extract.replace( /(<([^>]+)>)/ig, '')).join(' ')
            await Summarize(fullContent)
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
        {summary}
      </div>
    </div>
  );
}

export default App;