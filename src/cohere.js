const { COHERE_API } = require('./config.js');
const cohere = require("cohere-ai");

const Summarize = async (text) => {
  cohere.init(COHERE_API);
  const response = await cohere.summarize({
    text: text,
    model:'command',
    length:'medium',
    format: 'bullets',
    extractiveness:'medium'
  })
  return response.body.summary;
}

export default Summarize;