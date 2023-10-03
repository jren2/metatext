import { METAPHOR_API, COHERE_API } from "./config";
import React, { useState } from 'react';
import './input.css';
import './loading.css';

const examples = [
  'antitrust case against Google',
  'TikTok scrutiny from U.S. authorities',
  'European Union rules that threaten to restrict meta'
]
const randomExample = Math.floor(Math.random() * 3)

function App() {
  const [results, setResults] = useState([])
  const [summary, setSummary] = useState(["empty"])
  const [radio, setRadio] = useState(false)

  const Summarize = async (text : string) => {
    const headers = {
      "accept": "application/json",
      "content-type": "application/json",
      "authorization": "Bearer " + COHERE_API
    }
    const body = {
      "length": "medium",
      "format": "bullets",
      "model": "command",
      "text": text,
      "additional_command": "of this text"
    }
    await fetch('https://api.cohere.ai/v1/summarize', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    })
    .then((response) => response.json())
    .then((response) => {
        if (response.summary === undefined) {
          return response;
        } else {
          const parsedResponse = response.summary.split("- ")
          setSummary(parsedResponse.slice(1))
          return response;
        }
    });
  }

  const search = async () => {
    const searchArea = document.getElementById("search-area") as HTMLTextAreaElement | null;
    if (searchArea?.value === null || searchArea?.value === '') {
      return
    }

    setSummary(["loading"])
    const query = "here is a recent news article about " + (searchArea?.value || '') + ":";
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
      <textarea maxLength={200} id="search-area" placeholder={`i.e. ${examples[randomExample]}`}></textarea>
      <button className="search-button" onClick={() => search()}>Contextualize</button>
      {
        <>
          { 
            summary[0] === "loading" ? (
              <div className="banter-loader">
                <div className="banter-loader__box"></div>
                <div className="banter-loader__box"></div>
                <div className="banter-loader__box"></div>
                <div className="banter-loader__box"></div>
                <div className="banter-loader__box"></div>
                <div className="banter-loader__box"></div>
                <div className="banter-loader__box"></div>
                <div className="banter-loader__box"></div>
                <div className="banter-loader__box"></div>
              </div>
          ) : (
            <>
              {
                summary[0] === "empty" ? (
                  <></>
                ) : (
                <>
                  <div className="radio-inputs">
                    <label className="radio" onClick={() => setRadio(false)}>
                      <input type="radio" name="radio" checked={!radio} />
                      <span className="name">Summary</span>
                    </label>
                    <label className="radio" onClick={() => setRadio(true)}>
                      <input type="radio" name="radio" checked={radio} />
                      <span className="name">Sources</span>
                    </label>
                  </div>
                  <div className="summary-container">
                    {
                      radio ? (
                        <div style={{fontSize: 16}}>
                          {
                            results.map((result : any) => {
                              return (
                                <div key={result.id} className="summary-entry">
                                  {result.title}
                                  <a href={result.url} target="_blank" rel="noreferrer">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-link-45deg" viewBox="0 0 16 16">
                                      <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
                                      <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"/>
                                    </svg>
                                  </a>
                                </div>
                              )
                            })
                          }
                        </div>
                      ) : (
                        <div style={{fontSize: 16}}>
                          {
                            summary?.map((item : any) => {
                              return (
                                <div key={item} className="summary-entry">
                                  • {item}
                                </div>
                              )
                            })
                          }
                        </div>
                      )
                    }
                  </div>
                </>
                )
              }
            </>
          )
          }
        </>
      }
    </div>
  );
}

export default App;