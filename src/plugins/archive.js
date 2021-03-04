const axios = require('axios');
const { error } = require('../lib/result');
const { stringBuilder, success, failure } = require('../lib/format');

module.exports = async (moduleInfo) => {
  const githubTarget = moduleInfo.repository.url
    .split('github.com/')[1]
    .replace('.git', '');

  const { data: repo } = await axios.get(`https://api.github.com/repos/${githubTarget}`);
  const output = stringBuilder('Checking if github repository is archived').withPadding(65);

  if (repo.deprecated) {
    failure(output.get());
    return error(`The repository of the "${moduleInfo.name}" module seems to be archived. (https://www.github.com/${githubTarget})`);
  }

  success(output.get());
  return null;
};